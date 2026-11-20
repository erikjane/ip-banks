"""Сбор отчётности 15 банков с сайта ЦБ (формы 101, 102, 123, 135) и расчёт метрик.

Выход (папка data/):
  monthly.csv  — все метрики по месяцам для каждого банка
  summary.csv  — последний месяц по каждому банку: метрики, изменения год к году, сигналы, вердикт
  meta.csv     — дата обновления и последний отчётный месяц
  debug/       — служебные файлы для сверки (группы счетов, справочник 102)

Единицы: суммы в млрд ₽, доли в %. Месяц отчёта = месяц ДО даты файла
(файл 101-20261001 содержит обороты за сентябрь 2026).
"""
import csv, datetime as dt, gzip, json, os, subprocess, sys, tempfile, time
from collections import defaultdict

import requests
from dbfread import DBF, FieldParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
CACHE = os.path.join(DATA, "raw")
DEBUG = os.path.join(DATA, "debug")
UA = {"User-Agent": "Mozilla/5.0 (ip-banks; github.com/erikjane/ip-banks)"}
START = dt.date(2023, 7, 1)          # раньше ЦБ не публиковал формы (пауза 2022–2023)
REFRESH_LAST = 2                     # последние N файлов качаем заново (ЦБ иногда уточняет)

# Регномера сверены по справочнику ЦБ (форма 135, файл 01.10.2026)
BANKS = [
    (1481, "Сбербанк", "SBER"), (1000, "ВТБ", "VTBR"), (1326, "Альфа-Банк", ""),
    (2673, "Т-Банк", "T"), (354, "Газпромбанк", ""), (841, "ВБ Банк (Wildberries)", ""),
    (963, "Совкомбанк", "SVCB"), (2312, "Банк ДОМ.РФ", ""), (3349, "Россельхозбанк", ""),
    (3542, "Озон Банк", ""), (436, "Банк Санкт-Петербург", "BSPB"), (1978, "МКБ", "CBOM"),
    (3545, "Банк Точка", ""), (3027, "Яндекс Банк", ""), (2268, "МТС-Банк", "MBNK"),
]
REGNS = {b[0] for b in BANKS}


class Safe(FieldParser):
    def parseN(self, field, data):
        try:
            return super().parseN(field, data)
        except Exception:
            return None


# ── загрузка ─────────────────────────────────────────────────────────────
def months():
    d = START
    today = dt.date.today()
    while d <= today:
        yield d
        d = (d.replace(day=28) + dt.timedelta(days=5)).replace(day=1)


def download(form, d):
    url = f"https://www.cbr.ru/vfs/credit/forms/{form}-{d:%Y%m%d}.rar"
    for attempt in range(3):
        try:
            r = requests.get(url, headers=UA, timeout=120)
            if r.status_code == 404:
                return None
            if r.status_code == 200 and len(r.content) > 20000:
                return r.content
        except requests.RequestException:
            pass
        time.sleep(3 * (attempt + 1))
    return None


def extract(blob):
    tmp = tempfile.mkdtemp()
    p = os.path.join(tmp, "a.rar")
    with open(p, "wb") as f:
        f.write(blob)
    subprocess.run(["unar", "-q", "-f", "-o", tmp, p], capture_output=True)
    return {fn.upper(): os.path.join(rt, fn) for rt, _, fs in os.walk(tmp) for fn in fs if fn.upper().endswith(".DBF")}


def rows_for(path, regn_field="REGN"):
    for r in DBF(path, encoding="cp866", parserclass=Safe):
        if r.get(regn_field) in REGNS:
            yield r


def load(form, d, force):
    """Возвращает список строк (dict) только по нашим банкам; кэш в data/raw."""
    os.makedirs(CACHE, exist_ok=True)
    cp = os.path.join(CACHE, f"{form}-{d:%Y%m%d}.json.gz")
    if os.path.exists(cp) and not force:
        with gzip.open(cp, "rt", encoding="utf-8") as f:
            return json.load(f)
    blob = download(form, d)
    if blob is None:
        return None
    files = extract(blob)
    out = []
    for name, path in files.items():
        if form == "101" and name.endswith("B1.DBF"):
            out += [{"REGN": r["REGN"], "PLAN": r["PLAN"], "SC": str(r["NUM_SC"]).strip(), "AP": str(r["A_P"]).strip(),
                     "IN": r["VITG"] or 0, "OUT": r["IITG"] or 0} for r in rows_for(path)]
        elif form == "102" and name.endswith("_P1.DBF"):
            out += [{"REGN": r["REGN"], "CODE": str(r["CODE"]).strip(), "V": r["SIM_ITOGO"] or 0} for r in rows_for(path)]
        elif form == "102" and name == "SPRAV1.DBF":
            os.makedirs(DEBUG, exist_ok=True)
            with open(os.path.join(DEBUG, "sprav102.csv"), "w", encoding="utf-8", newline="") as f:
                w = csv.writer(f)
                w.writerow(["code", "name"])
                for r in DBF(path, encoding="cp866", parserclass=Safe):
                    w.writerow([r["CODE"], r["NAME"]])
        elif form == "123" and name.endswith("123D.DBF"):
            out += [{"REGN": r["REGN"], "CODE": str(r["C1"]).strip(), "V": r["C3"]} for r in rows_for(path)]
        elif form == "135" and name.endswith("135_3.DBF"):
            out += [{"REGN": r["REGN"], "CODE": str(r["C1_3"]).strip(), "V": r["C2_3"]} for r in rows_for(path)]
    with gzip.open(cp, "wt", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    return out


# ── расчёт по форме 101 ──────────────────────────────────────────────────
def in_range(sc, lo, hi):
    return sc.isdigit() and len(sc) == 3 and lo <= int(sc) <= hi


def is_group(sc, prefix):
    return "." in sc and sc.split(".")[0] == prefix


def calc101(rows):
    """rows — строки одного банка за один месяц. Возвращает метрики в тыс ₽."""
    a_out = defaultdict(float)   # (SC, AP) -> исходящий остаток
    a_in = defaultdict(float)
    for r in rows:
        if r["PLAN"] != "А":
            continue
        a_out[(r["SC"], r["AP"])] += r["OUT"]
        a_in[(r["SC"], r["AP"])] += r["IN"]
    def s(pred, ap, src=a_out):
        return sum(v for (sc, p), v in src.items() if p == ap and pred(sc))

    # кредиты (валовые) и резервы по ним; группы «44.x»/«45.x» — свёрнутые счета формы
    corp = lambda sc: (in_range(sc, 441, 454) or sc == "456" or is_group(sc, "44")
                       or (is_group(sc, "45") and sc != "45.2"))
    retail = lambda sc: sc in ("455", "457") or sc == "45.2"
    loans_corp = s(corp, "1")
    loans_retail = s(retail, "1")
    overdue = s(lambda sc: sc in ("458", "459"), "1")
    reserves = s(lambda sc: corp(sc) or retail(sc) or sc in ("458", "459"), "2")
    # средства клиентов: «42.2» — вклады населения (свёрнутые 423/426), «42.1» — депозиты юрлиц (421/425)
    dep_retail = s(lambda sc: sc in ("423", "426") or sc == "42.2", "2")
    funds_corp = s(lambda sc: in_range(sc, 405, 407) or in_range(sc, 410, 422) or sc == "425" or sc == "42.1", "2")
    # капитал по балансовым счетам (упрощённо)
    cap = (s(lambda sc: sc in ("102", "106", "107", "108"), "2") - s(lambda sc: sc in ("105", "106", "109"), "1")
           + s(lambda sc: sc in ("706", "707", "708"), "2") - s(lambda sc: sc in ("706", "707", "708"), "1"))
    current = s(lambda sc: sc == "408", "2")   # текущие счета (в т.ч. карточные счета физлиц 40817)
    ytd = s(lambda sc: sc == "706", "2") - s(lambda sc: sc == "706", "1")
    ytd_in = s(lambda sc: sc == "706", "2", a_in) - s(lambda sc: sc == "706", "1", a_in)
    assets = s(lambda sc: sc not in ("303", "706") and not sc.startswith("ITG"), "1")
    groups = sorted({sc for (sc, _) in a_out if "." in sc})
    return dict(loans_corp=loans_corp, loans_retail=loans_retail, overdue=overdue, reserves=reserves,
                dep_retail=dep_retail, funds_corp=funds_corp, current=current, cap_bs=cap, ytd=ytd, ytd_in=ytd_in,
                assets=assets, _groups=groups)


def calc102(rows):
    v = defaultdict(float)
    for r in rows:
        v[r["CODE"]] += r["V"] or 0
    if not v:
        return {}
    nii = v["11000"] - v["31000"]
    resv = v["15000"] + v["17000"] - v["37000"] - v["38000"]
    pbt = v["01000"] - v["02000"]
    return dict(nii_ytd=nii, resv_ytd=resv, pbt_ytd=pbt, pre_prov_ytd=pbt - resv,
                net102_ytd=v["61101"] - v["61102"])


# ── основной цикл ────────────────────────────────────────────────────────
def main():
    all_dates = [d for d in months()]
    data = defaultdict(dict)      # (regn, month 'YYYY-MM') -> metrics
    group_log = defaultdict(set)
    present_files = []
    for i, d in enumerate(all_dates):
        force = i >= len(all_dates) - (REFRESH_LAST + 1)
        r101 = load("101", d, force)
        if r101 is None:
            continue
        present_files.append(d)
        rep = (d - dt.timedelta(days=1))
        m = f"{rep:%Y-%m}"
        by = defaultdict(list)
        for r in r101:
            by[r["REGN"]].append(r)
        for regn, rows in by.items():
            c = calc101(rows)
            for g in c.pop("_groups"):
                group_log[regn].add(g)
            data[(regn, m)].update(c)
        for form, fn in (("102", calc102),):
            rr = load(form, d, force)
            if rr:
                byf = defaultdict(list)
                for r in rr:
                    byf[r["REGN"]].append(r)
                for regn, rows in byf.items():
                    data[(regn, m)].update(fn(rows))
        for form in ("123", "135"):
            rr = load(form, d, force)
            for r in rr or []:
                key = (r["REGN"], m)
                if form == "123" and r["CODE"] == "000":
                    data[key]["reg_capital"] = r["V"]
                if form == "135" and r["CODE"] in ("Н1.0", "Н1.1", "Н1.2"):
                    data[key]["h" + r["CODE"][1:].replace(".", "_")] = r["V"]
        print("ok", d, file=sys.stderr)

    rows_out = []
    for regn, name, ticker in BANKS:
        ms = sorted(m for (rg, m) in data if rg == regn)
        series = {m: data[(regn, m)] for m in ms}
        for m in ms:
            x = series[m]
            if "ytd" not in x:
                continue
            y, mo = int(m[:4]), int(m[5:])
            x["profit_m"] = x["ytd"] if mo == 1 else x["ytd"] - x["ytd_in"]
        for m in ms:
            x = series[m]
            if "ytd" not in x:
                continue
            y, mo = int(m[:4]), int(m[5:])
            last12 = [add_months(m, -k) for k in range(12)]
            vals = [series.get(k, {}).get("profit_m") for k in last12]
            caps = [series.get(k, {}).get("cap_bs") for k in last12]
            ltm = sum(vals) if len(vals) == 12 and all(v is not None for v in vals) else None
            avg_cap = sum(caps) / 12 if len(caps) == 12 and all(c for c in caps) else None
            loans = x["loans_corp"] + x["loans_retail"]
            gross = loans + x["overdue"]
            clients = x["dep_retail"] + x["funds_corp"] + x.get("current", 0)
            row = dict(
                regnum=regn, bank=name, ticker=ticker, month=m,
                profit_m=x["profit_m"] / 1e6, profit_ytd=x["ytd"] / 1e6,
                profit_ltm=None if ltm is None else ltm / 1e6,
                roe_ltm=None if (ltm is None or not avg_cap) else ltm / avg_cap * 100,
                loans_corp=x["loans_corp"] / 1e6, loans_retail=x["loans_retail"] / 1e6, loans=loans / 1e6,
                overdue=x["overdue"] / 1e6,
                overdue_pct=x["overdue"] / gross * 100 if gross else None,
                reserves=x["reserves"] / 1e6,
                reserve_cover=x["reserves"] / x["overdue"] * 100 if x["overdue"] else None,
                reserve_ratio=x["reserves"] / gross * 100 if gross else None,
                dep_retail=x["dep_retail"] / 1e6, funds_corp=x["funds_corp"] / 1e6, current_accts=x.get("current", 0) / 1e6,
                clients=clients / 1e6,
                ldr=loans / clients * 100 if clients else None,
                assets=x["assets"] / 1e6, cap_bs=x["cap_bs"] / 1e6,
                reg_capital=x.get("reg_capital") / 1e6 if x.get("reg_capital") else None,
                h1_0=x.get("h1_0"), h1_1=x.get("h1_1"), h1_2=x.get("h1_2"),
                nii_ytd=x["nii_ytd"] / 1e6 if "nii_ytd" in x else None,
                resv_ytd=x["resv_ytd"] / 1e6 if "resv_ytd" in x else None,
                pre_prov_ytd=x["pre_prov_ytd"] / 1e6 if "pre_prov_ytd" in x else None,
                pbt_ytd=x["pbt_ytd"] / 1e6 if "pbt_ytd" in x else None,
                net102_ytd=x["net102_ytd"] / 1e6 if "net102_ytd" in x else None,
            )
            rows_out.append(row)

    os.makedirs(DATA, exist_ok=True)
    cols = list(rows_out[0].keys())
    with open(os.path.join(DATA, "monthly.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in rows_out:
            w.writerow({k: fmt(v) for k, v in r.items()})

    from signals import build_summary
    summary = build_summary(rows_out, BANKS)
    with open(os.path.join(DATA, "summary.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(summary[0].keys()))
        w.writeheader()
        for r in summary:
            w.writerow({k: fmt(v) for k, v in r.items()})

    write_ru_tsv("monthly")
    write_ru_tsv("summary")
    last = max(r["month"] for r in rows_out)
    with open(os.path.join(DATA, "meta.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["key", "value"])
        w.writerow(["updated_utc", dt.datetime.utcnow().strftime("%Y-%m-%d %H:%M")])
        w.writerow(["last_month", last])
        w.writerow(["source", "Банк России, формы 0409101/0409102/0409123/0409135 (РСБУ, без дочерних компаний)"])
    os.makedirs(DEBUG, exist_ok=True)
    with open(os.path.join(DEBUG, "groups101.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["regnum", "groups"])
        for regn, gs in sorted(group_log.items()):
            w.writerow([regn, " ".join(sorted(gs))])
    print("rows", len(rows_out), "last", last)


def write_ru_tsv(name):
    """Копия CSV для русской Google Таблицы: табуляция и десятичная запятая."""
    import re
    num = re.compile(r"^-?\d+\.\d+$")
    with open(os.path.join(DATA, f"{name}.csv"), encoding="utf-8") as f, \
         open(os.path.join(DATA, f"{name}_ru.tsv"), "w", encoding="utf-8") as g:
        for row in csv.reader(f):
            g.write("\t".join(c.replace(".", ",") if num.match(c) else c.replace("\t", " ") for c in row) + "\n")


def add_months(m, k):
    y, mo = int(m[:4]), int(m[5:]) + k
    while mo < 1:
        y, mo = y - 1, mo + 12
    while mo > 12:
        y, mo = y + 1, mo - 12
    return f"{y:04d}-{mo:02d}"


def fmt(v):
    if v is None:
        return ""
    if isinstance(v, float):
        return f"{v:.2f}" if abs(v) < 1000 else f"{v:.1f}"
    return v


if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()

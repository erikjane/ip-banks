"""
Invest Privet · Фундаментал — сборка JSON для сайта из Google-таблиц.

Запускается GitHub Action по расписанию (и по кнопке из Google-таблицы).
Каждая Google-таблица читается ОДНИМ запросом (выгрузка .xlsx по ссылке или values.batchGet), поэтому
лимиты Google не важны: ~3–5 запросов за прогон, посетители сайта к Google
не обращаются вообще — они читают готовые JSON из GitHub Pages.

Локально (без Google) можно собрать из .xlsx-выгрузок:
    python build_data.py --xlsx data/ --out site/data
"""
import argparse, datetime as dt, json, os, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONFIG = json.loads((HERE / "config.json").read_text(encoding="utf-8"))


# ---------- общие утилиты ----------
def clean_cell(v):
    if v is None:
        return ""
    if isinstance(v, float):
        if v != v or v in (float("inf"), float("-inf")):
            return ""
        return round(v, 6)
    if isinstance(v, (dt.date, dt.datetime)):
        return v.strftime("%d.%m.%Y")
    if isinstance(v, str):
        s = v.strip()
        if s.startswith("#") and s.endswith(("!", "?", "A")):  # #VALUE!, #DIV/0!, #N/A
            return ""
        return s
    return v


def trim_grid(rows):
    out = []
    for r in rows:
        r = [clean_cell(v) for v in r]
        while r and r[-1] == "":
            r.pop()
        out.append(r)
    while out and not out[-1]:
        out.pop()
    return out


def excel_serial_to_iso(v):
    if isinstance(v, (int, float)) and 20000 < v < 80000:
        return (dt.date(1899, 12, 30) + dt.timedelta(days=int(v))).isoformat()
    if isinstance(v, (dt.date, dt.datetime)):
        return v.strftime("%Y-%m-%d")
    return v


# ---------- источники ----------
class SheetsSource:
    """Google Sheets API: один batchGet на таблицу."""

    def __init__(self):
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        info = json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"])
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
        self.api = build("sheets", "v4", credentials=creds, cache_discovery=False).spreadsheets()

    def sheet_names(self, sid):
        meta = self.api.get(spreadsheetId=sid, fields="sheets.properties.title").execute()
        return [s["properties"]["title"] for s in meta["sheets"]]

    def grids(self, sid, names):
        res = self.api.values().batchGet(
            spreadsheetId=sid, ranges=[f"'{n}'" for n in names],
            valueRenderOption="UNFORMATTED_VALUE", dateTimeRenderOption="FORMATTED_STRING").execute()
        return {n: trim_grid(vr.get("values", [])) for n, vr in zip(names, res["valueRanges"])}


class ExportSource:
    """Без ключей Google: скачивает таблицу целиком как .xlsx (один запрос на таблицу).
    Нужен доступ «Все, у кого есть ссылка — Читатель»."""

    def __init__(self):
        self._cache = {}

    def _wb(self, sid):
        if sid not in self._cache:
            import io, urllib.request, openpyxl
            url = f"https://docs.google.com/spreadsheets/d/{sid}/export?format=xlsx"
            req = urllib.request.Request(url, headers={"User-Agent": "ip-site-bot"})
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            if not data.startswith(b"PK"):
                raise RuntimeError(f"Таблица {sid} не открыта по ссылке (Google вернул страницу входа)")
            self._cache[sid] = openpyxl.load_workbook(io.BytesIO(data), data_only=True)
        return self._cache[sid]

    def sheet_names(self, sid):
        return self._wb(sid).sheetnames

    def grids(self, sid, names):
        wb = self._wb(sid)
        return {n: trim_grid([[c.value for c in row] for row in wb[n].iter_rows()]) for n in names if n in wb.sheetnames}


class XlsxSource:
    """Локальные .xlsx-выгрузки (для проверки без доступа к Google)."""

    def __init__(self, folder):
        self.folder = Path(folder)

    def _wb(self, sid):
        import openpyxl
        f = self.folder / f"{sid}.xlsx"
        return openpyxl.load_workbook(f, data_only=True)

    def sheet_names(self, sid):
        return self._wb(sid).sheetnames

    def grids(self, sid, names):
        wb = self._wb(sid)
        return {n: trim_grid([[c.value for c in row] for row in wb[n].iter_rows()]) for n in names if n in wb.sheetnames}


# ---------- сборка ----------
def pick_sheets(all_names, rule):
    inc, exc = rule.get("include"), re.compile(rule.get("exclude", r"^$"), re.I)
    names = [n for n in all_names if not exc.search(n)]
    if inc:
        names = [n for n in inc if n in all_names]
    return names


def build_sector(src, sector):
    sid = sector["spreadsheet_id"]
    names = pick_sheets(src.sheet_names(sid), sector.get("sheets", {}))
    return {"id": sector["id"], "sheets": src.grids(sid, names)}


def build_rsbu(cfg, local_dir=None):
    """РСБУ из репозитория ip-banks (data/summary.csv и data/monthly.csv) — Google не нужен."""
    import csv, io, urllib.request

    def load(name):
        if local_dir:
            return (Path(local_dir) / name).read_text(encoding="utf-8")
        with urllib.request.urlopen(cfg["csv_base"] + name, timeout=60) as r:
            return r.read().decode("utf-8")

    def num(v):
        if v in ("", None):
            return ""
        try:
            f = float(v)
            return int(f) if f.is_integer() and "." not in v else f
        except ValueError:
            return v

    def rows(name):
        return [{k: (num(v) if k not in ("bank", "ticker", "month", "light", "verdict", "profit_ytd_note") and not k.startswith("s_") else v)
                 for k, v in r.items()} for r in csv.DictReader(io.StringIO(load(name)))]

    summary = rows("summary.csv")
    for r in summary:
        r["month"] = r["month"] + "-01" if len(r["month"]) == 7 else r["month"]
    mon = rows("monthly.csv")
    head = [h for h in mon[0].keys() if h not in ("regnum", "bank", "ticker")] if mon else []
    monthly = {"cols": head, "banks": {}}
    for r in mon:
        r["month"] = r["month"] + "-01" if len(r["month"]) == 7 else r["month"]
        monthly["banks"].setdefault(r["bank"], []).append([r.get(h, "") for h in head])
    for k in monthly["banks"]:
        monthly["banks"][k].sort(key=lambda x: x[0], reverse=True)
    return {"month": summary[0]["month"] if summary else "", "summary": summary, "monthly": monthly}


def build_clock(src, cfg):
    """Лист «Тест» в таблице «Инвест-часы»: 10 ответов (столбец «Ваш ответ»), дата и галочка ОК.
    Публикуем только когда ОК отмечен и все 10 ответов заполнены; иначе на сайте остаются прошлые часы."""
    g = src.grids(cfg["spreadsheet_id"], [cfg["sheet"]])[cfg["sheet"]]
    hr = next(i for i, r in enumerate(g) if "Ваш ответ" in [str(x).strip() for x in r])
    col = [str(x).strip() for x in g[hr]].index("Ваш ответ")
    answers = [str((g[r] + [""] * (col + 1))[col]).strip().upper()[:1] for r in range(hr + 1, hr + 11)]

    def value(label):
        for r in g:
            if r and str(r[0]).strip().lower().startswith(label):
                return r[1] if len(r) > 1 else ""
        return ""

    ok = value("ок")
    if not (ok is True or str(ok).strip().lower() in ("true", "истина", "ок", "ok", "да", "1")):
        return None
    if not all(a in "ABCD" and a for a in answers):
        return None
    date = value("дата обновления")
    if isinstance(date, (int, float)):
        date = (dt.date(1899, 12, 30) + dt.timedelta(days=int(date))).strftime("%d.%m.%Y")
    return {"date": str(date), "answers": answers, "comment": str(value("комментарий") or "")}


def write_json(path, obj, now, compact=True):
    """Пишем файл; если данные не изменились — сохраняем прежнюю метку updated (тогда git не видит изменений)."""
    path = Path(path)
    if path.exists():
        try:
            old = json.loads(path.read_text(encoding="utf-8"))
            if {k: v for k, v in old.items() if k != "updated"} == {k: v for k, v in obj.items() if k != "updated"}:
                return False
        except Exception:
            pass
    obj["updated"] = now
    txt = json.dumps(obj, ensure_ascii=False, separators=(",", ":")) if compact else json.dumps(obj, ensure_ascii=False, indent=1)
    path.write_text(txt, encoding="utf-8")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--xlsx", help="папка с выгрузками <spreadsheet_id>.xlsx вместо Google API")
    ap.add_argument("--rsbu-local", help="папка data/ репозитория ip-banks вместо загрузки с GitHub")
    ap.add_argument("--out", default="site/data")
    a = ap.parse_args()
    if a.xlsx:
        src = XlsxSource(a.xlsx)
    elif os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON"):
        src = SheetsSource()      # закрытые таблицы + сервисный аккаунт
    else:
        src = ExportSource()      # таблицы, открытые по ссылке на просмотр
    out = Path(a.out)
    (out / "sectors").mkdir(parents=True, exist_ok=True)
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")

    changed = False
    catalog = {"sectors": []}
    for s in CONFIG["sectors"]:
        entry = {k: s[k] for k in ("id", "name") if k in s}
        entry["active"] = bool(s.get("active"))
        if s.get("spreadsheet_id"):
            try:
                changed |= write_json(out / "sectors" / f"{s['id']}.json", build_sector(src, s), now)
            except Exception as e:  # таблица недоступна — на сайте остаются прошлые данные
                print(f"WARN {s['id']}: {e}")
        catalog["sectors"].append(entry)

    if CONFIG.get("rsbu"):
        try:
            changed |= write_json(out / "rsbu.json", build_rsbu(CONFIG["rsbu"], a.rsbu_local), now)
        except Exception as e:
            print(f"WARN rsbu: {e}")

    if CONFIG.get("clock"):
        try:
            ck = build_clock(src, CONFIG["clock"])
        except Exception as e:
            print(f"WARN clock: {e}"); ck = None
        if ck:  # без галочки ОК файл не трогаем — на сайте остаются прошлые часы
            changed |= write_json(out / "clock.json", ck, now, compact=False)

    # каталог: метка времени = момент последнего изменения любых данных
    cat_path = out / "catalog.json"
    prev = json.loads(cat_path.read_text(encoding="utf-8")) if cat_path.exists() else {}
    if changed or prev.get("sectors") != catalog["sectors"]:
        catalog["updated"] = now
        cat_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=1), encoding="utf-8")
    print("ok", now)


if __name__ == "__main__":
    sys.exit(main())

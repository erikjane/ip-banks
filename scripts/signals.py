"""Светофор для частного инвестора: зелёный = хорошо для акционера, красный = плохо.
Сравниваем год к году (тот же месяц прошлого года), маленькие изменения — серые.
Пороги собраны вверху, их можно менять."""

TH = dict(
    profit_pct=3.0,          # прибыль с начала года: ±3% — серая зона
    roe_good=20.0, roe_bad=12.0,
    loans_pct=3.0, loans_hot=35.0,   # рост кредитов >35% г/г — жёлтый (риск слишком быстрого роста)
    overdue_pp=0.2,          # доля просрочки: изменение меньше ±0,2 п.п. — серое
    cover_good=100.0, cover_bad=80.0,
    dep_pct=3.0,
    h1_good=12.0, h1_bad=10.0,
)


def _ago(m, k=12):
    y, mo = int(m[:4]), int(m[5:]) - k
    while mo < 1:
        y, mo = y - 1, mo + 12
    return f"{y:04d}-{mo:02d}"


def pct(a, b):
    if a is None or b is None or b == 0:
        return None
    if b < 0:
        return None
    return (a / b - 1) * 100


def sign(v, lo, hi, invert=False):
    if v is None:
        return "нет данных"
    if invert:
        v = -v
    return "зелёный" if v >= hi else "красный" if v <= lo else "серый"


def build_summary(rows, banks):
    by = {(r["regnum"], r["month"]): r for r in rows}
    out = []
    for regn, name, ticker in banks:
        ms = sorted(m for (rg, m) in by if rg == regn)
        if not ms:
            out.append(dict(regnum=regn, bank=name, ticker=ticker, month="", verdict="нет раскрытой отчётности"))
            continue
        m = ms[-1]
        x, p = by[(regn, m)], by.get((regn, _ago(m)), {})
        s = {}
        notes_good, notes_bad = [], []

        # 1. прибыль с начала года
        dp = pct(x["profit_ytd"], p.get("profit_ytd"))
        if dp is None and p.get("profit_ytd") is not None and p["profit_ytd"] <= 0 < x["profit_ytd"]:
            s["s_profit"] = "зелёный"; dp_txt = "вышел в прибыль"
        else:
            s["s_profit"] = sign(dp, -TH["profit_pct"], TH["profit_pct"])
            dp_txt = "" if dp is None else f"{dp:+.0f}% к прошлому году"
        if x["profit_ytd"] is not None and x["profit_ytd"] < 0:
            s["s_profit"] = "красный"
        # 2. ROE
        roe = x.get("roe_ltm")
        s["s_roe"] = "нет данных" if roe is None else "зелёный" if roe >= TH["roe_good"] else "красный" if roe < TH["roe_bad"] else "серый"
        # 3. кредиты
        dl = pct(x["loans"], p.get("loans"))
        s["s_loans"] = "нет данных" if dl is None else "жёлтый" if dl > TH["loans_hot"] else sign(dl, 0.0, TH["loans_pct"])
        if s["s_loans"] == "серый" and dl is not None and dl < 0:
            s["s_loans"] = "красный"
        # 4. доля просрочки (рост — плохо)
        dov = None if p.get("overdue_pct") is None or x.get("overdue_pct") is None else x["overdue_pct"] - p["overdue_pct"]
        s["s_overdue"] = sign(dov, -TH["overdue_pp"], TH["overdue_pp"], invert=True)
        # 5. покрытие просрочки резервами
        cov = x.get("reserve_cover")
        s["s_cover"] = "нет данных" if cov is None else "зелёный" if cov >= TH["cover_good"] else "красный" if cov < TH["cover_bad"] else "серый"
        # 6. вклады населения
        dd = pct(x["dep_retail"], p.get("dep_retail"))
        s["s_deposits"] = sign(dd, 0.0, TH["dep_pct"])
        if s["s_deposits"] == "серый" and dd is not None and dd < 0:
            s["s_deposits"] = "красный"
        # банки, где кредиты — не основной бизнес (меньше 5% активов): качество кредитов не оцениваем
        if x.get("assets") and x["loans"] < 0.05 * x["assets"]:
            for k in ("s_loans", "s_overdue", "s_cover"):
                s[k] = "не применимо"
        if not x.get("dep_retail") or x["dep_retail"] < 1:
            s["s_deposits"] = "не применимо"
        young = any(v is not None and v > 100 for v in (dl, dd))
        # 7. достаточность капитала
        h1 = x.get("h1_0")
        s["s_h1"] = "нет данных" if h1 is None else "зелёный" if h1 >= TH["h1_good"] else "красный" if h1 < TH["h1_bad"] else "серый"

        txt = {
            "s_profit": ("прибыль растёт", "прибыль падает"),
            "s_roe": ("высокая рентабельность", "низкая рентабельность"),
            "s_loans": ("кредитный портфель растёт", "кредитный портфель сокращается"),
            "s_overdue": ("просрочка снижается", "просрочка растёт"),
            "s_cover": ("резервов с запасом", "резервов мало относительно просрочки"),
            "s_deposits": ("вклады населения растут", "вклады населения уходят"),
            "s_h1": ("запас капитала комфортный", "капитал близко к минимуму"),
        }
        for k, (g, b) in txt.items():
            if s[k] == "зелёный": notes_good.append(g)
            if s[k] == "красный": notes_bad.append(b)
        if s["s_loans"] == "жёлтый":
            notes_bad.append("кредиты растут очень быстро — следить за качеством")
        greens = sum(v == "зелёный" for v in s.values())
        reds = sum(v == "красный" for v in s.values())
        light = "зелёный" if greens >= 4 and reds <= 1 else "красный" if reds >= 3 else "жёлтый"
        if young:
            notes_bad = notes_bad  # не меняем сигналы, но добавляем пояснение ниже
        verdict = "; ".join([", ".join(notes_good[:3]).capitalize()] * bool(notes_good)
                            + [("но " if notes_good else "") + ", ".join(notes_bad[:3])] * bool(notes_bad)) or "без заметных изменений"
        if young:
            verdict += ". Молодой быстрорастущий банк: проценты роста и ROE несопоставимы с крупными банками"
        if s["s_loans"] == "не применимо":
            verdict += ". Кредитование — не основной бизнес банка"

        out.append(dict(
            regnum=regn, bank=name, ticker=ticker, month=m,
            light=light, greens=greens, reds=reds, verdict=verdict,
            profit_m=x["profit_m"], profit_ytd=x["profit_ytd"], profit_ytd_prev=p.get("profit_ytd"),
            profit_ytd_yoy_pct=dp, profit_ytd_note=dp_txt, s_profit=s["s_profit"],
            profit_ltm=x.get("profit_ltm"),
            roe_ltm=roe, s_roe=s["s_roe"],
            loans=x["loans"], loans_yoy_pct=dl, s_loans=s["s_loans"],
            overdue_pct=x.get("overdue_pct"), overdue_pct_prev=p.get("overdue_pct"), overdue_pct_chg_pp=dov, s_overdue=s["s_overdue"],
            reserve_cover=cov, s_cover=s["s_cover"],
            dep_retail=x["dep_retail"], dep_retail_yoy_pct=dd, s_deposits=s["s_deposits"],
            h1_0=h1, s_h1=s["s_h1"],
            ldr=x.get("ldr"), assets=x.get("assets"), young="да" if young else "",
            profit_ytd_check102=x.get("net102_ytd"),
        ))
    return out

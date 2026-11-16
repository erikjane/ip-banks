import os, subprocess, tempfile, datetime as dt, requests
from dbfread import DBF, FieldParser
class Safe(FieldParser):
    def parseN(self, f, d):
        try: return super().parseN(f, d)
        except Exception: return None
UA = {"User-Agent": "Mozilla/5.0"}
def files(form, d):
    r = requests.get(f"https://www.cbr.ru/vfs/credit/forms/{form}-{d:%Y%m%d}.rar", headers=UA, timeout=90)
    tmp = tempfile.mkdtemp(); p = os.path.join(tmp, "a.rar"); open(p, "wb").write(r.content)
    subprocess.run(["unar", "-q", "-f", "-o", tmp, p], capture_output=True)
    return {f.upper(): os.path.join(rt, f) for rt, _, fs in os.walk(tmp) for f in fs}
d = dt.date(2026, 10, 1)
f = files("101", d)
names = {}
for k, p in f.items():
    if k == "NAMES.DBF":
        for r in DBF(p, encoding="cp866", parserclass=Safe): names[(r["PLAN"], r["NUM_SC"])] = r["NAME"][:70]
print("FILES101", list(f))
for k, p in f.items():
    if k.endswith("B1.DBF"):
        rows = [r for r in DBF(p, encoding="cp866", parserclass=Safe) if r["REGN"] == 1481]
        print("rows Sber:", len(rows))
        for r in sorted(rows, key=lambda r: (r["PLAN"], r["NUM_SC"], r["A_P"])):
            print(f"A101 {r['PLAN']} {r['NUM_SC']:>6} ap{r['A_P']} in={r['VITG']} out={r['IITG']} | {names.get((r['PLAN'], r['NUM_SC']), '?')}")
f = files("102", d)
print("FILES102", list(f))
sp = {}
for k, p in f.items():
    if k == "SPRAV1.DBF":
        for r in DBF(p, encoding="cp866", parserclass=Safe):
            if r["CODE"]: sp[r["CODE"]] = r["NAME"][:80]
for k, p in f.items():
    if k.endswith("_P1.DBF"):
        for r in DBF(p, encoding="cp866", parserclass=Safe):
            if r["REGN"] == 1481 and (len(r["CODE"]) == 5 and (r["CODE"].endswith("000") or r["CODE"].startswith("61") or r["CODE"].startswith("0"))):
                print(f"A102 {r['CODE']} {r['SIM_ITOGO']} | {sp.get(r['CODE'], '?')}")
for form in ("123", "135"):
    f = files(form, d)
    for k, p in f.items():
        if k.endswith("123D.DBF") or k.endswith("135_3.DBF"):
            for r in DBF(p, encoding="cp866", parserclass=Safe):
                if r["REGN"] == 1481: print("A" + form, dict(r))
# месячность 101/102 в 2023-2025
for y, m in [(2023, 8), (2023, 11), (2024, 2), (2024, 8), (2024, 11), (2025, 2), (2025, 3), (2025, 6), (2026, 2)]:
    dd = dt.date(y, m, 1)
    print("MONTH", dd, [requests.head(f"https://www.cbr.ru/vfs/credit/forms/{fm}-{dd:%Y%m%d}.rar", headers=UA, timeout=30).status_code for fm in ("101", "102", "123", "135")])

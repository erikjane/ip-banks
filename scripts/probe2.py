"""Шаг 0.2: регномера наших банков, кто раскрывает 101/102/123/135, глубина истории."""
import os, subprocess, tempfile, datetime as dt, requests
from dbfread import DBF, FieldParser

class Safe(FieldParser):
    def parseN(self, field, data):
        try: return super().parseN(field, data)
        except Exception: return None
    def parseF(self, field, data):
        try: return super().parseF(field, data)
        except Exception: return None

UA = {"User-Agent": "Mozilla/5.0 (ip-banks research bot)"}
def get(form, d):
    url = f"https://www.cbr.ru/vfs/credit/forms/{form}-{d:%Y%m%d}.rar"
    r = requests.get(url, headers=UA, timeout=90)
    return r.content if r.status_code == 200 and len(r.content) > 20000 else None
def dbfs(blob):
    tmp = tempfile.mkdtemp(); p = os.path.join(tmp, "a.rar"); open(p, "wb").write(blob)
    subprocess.run(["unar", "-q", "-f", "-o", tmp, p], capture_output=True)
    return {f: os.path.join(r, f) for r, _, fs in os.walk(tmp) for f in fs if f.lower().endswith(".dbf")}
def rows(path): return DBF(path, encoding="cp866", parserclass=Safe)

KEYS = ["СБЕРБАНК", "ВТБ", "АЛЬФА", "ТБАНК", "Т-БАНК", "ГАЗПРОМБАНК", "ВАЙЛДБЕРРИЗ", "ВБ БАНК", "СОВКОМБАНК",
        "ДОМ.РФ", "ДОМ РФ", "РОССЕЛЬХОЗ", "ОЗОН", "ОЗОН", "САНКТ-ПЕТЕРБУРГ", "МОСКОВСКИЙ КРЕДИТНЫЙ", "ТОЧКА",
        "ЯНДЕКС", "МТС"]
d = dt.date(2026, 10, 1)
f101 = dbfs(get("101", d)); f135 = dbfs(get("135", d)); f123 = dbfs(get("123", d)); f102 = dbfs(get("102", d))
names = {}
for k, p in f101.items():
    if k.upper().endswith("N1.DBF"):
        for r in rows(p): names[r["REGN"]] = r.get("NAME_B") or str(r)
for k, p in f135.items():
    if k.upper().endswith("135B.DBF"):
        for r in rows(p): names.setdefault(r["REGN"], r["NAME_B"])
print("N1 sample:", list(names.items())[:2])
def regs(files, suffix):
    s = set()
    for k, p in files.items():
        if k.upper().endswith(suffix):
            for r in rows(p): s.add(r["REGN"])
    return s
r101, r102, r123, r135 = regs(f101, "B1.DBF"), regs(f102, "_P1.DBF"), regs(f123, "_123D.DBF"), regs(f135, "_135_3.DBF")
print("банков в 101:", len(r101), "102:", len(r102), "123:", len(r123), "135:", len(r135))
for rg, nm in sorted(names.items(), key=lambda x: str(x[1])):
    u = str(nm).upper()
    if any(k in u for k in KEYS):
        print(f"MATCH {rg:>5} | 101:{rg in r101:d} 102:{rg in r102:d} 123:{rg in r123:d} 135:{rg in r135:d} | {nm}")
for rg in [1481,1000,1326,2673,354,841,963,2312,3349,3542,436,1978,3027,2268]:
    print("CHECK", rg, names.get(rg), rg in r101, rg in r102)
print("\nИстория 101/102 по датам:")
for y in (2022, 2023, 2024, 2025, 2026):
    for m in (1, 4, 5, 7, 10):
        dd = dt.date(y, m, 1)
        if dd > d: continue
        res = []
        for form in ("101", "102"):
            url = f"https://www.cbr.ru/vfs/credit/forms/{form}-{dd:%Y%m%d}.rar"
            try: rr = requests.head(url, headers=UA, timeout=30); res.append(f"{form}:{rr.status_code}")
            except Exception as e: res.append(f"{form}:ERR")
        print(" ", dd, " ".join(res))

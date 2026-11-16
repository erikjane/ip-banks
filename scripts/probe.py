"""Шаг 0: проверка доступа к cbr.ru и разведка формата архивов форм 101/102/123/135.
Печатает: доступен ли сайт, какие файлы внутри архивов, колонки и пример строк,
и ищет наши 15 банков по названию в справочнике формы 101."""
import io, os, re, subprocess, sys, tempfile, datetime as dt
import requests
from dbfread import DBF

BASE = "https://www.cbr.ru/vfs/credit/forms/{form}-{date}.{ext}"
UA = {"User-Agent": "Mozilla/5.0 (ip-banks research bot)"}
WANT = ["СБЕРБАНК", "ВТБ", "АЛЬФА", "ТБАНК", "Т-БАНК", "ТИНЬКОФФ", "ГАЗПРОМБАНК", "ВАЙЛДБЕРРИЗ", "ВБ БАНК",
        "СОВКОМБАНК", "ДОМ.РФ", "РОССЕЛЬХОЗ", "ОЗОН", "САНКТ-ПЕТЕРБУРГ", "МОСКОВСКИЙ КРЕДИТНЫЙ",
        "ТОЧКА", "ЯНДЕКС", "МТС"]

def month_starts(n=6):
    d = dt.date.today().replace(day=1)
    for _ in range(n):
        yield d
        d = (d - dt.timedelta(days=1)).replace(day=1)

def fetch(form):
    for d in month_starts(8):
        for ext in ("rar", "zip"):
            url = BASE.format(form=form, date=d.strftime("%Y%m%d"), ext=ext)
            try:
                r = requests.get(url, headers=UA, timeout=60)
            except Exception as e:
                print(f"  {url}: ERROR {e}"); continue
            print(f"  {url}: {r.status_code} {len(r.content)} bytes")
            if r.status_code == 200 and len(r.content) > 1000:
                return url, r.content
    return None, None

def unpack(blob, ext, dest):
    p = os.path.join(dest, "a." + ext)
    open(p, "wb").write(blob)
    subprocess.run(["unar", "-q", "-f", "-o", dest, p], check=False)
    out = []
    for root, _, files in os.walk(dest):
        out += [os.path.join(root, f) for f in files if f.lower().endswith(".dbf")]
    return out

def main():
    try:
        r = requests.get("https://www.cbr.ru/", headers=UA, timeout=30)
        print("cbr.ru main:", r.status_code)
    except Exception as e:
        print("cbr.ru main: ERROR", e)
    for form in ("101", "102", "123", "135"):
        print(f"\n===== FORM {form} =====")
        url, blob = fetch(form)
        if not blob:
            print("  нет архива"); continue
        with tempfile.TemporaryDirectory() as tmp:
            for f in unpack(blob, url.rsplit(".", 1)[1], tmp):
                try:
                    t = DBF(f, encoding="cp866", load=False)
                    rows = []
                    for i, row in enumerate(t):
                        rows.append(dict(row))
                        if i >= 2: break
                    print(f"  -- {os.path.basename(f)} fields={t.field_names}")
                    for row in rows: print("     ", row)
                    if form == "101" and any(k.upper() in ("NAME_B", "NAME") for k in t.field_names):
                        for row in DBF(f, encoding="cp866"):
                            nm = str(row.get("NAME_B") or row.get("NAME") or "").upper()
                            if any(w in nm for w in WANT):
                                print("     BANK:", row.get("REGN"), nm)
                except Exception as e:
                    print("  !!", f, e)

if __name__ == "__main__":
    main()

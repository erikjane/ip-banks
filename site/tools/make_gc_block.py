import re
src=open('/home/claude/v2/site/app.html').read()
css=re.sub(r'/\*.*?\*/','',src[src.index('<style>')+7:src.index('</style>')],flags=re.S)
body_html=src[src.index('<body>')+6:src.index('<script>')]
js=src[src.index('<script>')+8:src.rindex('</script>')]
def scope(sel):
    out=[]
    for s in sel.split(','):
        s=s.strip()
        if not s: continue
        if s in(':root','body'): out.append('#ipapp')
        elif s=='*': out.append('#ipapp, #ipapp *')
        else: out.append('#ipapp '+s)
    return ','.join(out)
def scope_css(c):
    res=[];i=0
    while i<len(c):
        j=c.find('{',i)
        if j<0: res.append(c[i:]);break
        head=c[i:j].strip()
        if head.startswith('@media'):
            depth=1;k=j+1
            while depth:
                if c[k]=='{':depth+=1
                elif c[k]=='}':depth-=1
                k+=1
            res.append(head+'{'+scope_css(c[j+1:k-1])+'}\n'); i=k; continue
        k=c.find('}',j)
        res.append(scope(head)+'{'+c[j+1:k]+'}\n'); i=k+1
    return ''.join(res)
scss=scope_css(css).replace('#ipapp header{background:var(--navy);color:#fff;position:sticky;top:0;z-index:20}','#ipapp header{background:var(--navy);color:#fff;position:relative;border-radius:16px}')
reset='''#ipapp{all:initial;display:block;font-family:Manrope,system-ui,sans-serif;background:var(--canvas);color:var(--navy);font-size:15px;line-height:1.45;border-radius:16px;overflow:hidden}
#ipapp *{letter-spacing:normal;text-transform:none;text-shadow:none;font-family:Manrope,system-ui,sans-serif}
#ipapp h1,#ipapp h2,#ipapp h3,#ipapp h4,#ipapp p,#ipapp ul,#ipapp ol{color:inherit}
#ipapp table{margin:0;border:0;width:100%} #ipapp td,#ipapp th{line-height:1.35}
#ipapp select,#ipapp button,#ipapp input{line-height:normal;height:auto;box-shadow:none}
'''
def pid(t):
    t=re.sub(r'\bid="','id="ipa-',t)
    for a,b in [('getElementById("','getElementById("ipa-'),('querySelector("#','querySelector("#ipa-'),('querySelectorAll("#','querySelectorAll("#ipa-'),('querySelectorAll(`#q','querySelectorAll(`#ipa-q')]:
        t=t.replace(a,b)
    return t
body_html=pid(body_html); js=pid(js)
js=js.replace('const DATA_URL = "data/";','const DATA_URL = "https://raw.githubusercontent.com/erikjane/ip-banks/main/docs/data/";')
js=js.replace('window.scrollTo(0,0);','{const a=document.getElementById("ipapp"); const y=a.getBoundingClientRect().top+window.scrollY-10; if(window.scrollY>y) window.scrollTo(0,y);}')
block=f'''<!-- Инвест Привет+ · Инвест-часы и отрасли. HTML-блок для GetCourse. Данные берутся из GitHub (erikjane/ip-banks) и обновляются сами. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
{reset}{scss}</style>
<div id="ipapp">
{body_html.strip()}
</div>
<script>
(function(){{
{js}
}})();
</script>
'''
open('/home/claude/v2/getcourse_block.html','w').write(block)
page=open('/tmp/gc_test.html').read()
s0=page.index('<!-- Инвест Привет+'); e0=page.rindex('</script>')+len('</script>')
open('/tmp/gc_test.html','w').write(page[:s0]+block.strip()+page[e0:])
print('ok',len(block), 'sharedClock' in block)

import json,re
blk=open('/home/claude/v2/getcourse_block.html').read()
css=blk[blk.index('<style>')+7:blk.index('</style>')]
html=blk[blk.index('<div id="ipapp">')+len('<div id="ipapp">'):blk.rindex('</div>\n<script>')]
js=blk[blk.rindex('<script>')+8:blk.rindex('</script>')]
protect_css='''
#ipapp, #ipapp *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
#ipapp img,#ipapp svg,#ipapp canvas{-webkit-user-drag:none;pointer-events:auto}
#ipapp select,#ipapp input{-webkit-user-select:auto;user-select:auto}
@media print{#ipapp{display:none !important}}
'''
embed='''/* Инвест Привет+ · Инвест-часы и отрасли — встраивание на GetCourse и другие сайты.
   На странице нужно только:
   <div id="ipapp"></div>
   <script src="https://cdn.jsdelivr.net/gh/zaletovaea-ui/ip-banks@main/docs/embed.js"></script>
   Данные подтягиваются из docs/data этого репозитория. */
(function(){
  var root=document.getElementById("ipapp");
  if(!root){ root=document.createElement("div"); root.id="ipapp"; (document.currentScript&&document.currentScript.parentNode||document.body).insertBefore(root, document.currentScript||null); }
  if(root.dataset.ready) return; root.dataset.ready="1";
  var head=document.head||document.getElementsByTagName("head")[0];
  function link(href){ var l=document.createElement("link"); l.rel="stylesheet"; l.href=href; head.appendChild(l); }
  link("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");
  var st=document.createElement("style"); st.textContent=CSS_HERE; head.appendChild(st);
  root.innerHTML=HTML_HERE;
  // защита от копирования и сохранения (сдерживающая: скриншот и инструменты разработчика не блокируются)
  ["contextmenu","copy","cut","dragstart","selectstart"].forEach(function(ev){
    root.addEventListener(ev,function(e){ var t=e.target; if(t&&(t.tagName==="SELECT"||t.tagName==="INPUT")) return; e.preventDefault(); });
  });
  document.addEventListener("keydown",function(e){
    var k=(e.key||"").toLowerCase(), mod=e.ctrlKey||e.metaKey;
    if(mod&&(k==="s"||k==="p"||k==="u"||(k==="c"&&root.contains(document.activeElement)))){ e.preventDefault(); }
  },true);
  function start(){
APP_HERE
  }
  if(window.Chart){ start(); }
  else{ var s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"; s.onload=start; s.onerror=start; head.appendChild(s); }
})();
'''
embed=embed.replace('CSS_HERE',json.dumps(css+protect_css,ensure_ascii=False)).replace('HTML_HERE',json.dumps(html.strip(),ensure_ascii=False)).replace('APP_HERE',js)
open('/home/claude/v2/embed.js','w').write(embed)
snippet='''<div id="ipapp"></div>
<script src="https://cdn.jsdelivr.net/gh/zaletovaea-ui/ip-banks@main/docs/embed.js"></script>'''
open('/home/claude/v2/getcourse_code.txt','w').write(snippet+'\n')
page='''<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Georgia,serif;background:#eee;margin:0} *{letter-spacing:2px} table{width:40%} .gc-wrap{max-width:1300px;margin:20px auto;padding:0 20px}</style></head>
<body><div style="background:#333;color:#fff;padding:20px">GetCourse шапка</div><div class="gc-wrap">'''+snippet+'''</div></body></html>'''
open('/tmp/gc_short.html','w').write(page)
print(len(embed))

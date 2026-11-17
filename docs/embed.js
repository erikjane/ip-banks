/* Инвест Привет+ · Инвест-часы и отрасли — встраивание на GetCourse и другие сайты.
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
  var st=document.createElement("style"); st.textContent="\n#ipapp{all:initial;display:block;font-family:Manrope,system-ui,sans-serif;background:var(--canvas);color:var(--navy);font-size:15px;line-height:1.45;border-radius:16px;overflow:hidden}\n#ipapp *{letter-spacing:normal;text-transform:none;text-shadow:none;font-family:Manrope,system-ui,sans-serif}\n#ipapp h1,#ipapp h2,#ipapp h3,#ipapp h4,#ipapp p,#ipapp ul,#ipapp ol{color:inherit}\n#ipapp table{margin:0;border:0;width:100%} #ipapp td,#ipapp th{line-height:1.35}\n#ipapp select,#ipapp button,#ipapp input{line-height:normal;height:auto;box-shadow:none}\n#ipapp{--blue:#1F5CFF;--lime:#B6F03A;--navy:#0F2042;--canvas:#F8FAFC;--surface:#FFFFFF;--up:#15803D;--down:#DC2626;--downText:#B91C1C;--sec:#475569;--muted:#64748B;--border:#E2E8F0;--upBg:#DCFCE7;--downBg:#FEE2E2;--blueBg:#DCE6FF;--soft:#F1F5FF}\n#ipapp, #ipapp *{box-sizing:border-box}\n#ipapp{margin:0;font-family:Manrope,system-ui,sans-serif;background:var(--canvas);color:var(--navy);font-size:15px;line-height:1.45}\n#ipapp a{color:var(--blue);text-decoration:none}\n#ipapp button{font:inherit}\n#ipapp header{background:var(--navy);color:#fff;position:relative;border-radius:16px}\n#ipapp .bar{max-width:1280px;margin:0 auto;padding:14px 28px;display:flex;align-items:center;gap:32px;flex-wrap:wrap}\n#ipapp .logo{font-weight:800;font-size:21px;display:flex;align-items:center;gap:10px;color:#fff}\n#ipapp .logo i{font-style:normal;width:32px;height:32px;border-radius:9px;background:var(--blue);display:grid;place-items:center;font-size:14px}\n#ipapp .logo b{color:var(--lime);margin-left:-4px}\n#ipapp nav{display:flex;gap:24px;font-weight:600;font-size:15px}\n#ipapp nav a{color:#AFC0E4;padding-bottom:4px;border-bottom:2px solid transparent}\n#ipapp nav a.on{color:#fff;border-bottom-color:var(--lime)}\n#ipapp .status{margin-left:auto;font-size:12px;color:#AFC0E4}\n#ipapp main{max-width:1280px;margin:0 auto;padding:28px 28px 40px}\n#ipapp h1{font-size:34px;margin:0 0 4px;letter-spacing:-.6px}\n#ipapp h2{font-size:21px;margin:34px 0 14px;letter-spacing:-.2px}\n#ipapp .sub{color:var(--sec);margin:0 0 22px;font-size:16px}\n#ipapp .crumbs{font-size:13px;color:var(--muted);margin-bottom:8px}\n#ipapp .card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px 22px}\n#ipapp .note{font-size:12px;color:var(--muted);margin-top:10px}\n#ipapp .warn{background:#FFF7ED;border:1px solid #FED7AA;color:#9A3412;border-radius:12px;padding:10px 14px;font-size:13px;margin-top:12px}\n#ipapp .badge{display:inline-block;white-space:nowrap;font-weight:700;font-size:13px;border-radius:999px;padding:3px 10px}\n#ipapp .badge.up{background:var(--upBg);color:var(--up)}\n#ipapp .badge.down{background:var(--downBg);color:var(--downText)}\n#ipapp .badge.na{background:#F1F5F9;color:var(--muted)}\n#ipapp .btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:var(--surface);color:var(--navy);font-weight:700;border-radius:12px;padding:10px 16px;cursor:pointer}\n#ipapp .btn:hover{border-color:var(--blue)}\n#ipapp .btn.primary{background:var(--blue);border-color:var(--blue);color:#fff}\n#ipapp .btn.lime{background:var(--lime);border-color:var(--lime);color:var(--navy)}\n#ipapp .seg{display:inline-flex;background:#EEF2F7;border-radius:12px;padding:4px;gap:4px}\n#ipapp .seg button{border:0;background:transparent;padding:9px 16px;border-radius:9px;font-weight:700;color:var(--sec);cursor:pointer}\n#ipapp .seg button.on{background:var(--surface);color:var(--navy);box-shadow:0 1px 3px rgba(15,32,66,.12)}\n#ipapp .toggle{display:inline-flex;background:#EEF2F7;border-radius:10px;padding:3px;gap:2px}\n#ipapp .toggle button{font-size:13px;font-weight:600;border:0;background:transparent;padding:6px 12px;border-radius:8px;color:var(--sec);cursor:pointer}\n#ipapp .toggle button.on{background:var(--surface);color:var(--navy);box-shadow:0 1px 3px rgba(15,32,66,.12)}\n#ipapp .strip{margin-top:26px;background:var(--lime);border-radius:12px;padding:11px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:15px;font-weight:700;color:var(--navy);flex-wrap:wrap}\n#ipapp .strip a{color:var(--navy);font-weight:800}\n#ipapp footer{font-size:12px;color:var(--muted);text-align:center;padding:10px 20px 30px}\n#ipapp /* ---- тест ---- */\n.test-cta{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;background:var(--blue);color:#fff;border:0}\n#ipapp .test-cta h3{margin:0;font-size:20px}\n#ipapp .test-cta p{margin:4px 0 0;color:#DCE6FF}\n#ipapp .test-cta .btn{background:#fff;border-color:#fff;color:var(--navy)}\n#ipapp .test{margin-top:14px}\n#ipapp .test .head{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:12px}\n#ipapp .prog{height:8px;border-radius:99px;background:#EEF2F7;overflow:hidden;flex:1;min-width:200px}\n#ipapp .prog i{display:block;height:100%;background:var(--blue);width:0;transition:width .2s}\n#ipapp .qgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n@media(max-width:900px){#ipapp .qgrid{grid-template-columns:1fr}\n}\n#ipapp .q{border:1px solid var(--border);border-radius:14px;padding:14px}\n#ipapp .q.miss{border-color:#FCA5A5;background:#FFFBFB}\n#ipapp .q h4{margin:0 0 2px;font-size:15px}\n#ipapp .q .meta{font-size:12px;color:var(--muted);margin-bottom:10px}\n#ipapp .opt{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--border);border-radius:10px;padding:9px 11px;margin-top:7px;cursor:pointer;font-size:14px}\n#ipapp .opt:hover{border-color:var(--blue)}\n#ipapp .opt input{margin-top:3px;accent-color:var(--blue)}\n#ipapp .opt.sel{border-color:var(--blue);background:var(--soft)}\n#ipapp .opt b{color:var(--blue)}\n#ipapp .res{margin-top:16px;display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start}\n@media(max-width:900px){#ipapp .res{grid-template-columns:1fr}\n}\n#ipapp .recs{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n@media(max-width:700px){#ipapp .recs{grid-template-columns:1fr}\n}\n#ipapp .recs .card{padding:14px 16px}\n#ipapp .recs h4{margin:0 0 6px;font-size:14px}\n#ipapp .recs ul{margin:0;padding-left:18px;font-size:14px}\n#ipapp .recs li{margin:4px 0}\n#ipapp /* ---- часы ---- */\n.clockgrid{display:grid;grid-template-columns:700px 1fr;gap:22px;margin-top:22px}\n@media(max-width:1180px){#ipapp .clockgrid{grid-template-columns:1fr}\n}\n#ipapp .clockcard{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 18px}\n#ipapp .corner{position:absolute;font-size:14px;font-weight:800;color:var(--blue);line-height:1.25}\n#ipapp .tl{top:20px;left:22px}\n#ipapp .tr{top:20px;right:22px;text-align:right}\n#ipapp .bl{bottom:20px;left:22px}\n#ipapp .br{bottom:20px;right:22px;text-align:right}\n#ipapp .legend{display:flex;gap:16px;font-size:13px;color:var(--sec);justify-content:center;margin-bottom:6px}\n#ipapp .dot{width:12px;height:12px;border-radius:4px;display:inline-block;vertical-align:-1px;margin-right:6px}\n#ipapp .col{display:flex;flex-direction:column;gap:14px}\n#ipapp .now{background:var(--navy);color:#fff;border:0}\n#ipapp .now .k{font-size:13px;color:#AFC0E4;font-weight:600;display:flex;justify-content:space-between;gap:8px}\n#ipapp .now .t{font-size:36px;font-weight:800;margin:6px 0 0}\n#ipapp .now .p{font-size:18px;font-weight:700;color:#C9D7FF}\n#ipapp .now .upd{display:inline-block;margin-top:10px;background:#16295A;border-radius:999px;padding:4px 12px;font-size:12px;color:#C9D7FF}\n#ipapp .now ul{margin:12px 0 0;padding:12px 14px 12px 30px;background:#16295A;border-radius:12px;font-size:14px}\n#ipapp .now li{margin:3px 0}\n#ipapp .ex{background:#FFF7ED;color:#9A3412;border-radius:999px;padding:2px 10px;font-size:12px}\n#ipapp .ph h3{margin:0 0 4px;font-size:17px;display:flex;align-items:center;gap:6px}\n#ipapp .ph p{margin:0 0 12px;color:var(--sec);font-size:14px}\n#ipapp .chips{display:flex;flex-wrap:wrap;gap:8px}\n#ipapp .chip{font-size:14px;font-weight:700;border-radius:10px;padding:7px 12px;white-space:nowrap}\n#ipapp .chip.g{background:var(--upBg);color:var(--up)}\n#ipapp .chip.r{background:var(--downBg);color:var(--downText)}\n#ipapp .chip.b{background:var(--blueBg);color:var(--blue)}\n#ipapp .chip.off{opacity:.65}\n#ipapp details.how{margin-top:4px}\n#ipapp details.how summary{cursor:pointer;font-weight:700;color:var(--blue);font-size:14px}\n#ipapp details.how ol{margin:10px 0 0;padding-left:20px;font-size:14px;color:var(--sec)}\n#ipapp details.how li{margin:5px 0}\n#ipapp details.how li b{color:var(--navy)}\n#ipapp /* ---- таблицы ---- */\n.tbl{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:auto}\n#ipapp table{border-collapse:collapse;width:100%;font-size:13.5px;font-variant-numeric:tabular-nums}\n#ipapp th,#ipapp td{padding:9px 12px;text-align:right;white-space:nowrap;border-bottom:1px solid var(--border)}\n#ipapp th{font-weight:700;color:var(--sec);background:#F8FAFC;position:sticky;top:0}\n#ipapp td:first-child,#ipapp th:first-child{text-align:left;position:sticky;left:0;background:var(--surface);z-index:1}\n#ipapp th:first-child{background:#F8FAFC;z-index:2}\n#ipapp .fin td:first-child{min-width:260px;white-space:normal}\n#ipapp .wrapth th{white-space:normal;vertical-align:bottom;min-width:84px}\n#ipapp tr.grp td{background:var(--soft);font-weight:800;color:var(--navy);text-align:left}\n#ipapp tr.sub td:first-child{color:var(--muted);padding-left:26px}\n#ipapp td.ltm,#ipapp th.ltm{background:#F5F8FF}\n#ipapp td.neg{color:var(--downText)}\n#ipapp td.avg,#ipapp th.avg{background:#FBFCE9}\n#ipapp td.lo{background:#DCFCE7 !important;color:#14532D}\n#ipapp td.hi{background:#FEE2E2 !important;color:#7F1D1D}\n#ipapp td.nm{color:var(--muted)}\n#ipapp tr.off td{color:#94A3B8}\n#ipapp tr.off td:first-child{color:#94A3B8}\n#ipapp tr.link{cursor:pointer}\n#ipapp tr.link:hover td{background:var(--soft)}\n#ipapp tr.total td{font-weight:800;background:#FBFCE9}\n#ipapp .soon{font-size:11px;font-weight:700;color:var(--muted);background:#F1F5F9;border-radius:6px;padding:2px 7px;margin-left:8px}\n#ipapp .go{font-size:11px;font-weight:700;color:var(--blue);background:#EAF0FF;border-radius:6px;padding:2px 7px;margin-left:8px}\n#ipapp .light{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px}\n#ipapp .l-g{background:#22C55E}\n#ipapp .l-r{background:#EF4444}\n#ipapp .l-y{background:#F59E0B}\n#ipapp .l-s{background:#CBD5E1}\n#ipapp td.c-g{background:#F0FDF4}\n#ipapp td.c-r{background:#FEF2F2}\n#ipapp td.c-y{background:#FFFBEB}\n#ipapp .rcard{margin-top:6px}\n#ipapp .rcard .top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}\n#ipapp .rcard .top b{font-size:20px}\n#ipapp .rcard .vd{color:var(--sec);font-size:14px;flex-basis:100%}\n#ipapp .mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}\n#ipapp .m{border-radius:12px;padding:12px 14px;border:1px solid var(--border)}\n#ipapp .m span{display:block;font-size:12px;color:var(--muted)}\n#ipapp .m b{font-size:20px;font-weight:800}\n#ipapp .m p{margin:4px 0 0;font-size:13px;color:var(--sec)}\n#ipapp .m.g{background:#F0FDF4;border-color:#BBF7D0}\n#ipapp .m.r{background:#FEF2F2;border-color:#FECACA}\n#ipapp .m.y{background:#FFFBEB;border-color:#FDE68A}\n#ipapp .verdict{white-space:normal;min-width:280px;max-width:420px;text-align:left;color:var(--sec);font-size:13px}\n#ipapp /* ---- банки / компании ---- */\n.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;margin-top:16px}\n#ipapp .tile{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px}\n#ipapp .tile span{display:block;font-size:12px;color:var(--muted);margin-bottom:4px}\n#ipapp .tile b{font-size:21px;font-weight:800}\n#ipapp .tile.hl{background:var(--blue);border-color:var(--blue);color:#fff}\n#ipapp .tile.hl span{color:#C9D7FF}\n#ipapp .tile.hl a{display:block;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.25);font-size:13px;font-weight:700;color:#fff}\n#ipapp .bankbtns{display:flex;flex-wrap:wrap;gap:10px}\n#ipapp .bankbtns .btn{padding:11px 18px}\n#ipapp .bankbtns .btn small{font-size:11px;color:var(--muted);font-weight:700}\n#ipapp .sec-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:34px 0 14px}\n#ipapp .sec-head h2{margin:0}\n#ipapp .charts{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}\n@media(max-width:900px){#ipapp .charts{grid-template-columns:1fr}\n}\n#ipapp .csel{width:100%;margin-bottom:12px;font-weight:700;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--soft);color:var(--navy)}\n#ipapp .chart-wrap{position:relative;height:270px}\n#ipapp .fc{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}\n@media(max-width:900px){#ipapp .fc{grid-template-columns:1fr}\n}\n#ipapp .fc td:first-child{white-space:normal;min-width:0}\n#ipapp .fc th{white-space:normal}\n#ipapp .fc td,#ipapp .fc th{padding:8px 10px}\n#ipapp .fc h3{margin:0 0 4px;font-size:16px}\n#ipapp .fc .hint{font-size:12px;color:var(--muted);margin:0 0 12px}\n#ipapp .final{margin-top:16px;display:flex;gap:16px;flex-wrap:wrap}\n#ipapp .final .big{flex:1;min-width:240px;background:var(--navy);color:#fff;border-radius:16px;padding:18px 20px}\n#ipapp .final .big .lbl{font-size:12px;color:#AFC0E4;display:block}\n#ipapp .final .big b{font-size:28px;font-weight:800;margin-right:8px}\n#ipapp .clubbar{margin-top:16px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}\n#ipapp .clubbar .btn{padding:12px 18px}\n#ipapp .legend2{display:flex;gap:16px;font-size:12px;color:var(--sec);margin-top:8px;flex-wrap:wrap}\n#ipapp .legend2 i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:6px}\n#ipapp .compact{width:fit-content;max-width:100%}\n#ipapp .compact table{width:auto}\n#ipapp .compact th,#ipapp .compact td{padding:7px 12px}\n#ipapp .compact td:first-child,#ipapp .compact th:first-child{white-space:normal;width:190px;min-width:150px;max-width:190px}\n#ipapp .cm{white-space:normal;text-align:left;color:var(--muted);font-size:12px;min-width:220px;max-width:360px}\n#ipapp .dv{display:block;font-size:10px;font-weight:800;color:var(--up)}\n#ipapp select.inl{font:inherit;font-weight:700;padding:8px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--navy)}\n\n\n#ipapp, #ipapp *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\n#ipapp img,#ipapp svg,#ipapp canvas{-webkit-user-drag:none;pointer-events:auto}\n#ipapp select,#ipapp input{-webkit-user-select:auto;user-select:auto}\n@media print{#ipapp{display:none !important}}\n"; head.appendChild(st);
  root.innerHTML="<header><div class=\"bar\">\n  <a class=\"logo\" href=\"#home\"><i>IP</i>Инвест Привет<b>+</b></a>\n  <nav id=\"ipa-nav\"><a href=\"#home\" data-n=\"home\">Инвест-часы</a><a href=\"#sectors\" data-n=\"sectors\">Отрасли</a><a href=\"#club\" data-n=\"club\">Клуб</a></nav>\n  <div class=\"status\" id=\"ipa-status\"></div>\n</div></header>\n<main id=\"ipa-app\"></main>\n<footer>Данные: Google-таблицы Инвест Привет+ и Банк России (РСБУ). Не является индивидуальной инвестиционной рекомендацией.</footer>";
  // защита от копирования и сохранения (сдерживающая: скриншот и инструменты разработчика не блокируются)
  ["contextmenu","copy","cut","dragstart","selectstart"].forEach(function(ev){
    root.addEventListener(ev,function(e){ var t=e.target; if(t&&(t.tagName==="SELECT"||t.tagName==="INPUT")) return; e.preventDefault(); });
  });
  document.addEventListener("keydown",function(e){
    var k=(e.key||"").toLowerCase(), mod=e.ctrlKey||e.metaKey;
    if(mod&&(k==="s"||k==="p"||k==="u"||(k==="c"&&root.contains(document.activeElement)))){ e.preventDefault(); }
  },true);
  function start(){

(function(){

/* ================= НАСТРОЙКИ ================= */
const DATA_URL = "https://raw.githubusercontent.com/zaletovaea-ui/ip-banks/main/docs/data/";                       // где лежат JSON (GitHub Pages)
const COURSE_URL = "https://investprivet.online/oa";
const CLUB_URL = "";                            // ссылка на клуб (пока пусто)
// Кнопки банков (порядок — как во вкладке «риск»). sheet — лист в таблице «Банковский сектор», rsbu — имя в РСБУ.
const BANKS = [
  {short:"Сбер",       sheet:"Сбербанк",             id:"sber",  ticker:"SBER",  rsbu:"Сбербанк",            review:""},
  {short:"Т-банк",     sheet:"Т-Банк",               id:"tbank", ticker:"T",     rsbu:"Т-Банк",              review:""},
  {short:"Дом рф",     sheet:"Дом РФ",               id:"domrf", ticker:"DOMRF", rsbu:"Банк ДОМ.РФ",         review:""},
  {short:"Совкомбанк", sheet:"Совкомбанк",           id:"svcb",  ticker:"SVCB",  rsbu:"Совкомбанк",          review:""},
  {short:"МТС банк",   sheet:"МТС Банк",             id:"mbnk",  ticker:"MBNK",  rsbu:"МТС-Банк",            review:""},
  {short:"БСП",        sheet:"Банк Санкт-Петербург", id:"bspb",  ticker:"BSPB",  rsbu:"Банк Санкт-Петербург",review:""},
  {short:"ВТБ",        sheet:"ВТБ",                  id:"vtb",   ticker:"VTBR",  rsbu:"ВТБ",                 review:""}
];
const EXCLUDE_FROM_AVG = ["МКБ"];
// Фазы на часах: с какого по какой час, отрасли (id из каталога) — согласовать
const PHASES = [
  {id:"peak",     name:"Бум / Пик",      from:9,  to:12, sectors:["metals","oilgas","fertilizers","industry","transport"]},
  {id:"slowdown", name:"Замедление",     from:12, to:15, sectors:["gold","consumer","power","telecom"]},
  {id:"recession",name:"Рецессия",       from:15, to:18, sectors:["pharma","medicine","grids"]},
  {id:"recovery", name:"Восстановление", from:18, to:21, sectors:["banks","finance","developers","it","retail"]}
];
const ANSWER_HOUR = {A:7.5, B:10.5, C:1.5, D:4.5};   // ответ теста → середина фазы на циферблате
/* ============================================ */

const EMBED = /*EMBED*/null;
let D = {catalog:null, sectors:{}, rsbu:null, clock:null, test:null};
const charts=[];

/* ---------- утилиты ---------- */
const nf=d=>new Intl.NumberFormat("ru-RU",{minimumFractionDigits:d,maximumFractionDigits:d});
const isNum=v=>typeof v==="number"&&isFinite(v);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function fmt(v,kind){
  if(!isNum(v)) return (v===""||v==null)?"—":esc(v);
  if(kind==="pct") return nf(1).format(v*100)+"%";
  if(kind==="pp") return nf(1).format(v)+"%";
  const a=Math.abs(v); return nf(a>=1000?0:a>=100?1:2).format(v);
}
const rub=v=>isNum(v)?fmt(v)+" ₽":"—";
const pctBadge=v=>!isNum(v)||v<=-0.999?`<span class="badge na">н/д</span>`:`<span class="badge ${v>=0?"up":"down"}">${v>=0?"+":""}${nf(1).format(v*100)}%</span>`;
const norm=s=>String(s??"").trim().toLowerCase().replace(/р/g,"p").replace(/е/g,"e").replace(/в/g,"b").replace(/\s+/g," ");
const isPctLabel=l=>/темп|рентаб|\/ ?прибыль|\/ ?fcf|%|апсайд|^roe|^roa|cost of risk|маржа|npl|ratio|норматив|доля|доходность|cir|покрытие/i.test(l);
function hourLabel(h){ h=((h%12)+12)%12; let H=Math.floor(h), M=Math.round((h-H)*60/15)*15; if(M===60){H+=1;M=0;} if(H===0)H=12; return H+":"+String(M).padStart(2,"0"); }

/* ---------- инвест-часы ---------- */
function phaseOf(h){ const x=((h%12)+12)%12; const hh=x<9? x+12 : x; return PHASES.find(p=>hh>=p.from&&hh<p.to)||PHASES[0]; }
function phaseIdx(p){ return PHASES.indexOf(p); }
function clockFromAnswers(ans){
  let x=0,y=0,n=0;
  ans.forEach(a=>{ if(!ANSWER_HOUR[a]) return; const t=(ANSWER_HOUR[a]/12)*2*Math.PI; x+=Math.sin(t); y+=Math.cos(t); n++; });
  if(!n) return null;
  let t=Math.atan2(x,y); if(t<0) t+=2*Math.PI;
  const hour=t/(2*Math.PI)*12, strength=Math.sqrt(x*x+y*y)/n;
  const score=ans.reduce((s,a)=>s+(D.test.SCORE[a]??0),0);
  const band=score>=23?"recovery":score>=16?"peak":score>=8?"slowdown":"recession";
  return {hour, strength, score, band, phase:phaseOf(hour)};
}
// общие часы: время из теста, либо выставленное вручную в таблице (поле «Время вручную»)
function sharedClock(){
  const ck=D.clock; if(!ck) return null;
  const r=clockFromAnswers(ck.answers||[]);
  if(isNum(ck.hour)){ const p=phaseOf(ck.hour); return Object.assign(r||{}, {hour:ck.hour, phase:p}); }
  return r;
}
function clockSVG(hour, size, opts={}){
  const S=size, cx=S/2, cy=S/2, R=S*0.39;
  const pt=(h,r)=>{const a=(h*30-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]};
  const cur=phaseOf(hour), ci=phaseIdx(cur), next=PHASES[(ci+1)%4], prev=PHASES[(ci+3)%4];
  const st=p=>p===cur?"now":p===next?"next":p===prev?"prev":"far";
  const fill={now:"#DCE6FF",next:"#DCFCE7",prev:"#FEE2E2",far:"#EEF2F7"};
  const tagTxt={now:"сейчас",next:"следующая фаза",prev:"прошлая фаза"};
  const tagCol={now:["#1F5CFF","#fff"],next:["#DCFCE7","#15803D"],prev:["#FEE2E2","#B91C1C"]};
  const sector=(h1,h2,r)=>{const [x1,y1]=pt(h1,r),[x2,y2]=pt(h2,r); return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z`};
  let s=`<svg viewBox="0 0 ${S} ${S}" width="${opts.w||S}" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, Arial, sans-serif">`;
  PHASES.forEach(p=>{ s+=`<path d="${sector(p.from,p.to,R)}" fill="${fill[st(p)]}" stroke="#fff" stroke-width="${S/110}"/>`; });
  s+=`<path d="${sector(cur.from,cur.to,R-2)}" fill="none" stroke="#1F5CFF" stroke-width="3"/>`;
  for(let h=1;h<=12;h++){
    const [x1,y1]=pt(h,R+S*0.012),[x2,y2]=pt(h,R+S*0.03);
    s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0F2042" stroke-width="${h%3?1.5:3}" stroke-linecap="round"/>`;
    const [x,y]=pt(h,R+S*0.065), fs=h%3?S*0.026:S*0.04;
    s+=`<text x="${x}" y="${y+fs*0.36}" text-anchor="middle" font-size="${fs}" font-weight="${h%3?600:800}" fill="#0F2042">${h}</text>`;
  }
  const [hx,hy]=pt(hour,R*0.86);
  s+=`<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#0F2042" stroke-width="${S*0.011}" stroke-linecap="round"/>`;
  if(opts.second!=null){ const [gx,gy]=pt(opts.second,R*0.7); s+=`<line x1="${cx}" y1="${cy}" x2="${gx}" y2="${gy}" stroke="#1F5CFF" stroke-width="${S*0.008}" stroke-dasharray="${S*0.02} ${S*0.012}" stroke-linecap="round"/>`; }
  if(opts.labels!==false){
    PHASES.forEach(p=>{
      const [x,y]=pt((p.from+p.to)/2,R*0.53), list=p.sectors.map(id=>secName(id)), k=st(p);
      const lh=S*0.034, y0=y-(list.length*lh+S*0.045)/2;
      if(tagTxt[k]){ const [bg,fg]=tagCol[k], tw=tagTxt[k].length*S*0.0118+S*0.03;
        s+=`<rect x="${x-tw/2}" y="${y0-S*0.06}" width="${tw}" height="${S*0.034}" rx="${S*0.017}" fill="${bg}"/><text x="${x}" y="${y0-S*0.037}" text-anchor="middle" font-size="${S*0.0185}" font-weight="700" fill="${fg}">${tagTxt[k]}</text>`; }
      s+=`<text x="${x}" y="${y0+S*0.012}" text-anchor="middle" font-size="${S*0.023}" font-weight="800" letter-spacing="1" fill="#0F2042" stroke="#fff" stroke-width="${S*0.006}" paint-order="stroke">${p.name.toUpperCase()}</text>`;
      list.forEach((t,i)=>{ s+=`<text x="${x}" y="${y0+S*0.05+i*lh}" text-anchor="middle" font-size="${S*0.021}" font-weight="500" fill="#475569" stroke="#fff" stroke-width="${S*0.005}" paint-order="stroke">${esc(t)}</text>`; });
    });
  }
  s+=`<circle cx="${cx}" cy="${cy}" r="${S*0.022}" fill="#0F2042"/><circle cx="${cx}" cy="${cy}" r="${S*0.009}" fill="#B6F03A"/></svg>`;
  return s;
}
function secName(id){ const s=(D.catalog?.sectors||[]).find(x=>x.id===id); return s?s.name.replace("Банковский сектор","Банки").replace("Потребительский сектор","Потреб сектор").replace("Сетевые компании","Сетевые"):id; }
function secChip(id,cls){ const s=(D.catalog?.sectors||[]).find(x=>x.id===id); const nm=secName(id);
  return s&&s.active? `<a class="chip ${cls}" href="#${id}">${esc(nm)} →</a>` : `<span class="chip ${cls} off">${esc(nm)}</span>`; }

function renderHome(){
  const T=D.test, ck=D.clock, res=sharedClock();
  const app=document.getElementById("ipa-app");
  let right="";
  if(res){
    const cur=res.phase, ci=phaseIdx(cur), next=PHASES[(ci+1)%4], prev=PHASES[(ci+3)%4], R=T.RECS[cur.id];
    right=`<div class="card now">
        <div class="k"><span>Сейчас на часах Инвест Привет+</span>${ck.example?'<span class="ex">пример</span>':""}</div>
        <div class="t">${hourLabel(res.hour)}</div><div class="p">${esc(R.band)}</div>
        <span class="upd">Последнее обновление: ${esc(ck.date)}</span>
        <ul>${R.stocks.slice(0,2).map(x=>`<li>${esc(x)}</li>`).join("")}${R.bonds.slice(0,1).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        <details class="how" style="margin-top:12px"><summary style="color:#C9D7FF">Как определили — 10 сигналов</summary>
          <ol style="color:#C9D7FF">${T.QUESTIONS.map((q,i)=>{const o=q.options.find(o=>o.key===ck.answers[i]); return `<li><b style="color:#fff">${esc(q.title)}:</b> ${o?esc(o.text):"—"}</li>`}).join("")}</ol></details>
      </div>
      <div class="card ph"><h3><i class="dot" style="background:#86EFAC"></i>Следующая фаза: ${next.name}</h3><p>Присматриваемся заранее — рынок опережает экономику</p><div class="chips">${next.sectors.map(id=>secChip(id,"g")).join("")}</div></div>
      <div class="card ph"><h3><i class="dot" style="background:#1F5CFF"></i>Текущая фаза: ${cur.name}</h3><p>Сектора, которые обычно сильнее рынка сейчас</p><div class="chips">${cur.sectors.map(id=>secChip(id,"b")).join("")}</div></div>
      <div class="card ph"><h3><i class="dot" style="background:#FCA5A5"></i>Прошлая фаза: ${prev.name}</h3><p>Их время прошло — постепенно фиксируем и перекладываемся</p><div class="chips">${prev.sectors.map(id=>secChip(id,"r")).join("")}</div></div>`;
  }
  app.innerHTML=`
    <div class="card test-cta"><div><h3>Определите фазу цикла сами</h3><p>10 вопросов о рынке и экономике — 3 минуты. Увидите своё время на часах и что делать с портфелем.</p></div>
      <button class="btn" id="ipa-openTest">Пройти тест →</button></div>
    <div id="ipa-testBox" class="card test" hidden></div>
    <h1 style="margin-top:30px">Инвестиционные часы</h1>
    <p class="sub">Где сейчас российская экономика в цикле и какие отрасли интересны на следующем шаге</p>
    <div class="clockgrid">
      <div class="card clockcard">
        <div class="corner tl">Портфель<br>в акциях</div><div class="corner tr">Продажа<br>акций</div>
        <div class="corner bl">Покупка<br>акций</div><div class="corner br">Держаться<br>подальше от акций</div>
        ${res?clockSVG(res.hour,640,{w:"100%"}):"<p>Часы ещё не выставлены</p>"}
        <div class="legend"><span><i class="dot" style="background:#DCE6FF;border:2px solid #1F5CFF"></i>сейчас</span><span><i class="dot" style="background:#DCFCE7"></i>следующая</span><span><i class="dot" style="background:#FEE2E2"></i>прошлая</span></div>
      </div>
      <div class="col">${right}</div>
    </div>
    <div class="strip"><span>Как определять фазу цикла и выбирать отрасли — подробнее на курсе «Оценка акций»</span><a href="${COURSE_URL}" target="_blank" rel="noopener">investprivet.online/oa →</a></div>`;
  document.getElementById("ipa-openTest").onclick=()=>{const b=document.getElementById("ipa-testBox"); b.hidden=!b.hidden; if(!b.hidden&&!b.dataset.ready) renderTest(b); b.scrollIntoView({behavior:"smooth",block:"start"});};
}

function renderTest(box){
  const T=D.test, ans=Array(T.QUESTIONS.length).fill(null); box.dataset.ready=1;
  box.innerHTML=`<div class="head"><b>Тест: определите фазу экономики (акции и облигации РФ, горизонт 3–6 месяцев)</b>
      <div class="prog"><i id="ipa-pg"></i></div><span id="ipa-cnt" class="note" style="margin:0">0/10</span></div>
    <div class="qgrid">${T.QUESTIONS.map((q,i)=>`<div class="q" id="ipa-q${i}"><h4>${i+1}. ${esc(q.title)}</h4><div class="meta">${esc(q.meta)}</div>
      ${q.options.map(o=>`<label class="opt"><input type="radio" name="q${i}" value="${o.key}"><span><b>${o.key}</b> — ${esc(o.text)}</span></label>`).join("")}</div>`).join("")}</div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn primary" id="ipa-calc">Определить фазу цикла</button><button class="btn" id="ipa-rst">Сбросить</button></div>
    <div id="ipa-out"></div>`;
  box.onchange=e=>{const m=e.target.name&&e.target.name.match(/^q(\d+)$/); if(!m) return; ans[+m[1]]=e.target.value;
    box.querySelectorAll(`#ipa-q${m[1]} .opt`).forEach(l=>l.classList.toggle("sel",l.querySelector("input").checked));
    document.getElementById(`q${m[1]}`).classList.remove("miss");
    const n=ans.filter(Boolean).length; document.getElementById("ipa-pg").style.width=(n*10)+"%"; document.getElementById("ipa-cnt").textContent=n+"/10";};
  box.querySelector("#ipa-rst").onclick=()=>{box.dataset.ready="";renderTest(box)};
  box.querySelector("#ipa-calc").onclick=()=>{
    const miss=ans.map((a,i)=>a?null:i).filter(x=>x!==null);
    if(miss.length){ miss.forEach(i=>document.getElementById("ipa-q"+i).classList.add("miss")); document.getElementById("ipa-q"+miss[0]).scrollIntoView({behavior:"smooth",block:"center"}); return; }
    const r=clockFromAnswers(ans), R=D.test.RECS[r.phase.id], shared=sharedClock();
    const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join("");
    document.getElementById("ipa-out").innerHTML=`<div class="res">
      <div style="text-align:center">${clockSVG(r.hour,320,{labels:false,w:"100%",second:shared?shared.hour:null})}
        <div class="note" style="margin:0">чёрная стрелка — ваш ответ${shared?", синяя пунктирная — часы Инвест Привет+":""}</div></div>
      <div><div style="font-size:13px;color:var(--muted)">Ваше время на часах</div>
        <div style="font-size:34px;font-weight:800">${hourLabel(r.hour)} · ${esc(R.band)}</div>
        <div class="note" style="margin:2px 0 12px">Баллы по тесту: ${r.score} из 30 · согласованность сигналов: ${r.strength>0.75?"высокая":r.strength>0.45?"средняя":"низкая — сигналы противоречат друг другу"}</div>
        <div class="recs"><div class="card"><h4>Акции (РФ)</h4><ul>${li(R.stocks)}</ul></div><div class="card"><h4>Облигации (РФ)</h4><ul>${li(R.bonds)}</ul></div>
        <div class="card"><h4>Риск-менеджмент (3–6 месяцев)</h4><ul>${li(R.risk)}</ul></div><div class="card"><h4>Что мониторить</h4><ul>${li(R.indicators)}</ul></div></div>
        <p class="note">Учебный тест на основе книги Г. Маркса и циклических индикаторов. Не является индивидуальной инвестиционной рекомендацией.</p></div></div>`;
    document.getElementById("ipa-out").scrollIntoView({behavior:"smooth",block:"start"});
  };
}

/* ---------- разбор листа компании / банка (по подписям строк) ---------- */
function parseCompany(grid){
  const head=grid[0]||[], cols=[];
  for(let c=2;c<head.length;c++){
    const h=head[c]; if(h===""||h==null){ if(cols.length) break; else continue; }
    const label=isNum(h)?String(Math.round(h)):String(h).trim();
    const kind=/^\d{4}$/.test(label)?"year":/^ltm$/i.test(label)?"ltm":(/прогноз|п$|^п\d{4}/i.test(label))?"fc":"q";
    cols.push({c,label,kind});
  }
  const L=r=>String((grid[r]||[])[0]??"").trim();
  let multRow=grid.findIndex(r=>norm(r[0])===norm("мультипликаторы")), fcRow=grid.findIndex(r=>norm(r[0])===norm("мультипликаторный прогноз"));
  if(multRow<0) multRow=grid.length; if(fcRow<0) fcRow=grid.length;
  const blocks=[]; let cur=null;
  for(let r=1;r<multRow;r++){ const l=L(r); if(!l||isNum(grid[r][0])){cur=null;continue}
    if(!cur){cur={rows:[]};blocks.push(cur)}
    cur.rows.push({label:l,pct:isPctLabel(l),sub:/^темп|^юридическ|^физическ|^в том числе|^доля/i.test(l),vals:cols.map(k=>grid[r][k.c])}); }
  const title=b=>{ const s=b.rows.map(r=>r.label.toLowerCase()).join("|");
    if(/выручка/.test(s)) return "Финансовые результаты";
    if(/процентные доходы/.test(s)) return "Доходы и прибыль";
    if(/дивиденд/.test(s)) return "Дивиденды";
    if(/денежный поток|fcf/.test(s)) return "Денежный поток";
    if(/(^|\|)roe|cost of risk|npl|процентная маржа/.test(s)) return "Эффективность и качество кредитов";
    if(/норматив/.test(s)) return "Достаточность капитала";
    if(/капитализ|цена акции/.test(s)) return "Рынок";
    if(/актив|капитал|долг|кредитный портфель|депозит/.test(s)) return "Баланс";
    return "Операционные показатели"; };
  blocks.forEach(b=>b.title=title(b));
  const mult=[];
  for(let r=multRow+1;r<fcRow&&r<grid.length;r++){ const l=L(r); if(!l) break; mult.push({label:l,avg:grid[r][1],vals:cols.map(k=>grid[r][k.c])}); }
  const fc=[]; let final=null;
  for(let r=fcRow+1;r<grid.length;r++){
    const row=grid[r]||[], l=norm(row[0]);
    if(["p/e","ev/ebitda","p/b"].includes(l) && typeof row[1]==="string" && row[1].trim()){
      const blk={method:String(row[0]).trim(),h1:String(row[1]).trim(),h2:String(row[2]??"").trim(),rows:[]};
      for(let k=r+1;k<grid.length&&L(k);k++) blk.rows.push({label:L(k),v1:grid[k][1],v2:grid[k][2]});
      fc.push(blk);
    }
  }
  // итоговая справедливая стоимость: первая строка «апсайд» правее столбца A после блока прогноза
  if(fcRow<grid.length){
    let it=null; for(let r=fcRow;r<grid.length&&!it;r++){ const c=(grid[r]||[]).findIndex(v=>norm(v)===norm("итоговая сс")); if(c>=0) it={r,c}; }
    for(let r=fcRow+1;r<grid.length;r++){
      const row=grid[r]||[], ca=row.findIndex((v,i)=>i>=3&&norm(v)===norm("апсайд"));
      if(ca>=0&&isNum(row[ca+1])){
        const vr=grid[r-1]||[], hr=it?grid[it.r+1]||[]:grid[r-2]||[], hc=it?it.c:ca+1;
        final={labels:[hr[hc],hr[hc+1]].map(x=>String(x??"").trim()),values:[vr[ca+1],vr[ca+2]],upside:[row[ca+1],row[ca+2]]};
        break;
      }
    }
  }
  return {cols,blocks,mult,fc,final};
}
const findRow=(p,re)=>{for(const b of p.blocks) for(const r of b.rows) if(re.test(r.label)) return r; return null;};
const ltmIdx=p=>p.cols.findIndex(c=>c.kind==="ltm");
const ltm=(p,row)=>{const i=ltmIdx(p); return row&&i>=0?row.vals[i]:null;};
const multRow=(p,re)=>p.mult.find(m=>re.test(norm(m.label)));
const multLtm=(p,re)=>{const r=multRow(p,re); return r?ltm(p,r):null;};
function finalUp(f){ if(!f) return null; for(let i=f.values.length-1;i>=0;i--) if(isNum(f.values[i])&&f.values[i]>0) return f.upside[i]; return null; }

function bankSummary(b){
  const g=D.sectors.banks?.sheets?.[b.sheet]; if(!g) return null;
  const p=parseCompany(g);
  const price=ltm(p,findRow(p,/^цена акции/i)), dps=ltm(p,findRow(p,/^дивиденды на акцию/i));
  return {p, price, cap:ltm(p,findRow(p,/^капитализация/i)), pe:multLtm(p,/^p\/e$/), pb:multLtm(p,/^p\/bv?$/),
    roe:ltm(p,findRow(p,/^roe$/i)), roa:ltm(p,findRow(p,/^roa$/i)), npl:ltm(p,findRow(p,/^просроченные/i)),
    dy: isNum(dps)&&isNum(price)&&price>0? dps/price : null, final:p.final, up:finalUp(p.final)};
}

/* ---------- средние по банковскому сектору (вкладка «средние», без МКБ) ---------- */
function bankAverages(){
  const g=D.sectors.banks?.sheets?.["средние"]; if(!g) return null;
  const h=g.findIndex(r=>r.some(v=>norm(v)===norm("Капитализация"))); if(h<0) return null;
  const head=g[h].map(norm), ci=n=>head.findIndex(x=>x===norm(n));
  const rows=[];
  for(let r=h+1;r<g.length;r++){ const nm=String(g[r][0]??"").trim(); if(!nm) break;
    rows.push({name:nm, cap:g[r][ci("Капитализация")], roe:g[r][ci("ROE")], roa:g[r][ci("ROA")], pb:g[r][ci("P/B")], pe:g[r][ci("Р/Е")],
      avgRow:/^среднее/i.test(nm), excluded:EXCLUDE_FROM_AVG.includes(nm), note:String(g[r][6]??"")}); }
  const use=rows.filter(r=>!r.avgRow&&!r.excluded);
  const avg=k=>{const v=use.map(r=>r[k]).filter(isNum); return v.length? v.reduce((a,b)=>a+b,0)/v.length : null;};
  const dys=BANKS.map(b=>bankSummary(b)?.dy).filter(isNum);
  return {rows, n:use.length, pe:avg("pe"), pb:avg("pb"), roe:avg("roe"), roa:avg("roa"), dy:dys.length?dys.reduce((a,b)=>a+b,0)/dys.length:null};
}

/* ---------- страница «Отрасли» ---------- */
function renderSectors(){
  const A=bankAverages();
  const rows=(D.catalog?.sectors||[]).map(s=>{
    const a = s.id==="banks"? A : null, on=s.active;
    const na=`<span title="Для банков не применимо: у банков нет EBITDA и выручки в привычном смысле">н/п</span>`;
    const v=(x,k)=>a? (x===null? na : fmt(x,k)) : "—";
    return `<tr class="${on?"link":"off"}" ${on?`onclick="location.hash='${s.id}'"`:""}>
      <td>${esc(s.name)}${on?'<span class="go">открыть</span>':'<span class="soon">скоро</span>'}</td>
      <td>${a?a.n:"—"}</td><td>${v(a?.pe)}</td><td>${v(a?.pb)}</td><td>${v(a?null:undefined)}</td><td>${v(a?.roe,"pct")}</td>
      <td>${v(a?null:undefined)}</td><td>${v(a?null:undefined)}</td><td>${v(a?.dy,"pct")}</td></tr>`;}).join("");
  document.getElementById("ipa-app").innerHTML=`<div class="crumbs">Отрасли</div><h1>Отрасли</h1>
    <p class="sub">Средние показатели по отраслям российского рынка. Нажмите на активную отрасль, чтобы открыть компании.</p>
    <div class="tbl wrapth"><table><thead><tr><th>Отрасль</th><th>Компаний в среднем</th><th>P/E</th><th>P/B</th><th>Долг/EBITDA</th><th>ROE</th><th>Опер. рентабельность</th><th>Чистая рентабельность</th><th>Средняя див. доходность</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note">Банки: среднее по ${A?A.n:"—"} банкам без МКБ. Дивидендная доходность — дивиденды за 12 мес. на обыкновенную акцию к текущей цене. н/п — не применимо для банков.</p>`;
}

/* ---------- банковский сектор ---------- */
function renderBanks(view, selBank){
  const A=bankAverages(), app=document.getElementById("ipa-app");
  app.innerHTML=`<div class="crumbs"><a href="#sectors">Отрасли</a> / Банковский сектор</div>
    <h1>Банковский сектор</h1><p class="sub">${A?A.n:""} банков в среднем · МКБ в среднем не участвует · суммы в млрд ₽</p>
    <div class="seg" id="ipa-seg"><button data-v="overview" class="${view!=="rsbu"?"on":""}">Обзор сектора</button><button data-v="rsbu" class="${view==="rsbu"?"on":""}">Ежемесячное РСБУ</button></div>
    <div id="ipa-bview"></div>`;
  document.getElementById("ipa-seg").onclick=e=>{const b=e.target.closest("button"); if(b) location.hash=b.dataset.v==="rsbu"?"banks-rsbu":"banks";};
  const box=document.getElementById("ipa-bview");
  if(view==="rsbu") return renderRsbu(box, selBank);
  const btns=BANKS.map(b=>{const s=bankSummary(b); return `<a class="btn" href="#bank-${b.id}">${esc(b.short)} <small>${b.ticker}</small></a>`}).join("");
  box.innerHTML=`
    <div class="tiles">
      <div class="tile"><span>Средний P/E</span><b>${fmt(A?.pe)}</b></div>
      <div class="tile"><span>Средний P/B</span><b>${fmt(A?.pb)}</b></div>
      <div class="tile"><span>Средний ROE</span><b>${fmt(A?.roe,"pct")}</b></div>
      <div class="tile"><span>Средний ROA</span><b>${fmt(A?.roa,"pct")}</b></div>
      <div class="tile"><span>Средняя див. доходность</span><b>${fmt(A?.dy,"pct")}</b></div>
    </div>
    <h2>Банки</h2><div class="bankbtns">${btns}</div>
    <h2>Сравнение банков: маржа, риск, капитал</h2>${riskTable()}
    <h2>Мультипликаторы банков</h2>${multTableBanks(A)}`;
}
function riskTable(){
  const g=D.sectors.banks?.sheets?.["риск"]; if(!g) return "";
  const h=g.findIndex(r=>String(r[1]??"").trim()==="Сбер"); if(h<0) return "";
  const names=g[h].slice(1).map(x=>String(x??"").trim()).filter(Boolean);
  const rows=[]; for(let r=h+1;r<g.length;r++){ const l=String(g[r][0]??"").trim(); if(!l||l.startsWith("@")) break; rows.push(r); }
  const cap=t=>/^[pр]\/[eеbв]$/i.test(t)?t.toUpperCase().replace("Р","P").replace("Е","E").replace("В","B"):t.charAt(0).toUpperCase()+t.slice(1);
  const body=rows.map(r=>{const l=String(g[r][0]).trim(), pct=/маржа|риск|рентаб|норматив|достаточн/i.test(l);
    return `<tr><td>${esc(cap(l))}</td>${names.map((n,i)=>`<td>${fmt(g[r][i+1],pct?"pct":"")}</td>`).join("")}</tr>`}).join("");
  return `<div class="tbl compact"><table><thead><tr><th>Показатель</th>${names.map(n=>`<th>${esc(n)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
}
function multTableBanks(A){
  if(!A) return "";
  const b=A.rows.filter(r=>!r.avgRow).map(r=>`<tr class="${r.excluded?"off":""}"><td>${esc(r.name)}${r.excluded?'<span class="soon">не в среднем</span>':""}</td><td>${fmt(r.cap)}</td><td>${fmt(r.roe,"pct")}</td><td>${fmt(r.roa,"pct")}</td><td>${fmt(r.pb)}</td><td>${fmt(r.pe)}</td></tr>`).join("");
  return `<div class="tbl"><table><thead><tr><th>Банк</th><th>Капитализация, млрд ₽</th><th>ROE</th><th>ROA</th><th>P/B</th><th>P/E</th></tr></thead><tbody>${b}
    <tr class="total"><td>Среднее (без МКБ)</td><td></td><td>${fmt(A.roe,"pct")}</td><td>${fmt(A.roa,"pct")}</td><td>${fmt(A.pb)}</td><td>${fmt(A.pe)}</td></tr></tbody></table></div>`;
}

/* ---------- РСБУ ---------- */
function rsbuCard(r){
  if(!r) return "";
  const n1=v=>isNum(v)?nf(1).format(v):"—", n0=v=>isNum(v)?nf(0).format(v):"—", sg=v=>isNum(v)?(v>0?"+":"")+nf(1).format(v):"—";
  const up=v=>isNum(v)&&v>0;
  const items=[
    ["Прибыль с начала года", n0(r.profit_ytd)+" млрд ₽", r.s_profit,
      isNum(r.profit_ytd_yoy_pct)? `${up(r.profit_ytd_yoy_pct)?"Больше":"Меньше"}, чем год назад (${n0(r.profit_ytd_prev)} млрд ₽): ${sg(r.profit_ytd_yoy_pct)}%` : "Сравнить с прошлым годом нельзя"],
    ["ROE за 12 месяцев", n1(r.roe_ltm)+"%", r.s_roe,
      isNum(r.roe_ltm)? `На каждый рубль капитала банк заработал ${n0(r.roe_ltm)} копеек за год` : ""],
    ["Кредиты", n0(r.loans)+" млрд ₽", r.s_loans,
      isNum(r.loans_yoy_pct)? (r.s_loans==="жёлтый"? `Выросли на ${n1(r.loans_yoy_pct)}% за год — очень быстро, важно следить за качеством` : up(r.loans_yoy_pct)? `Основной бизнес растёт: +${n1(r.loans_yoy_pct)}% за год` : `Кредитный портфель сократился на ${n1(Math.abs(r.loans_yoy_pct))}% за год`) : ""],
    ["Доля просрочки", n1(r.overdue_pct)+"%", r.s_overdue,
      isNum(r.overdue_pct_chg_pp)? (r.overdue_pct_chg_pp>0? `Выросла с ${n1(r.overdue_pct_prev)}% до ${n1(r.overdue_pct)}% — заёмщики стали хуже платить` : `Снизилась с ${n1(r.overdue_pct_prev)}% до ${n1(r.overdue_pct)}% — заёмщики платят лучше`) : ""],
    ["Резервы к просрочке", n0(r.reserve_cover)+"%", r.s_cover,
      isNum(r.reserve_cover)? (r.reserve_cover>=100? "Плохие долги уже покрыты резервами с запасом" : "Резервов меньше, чем просрочки — возможны новые расходы") : ""],
    ["Вклады населения", n0(r.dep_retail)+" млрд ₽", r.s_deposits,
      isNum(r.dep_retail_yoy_pct)? (up(r.dep_retail_yoy_pct)? `Выросли на ${n1(r.dep_retail_yoy_pct)}% за год — люди доверяют банку` : `Уменьшились на ${n1(Math.abs(r.dep_retail_yoy_pct))}% за год — вклады уходят`) : ""],
    ["Достаточность капитала H1.0", n1(r.h1_0)+"%", r.s_h1,
      isNum(r.h1_0)? (r.h1_0>=12? "Запас капитала комфортный — есть из чего платить дивиденды" : r.h1_0<10? "Запас у самой границы — дивиденды могут урезать" : "Запас капитала умеренный") : ""]
  ];
  return `<div class="card rcard"><div class="top"><span class="light l-${LIGHT[r.light]||"s"}" style="width:16px;height:16px"></span><b>${esc(r.bank)}</b>
      <span class="badge ${r.light==="зелёный"?"up":r.light==="красный"?"down":"na"}">${r.greens} зелёных · ${r.reds} красных</span>
      <div class="vd">${esc(r.verdict)}</div></div>
    <div class="mgrid">${items.map(([t,v,st,txt])=>`<div class="m ${LIGHT[st]||""}"><span>${t}</span><b>${v}</b><p>${esc(txt)}</p></div>`).join("")}</div></div>`;
}
const LIGHT={"зелёный":"g","красный":"r","жёлтый":"y","серый":"s"};
function renderRsbu(box, selBank){
  const R=D.rsbu; if(!R){box.innerHTML="<p>Нет данных РСБУ</p>";return}
  const m=new Date(R.month), mLbl=m.toLocaleDateString("ru-RU",{month:"long",year:"numeric"});
  const c=(v,s,k)=>`<td class="${s?"c-"+(LIGHT[s]||""):""}">${isNum(v)?(k==="sign"?(v>0?"+":"")+nf(0).format(v):k==="pp"?(v>0?"+":"")+nf(2).format(v):fmt(v)):"—"}</td>`;
  const rows=R.summary.map(r=>`<tr class="link" onclick="location.hash='banks-rsbu-${encodeURIComponent(r.bank)}'"><td><span class="light l-${LIGHT[r.light]||"s"}"></span>${esc(r.bank)} ${r.ticker?`<small style="color:var(--muted)">${esc(r.ticker)}</small>`:""}</td>
    <td class="verdict">${esc(r.verdict)}</td>${c(r.profit_ytd,r.s_profit)}${c(r.profit_ytd_yoy_pct,r.s_profit,"sign")}${c(r.roe_ltm,r.s_roe)}${c(r.loans,r.s_loans)}${c(r.loans_yoy_pct,r.s_loans,"sign")}
    ${c(r.overdue_pct,r.s_overdue)}${c(r.overdue_pct_chg_pp,r.s_overdue,"pp")}${c(r.reserve_cover,r.s_cover)}${c(r.dep_retail,r.s_deposits)}${c(r.dep_retail_yoy_pct,r.s_deposits,"sign")}${c(r.h1_0,r.s_h1)}</tr>`).join("");
  const banks=Object.keys(R.monthly.banks), sel=selBank&&banks.includes(selBank)?selBank:banks[0];
  box.innerHTML=`<h2>Здоровье банков по отчётности ЦБ · ${mLbl}</h2>
    <p class="note" style="margin-top:-6px">РСБУ самого банка, без дочерних компаний — цифры отличаются от МСФО группы. Сравнение с тем же месяцем прошлого года. Зелёный — хорошо для акционера, красный — плохо.</p>
    <div class="tbl"><table><thead><tr><th>Банк</th><th style="text-align:left">Что происходит</th><th>Прибыль с начала года, млрд ₽</th><th>к прошл. году, %</th><th>ROE 12 мес, %</th><th>Кредиты, млрд ₽</th><th>к прошл. году, %</th><th>Просрочка, %</th><th>за год, п.п.</th><th>Резервы к просрочке, %</th><th>Вклады населения, млрд ₽</th><th>к прошл. году, %</th><th>H1.0, %</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="sec-head"><h2>Банк подробно</h2><select class="inl" id="ipa-rsbuSel">${banks.map(b=>`<option${b===sel?" selected":""}>${esc(b)}</option>`).join("")}</select></div>
    <div id="ipa-rsbuMonthly"></div>
    <p class="note">Источник: Банк России, формы 0409101, 0409102, 0409123, 0409135. Обновляется автоматически (GitHub: ip-banks).</p>`;
  const draw=b=>{
    const M=R.monthly, ci=n=>M.cols.indexOf(n);
    const spec=[["month","Месяц"],["profit_m","Прибыль за месяц"],["profit_ytd","Прибыль с начала года"],["profit_ltm","Прибыль за 12 мес"],["roe_ltm","ROE 12 мес, %"],["loans","Кредиты"],["overdue_pct","Просрочка, %"],["reserve_cover","Резервы к просрочке, %"],["dep_retail","Вклады населения"],["ldr","Кредиты/средства клиентов, %"],["h1_0","H1.0, %"],["nii_ytd","Чист. проц. доходы с нач. года"],["pre_prov_ytd","Прибыль до резервов с нач. года"]];
    const body=M.banks[b].map(row=>`<tr>${spec.map(([k],j)=>{const v=row[ci(k)]; if(!j){const d=new Date(v); return `<td>${d.toLocaleDateString("ru-RU",{month:"short",year:"numeric"})}</td>`} return `<td class="${isNum(v)&&v<0?"neg":""}">${isNum(v)?nf(Math.abs(v)>=100?0:1).format(v):"—"}</td>`}).join("")}</tr>`).join("");
    document.getElementById("ipa-rsbuMonthly").innerHTML=rsbuCard(R.summary.find(x=>x.bank===b))+`<h3 style="margin:22px 0 10px">История по месяцам</h3><div class="tbl" style="max-height:560px"><table><thead><tr>${spec.map(([,t])=>`<th>${t}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div><p class="note">Суммы в млрд ₽.</p>`;
  };
  document.getElementById("ipa-rsbuSel").onchange=e=>{history.replaceState(null,"","#banks-rsbu-"+encodeURIComponent(e.target.value)); draw(e.target.value)};
  draw(sel);
}

/* ---------- страница банка ---------- */
function tableHTML(p,mode){
  const cols=p.cols.map((c,i)=>i).filter(i=>mode==="all"||(mode==="year"?p.cols[i].kind!=="q":p.cols[i].kind!=="year"));
  const th=cols.map(i=>`<th class="${p.cols[i].kind==="ltm"?"ltm":""}">${esc(p.cols[i].label)}</th>`).join("");
  const body=p.blocks.map(b=>`<tr class="grp"><td colspan="${cols.length+1}">${b.title}</td></tr>`+b.rows.map(r=>`<tr class="${r.sub?"sub":""}"><td>${esc(r.label)}</td>${cols.map(i=>{const v=r.vals[i];return `<td class="${p.cols[i].kind==="ltm"?"ltm":""} ${isNum(v)&&v<0?"neg":""}">${fmt(v,r.pct?"pct":"")}</td>`}).join("")}</tr>`).join("")).join("");
  return `<div class="tbl fin"><table><thead><tr><th>Показатель</th>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
}
function multHTML(p,mode){
  const cols=p.cols.map((c,i)=>i).filter(i=>mode==="all"||(mode==="year"?p.cols[i].kind!=="q":p.cols[i].kind!=="year"));
  const th=cols.map(i=>`<th class="${p.cols[i].kind==="ltm"?"ltm":""}">${esc(p.cols[i].label)}</th>`).join("");
  const body=p.mult.map(m=>{const debt=/^долг/.test(norm(m.label)), cls=v=>!isNum(v)||!isNum(m.avg)?"":(v<0&&!debt)?"nm":v<m.avg?"lo":v>m.avg?"hi":"";
    return `<tr><td>${esc(m.label)}</td><td class="avg"><b>${fmt(m.avg)}</b></td>${cols.map(i=>`<td class="${p.cols[i].kind==="ltm"?"ltm":""} ${cls(m.vals[i])}">${fmt(m.vals[i])}</td>`).join("")}</tr>`}).join("");
  return `<div class="tbl fin"><table><thead><tr><th>Мультипликатор</th><th class="avg">Среднее</th>${th}</tr></thead><tbody>${body}</tbody></table></div>
    <div class="legend2"><span><i style="background:#DCFCE7"></i>ниже своего среднего — дешевле истории</span><span><i style="background:#FEE2E2"></i>выше среднего — дороже истории</span><span><i style="background:#F1F5F9"></i>серым — отрицательный (убыток), не сравнивается</span></div>`;
}
function fcHTML(p,price){
  if(!p.fc.length) return `<p class="note">На листе нет блока «Мультипликаторный прогноз».</p>`;
  const nm={"p/e":"По P/E (цена / прибыль)","ev/ebitda":"По EV/EBITDA","p/b":"По P/B (цена / капитал)"};
  const cards=p.fc.map(b=>{const cnt={};
    const rows=b.rows.map(r=>{let l=r.label; const m=l.match(/^целевая цена\s*(\d)?\s*(\(.+\))?/i);
      if(m){const suf=m[2]||""; cnt[suf]=(cnt[suf]||0)+1; l=`Целевая цена ${suf} · ${cnt[suf]===1?"по среднему мультипликатору компании":"по среднеотраслевому мультипликатору"}`;}
      const up=/^апсайд/i.test(r.label), tp=/^целевая цена/i.test(r.label);
      const cell=v=>up?pctBadge(v):tp?(isNum(v)&&v>0?`<b>${rub(v)}</b>`:`<span class="badge na">н/д</span>`):fmt(v);
      return `<tr><td>${esc(l)}</td><td>${cell(r.v1)}</td><td>${cell(r.v2)}</td></tr>`}).join("");
    return `<div class="card"><h3>${nm[norm(b.method)]||esc(b.method)}</h3><p class="hint">Сценарии: «${esc(b.h1)}» и «${esc(b.h2)}»</p><div class="tbl" style="border:0"><table><thead><tr><th></th><th>${esc(b.h1)}</th><th>${esc(b.h2)}</th></tr></thead><tbody>${rows}</tbody></table></div></div>`}).join("");
  const f=p.final;
  const fin=f?`<div class="final">${f.labels.map((l,i)=>`<div class="big"><span class="lbl">Итоговая справедливая стоимость · ${esc(l)}</span><b>${isNum(f.values[i])&&f.values[i]>0?rub(f.values[i]):"н/д"}</b>${pctBadge(f.upside[i])}</div>`).join("")}<div class="tile"><span>Текущая цена</span><b>${rub(price)}</b></div></div>`:"";
  return `<div class="fc">${cards}</div>${fin}`;
}
const BANK_CHARTS=[
  {id:"inc",t:"Чистые процентные и комиссионные доходы, прибыль, млрд ₽"},
  {id:"bal",t:"Кредитный портфель и депозиты, млрд ₽"},
  {id:"roe",t:"ROE и ROA"},
  {id:"qual",t:"Качество: просрочка (NPL) и стоимость риска"},
  {id:"nim",t:"Чистая процентная маржа"},
  {id:"mult",t:"P/E и P/BV"}];
const PAL=["#1F5CFF","#0F2042","#94A3B8","#15803D"];
function bankChart(p,kind){
  const yi=p.cols.map((c,i)=>i).filter(i=>p.cols[i].kind==="year"||p.cols[i].kind==="ltm"), labels=yi.map(i=>p.cols[i].label);
  const pick=r=>yi.map(i=>r&&isNum(r.vals[i])?r.vals[i]:null), ser=re=>pick(findRow(p,re));
  const mser=re=>{const r=multRow(p,re); return yi.map(i=>r&&isNum(r.vals[i])&&Math.abs(r.vals[i])<60?r.vals[i]:null)};
  const grid={color:"#E2E8F0"}, legend={position:"bottom",labels:{boxWidth:12}}, pctT={callback:v=>nf(1).format(v*100)+"%"};
  const bar=(l,d,i)=>({label:l,data:d,backgroundColor:PAL[i],borderRadius:4}), line=(l,d,i)=>({label:l,data:d,borderColor:PAL[i],backgroundColor:PAL[i],tension:.3,spanGaps:true,pointRadius:3});
  const base=(type,ds,pct)=>({type,data:{labels,datasets:ds},options:{maintainAspectRatio:false,plugins:{legend,tooltip:pct?{callbacks:{label:c=>c.dataset.label+": "+fmt(c.parsed.y,"pct")}}:{}},scales:{x:{grid:{display:false}},y:{grid,ticks:pct?pctT:{}}}}});
  if(kind==="inc") return base("bar",[bar("Чистые процентные доходы",ser(/^чистые процентные доходы/i),0),bar("Чистые комиссионные доходы",ser(/^чистые комиссионные/i),1),bar("Прибыль",ser(/^(чистая )?прибыль/i),2)]);
  if(kind==="bal") return base("bar",[bar("Кредитный портфель",ser(/^кредитный портфель/i),0),bar("Депозиты",ser(/^депозиты/i),1)]);
  if(kind==="roe") return base("line",[line("ROE",ser(/^roe$/i),0),line("ROA",ser(/^roa$/i),1)],true);
  if(kind==="qual") return base("line",[line("Просрочка (NPL)",ser(/^просроченные/i),0),line("Стоимость риска",ser(/^cost of risk/i),1)],true);
  if(kind==="nim") return base("line",[line("Чистая процентная маржа",ser(/процентная маржа/i),0)],true);
  return base("line",[line("P/E",mser(/^p\/e$/),0),line("P/BV",mser(/^p\/bv?$/),1)]);
}
function renderBank(b){
  const s=bankSummary(b), app=document.getElementById("ipa-app");
  if(!s){app.innerHTML=`<p>Лист «${esc(b.sheet)}» не найден.</p>`;return}
  const p=s.p, club=b.review||CLUB_URL||"#"; let mode="year";
  app.innerHTML=`<div class="crumbs"><a href="#sectors">Отрасли</a> / <a href="#banks">Банковский сектор</a> / ${esc(b.sheet)}</div>
    <h1>${esc(b.sheet)} <span class="go" style="font-size:14px;vertical-align:middle">${b.ticker}</span></h1>
    <p class="sub">МСФО · суммы в млрд ₽ · LTM — последние 12 месяцев · <a href="#banks-rsbu-${encodeURIComponent(b.rsbu)}">ежемесячное РСБУ →</a></p>
    <div class="bankbtns" style="margin-bottom:6px">${BANKS.map(x=>`<a class="btn" style="${x===b?"border-color:#1F5CFF;background:#F1F5FF":""}" href="#bank-${x.id}">${esc(x.short)}</a>`).join("")}</div>
    <div class="tiles">
      <div class="tile"><span>Цена акции (ао)</span><b>${rub(s.price)}</b></div>
      <div class="tile"><span>Капитализация, млрд</span><b>${fmt(s.cap)}</b></div>
      <div class="tile"><span>P/E LTM</span><b>${fmt(s.pe)}</b></div>
      <div class="tile"><span>P/BV LTM</span><b>${fmt(s.pb)}</b></div>
      <div class="tile"><span>ROE LTM</span><b>${fmt(s.roe,"pct")}</b></div>
      <div class="tile"><span>Див. доходность 12 мес</span><b>${fmt(s.dy,"pct")}</b></div>
      <div class="tile hl"><span>Апсайд к справедливой</span><b>${isNum(s.up)&&s.up>-0.999?(s.up>=0?"+":"")+nf(1).format(s.up*100)+"%":"н/д"}</b><a href="${club}" target="_blank" rel="noopener">Обзор в Клубе →</a></div>
    </div>
    <div class="card clubbar"><div><b style="font-size:16px">Разбор ${esc(b.sheet)} в клубе Инвест Привет+</b><div class="note" style="margin:4px 0 0">Почему такая справедливая стоимость, риски и что делать с акцией.</div></div><a class="btn lime" href="${club}" target="_blank" rel="noopener">Обзор в Клубе →</a></div>
    <h2>Динамика</h2>
    <div class="charts">${[0,1].map(k=>`<div class="card"><select class="csel" id="ipa-sel${k}">${BANK_CHARTS.map(c=>`<option value="${c.id}"${c.id===(k?"roe":"inc")?" selected":""}>${c.t}</option>`).join("")}</select><div class="chart-wrap"><canvas id="ipa-c${k}"></canvas></div></div>`).join("")}</div>
    <div class="sec-head"><h2>Финансовые показатели</h2><div class="toggle" id="ipa-tg"><button data-m="year" class="on">Годы</button><button data-m="q">Кварталы</button><button data-m="all">Все</button></div></div>
    <div id="ipa-fin"></div><h2>Мультипликаторы</h2><div id="ipa-mult"></div>
    <h2>Мультипликаторный прогноз</h2>${fcHTML(p,s.price)}`;
  const draw=()=>{document.getElementById("ipa-fin").innerHTML=tableHTML(p,mode);document.getElementById("ipa-mult").innerHTML=multHTML(p,mode)}; draw();
  document.getElementById("ipa-tg").onclick=e=>{const x=e.target.closest("button"); if(!x) return; mode=x.dataset.m; [...e.currentTarget.children].forEach(y=>y.classList.toggle("on",y===x)); draw();};
  if(window.Chart){ Chart.defaults.font.family="Manrope"; Chart.defaults.color="#475569";
    [0,1].forEach(k=>{const sel=document.getElementById("ipa-sel"+k); let ch=null; const go=()=>{if(ch){ch.destroy();charts.splice(charts.indexOf(ch),1)} ch=new Chart(document.getElementById("ipa-c"+k),bankChart(p,sel.value)); charts.push(ch)}; sel.onchange=go; go();}); }
}

/* ---------- роутинг ---------- */
function route(){
  charts.splice(0).forEach(c=>c.destroy());
  const h=decodeURIComponent(location.hash.replace("#",""))||"home";
  document.querySelectorAll("#ipa-nav a").forEach(a=>a.classList.toggle("on", a.dataset.n===(h==="home"?"home":h==="club"?"club":"sectors")));
  if(h==="home") renderHome();
  else if(h==="sectors") renderSectors();
  else if(h==="banks") renderBanks("overview");
  else if(h.startsWith("banks-rsbu")) renderBanks("rsbu", h.slice("banks-rsbu-".length)||null);
  else if(h.startsWith("bank-")){ const b=BANKS.find(x=>x.id===h.slice(5)); b?renderBank(b):renderSectors(); }
  else if(h==="club") document.getElementById("ipa-app").innerHTML=`<h1>Клуб Инвест Привет+</h1><p class="sub">Разборы компаний, портфель и обучение.</p>${CLUB_URL?`<a class="btn lime" href="${CLUB_URL}">Перейти в клуб →</a>`:'<p class="note">Ссылка на клуб появится здесь.</p>'}`;
  else renderSectors();
  {const a=document.getElementById("ipapp"); const y=a.getBoundingClientRect().top+window.scrollY-10; if(window.scrollY>y) window.scrollTo(0,y);}
}

async function getJSON(name){
  try{ const r=await fetch(DATA_URL+name+"?v="+Date.now()); if(r.ok) return await r.json(); }catch(e){}
  return null;
}
async function load(){
  if(EMBED){ D=EMBED; }
  else{
    const [catalog,banks,rsbu,clock,test]=await Promise.all([getJSON("catalog.json"),getJSON("sectors/banks.json"),getJSON("rsbu.json"),getJSON("clock.json"),getJSON("test.json")]);
    D={catalog,sectors:{banks},rsbu,clock,test};
  }
  const u=D.catalog?.updated? new Date(D.catalog.updated).toLocaleString("ru-RU",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}) : "";
  document.getElementById("ipa-status").textContent=u? "данные обновлены "+u : "";
  window.addEventListener("hashchange",route); route();
}
load();

})();

  }
  if(window.Chart){ start(); }
  else{ var s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"; s.onload=start; s.onerror=start; head.appendChild(s); }
})();

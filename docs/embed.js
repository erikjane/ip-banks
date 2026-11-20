/* Инвест Привет+ · загрузчик для GetCourse и других сайтов.
   На странице:
   <div id="ipapp"></div>
   <script src="https://cdn.jsdelivr.net/gh/erikjane/ip-banks@main/docs/embed.js"></script>
   Сам сайт (docs/app-embed.js) берётся напрямую с GitHub, поэтому правки видны через ~5 минут. */
(function(){
  var root=document.getElementById("ipapp");
  if(!root){ root=document.createElement("div"); root.id="ipapp"; var cs=document.currentScript; (cs&&cs.parentNode||document.body).insertBefore(root, cs||null); }
  if(root.getAttribute("data-loading")) return; root.setAttribute("data-loading","1");
  root.innerHTML='<div style="padding:40px;text-align:center;font:15px Arial,sans-serif;color:#64748B">Загружаем Инвест-часы…</div>';
  var v=Math.floor(Date.now()/300000); // новая версия не реже раза в 5 минут
  fetch("https://raw.githubusercontent.com/erikjane/ip-banks/main/docs/app-embed.js?v="+v)
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
    .then(function(code){ (new Function(code))(); })
    .catch(function(){ root.innerHTML='<div style="padding:40px;text-align:center;font:15px Arial,sans-serif;color:#B91C1C">Не удалось загрузить. Обновите страницу.</div>'; });
})();

(function(){
  const root = document.documentElement;
  const btnLight = document.getElementById('theme-light');
  const btnSystem = document.getElementById('theme-system');
  const btnDark = document.getElementById('theme-dark');

  function setTheme(mode){
    if(mode==='light'){ root.setAttribute('data-theme','light'); }
    else if(mode==='dark'){ root.setAttribute('data-theme','dark'); }
    else { root.setAttribute('data-theme','system'); }
    try{ localStorage.setItem('theme-pref', mode); }catch{}
  }

  try{
    const saved = localStorage.getItem('theme-pref');
    if(saved) setTheme(saved);
  }catch{}

  btnLight && (btnLight.onclick = ()=>setTheme('light'));
  btnSystem && (btnSystem.onclick = ()=>setTheme('system'));
  btnDark && (btnDark.onclick = ()=>setTheme('dark'));
})();

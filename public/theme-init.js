/* theme: no-flash init */
(function(){var p='system';try{p=localStorage.getItem('theme')||'system'}catch(e){}
var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',d);})();

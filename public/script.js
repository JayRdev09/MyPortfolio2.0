const NAME='Godie Banghal', EMAIL='jrbanghal4222@gmail.com';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const rand=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const isMac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
$$('.modk').forEach(k=>k.textContent=isMac?'Cmd':'Alt');

/* â•â•â• UI SOUNDS â•â•â• */
(function(){
  const interactive='a[href],button:not([disabled]),[role="button"],[tabindex="0"],.chip,.dc,.cert,.rec';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const sounds={
    tick:[{type:'noise',frequency:5400,attack:.001,decay:.018,peak:.14},{type:'tone',frequency:2600,attack:.001,decay:.012,peak:.018}],
    press:[{type:'noise',frequency:1700,attack:.001,decay:.02,peak:.13}],
    release:[{type:'noise',frequency:4600,attack:.001,decay:.016,peak:.12},{type:'tone',frequency:3200,offset:.006,attack:.001,decay:.05,peak:.02}],
    bloom:[{type:'tone',frequency:528,attack:.06,decay:.32,peak:.06},{type:'tone',frequency:531.7,attack:.06,decay:.34,peak:.05}],
    droplet:[{type:'tone',frequency:1200,glideTo:550,glideTime:.14,attack:.004,decay:.2,peak:.075}]
  };
  let audio,enabled=true,lastHoverTime=-Infinity;
  try{enabled=localStorage.getItem('site-sounds-enabled')!=='false'}catch(e){}
  function context(){
    if(audio)return audio;
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)return null;
    try{return audio=new AudioContext()}catch(e){return null}
  }
  function play(name){
    if(!enabled)return;
    const ctx=context(),layers=sounds[name];if(!ctx||!layers)return;
    if(ctx.state==='suspended'){
      ctx.resume().then(()=>play(name)).catch(()=>{});
      return;
    }
    const start=ctx.currentTime,gain=ctx.createGain();gain.gain.value=.14;gain.connect(ctx.destination);
    const finish=[];
    layers.forEach(layer=>{
      const at=start+(layer.offset||0),node=layer.type==='noise'?ctx.createBufferSource():ctx.createOscillator();
      if(layer.type==='noise'){
        const buffer=ctx.createBuffer(1,Math.max(1,Math.floor((layer.attack+layer.decay+.05)*ctx.sampleRate)),ctx.sampleRate),data=buffer.getChannelData(0);
        for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
        node.buffer=buffer;
        const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=layer.frequency;filter.Q.value=1.6;
        node.connect(filter);
        filter.connect(gain);
      }else{node.type='sine';node.frequency.setValueAtTime(layer.frequency,at);node.connect(gain)}
      if(layer.glideTo)node.frequency.exponentialRampToValueAtTime(layer.glideTo,at+(layer.glideTime||.14));
      const envelope=ctx.createGain();envelope.gain.setValueAtTime(.001,at);
      envelope.gain.exponentialRampToValueAtTime(layer.peak,at+layer.attack);
      envelope.gain.exponentialRampToValueAtTime(.001,at+layer.attack+layer.decay);
      node.disconnect();node.connect(envelope);envelope.connect(gain);
      node.start(at);node.stop(at+layer.attack+layer.decay+.05);finish.push(at+layer.attack+layer.decay+.05);
    });
    setTimeout(()=>gain.disconnect(),Math.max(...finish.map(end=>(end-ctx.currentTime)*1000+100),100));
  }
  function configure(root=document){
    const nodes=[];
    if(root instanceof Element&&root.matches(interactive))nodes.push(root);
    root.querySelectorAll&&root.querySelectorAll(interactive).forEach(el=>nodes.push(el));
    nodes.forEach(el=>{
      if(el.closest('[data-sound-silent]')||el.hasAttribute('data-sound-toggle'))return;
      el.dataset.soundHover='tick';
      el.dataset.soundPress='press';
      el.dataset.soundRelease=el.matches('button')?'bloom':'release';
      if((el.getAttribute('aria-label')||'').toLowerCase().startsWith('close'))el.dataset.soundRelease='droplet';
    });
  }
  function syncToggle(){
    document.querySelectorAll('[data-sound-toggle]').forEach(el=>{
      el.setAttribute('aria-pressed',String(enabled));
      el.setAttribute('aria-label',enabled?'Mute interface sounds':'Enable interface sounds');
      el.textContent=enabled?'sound on':'sound off';
    });
  }
  addEventListener('pointerover',e=>{
    if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const el=e.target.closest('[data-sound-hover]');
    if(!el||el.contains(e.relatedTarget)||performance.now()-lastHoverTime<150)return;
    lastHoverTime=performance.now();play(el.dataset.soundHover);
  },{passive:true});
  addEventListener('pointerdown',e=>{
    const ctx=context();if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{});
    const el=e.target.closest('[data-sound-press]');if(el)play(el.dataset.soundPress);
  },true);
  addEventListener('pointerup',e=>{const el=e.target.closest('[data-sound-release]');if(el)play(el.dataset.soundRelease)},true);
  addEventListener('click',e=>{
    const toggle=e.target.closest('[data-sound-toggle]');
    if(!toggle)return;
    enabled=!enabled;try{localStorage.setItem('site-sounds-enabled',String(enabled))}catch(err){}
    syncToggle();if(enabled)play('bloom');
  },true);
  addEventListener('keydown',e=>{
    if(e.repeat)return;
    if(e.key==='Enter'||e.key===' '||e.key==='Escape'||e.key==='Backspace')play('press');
  },true);
  configure();syncToggle();
  new MutationObserver(records=>records.forEach(({addedNodes})=>addedNodes.forEach(node=>{
    if(node.nodeType===Node.ELEMENT_NODE)configure(node);
  }))).observe(document.documentElement,{childList:true,subtree:true});
})();

/* â•â•â• THEME (system / light / dark) with circular reveal â•â•â• */
(function(){
  const root=document.documentElement, mq=matchMedia('(prefers-color-scheme: dark)');
  const pref=()=>{try{const v=localStorage.getItem('theme');return['dark','light','system'].includes(v)?v:'system'}catch(e){return'system'}};
  const isDark=p=>p==='dark'||(p==='system'&&mq.matches);
  const apply=p=>{root.classList.toggle('dark',isDark(p));$$('[data-theme-opt]').forEach(el=>el.classList.toggle('is-active',el.dataset.themeOpt===p))};
  window.setTheme=(p,ev)=>{
    try{localStorage.setItem('theme',p)}catch(e){}
    if(isDark(p)===root.classList.contains('dark')){apply(p);return}
    if(!document.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches){
      root.classList.add('theme-anim');apply(p);setTimeout(()=>root.classList.remove('theme-anim'),520);return}
    const x=(ev&&ev.clientX)||innerWidth,y=(ev&&ev.clientY)||innerHeight,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    document.startViewTransition(()=>apply(p)).ready.then(()=>root.animate(
      {clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},
      {duration:540,easing:'cubic-bezier(.32,.08,.24,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
  };
  mq.addEventListener('change',()=>{if(pref()==='system'){root.classList.add('theme-anim');apply('system');setTimeout(()=>root.classList.remove('theme-anim'),520)}});
  apply(pref());
})();

/* â•â•â• MOBILE NAV â•â•â• */
function openMobileNav(){const m=$('#mnav');m.style.display='flex';document.documentElement.style.overflow='hidden';requestAnimationFrame(()=>m.classList.add('open'))}
function closeMobileNav(){const m=$('#mnav');m.classList.remove('open');document.documentElement.style.overflow='';setTimeout(()=>m.style.display='none',300)}

/* â•â•â• FACE THAT FOLLOWS THE CURSOR â•â•â•
   Mode A (default): SVG portrait â€” smooth eye tracking, 3D tilt, parallax features, blinking.
   Mode B (auto): swap between the directional portrait frames in ./profile-gaze/ by pointer angle. */
(function(){
  const face=$('#face'),photo=$('#photo'),headG=$('#headG'),featG=$('#featG'),brows=$('#brows'),mouth=$('#mouth');
  const pups=$$('.pup'),lids=$$('.lid'),img=$('#gazeImg');
  const BASE='profile-gaze',EXT='.png',DIRS=['right','down-right','down','down-left','left','up-left','up','up-right'];
  let tx=0,ty=0,cx=0,cy=0,ptr=null,photoMode=false,cur='center';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  window.gazeGuide=null; // guide cursor can override pointer
  function set(x,y){ptr={x,y};
    const r=photo.getBoundingClientRect(),dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),R=Math.max(innerWidth,innerHeight)*.45;
    tx=clamp(dx/R,-1,1);ty=clamp(dy/R,-1,1);
    if(photoMode){
      if(Math.hypot(dx,dy)<r.width*.18)return show('center');
      show(DIRS[(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8]);
    }}
  function show(d){
    if(d===cur)return;
    cur=d;
    img.src=`${BASE}/${d}${EXT}?v=1`;
  }
  addEventListener('pointermove',e=>{
    if(e.pointerType!=='touch'&&!window.gazeGuide)set(e.clientX,e.clientY);
  },{passive:true});
  addEventListener('pointerdown',e=>set(e.clientX,e.clientY),{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{tx=ty=0;if(photoMode)show('center')});
  window.gazeLook=(x,y)=>set(x,y);
  (function loop(){
    cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;
    if(!reduce.matches&&!photoMode){
      face.style.transform=`rotateY(${cx*16}deg) rotateX(${-cy*14}deg)`;
      headG.setAttribute('transform',`translate(${cx*5} ${cy*3}) rotate(${cx*3} 100 140)`);
      featG.setAttribute('transform',`translate(${cx*7} ${cy*5})`);
      pups.forEach(p=>p.setAttribute('transform',`translate(${cx*4.6} ${cy*4.6})`));
      brows.setAttribute('transform',`translate(0 ${cy*-2.5})`);
      mouth.setAttribute('d',`M86 130 Q${100+cx*5} ${140-Math.abs(cx)*1.5} 114 ${130+cx*2}`);
    }
    requestAnimationFrame(loop);
  })();
  (function blink(){lids.forEach(l=>l.setAttribute('ry',11));setTimeout(()=>lids.forEach(l=>l.setAttribute('ry',0)),120);setTimeout(blink,2200+Math.random()*3200)})();
  // detect photo set
  const probe=new Image();
  probe.onload=()=>{
    photoMode=true;
    img.hidden=false;
    img.src=`${BASE}/center${EXT}?v=1`;
    face.style.display='none';
    DIRS.forEach(d=>{
      const frame=new Image();
      frame.src=`${BASE}/${d}${EXT}?v=1`;
    });
  };
  probe.onerror=()=>console.error(`Unable to load portrait frame: ${BASE}/center${EXT}`);
  probe.src=`${BASE}/center${EXT}?v=1`;
})();

/* â•â•â• PROJECT DECK â•â•â• */
function activateCard(card){
  if(card.classList.contains('c'))return;
  const deck=card.closest('.deck'),center=deck.querySelector('.dc.c'),slot=card.classList.contains('l')?'l':'r';
  center.classList.remove('c');center.classList.add(slot);card.classList.remove('l','r');card.classList.add('c');
}

/* â•â•â• MODALS â•â•â• */
const modal=$('#modal');
const imageLightbox=$('#imageLightbox'),imageLightboxImage=$('#imageLightboxImage'),imageLightboxCaption=$('#imageLightboxCaption');
function openImageLightbox(image){
  imageLightboxImage.src=image.currentSrc||image.src;
  imageLightboxImage.alt=image.alt;
  imageLightboxCaption.textContent=image.alt;
  imageLightbox.classList.add('open');
  document.documentElement.style.overflow='hidden';
}
function closeImageLightbox(){
  imageLightbox.classList.remove('open');
  imageLightboxImage.removeAttribute('src');
  document.documentElement.style.overflow='';
}
$$('.feature-gallery img').forEach(image=>image.addEventListener('click',e=>{
  e.stopPropagation();
  openImageLightbox(image);
}));
$$('.cert-image').forEach(image=>image.addEventListener('click',e=>{
  e.preventDefault();
  e.stopPropagation();
  openImageLightbox(image);
}));
$$('.cert').forEach(card=>card.addEventListener('click',e=>{
  const image=card.querySelector('.cert-image');
  if(!image)return;
  e.preventDefault();
  openImageLightbox(image);
}));
$$('.achievement-gallery img').forEach(image=>image.addEventListener('click',e=>{
  e.stopPropagation();
  openImageLightbox(image);
}));
$('#imageLightboxClose').addEventListener('click',closeImageLightbox);
imageLightbox.addEventListener('click',e=>{if(e.target===imageLightbox)closeImageLightbox()});
function openModal(name){
  const p=modal.querySelector(`[data-panel="${name}"]`);if(!p)return;
  $$('.panel').forEach(x=>{if(x!==p)x.style.display='none'});
  modal.style.display='flex';p.style.display='block';document.documentElement.style.overflow='hidden';
  requestAnimationFrame(()=>{modal.querySelector('.bd').style.opacity=1;p.style.opacity=1;p.style.transform='none'});
}
function closeModal(){
  modal.querySelector('.bd').style.opacity=0;$$('.panel').forEach(p=>{p.style.opacity=0;p.style.transform='scale(.95)'});
  document.documentElement.style.overflow='';
  setTimeout(()=>{modal.style.display='none';$$('.panel').forEach(p=>p.style.display='none')},200);
}
/* â•â•â• ASK ANYTHING (âŒ˜K / Alt+K) â•â•â• */
const askOv=$('#askOv'),askIn=$('#askIn'),askText=$('#askText'),askTitle=$('#askTitle'),askHead=$('#askHead'),
  askLoader=$('#askLoader'),askBubble=$('#askBubble'),askField=$('#askField'),askCaret=$('#askCaret');
let askSeq=0,askBusy=false;
function askReset(){
  askBusy=false;askIn.removeAttribute('readonly');askIn.value='';askText.textContent='';askCaret.style.display='';askField.style.display='';
  askBubble.className='bubble';askBubble.style.cssText='';askTitle.className='ask-title';askTitle.style.cssText='';askTitle.textContent='what do you want to ask?';
  askHead.className='ask-head';askHead.style.cssText='';askLoader.classList.remove('on');
}
async function askSet(text,pulse){
  askTitle.style.opacity=0;askTitle.style.transform='translateY(6px)';await sleep(250);
  askTitle.textContent=text;askTitle.classList.add('sm');
  askLoader.classList.toggle('on',!!pulse);askHead.classList.toggle('shimmer',!!pulse);
  askTitle.style.opacity=1;askTitle.style.transform='none';if(!pulse)await sleep(300);
}
function browserName(ua){
  if(/Edg\//.test(ua))return'Edge';if(/OPR\//.test(ua))return'Opera';if(/Firefox\//.test(ua))return'Firefox';
  if(/Chrome\//.test(ua))return'Chrome';if(/Safari\//.test(ua))return'Safari';return'your browser'}
function osName(ua){
  if(/Windows/.test(ua))return'Windows';if(/iPhone|iPad|iPod/.test(ua))return'iOS';if(/Mac OS X/.test(ua))return'macOS';
  if(/Android/.test(ua))return'Android';if(/Linux/.test(ua))return'Linux';return'your device'}
async function askSubmit(){
  if(askBusy)return;const q=askIn.value.trim();if(!q)return;
  askBusy=true;const my=askSeq;askIn.setAttribute('readonly','');askCaret.style.display='none';
  askBubble.textContent=q;askBubble.classList.add('on');askField.style.display='none';
  await askSet('thinking...',true);await sleep(1900);if(my!==askSeq)return;
  await askSet('analyzing...',true);await sleep(1500);if(my!==askSeq)return;
  // plot twist â€” ONLY data the browser already exposes locally (no network lookups, nothing sent anywhere)
  askBubble.style.transition=askHead.style.transition='opacity .55s,filter .55s';
  askBubble.style.opacity=askHead.style.opacity=0;askBubble.style.filter=askHead.style.filter='blur(8px)';await sleep(600);if(my!==askSeq)return;
  askBubble.classList.remove('on');askLoader.classList.remove('on');askHead.classList.remove('shimmer');askTitle.textContent='';
  askHead.style.cssText='';askBubble.style.cssText='';await sleep(300);
  const ua=navigator.userAgent,mem=navigator.deviceMemory,conn=navigator.connection&&navigator.connection.effectiveType;
  const msgs=['before i answer','here is what your browser shares with every site you open',
    `you are on a ${osName(ua)} device with ${navigator.hardwareConcurrency||'?'} processor cores${mem?` and ${mem}gb of memory`:''}`,
    `you are browsing with ${browserName(ua)} set to ${navigator.language}`,
    `your screen is ${screen.width} x ${screen.height}`,
    `your timezone is ${Intl.DateTimeFormat().resolvedOptions().timeZone} and it is around ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}).toLowerCase()} there`,
    ...(conn?[`you are on a ${conn} connection`]:[]),
    ...(document.referrer?[`you arrived from ${new URL(document.referrer).hostname}`]:[]),
    'none of this needed your permission','so be mindful of what you click, and who you trust online'];
  for(const m of msgs){await askSet(m,false);if(my!==askSeq)return;await sleep(2300);if(my!==askSeq)return}
  await askSet('as for your question',false);await sleep(2000);if(my!==askSeq)return;
  await askSet("i don't want to waste tokens on that, search for it yourself :)",false);await sleep(2200);if(my!==askSeq)return;
  window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank','noopener');
}
function openAsk(){closeTyping(true);askSeq++;askReset();askOv.classList.add('show');document.documentElement.style.overflow='hidden';
  requestAnimationFrame(()=>askOv.classList.add('open'));setTimeout(()=>askIn.focus(),60)}
function closeAsk(){if(!askOv.classList.contains('show'))return;askSeq++;document.documentElement.style.overflow='';askOv.classList.remove('open');
  setTimeout(()=>{askOv.classList.remove('show');askReset()},420)}
askIn.addEventListener('input',()=>askText.textContent=askIn.value);
askIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();askSubmit()}});

/* â•â•â• TYPING TEST (âŒ˜J / Alt+J) â•â•â• */
const ttOv=$('#ttOv'),ttWordsEl=$('#ttWords');
const WORDS='the be of and a to in he have it that for they with as not on she at by this we you do but from or which one would all will there say who make when can more if no out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still hand old life tell write become here show house both between need mean call under last right move thing school never same begin while number part turn real leave might want point form off child few small since against ask late home large person end open public follow during without again hold around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand early course change help line'.split(' ');
const T={words:[],els:[],wi:0,ci:0,started:false,done:false,t0:0,raf:0,raw:0,ok:0,pending:false,open:false,dw:0,da:100,dt:0};
const caretEl=document.createElement('span');caretEl.className='tt-caret';
(function kb(){const k=$('#ttKb');['qwertyuiop','asdfghjkl','zxcvbnm'].forEach(r=>{const row=document.createElement('div');row.className='kr';
  [...r].forEach(c=>{const s=document.createElement('span');s.className='key';s.dataset.k=c;s.textContent=c;row.appendChild(s)});k.appendChild(row)});
  const row=document.createElement('div');row.className='kr';const s=document.createElement('span');s.className='key space';s.dataset.k=' ';s.textContent='space';row.appendChild(s);k.appendChild(row)})();
const keyEl=c=>$(`#ttKb .key[data-k="${c}"]`);
function flash(c){const k=keyEl(c);if(k){k.classList.add('active');setTimeout(()=>k.classList.remove('active'),110)}}
function nextHint(){$$('#ttKb .key.next').forEach(k=>k.classList.remove('next'));if(T.done)return;
  const w=T.els[T.wi];let n=T.ci<w.word.length?w.word[T.ci]:(T.wi<T.words.length-1?' ':null);if(n){const k=keyEl(n);k&&k.classList.add('next')}}
function moveCaret(){const w=T.els[T.wi];let l,t;if(T.ci<w.chars.length){l=w.chars[T.ci].offsetLeft;t=w.chars[T.ci].offsetTop}
  else{const e=w.chars[w.chars.length-1];l=e.offsetLeft+e.offsetWidth;t=e.offsetTop}caretEl.style.left=l+'px';caretEl.style.top=t+'px'}
function ttBuild(){ttWordsEl.innerHTML='';T.els=[];T.words.forEach(w=>{const el=document.createElement('span');el.className='tt-word';const chars=[...w].map(ch=>{const c=document.createElement('span');c.className='tt-char';c.textContent=ch;el.appendChild(c);return c});ttWordsEl.appendChild(el);T.els.push({el,chars,word:w})});ttWordsEl.appendChild(caretEl)}
function ttRestart(){Object.assign(T,{wi:0,ci:0,started:false,done:false,t0:0,raw:0,ok:0,pending:false,dw:0,da:100,dt:0});cancelAnimationFrame(T.raf);
  ttOv.classList.remove('results','confirming');$('#ttWpm').textContent=0;$('#ttAcc').textContent=100;$('#ttTime').textContent=0;
  T.words=Array.from({length:26},()=>WORDS[Math.floor(Math.random()*WORDS.length)]);ttBuild();requestAnimationFrame(()=>{moveCaret();nextHint()})}
function ttLoop(){const t=T.started?(Date.now()-T.t0)/1000:0,tw=T.started&&t>.5?(T.ok/5)/(t/60):0,ta=T.raw?T.ok/T.raw*100:100;
  T.dw+=(tw-T.dw)*.16;T.da+=(ta-T.da)*.16;T.dt+=(t-T.dt)*.4;
  $('#ttWpm').textContent=Math.round(T.dw);$('#ttAcc').textContent=Math.round(T.da);$('#ttTime').textContent=Math.floor(T.dt+1e-4);
  if(T.open&&!T.done)T.raf=requestAnimationFrame(ttLoop)}
function ttFinish(){T.done=true;cancelAnimationFrame(T.raf);const el=Math.max(.001,(Date.now()-T.t0)/1000);
  const wpm=Math.round((T.ok/5)/(el/60));$('#rAcc').textContent=T.raw?Math.round(T.ok/T.raw*100):100;$('#rRaw').textContent=Math.round((T.raw/5)/(el/60));$('#rTime').textContent=el.toFixed(1);
  ttOv.classList.add('results');const t0=performance.now();(function tk(n){const p=Math.min(1,(n-t0)/750);$('#rWpm').textContent=Math.round(wpm*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tk)})(t0)}
function ttAfter(){moveCaret();nextHint();const w=T.els[T.wi];if(T.wi===T.words.length-1&&T.ci>=w.word.length)ttFinish()}
function ttChar(k){if(T.done)return;if(!T.started){T.started=true;T.t0=Date.now();cancelAnimationFrame(T.raf);T.raf=requestAnimationFrame(ttLoop)}
  const w=T.els[T.wi];
  if(T.ci<w.word.length){const ok=k===w.word[T.ci];w.chars[T.ci].classList.add(ok?'correct':'incorrect');T.raw++;if(ok)T.ok++;T.ci++}
  else if(w.chars.length-w.word.length<8){const ex=document.createElement('span');ex.className='tt-char extra';ex.textContent=k;w.el.appendChild(ex);w.chars.push(ex);T.raw++;T.ci++}
  ttAfter()}
function ttBack(){if(T.done)return;if(T.ci>0){T.ci--;const w=T.els[T.wi];if(T.ci>=w.word.length){const ex=w.chars.pop();ex&&ex.remove()}else w.chars[T.ci].classList.remove('correct','incorrect')}
  else if(T.wi>0){T.wi--;T.ci=T.els[T.wi].chars.length}moveCaret();nextHint()}
function openTyping(){closeAsk();T.open=true;ttOv.classList.add('show');document.documentElement.style.overflow='hidden';requestAnimationFrame(()=>ttOv.classList.add('open'));ttRestart()}
function closeTyping(silent){if(!T.open)return;T.open=false;cancelAnimationFrame(T.raf);ttOv.classList.remove('open','confirming');document.documentElement.style.overflow='';
  setTimeout(()=>ttOv.classList.remove('show','results'),silent?0:380)}

/* PORTFOLIO ARCADE */
const arcadeOv=$('#arcadeOv'),arcadeGame=$('#arcadeGame'),arcadeTabs=$$('.arcade-tab');
let arcadeTimer=0,arcadeCleanup=()=>{};
function arcadeView(html){arcadeCleanup();arcadeGame.innerHTML=html}
function openArcade(){closeAsk();closeTyping(true);arcadeOv.classList.add('show');document.documentElement.style.overflow='hidden';requestAnimationFrame(()=>arcadeOv.classList.add('open'));arcadeReaction()}
function closeArcade(){arcadeCleanup();clearTimeout(arcadeTimer);arcadeOv.classList.remove('open');document.documentElement.style.overflow='';setTimeout(()=>arcadeOv.classList.remove('show'),380)}
function arcadeReaction(){
  arcadeTabs.forEach(tab=>tab.classList.toggle('is-active',tab.dataset.game==='reaction'));
  arcadeView('<div class="game-copy"><h3>Reaction time</h3><p>Wait for the panel to turn green, then click as fast as you can.</p><div class="reaction-pad" id="reactionPad">Press start when ready</div><div class="game-score" id="reactionScore">Best: --</div></div>');
  const pad=arcadeGame.querySelector('#reactionPad'),score=arcadeGame.querySelector('#reactionScore');if(!pad||!score)return;let started=0,armed=false,finished=false;
  const best=()=>Number(localStorage.getItem('reaction-best')||0);
  const showBest=()=>score.textContent=`Best: ${best()?`${best()} ms`:'--'}`;
  showBest();
  const begin=()=>{if(armed)return;finished=false;armed=true;pad.className='reaction-pad waiting';pad.textContent='Wait for green...';arcadeTimer=setTimeout(()=>{started=performance.now();pad.className='reaction-pad ready';pad.textContent='CLICK NOW';},900+Math.random()*2400)};
  const click=()=>{if(!armed){begin();return}if(!started){clearTimeout(arcadeTimer);armed=false;pad.className='reaction-pad result';pad.textContent='Too early - try again';return}if(finished)return;finished=true;armed=false;const ms=Math.round(performance.now()-started),old=best();if(!old||ms<old)localStorage.setItem('reaction-best',String(ms));pad.className='reaction-pad result';pad.textContent=`${ms} ms - ${ms<250?'Lightning fast.':'Nice run.'}`;showBest()};
  pad.addEventListener('click',click);arcadeCleanup=()=>{pad.removeEventListener('click',click);clearTimeout(arcadeTimer)}
}
function arcadeMemory(){
  arcadeTabs.forEach(tab=>tab.classList.toggle('is-active',tab.dataset.game==='memory'));
  const icons=['✦','◼','●','▲','◆','✚'],deck=[...icons,...icons].sort(()=>Math.random()-.5);
  arcadeView(`<div class="game-copy"><h3>Memory match</h3><p>Find all six pairs in as few moves as possible.</p><div class="memory-grid">${deck.map((icon,i)=>`<button class="memory-card" data-index="${i}" data-icon="${icon}" aria-label="Hidden memory card">?</button>`).join('')}</div><div class="game-score" id="memoryScore">Moves: 0 - pairs: 0/6</div></div>`);
  const cards=$$('.memory-card'),score=$('#memoryScore');let first=null,lock=false,moves=0,pairs=0;
  const flip=e=>{const card=e.currentTarget;if(lock||card.classList.contains('flipped')||card.classList.contains('matched'))return;card.classList.add('flipped');card.textContent=card.dataset.icon;
    if(!first){first=card;return}moves++;if(first.dataset.icon===card.dataset.icon){first.classList.add('matched');card.classList.add('matched');first=null;pairs++;score.textContent=`Moves: ${moves} - pairs: ${pairs}/6`;if(pairs===6)score.textContent=`Complete in ${moves} moves - excellent memory`}else{lock=true;const previous=first;first=null;setTimeout(()=>{previous.classList.remove('flipped');card.classList.remove('flipped');previous.textContent=card.textContent='?';lock=false;score.textContent=`Moves: ${moves} - pairs: ${pairs}/6`},650)}};
  cards.forEach(card=>card.addEventListener('click',flip));arcadeCleanup=()=>cards.forEach(card=>card.removeEventListener('click',flip))
}
function arcadeNumbers(){
  arcadeTabs.forEach(tab=>tab.classList.toggle('is-active',tab.dataset.game==='numbers'));
  arcadeView('<div class="game-copy"><h3>Number sprint</h3><p>Hit the target number as many times as possible in 20 seconds.</p><div class="number-target" id="numberTarget">0</div><div class="number-board" id="numberBoard"></div><div class="game-score" id="numberScore">Score: 0 - 20 seconds</div></div>');
  const target=$('#numberTarget'),board=$('#numberBoard'),score=$('#numberScore');let points=0,left=20,current=0,interval=0;
  const next=()=>{current=Math.floor(Math.random()*10);target.textContent=current;board.innerHTML=Array.from({length:10},(_,i)=>`<button class="number-key" data-number="${i}">${i}</button>`).join('');board.querySelectorAll('button').forEach(button=>button.addEventListener('click',hit))};
  const hit=e=>{if(Number(e.currentTarget.dataset.number)!==current)return;points++;next();score.textContent=`Score: ${points} - ${left} seconds`};
  next();interval=setInterval(()=>{left--;score.textContent=`Score: ${points} - ${left} seconds`;if(left<=0){clearInterval(interval);board.innerHTML='';target.textContent=points;score.textContent=`Final score: ${points} - play again by switching tabs`}},1000);
  arcadeCleanup=()=>{clearInterval(interval);board.querySelectorAll('button').forEach(button=>button.removeEventListener('click',hit))}
}
arcadeTabs.forEach(tab=>tab.addEventListener('click',()=>{
  if(tab.dataset.game==='typing'){closeArcade();openTyping();return}
  const game={reaction:arcadeReaction,memory:arcadeMemory,numbers:arcadeNumbers}[tab.dataset.game];
  if(game)game();
}));
window.openArcade=openArcade;window.closeArcade=closeArcade;
if(arcadeOv)arcadeOv.addEventListener('click',e=>{if(e.target===arcadeOv)closeArcade()});

/* â•â•â• KEYBOARD â•â•â• */
addEventListener('keydown',e=>{
  if((e.metaKey||e.altKey)&&e.code==='KeyK'&&askOv){e.preventDefault();askOv.classList.contains('show')?closeAsk():openAsk();return}
  if((e.metaKey||e.altKey)&&e.code==='KeyJ'&&!e.ctrlKey){e.preventDefault();T.open?closeTyping():openTyping();return}
  if(e.key==='Escape'){
    if(imageLightbox.classList.contains('open')){e.preventDefault();closeImageLightbox();return}
    if(arcadeOv&&arcadeOv.classList.contains('show')){e.preventDefault();closeArcade();return}
    if(T.open){e.preventDefault();T.pending?(T.pending=false,ttOv.classList.remove('confirming')):closeTyping();return}
    if(askOv&&askOv.classList.contains('show'))closeAsk();
    if(modal.style.display==='flex')closeModal();
    if($('#mnav').style.display==='flex')closeMobileNav();return}
  if(!T.open||e.metaKey||e.ctrlKey)return;
  if(e.key==='Tab'){e.preventDefault();if(T.started&&!T.done){T.pending=true;ttOv.classList.add('confirming')}else ttRestart();return}
  if(e.key==='Enter'){if(T.pending||T.done){e.preventDefault();ttRestart()}return}
  if(T.pending)return;
  if(e.key==='Backspace'){e.preventDefault();ttBack();return}
  if(e.key===' '){e.preventDefault();flash(' ');if(T.done)return ttRestart();if(T.started&&T.wi<T.words.length-1){T.wi++;T.ci=0;ttAfter()}return}
  if(e.key.length===1&&/[a-z]/i.test(e.key)){e.preventDefault();const c=e.key.toLowerCase();flash(c);ttChar(c)}
});

/* â•â•â• SCROLL REVEAL â•â•â• */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});
$$('.rv').forEach(el=>io.observe(el));

/* â•â•â• HALFTONE GITHUB GRAPH (generated, not real data) â•â•â• */
(function(){
  const svg=$('#ghsvg'),R=[1.1,2.7,3.8,4.8,5.7];
  const levels=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,4,1,0,3,2,0,1,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  let h='';for(let c=0;c<53;c++)for(let r=0;r<7;r++){const lv=levels[r][c];h+=`<circle cx="${6.5+c*13}" cy="${6.5+r*13}" r="${R[lv]}" fill="currentColor" opacity="${lv?.92:.12}"/>`}
  svg.innerHTML=h;$('#gcount').textContent='121';
})();

/* â•â•â• FAKE PRESENCE (demo) â•â•â• */
setInterval(()=>{$('#pcount').textContent=1+Math.floor(Math.random()*3)},9000);

/* â•â•â• GUIDE CURSOR TOUR (desktop only, once per session) â•â•â• */
(function(){
  const desk=matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  if(!desk.matches)return;
  const gc=$('#gc'),tag=$('#gcTag'),txt=$('#gcText'),gp=$('#gp'),store={g:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}}};
  const G=k=>$$(`[data-guide="${k}"]`),within=(k,sel)=>G(k).flatMap(e=>[...e.querySelectorAll(sel)]);
  const vis=el=>{const r=el.getBoundingClientRect();return r.width&&r.top>=0&&r.bottom<=innerHeight};
  const steps=[
    {els:()=>G('name'),at:'above',free:1,text:`Hi! I'm ${NAME}, welcome to my website.`},
    {els:()=>within('socials','a'),at:'below',text:'Find my email, phone, Instagram, Facebook, and LinkedIn links here.'},
    {els:()=>G('ai-tools'),at:'below',text:'I use ChatGPT, DeepSeek, Claude, Gemini, OpenCode, and OmniRoute to assist my development work.'},
    {els:()=>within('stats','a,button'),at:'below',text:'My public work includes 8 repositories and 121 GitHub contributions in 2026.'},
    {els:()=>G('nav-shop'),text:'Explore my builds: the Tomato Farming Assistant, SmartPickle, and ESP32 soil sensor.'},
    {els:()=>G('nav-blog'),text:'Learn about my background as a computer science graduate and developer.'},
    {els:()=>G('nav-gear'),text:'See the tools behind my work: Flutter, React, Python, Node.js, and ESP32.'},
    {els:()=>G('nav-resources'),text:'Browse the technologies used across my web, mobile, AI, and smart-device projects.'},
    {els:()=>G('nav-consulting'),text:'View my certificates, awards, and achievement photos.'},
    {els:()=>G('nav-about'),text:'Ready to build something useful? Start a conversation with me.'},
    {els:()=>G('email'),text:'You can reach me directly at jrbanghal4222@gmail.com.'},
    {free:1,text:"That's the tour. Thanks for visiting my portfolio."}];
  let pos={x:innerWidth+40,y:innerHeight*.6},hover=null,running=false;
  const place=(x,y,dur)=>{gc.style.transition=`opacity .45s${dur?`,transform ${dur}ms cubic-bezier(.65,0,.25,1)`:''}`;gc.style.transform=`translate3d(${x}px,${y}px,0)`;pos={x,y};window.gazeGuide=true;window.gazeLook(x,y)};
  const anchor=(el,at)=>{const r=el.getBoundingClientRect();return at==='above'?{x:r.left+6,y:r.top-24}:at==='below'?{x:r.left+r.width/2,y:r.bottom+2}:{x:r.right+5,y:r.top+r.height/2}};
  const setHover=el=>{hover&&hover.classList.remove('gc-hover');hover=el||null;hover&&hover.classList.add('gc-hover')};
  async function glide(p){const d=clamp(Math.hypot(p.x-pos.x,p.y-pos.y)*1.1+300,450,1100);place(p.x,p.y,d);
    // keep the portrait watching the cursor while it travels
    const t0=performance.now();(function f(n){const r=gc.getBoundingClientRect();window.gazeLook(r.left,r.top);if(n-t0<d)requestAnimationFrame(f)})(t0);await sleep(d)}
  const live=()=>running&&[askOv,ttOv].filter(Boolean).every(o=>!o.classList.contains('show'))&&modal.style.display!=='flex';
  async function type(s){tag.classList.add('talk');txt.textContent='';for(const ch of s){if(!running)return;txt.textContent+=ch;await sleep(/[.!?]/.test(ch)?rand(80,150):rand(10,24))}}
  async function say(st){
    const els=st.els?st.els().filter(vis):[];if(!els.length&&!st.free)return;
    const pts=els.length?els.map(e=>anchor(e,st.at)):[{x:innerWidth*.55,y:innerHeight*.42}];
    while(running&&!live())await sleep(300);
    tag.classList.remove('talk');txt.textContent='';
    gc.classList.toggle('up',st.at==='above'||pts[0].y+110>innerHeight);gc.classList.toggle('lf',pts[0].x+280>innerWidth);
    setHover(els[0]);await glide(pts[0]);await sleep(rand(60,140));await type(st.text);
    for(let i=1;i<pts.length;i++){await sleep(rand(400,600));setHover(els[i]);await glide(pts[i])}
    await sleep(900+st.text.length*18);setHover(null);
  }
  async function start(){
    if(running)return;running=true;gp.classList.remove('on');store.s('tourSeen','1');
    gc.style.transition='none';gc.style.transform=`translate3d(${innerWidth+40}px,${innerHeight*.6}px,0)`;pos={x:innerWidth+40,y:innerHeight*.6};
    await sleep(500);gc.classList.add('here');
    for(const s of steps){if(!running)break;await say(s)}
    tag.classList.remove('talk');await sleep(400);await glide({x:innerWidth+90,y:innerHeight*.3});
    gc.classList.remove('here');await sleep(500);running=false;window.gazeGuide=null;
    if(store.g('tourPrompt')!=='off')gp.classList.add('on');
  }
  $('#gpReplay').onclick=start;$('#gpClose').onclick=()=>{gp.classList.remove('on');store.s('tourPrompt','off')};
  if(store.g('tourSeen')!=='1'||location.search.includes('tour'))setTimeout(start,700);else gp.classList.add('on');
})();

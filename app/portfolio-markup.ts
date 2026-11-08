const portfolioMarkup = `

<!-- â”€â”€â”€ page-wide halftone backdrop â”€â”€â”€ -->
<div class="backdrop" aria-hidden="true"><div class="halftone halftone-wide mask-tr a"></div><div class="halftone mask-bl b"></div></div>

<!-- â”€â”€â”€ fixed sidebar (desktop) â”€â”€â”€ -->
<nav class="side" data-guide="sidebar">
  <a href="#top" class="logo">Godie Banghal</a>
  <div class="navs">
    <div class="grp">
      <a class="nl" href="#projects" data-guide="nav-shop"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Builds</a>
      <a class="nl" href="#about" data-guide="nav-blog"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Profile</a>
      <a class="nl" href="#skills" data-guide="nav-gear"><svg viewBox="0 0 24 24" fill="none"><path d="M5 5h14v14H5zM8 9h8M8 13h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Toolkit</a>
      <a class="nl" href="#stack" data-guide="nav-resources"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Technologies</a>
    </div>
    <div class="sep"></div>
    <div class="grp">
      <a class="nl" href="#recognition" data-guide="nav-consulting"><svg viewBox="0 0 24 24" fill="none"><path d="m12 3 2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8L12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>Proof</a>
    </div>
    <div class="sep"></div>
    <div class="grp">
      <a class="nl" href="#contact" data-guide="nav-about">Start a conversation</a>
      <a class="nl" href="#top" data-guide="nav-about">Return to top</a>
    </div>
  </div>
  <button class="sbtn" style="margin-top:.65rem" onclick="openTyping()"><span>Typing test</span><span><kbd class="modk">Cmd</kbd> + <kbd>J</kbd></span></button>
  <button class="sbtn sound-toggle" type="button" data-sound-toggle aria-pressed="true">sound on</button>
  <div class="pres">
    <span class="pav"></span>
    <p class="plabel"><b id="pcount">1</b> person viewing now</p>
  </div>
  <div style="margin-top:1.5rem">
    <div class="theme-switch" role="group" aria-label="Theme" style="margin-bottom:1rem">
      <button class="theme-opt" data-theme-opt="system" onclick="setTheme('system',event)" title="System"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9 21h6M12 17v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
      <button class="theme-opt" data-theme-opt="light" onclick="setTheme('light',event)" title="Light"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
      <button class="theme-opt" data-theme-opt="dark" onclick="setTheme('dark',event)" title="Dark"><svg viewBox="0 0 24 24" fill="none"><path d="M20 13.6A8 8 0 1 1 10.4 4a6.2 6.2 0 0 0 9.6 9.6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button>
    </div>
    <p class="faint" style="font-size:12px;line-height:1.6">For work, collabs &amp; everything else, reach me at</p>
    <a class="mailto" data-guide="email" href="mailto:jrbanghal4222@gmail.com"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>jrbanghal4222@gmail.com</a>
  </div>
</nav>

<!-- â”€â”€â”€ mobile top bar + menu â”€â”€â”€ -->
<header class="mbar"><div>
  <a href="#top" class="logo" style="font-size:14px">Godie Banghal</a>
  <button onclick="openMobileNav()" aria-label="Open menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
</div></header>
<div class="mnav" id="mnav">
  <div class="mbar" style="position:static"><div><a href="#top" class="logo" style="font-size:14px">Godie Banghal</a>
    <button onclick="closeMobileNav()" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></div></div>
  <div class="body" onclick="if(event.target.closest('a'))closeMobileNav()">
    <a class="nl" href="#projects">Builds</a><a class="nl" href="#about">Profile</a><a class="nl" href="#skills">Toolkit</a><a class="nl" href="#stack">Technologies</a>
    <div class="sep"></div><a class="nl" href="#recognition">Proof</a><a class="nl" href="#contact">Start a conversation</a>
    <div class="sep"></div>
    <button class="sbtn sound-toggle" type="button" data-sound-toggle aria-pressed="true">sound on</button>
    <div class="theme-switch" role="group"><button class="theme-opt" data-theme-opt="system" onclick="setTheme('system',event)"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9 21h6M12 17v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button><button class="theme-opt" data-theme-opt="light" onclick="setTheme('light',event)"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/></svg></button><button class="theme-opt" data-theme-opt="dark" onclick="setTheme('dark',event)"><svg viewBox="0 0 24 24" fill="none"><path d="M20 13.6A8 8 0 1 1 10.4 4a6.2 6.2 0 0 0 9.6 9.6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button></div>
    <a class="mailto" href="mailto:jrbanghal4222@gmail.com" style="font-size:14px">jrbanghal4222@gmail.com</a>
  </div>
</div>

<!-- â”€â”€â”€ content â”€â”€â”€ -->
<main id="top">
<div class="wrap">

  <!-- hero -->
  <section class="hero">
    <div class="hero-grid">
      <div class="photo reveal d1" id="photo">
        <!-- Smooth cursor-following SVG portrait (default) -->
        <svg id="face" viewBox="0 0 200 200" aria-label="Portrait that follows your cursor" style="transform-style:preserve-3d;will-change:transform">
          <defs><clipPath id="fclip"><circle cx="100" cy="100" r="96"/></clipPath></defs>
          <circle cx="100" cy="100" r="96" fill="rgb(var(--g100))"/>
          <g clip-path="url(#fclip)">
            <path d="M20 210 Q30 150 100 148 Q170 150 180 210Z" fill="rgb(var(--g800))"/>
            <g id="headG">
              <rect x="86" y="128" width="28" height="28" rx="10" fill="#e8b895"/>
              <ellipse cx="100" cy="82" rx="54" ry="56" fill="#1a1a1a"/>
              <ellipse cx="100" cy="98" rx="46" ry="52" fill="#f2c9a6"/>
              <ellipse cx="54" cy="100" rx="6" ry="10" fill="#e8b895"/><ellipse cx="146" cy="100" rx="6" ry="10" fill="#e8b895"/>
              <path d="M52 86 Q56 40 100 38 Q146 40 148 86 Q132 62 100 62 Q70 62 52 86Z" fill="#1a1a1a"/>
              <g id="featG">
                <g id="brows" stroke="#1a1a1a" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M69 80 Q79 75 90 79"/><path d="M110 79 Q121 75 131 80"/></g>
                <ellipse cx="79" cy="95" rx="10" ry="11" fill="#fff"/><ellipse cx="121" cy="95" rx="10" ry="11" fill="#fff"/>
                <circle class="pup" cx="79" cy="95" r="5" fill="#1a1a1a"/><circle class="pup" cx="121" cy="95" r="5" fill="#1a1a1a"/>
                <circle class="pup" cx="81" cy="93" r="1.6" fill="#fff"/><circle class="pup" cx="123" cy="93" r="1.6" fill="#fff"/>
                <ellipse class="lid" cx="79" cy="95" rx="11" ry="0" fill="#f2c9a6"/><ellipse class="lid" cx="121" cy="95" rx="11" ry="0" fill="#f2c9a6"/>
                <path d="M100 100 Q95 116 101 118" stroke="#c99472" stroke-width="2.6" fill="none" stroke-linecap="round"/>
                <path id="mouth" d="M86 130 Q100 140 114 130" stroke="#a5503f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
              </g>
            </g>
          </g>
        </svg>
        <!-- Directional portrait frames are loaded from ./profile-gaze/. -->
        <img id="gazeImg" src="profile-gaze/center.png" alt="Godie Banghal portrait" draggable="false">
      </div>
      <div>
        <h1 class="h1 reveal d2" data-guide="name">Godie Banghal</h1>
        <p class="lead reveal d3">Computer science graduate and developer</p>
        <p class="lead reveal d4">I build useful mobile and web apps with AI and smart devices.</p>
        <div class="ai-tools reveal d5" data-guide="ai-tools" aria-label="AI tools I use to assist my work">
          <span class="ai-tools-label">AI-assisted workflow</span>
          <span class="ai-tool" title="ChatGPT"><img src="https://api.iconify.design/simple-icons/openai.svg" alt="">ChatGPT</span>
          <span class="ai-tool" title="DeepSeek"><img src="https://api.iconify.design/simple-icons/deepseek.svg" alt="">DeepSeek</span>
          <span class="ai-tool" title="Claude"><img src="https://api.iconify.design/simple-icons/anthropic.svg" alt="">Claude</span>
          <span class="ai-tool" title="Gemini"><img src="https://api.iconify.design/simple-icons/googlegemini.svg" alt="">Gemini</span>
          <span class="ai-tool" title="OpenCode"><img src="https://api.iconify.design/simple-icons/opencode.svg" alt="">OpenCode</span>
          <span class="ai-tool" title="OmniRoute"><img src="https://api.iconify.design/solar/route-bold.svg?color=%232F71E3" alt="">OmniRoute</span>
        </div>
        <div class="socials reveal d5" data-guide="socials">
          <a href="mailto:jrbanghal4222@gmail.com">email -></a><a href="tel:+639543999117">phone -></a><a href="https://www.instagram.com/justfound_404/" target="_blank" rel="noopener">instagram -></a><a href="https://www.facebook.com/J.R.BANGHAL" target="_blank" rel="noopener">facebook -></a><a href="https://www.linkedin.com/in/banghal-godie-jr-s-3a9036428" target="_blank" rel="noopener">linkedin -></a>
        </div>
      </div>
    </div>
  </section>

  <!-- capabilities strip -->
  <div class="affil">
    <a href="#stack"><span class="logo-box">WEB</span><span><b>Web developer</b><small>React - Node.js - JavaScript</small></span></a>
    <a href="#projects"><span class="logo-box">APP</span><span><b>Mobile app builder</b><small>Flutter - Dart - useful products</small></span></a>
    <a href="#skills"><span class="logo-box">AI</span><span><b>AI + smart devices</b><small>Python - computer vision - ESP32</small></span></a>
  </div>

  <!-- proof points -->
  <div class="stats" data-guide="stats">
    <a href="https://github.com/JayRdev09?tab=overview" target="_blank" rel="noopener"><div class="v">8<svg viewBox="0 0 16 16" fill="none"><path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="l">public repositories</div></a>
    <a href="#github"><div class="v">121<svg viewBox="0 0 16 16" fill="none"><path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="l">GitHub contributions</div></a>
  </div>
  <div class="halftone halftone-wide mask-fade-x hdiv" aria-hidden="true"></div>

  <!-- 01 about -->
  <section id="about" class="sec rv profile-section">
    <div class="halftone mask-circle" style="position:absolute;left:-2.5rem;bottom:1.5rem;width:8rem;height:8rem;opacity:.2;pointer-events:none" aria-hidden="true"></div>
    <div class="sh"><h2>01 - profile</h2><a href="#contact">start a conversation -></a></div>
    <div class="list profile-list">
      <a class="post" href="#"><div><h3>I like making useful things.</h3><p>I turn ideas into useful web and mobile experiences with AI, automation, and smart devices.</p></div><time>About</time></a>
      <a class="post" href="#"><div><h3>Bachelor of Computer Science</h3><p>Jose Rizal Memorial State University</p><p>I earned my Bachelor of Computer Science and built my foundation in software development.</p></div><time>Education</time></a>
      <a class="post" href="#"><div><h3>Aloran, Misamis Occidental</h3><p>Based in the Philippines, I create practical digital products for people, communities, and real-world problems.</p></div><time>Location</time></a>
    </div>
  </section>

  <!-- 02 selected work -->
  <section id="projects" class="sec rv">
    <div class="sh"><h2>02 - builds</h2><a href="https://smartpickle.vercel.app/" target="_blank" rel="noopener">open a build -></a></div>
    <div class="deck" id="deck">
      <article class="dc c" tabindex="0" role="button" onclick="activateCard(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();activateCard(this)}">
        <div class="tags"><span class="tag dark">Award-winning school project</span><span class="tag">AI + farming</span></div>
        <div class="feature-gallery" aria-label="Tomato Farming Assistant feature screens">
          <img src="tomatoai%20features%20images/image1.png" alt="Tomato Farming Assistant welcome screen">
          <img src="tomatoai%20features%20images/image2.png" alt="Tomato Farming Assistant dashboard">
          <img src="tomatoai%20features%20images/image3.png" alt="Tomato Farming Assistant profile screen">
          <img src="tomatoai%20features%20images/image4.png" alt="Tomato Farming Assistant plant health screen">
          <img src="tomatoai%20features%20images/image5.png" alt="Tomato Farming Assistant advice screen">
          <img src="tomatoai%20features%20images/image6.png" alt="Tomato Farming Assistant harvest screen">
          <img src="tomatoai%20features%20images/image7.png" alt="Tomato Farming Assistant soil data screen">
          <img src="tomatoai%20features%20images/image8.png" alt="Tomato Farming Assistant checklist screen">
          <img src="tomatoai%20features%20images/image9.png" alt="Tomato Farming Assistant sensor readings screen">
          <img src="tomatoai%20features%20images/image10.png" alt="Tomato Farming Assistant data overview screen">
          <img src="tomatoai%20features%20images/image11.png" alt="Tomato Farming Assistant plant list screen">
          <img src="tomatoai%20features%20images/image12.png" alt="Tomato Farming Assistant growth screen">
          <img src="tomatoai%20features%20images/image13.png" alt="Tomato Farming Assistant warning screen">
          <img src="tomatoai%20features%20images/image14.png" alt="Tomato Farming Assistant recommendations screen">
          <img src="tomatoai%20features%20images/image15.png" alt="Tomato Farming Assistant treatment screen">
          <img src="tomatoai%20features%20images/image16.png" alt="Tomato Farming Assistant image upload screen">
          <img src="tomatoai%20features%20images/image17.png" alt="Tomato Farming Assistant diagnosis screen">
          <img src="tomatoai%20features%20images/image18.png" alt="Tomato Farming Assistant calendar screen">
          <img src="tomatoai%20features%20images/image19.png" alt="Tomato Farming Assistant tomato crop screen">
          <img src="tomatoai%20features%20images/image20.png" alt="Tomato Farming Assistant task screen">
          <img src="tomatoai%20features%20images/image21.png" alt="Tomato Farming Assistant farming guide screen">
          <img src="tomatoai%20features%20images/image22.png" alt="Tomato Farming Assistant recommendation detail screen">
          <img src="tomatoai%20features%20images/image23.png" alt="Tomato Farming Assistant plant care screen">
          <img src="tomatoai%20features%20images/image24.png" alt="Tomato Farming Assistant plant health history screen">
          <img src="tomatoai%20features%20images/image25.png" alt="Tomato Farming Assistant guide screen">
        </div>
        <div class="row"><span class="app-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20c-4.4 0-7.5-2.8-7.5-7.1C4.5 9.4 7.4 7 12 7s7.5 2.4 7.5 5.9C19.5 17.2 16.4 20 12 20Z"/><path d="M12 7c-.2-2.4 1.2-4 3.6-4.5.2 2.2-1.1 4.1-3.6 4.5ZM12 7C10.8 4.8 9 4 7.1 4.4 7.7 6.4 9.2 7.5 12 7Z"/></svg></span><h3>Tomato Farming Assistant</h3></div>
        <p>A mobile app that helps farmers find tomato diseases, check soil, and get farming advice.</p>
        <div class="stores"><a class="store" href="#recognition">97.6% model accuracy</a><a class="store" href="#skills">Flutter / Python</a></div>
      </article>
      <article class="dc l" tabindex="0" role="button" onclick="activateCard(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();activateCard(this)}">
        <div class="tags"><span class="tag dark">Featured product</span></div>
        <img class="project-thumb" src="./system-img/smartpickle-thumbnail.jpg" alt="SmartPickle pickleball booking website thumbnail">
        <div class="row"><span class="app-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 8.5c2.4-2.2 5.3-3.3 8.7-2.7 2.8.5 4.4 2 5.3 4.3.8 2.2-.3 4.3-2.2 5.1-2 .8-4-.2-4.9-2.1-.7-1.5-2-2.2-3.7-2.1-1.8.1-3.3-.5-3.8-2.5-.2-.7.1-1.3.7-2Z"/><path d="M7.5 9.7c1.2-.8 2.5-1.1 4-.8M16.4 11.6l1.2-.3"/></svg></span><h3>SmartPickle</h3></div>
        <p>A website for booking pickleball courts, tracking games, seeing stats, and meeting other players.</p>
        <div class="stores"><a class="store" href="https://smartpickle.vercel.app/" target="_blank" rel="noopener">Visit live project</a><a class="store" href="#skills">React</a></div>
      </article>
      <article class="dc r" tabindex="0" role="button" onclick="activateCard(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();activateCard(this)}">
        <div class="tags"><span class="tag dark">Connected hardware</span></div>
        <img class="project-thumb" src="./system-img/SOIL SENSOR_LABELED.jpg" alt="Labeled ESP32 7-in-1 soil sensor">
        <div class="row"><span class="app-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20V9"/><path d="M12 13c-3.8 0-6-2.2-6-5.8C9.6 7.2 12 9.1 12 13ZM12 10c0-3.2 2.1-5.4 5.8-5.8C17.8 7.8 15.8 10 12 10Z"/><path d="M8.2 20h7.6"/></svg></span><h3>ESP32 7-in-1 soil sensor</h3></div>
        <p>A smart soil sensor that uses an ESP32 to send live soil data to the app.</p>
        <div class="stores"><a class="store" href="#projects">Live soil data</a><a class="store" href="#contact">work with me -></a></div>
      </article>
    </div>
  </section>

  <!-- 03 skills -->
  <section id="skills" class="sec rv" style="padding-bottom:2rem">
    <div class="sh" style="margin-bottom:1.5rem"><h2>03 - toolkit</h2><a href="#contact">work with me -></a></div>
    <div class="list">
      <div class="exp"><div class="y">01</div><div class="t">Mobile</div><div class="co">Flutter, Dart, cross-platform UI</div></div>
      <div class="exp"><div class="y">02</div><div class="t">Web</div><div class="co">React, HTML, CSS, JavaScript, Bootstrap, Tailwind</div></div>
      <div class="exp"><div class="y">03</div><div class="t">Backend</div><div class="co">Node.js, Express.js, PHP, REST APIs</div></div>
      <div class="exp"><div class="y">04</div><div class="t">AI &amp; vision</div><div class="co">Python, deep learning, image classification</div></div>
      <div class="exp"><div class="y">05</div><div class="t">Smart devices</div><div class="co">ESP32 and soil sensors</div></div>
    </div>
  </section>
  <section id="stack" class="rv" style="padding-bottom:3.5rem">
    <div class="sh" style="margin-bottom:1rem"><h2 style="font:11px var(--mono);text-transform:uppercase;letter-spacing:.06em">Technologies</h2><a href="#projects">see the builds -></a></div>
    <div class="chips">
      <span class="chip">Flutter</span><span class="chip">Dart</span><span class="chip">React</span><span class="chip">JavaScript</span><span class="chip">Node.js</span><span class="chip">Express.js</span>
      <span class="chip">PHP</span><span class="chip">Python</span><span class="chip">MySQL</span><span class="chip">PostgreSQL</span><span class="chip">ESP32</span><a class="chip more" href="#contact">+ more</a>
    </div>
  </section>

  <!-- 04 recognition -->
  <section id="recognition" class="sec rv">
    <div class="sh"><h2>04 - awards and certifications</h2><a href="#contact">ask me about it -></a></div>
    <div class="grid3 cert-gallery">
      <a class="cert" href="cert/e1c5b300-eba0-4a35-817f-b72c0b010d12.png"><img class="cert-image" src="cert/e1c5b300-eba0-4a35-817f-b72c0b010d12.png" alt="Certificate e1c5b300"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.3-4.5 2.3.9-5-3.6-3.5 5-.7L12 3Z"/><path d="M8 19h8M10 21h4"/></svg></span><h3>Certificate of achievement</h3><p class="org">Professional development</p><p class="v">Open certificate</p></a>
      <a class="cert" href="cert/b7c2992d-c795-4730-bce7-2e235c700ad6.png"><img class="cert-image" src="cert/b7c2992d-c795-4730-bce7-2e235c700ad6.png" alt="Certificate b7c2992d"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"/><path d="m7 15 3-3 2 2 3-4 2 3M8 9h.01"/></svg></span><h3>Certificate of participation</h3><p class="org">Learning and development</p><p class="v">Open certificate</p></a>
      <a class="cert" href="cert/b4d61203-cf1a-466e-b824-8eab118a9ba6.png"><img class="cert-image" src="cert/b4d61203-cf1a-466e-b824-8eab118a9ba6.png" alt="Certificate b4d61203"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M5 8.5h14M5 15.5h14"/><circle cx="12" cy="12" r="9"/></svg></span><h3>Certificate of completion</h3><p class="org">Technical training</p><p class="v">Open certificate</p></a>
      <a class="cert" href="cert/award1.jpg"><img class="cert-image" src="cert/award1.jpg" alt="2nd Best Paper certificate"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.3-4.5 2.3.9-5-3.6-3.5 5-.7L12 3Z"/><path d="M8 19h8M10 21h4"/></svg></span><h3>２nd Best Paper</h3><p class="org">JRMSU CCS Techtopia ２０２６</p><p class="v">Open certificate</p></a>
      <a class="cert" href="cert/award2.jpg"><img class="cert-image" src="cert/award2.jpg" alt="AI image checking certificate"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"/><path d="m7 15 3-3 2 2 3-4 2 3M8 9h.01"/></svg></span><h3>AI image checking</h3><p class="org">School presentation</p><p class="v">Open certificate</p></a>
      <a class="cert" href="cert/71fbdb27-419a-4305-aa80-6d878d7147d0.png"><img class="cert-image" src="cert/71fbdb27-419a-4305-aa80-6d878d7147d0.png" alt="Certificate 71fbdb27"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.3-4.5 2.3.9-5-3.6-3.5 5-.7L12 3Z"/><path d="M8 19h8M10 21h4"/></svg></span><h3>Certificate of recognition</h3><p class="org">Academic achievement</p><p class="v">Open certificate</p></a>
    </div>
    <div class="achievement-gallery" aria-label="Achievement photos">
      <button type="button" aria-label="Open achievement photo 1"><img src="group/6120657855611342579%20(1).jpg" alt="Achievement photo from a group presentation"></button>
      <button type="button" aria-label="Open achievement photo 2"><img src="group/6120657855611342580%20(1).jpg" alt="Achievement photo from a group event"></button>
      <button type="button" aria-label="Open achievement photo 3"><img src="group/6194838658142115992.jpg" alt="Achievement photo from a project presentation"></button>
      <button type="button" aria-label="Open achievement photo 4"><img src="group/6194838658142115993.jpg" alt="Achievement photo from a school achievement"></button>
      <button type="button" aria-label="Open achievement photo 5"><img src="group/image.png" alt="Achievement group photo"></button>
    </div>
  </section>

  <!-- 06 contact -->
  <section id="contact" class="sec rv">
    <div class="sh"><h2>06 - conversation</h2><a href="mailto:jrbanghal4222@gmail.com">send a message -></a></div>
    <div class="aff">
      <a href="mailto:jrbanghal4222@gmail.com"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span><span><b>jrbanghal4222@gmail.com</b><small>Email</small></span></a>
      <a href="tel:+639543999117"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4h3l1.5 4-2 1.5a15 15 0 0 0 5 5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C11.4 19.9 4.1 12.6 4 5.9 4 4.8 4.9 4 6 4h1Z"/></svg></span><span><b>+63 954 399 9117</b><small>Phone</small></span></a>
      <a href="https://www.instagram.com/justfound_404/" target="_blank" rel="noopener"><span class="ic" aria-hidden="true"><b>@</b></span><span><b>@justfound_404</b><small>Instagram</small></span></a>
      <a href="https://www.facebook.com/J.R.BANGHAL" target="_blank" rel="noopener"><span class="ic" aria-hidden="true"><b>f</b></span><span><b>J.R. Banghal</b><small>Facebook</small></span></a>
      <a href="https://www.linkedin.com/in/banghal-godie-jr-s-3a9036428" target="_blank" rel="noopener"><span class="ic" aria-hidden="true"><b>in</b></span><span><b>Godie Jr. S. Banghal</b><small>LinkedIn</small></span></a>
      <a href="#top"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z"/></svg></span><span><b>Aloran, Misamis Occidental</b><small>Philippines</small></span></a>
    </div>
  </section>

  <!-- 07 github -->
  <section id="github" class="sec rv">
    <div class="sh" style="margin-bottom:1.5rem"><h2>07 - end note</h2><a href="#top">return to top ^</a></div>
    <a href="https://github.com/JayRdev09?tab=overview" target="_blank" rel="noopener" aria-label="View Jay R Banghal on GitHub"><svg id="ghsvg" viewBox="0 0 689 91" preserveAspectRatio="xMidYMid meet" aria-label="GitHub contribution graph"></svg></a>
      <p class="gcount"><span id="gcount">121</span> GitHub contributions in 2026 - <a href="https://github.com/JayRdev09?tab=overview" target="_blank" rel="noopener">view 8 public repositories -></a></p>
  </section>

  <div class="halftone halftone-wide mask-fade-x" style="height:2.5rem;margin:.5rem 0 4rem;opacity:.15" aria-hidden="true"></div>
  <p class="credit">Design direction inspired by <a href="https://bryllim.com/" target="_blank" rel="noopener">Bryl Lim</a>.</p>
</div>
</main>

<div class="image-lightbox" id="imageLightbox" role="dialog" aria-modal="true" aria-label="Image preview">
  <button class="image-lightbox-close" id="imageLightboxClose" type="button" aria-label="Close image preview">&times;</button>
  <img id="imageLightboxImage" alt="">
  <p class="image-lightbox-caption" id="imageLightboxCaption"></p>
</div>

<!-- â”€â”€â”€ info modals â”€â”€â”€ -->
<div class="modal" id="modal" role="dialog" aria-modal="true">
  <div class="bd" onclick="closeModal()"></div>

  <div class="panel" data-panel="community">
    <button class="x" onclick="closeModal()" aria-label="Close"><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
    <p class="eyebrow">Project facts</p><h2>97.6% accuracy</h2>
    <p class="t">The tomato app checks plant health and soil data to give farmers useful advice.</p>
    <div style="margin-top:1.25rem"><a class="lk" href="#projects">10 app modules <span>explore -></span></a><a class="lk" href="#projects">25 documented screens <span>view work -></span></a></div>
    <p class="eyebrow" style="margin:1.5rem 0 .75rem">Tools used</p>
    <a class="feat" href="#skills"><small>Made with<SmartPickle/small><h3>Flutter - Python - ESP32</h3><small style="display:block;margin-top:6px;text-transform:none">Mobile app, AI, and smart sensors</small></a>
  </div>

  <div class="panel wide" data-panel="hackathons">
    <button class="x" onclick="closeModal()" aria-label="Close"><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
    <p class="eyebrow">Awards</p><h2 style="font-size:1.5rem">2nd Best Paper</h2>
    <a class="feat" style="margin-top:1.25rem" href="#recognition"><small>School event - June 2026</small><h3>JRMSU CCS Techtopia</h3></a>
    <a class="feat" href="#projects"><small>Winning school project</small><h3>Tomato Farming Assistant</h3></a>
    <p class="eyebrow" style="margin:1.75rem 0 0">More facts</p>
    <div class="ach">
      <div><h4>AI image recognition <span class="b">97.6%</span></h4><small>Model accuracy</small></div>
      <div><h4>ESP32 soil sensor <span class="b">7-in-1</span></h4><small>Live soil data</small></div>
      <div><h4>Tomato farming guidance <span class="b">10</span></h4><small>App modules</small></div>
      <div><h4>Research presentation <span class="b">2nd</span></h4><small>Best paper</small></div>
      <div><h4>SmartPickle <span class="b f">Live</span></h4><small>Full-stack product</small></div>
      <div><h4>JRMSU / CCS <span class="b f">2026</span></h4><small>Techtopia congress</small></div>
    </div>
  </div>

</div>

<!-- â”€â”€â”€ ask anything â”€â”€â”€ -->
<div class="ov" id="askOv" role="dialog" aria-modal="true">
  <div class="bg" onclick="closeAsk()"></div>
  <div class="ask-c" onclick="if(!askBusy)askIn.focus()">
    <div class="bubble" id="askBubble"></div>
    <div class="ask-head" id="askHead"><div class="loader" id="askLoader"></div><h2 class="ask-title" id="askTitle">what do you want to ask?</h2></div>
    <div class="ask-field" id="askField"><span id="askText"></span><span class="caret" id="askCaret"></span></div>
    <input id="askIn" class="hid" type="text" autocomplete="off" spellcheck="false" aria-label="Type your question">
  </div>
</div>

<!-- â”€â”€â”€ typing test â”€â”€â”€ -->
<div class="ov" id="ttOv" role="dialog" aria-modal="true">
  <div class="bg" onclick="closeTyping()"></div>
  <div class="tt-c">
    <div class="tt-stats">
      <div class="tt-stat"><div class="n" id="ttWpm">0</div><span>wpm</span></div>
      <div class="tt-stat"><div class="n"><span id="ttAcc">100</span><i>%</i></div><span>acc</span></div>
      <div class="tt-stat"><div class="n"><span id="ttTime">0</span><i>s</i></div><span>time</span></div>
    </div>
    <div class="tt-words" id="ttWords"></div>
    <div class="kb" id="ttKb"></div>
    <div class="tt-hint"><span><kbd>tab</kbd>restart</span><span><kbd>esc</kbd>close</span></div>
    <div class="tt-confirm">restart test? <kbd>Enter</kbd> to confirm - <kbd>Esc</kbd> cancel</div>
    <div class="tt-res">
      <div><div class="big" id="rWpm">0</div><div class="cap">words per minute</div></div>
      <div class="tt-grid"><div><b><span id="rAcc">0</span>%</b><label>accuracy</label></div><div><b id="rRaw">0</b><label>raw</label></div><div><b><span id="rTime">0</span>s</b><label>time</label></div></div>
      <button class="tt-btn" onclick="ttRestart()">-> try again</button>
    </div>
  </div>
</div>

<!-- â”€â”€â”€ guide cursor â”€â”€â”€ -->
<div id="gc" aria-hidden="true">
  <svg class="gc-arrow" viewBox="0 0 24 24"><path class="gc-rim" d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z"/><path class="gc-body" d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z"/></svg>
  <div class="gc-tag" id="gcTag"><span class="gc-name">Godie Banghal</span><div class="gc-text" id="gcText"></div></div>
</div>
<div id="gp"><button id="gpReplay">-> take the tour again</button><button id="gpClose" aria-label="Dismiss">x</button></div>
`;

export default portfolioMarkup;

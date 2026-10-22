(() => {
  const section = document.getElementById('minds');
  if (!section) return;

  /* ===== Settings ===== */
  const MAX_TILT = 16;     // degrees of rotation at the card edge
  const GLARE = true;      // moving light reflection
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Your content: edit the people here ===== */
  const MINDS = [
    { role: 'Content & Social Media Lead', name: 'Kanav Kapur', bio: 'FY Student at MAIMS and\nIIM Bangalore (BBA DBE)', quote: 'Bigger possibilities.', image: './assets/minds-portraits/kanav-kapur.jpg',
      angle: -9, y: 30, z: 2, ps: 118, px: 118, py: 46, c1: '#e2a5ff', c2: '#9b42d1', c3: '#211033', glow: 'rgba(178,0,237,.55)', texture: './assets/planet-01-violet.jpg', cardTop: '#27113A', cardMid: '#14091F', cardBottom: '#08050F', cardGlow: 'rgba(157,65,230,.24)', cardBorder: 'rgba(177,114,235,.55)', cardBorderStrong: 'rgba(222,178,255,.9)', cardHalo: 'rgba(178,0,237,.32)', orbitColor: 'rgba(193,133,244,.26)', rim: '#B200ED', hair: 'curly', glasses: true, delay: 0 },
    { role: 'Marketing and Sales Head', name: 'Ansh Kumar', bio: 'BALLB first year student at MAIMS\nCommunication and Media Specialist', quote: 'Keeping us in orbit.', image: './assets/minds-portraits/ansh-kumar.jpg',
      angle: -5, y: 10, z: 3, ps: 84, px: 146, py: 38, c1: '#c17bff', c2: '#7025aa', c3: '#1b0b2c', glow: 'rgba(217,91,128,.34)', texture: './assets/planet-02-mars.jpg', cardTop: '#2A122A', cardMid: '#160A1D', cardBottom: '#08050F', cardGlow: 'rgba(196,68,113,.20)', cardBorder: 'rgba(185,95,204,.43)', cardBorderStrong: 'rgba(226,158,255,.82)', cardHalo: 'rgba(196,68,113,.28)', orbitColor: 'rgba(190,109,220,.25)', rim: '#D36CFF', hair: 'curly', glasses: true, rocks: 34, delay: -1.2 },
    { role: 'The Founder', name: 'Prakhar Mundra', bio: 'FY Student at MAIMS\nBusiness & Strategy Enthusiast', quote: "Building what's next.", image: './assets/minds-portraits/prakhar-mundra.jpg',
      angle: -1, y: -14, z: 5, ps: 96, px: 72, py: 50, c1: '#f0c7ff', c2: '#a85ee0', c3: '#2c1246', glow: 'rgba(218,166,255,.42)', texture: './assets/planet-03-saturn.jpg', cardTop: '#2D1740', cardMid: '#170C24', cardBottom: '#080510', cardGlow: 'rgba(205,138,255,.27)', cardBorder: 'rgba(195,142,239,.58)', cardBorderStrong: 'rgba(231,205,255,.92)', cardHalo: 'rgba(178,0,237,.31)', orbitColor: 'rgba(215,170,255,.28)', rim: '#C58CFF', ring: true, hair: 'curly', delay: -2.4 },
    { role: 'Full Stack Developer', name: 'Baibhaw Kumar Upadhyay', bio: 'B.Tech CSE Second - Year Student At MAIT', quote: 'Beauty in function.', image: './assets/minds-portraits/Baibhaw-kumar-upadhyay.jpg',
      angle: 2, y: 4, z: 4, ps: 130, px: 70, py: 34, c1: '#dce7ff', c2: '#627fcb', c3: '#101a3a', glow: 'rgba(103,139,255,.42)', texture: './assets/planet-04-blue.jpg', cardTop: '#132543', cardMid: '#0B1328', cardBottom: '#060A13', cardGlow: 'rgba(75,130,236,.24)', cardBorder: 'rgba(120,155,237,.45)', cardBorderStrong: 'rgba(174,202,255,.9)', cardHalo: 'rgba(75,130,236,.31)', orbitColor: 'rgba(133,173,255,.24)', rim: '#83B0FF', hair: 'curly', delay: -3.6 },
    { role: 'Informal Strategic Advisor', name: 'Pragya Mundra', bio: 'B.Tech graduate,\nAI/ML Developer at Vodafone', quote: 'Ideas into orbits.', image: './assets/minds-portraits/pragya-mundra.jpg',
      angle: 6, y: 26, z: 3, ps: 120, px: 116, py: 28, c1: '#f0eaff', c2: '#9a8bc0', c3: '#21172e', glow: 'rgba(190,180,220,.32)', texture: './assets/planet-05-lunar.jpg', cardTop: '#282039', cardMid: '#13101F', cardBottom: '#08060E', cardGlow: 'rgba(191,184,225,.18)', cardBorder: 'rgba(175,153,209,.42)', cardBorderStrong: 'rgba(222,211,255,.88)', cardHalo: 'rgba(157,133,204,.24)', orbitColor: 'rgba(182,171,223,.22)', rim: '#C7B8E8', craters: true, hair: 'bun', delay: -4.8 },
    { role: 'UI/UX Designer', name: 'Siddhant Singh', bio: 'FY Student, BTech at MAIT', quote: 'Always further.', image: './assets/minds-portraits/siddhant-singh.jpg',
      angle: 9, y: 46, z: 2, ps: 130, px: 98, py: 40, c1: '#df9cff', c2: '#8f2bc2', c3: '#1c0733', glow: 'rgba(178,0,237,.52)', texture: './assets/planet-06-magenta.jpg', cardTop: '#2D1040', cardMid: '#170A24', cardBottom: '#08050F', cardGlow: 'rgba(178,0,237,.30)', cardBorder: 'rgba(191,94,239,.55)', cardBorderStrong: 'rgba(229,169,255,.92)', cardHalo: 'rgba(178,0,237,.34)', orbitColor: 'rgba(194,120,245,.25)', rim: '#B200ED', hair: 'wavy', delay: -6 }
  ];

  /* ===== Small SVG helpers (seeded, so the stars never change between loads) ===== */
  const f1 = n => Math.round(n * 10) / 10;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // many circles as one SVG path: [[cx, cy, r], ...]
  function dots(list) {
    return list.map(([x, y, r]) =>
      `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`).join('');
  }
  const circle = (cx, cy, r) => dots([[cx, cy, r]]);
  const sparkle = (x, y, s) =>
    `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

  const HAIR = {
    curly: [[96,80,15],[112,66,16],[130,62,15],[147,68,13],[86,98,15],[91,114,13],[103,88,16],[121,78,16],[139,79,12],[84,80,12],[101,60,12],[122,55,12],[143,59,10],[80,104,10]],
    bun:   [[100,74,16],[118,64,16],[137,68,14],[95,94,14],[110,82,18],[128,78,14],[78,88,14],[74,80,10]],
    wavy:  [[96,84,16],[114,68,17],[133,64,15],[148,70,12],[88,102,15],[86,122,12],[92,138,9],[106,90,16],[124,80,15],[142,80,11],[80,88,12]]
  };
  const RIM = '#b45cff';

  /* ===== Page background stars ===== */
  (() => {
    const r = rng(42), list = [];
    for (let i = 0; i < 170; i++) list.push([r() * 1440, r() * 900, 0.4 + r() * 0.9]);
    section.querySelector('#sky-stars').setAttribute('d', dots(list));
    section.querySelector('#sky-sparkles').setAttribute('d',
      sparkle(789, 80, 15) + sparkle(262, 158, 6) + sparkle(1085, 268, 5) +
      sparkle(150, 560, 5) + sparkle(1330, 640, 6) + sparkle(640, 820, 5));
  })();

  /* ===== Build one card ===== */
  function cardHTML(m, i) {
    const r = rng(100 + i * 17), stars = [];
    for (let k = 0; k < 46; k++) stars.push([r() * 240, r() * 330, 0.45 + r() * 0.75]);

    const cx = m.px + m.ps / 2, cy = m.py + m.ps / 2;
    const orbits = circle(cx, cy, m.ps * 0.8) + circle(cx, cy, m.ps * 1.3) + circle(cx, cy, m.ps * 1.85) +
                   `M0 ${f1(cy)}H240M${f1(cx)} 0V400`;

    const hr = rng(300 + i * 29);
    const hair = dots(HAIR[m.hair].map(([x, y, rad]) => [x + (hr() - .5) * 5, y + (hr() - .5) * 5, rad * (.9 + hr() * .2)]));

    const rim = m.rim || RIM;

    let rocks = '';
    if (m.rocks) {
      const rr = rng(77), list = [];
      for (let k = 0; k < m.rocks; k++) list.push([rr() * 240, 20 + rr() * 190, 1.5 + rr() * 5.5]);
      rocks = dots(list);
    }

    const planetTexture = m.texture ? `url("${m.texture}")` : `radial-gradient(circle at 30% 28%, ${m.c1} 0%, ${m.c2} 46%, ${m.c3} 100%)`;

    const rw = m.ps * 2.6, rh = m.ps * 0.56;
    const ringStyle = `left:${f1(cx - rw / 2)}px;top:${f1(cy - rh / 2)}px;width:${f1(rw)}px;height:${f1(rh)}px`;

    return `
<span class="float" style="--delay:${m.delay}s">
 <span class="tilt">
  <span class="face">
    <svg width="240" height="400" viewBox="0 0 240 400" aria-hidden="true">
      <path d="${dots(stars)}" fill="#eadfff" fill-opacity=".76"/>
      <path d="${orbits}" fill="none" stroke="${m.orbitColor || 'rgba(174,121,226,.30)'}" stroke-width=".7"/>
    </svg>

    ${m.ring ? `<span class="ring back" style="${ringStyle}"></span>` : ''}
    <span class="planet" style="left:${m.px}px;top:${m.py}px;width:${m.ps}px;height:${m.ps}px;--planet-texture:${planetTexture};--glow:${m.glow}"></span>
    ${m.ring ? `<span class="ring front" style="${ringStyle}"></span>` : ''}
    ${m.rocks ? `<svg class="rocks" width="240" height="400" viewBox="0 0 240 400" aria-hidden="true"><path d="${rocks}" fill="#090511" stroke="${rim}" stroke-opacity=".62" stroke-width=".7"/></svg>` : ''}

    <img class="person-photo" src="${esc(m.image)}" alt="" loading="eager" draggable="false">

    <span class="fade"></span>
    <span class="glare"></span>
  </span>

  <span class="top">
    <span class="mind-no">MIND ${String(i + 1).padStart(2, '0')}</span>
    <span class="badge"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 0Q7.6 6.4 14 7Q7.6 7.6 7 14Q6.4 7.6 0 7Q6.4 6.4 7 0Z" fill="#eadfff"/></svg></span>
  </span>

  <span class="info">
    <span class="role-row">
      <span class="role">${esc(m.role)}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 9.5L9.5 2.5M3.5 2.5H9.5V8.5" fill="none" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span class="rule"></span>
    <span class="name">${esc(m.name)}</span>
    <span class="bio">${esc(m.bio)}</span>
    <span class="quote">“${esc(m.quote)}”</span>
  </span>
 </span>
</span>`;
  }

  /* ===== Mount cards + tilt behaviour ===== */
  const deck = section.querySelector('#deck');
  const statusText = section.querySelector('#status-text');
  const cards = [];
  let selected = null;

  if (!GLARE) document.documentElement.style.setProperty('--glare', '0');

  MINDS.forEach((m, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.setAttribute('aria-label', `Mind ${i + 1}, ${m.role}, ${m.name}`);
    card.style.cssText = `--y:${m.y}px;--base:${m.angle}deg;--z:${m.z};--card-top:${m.cardTop || '#241039'};--card-mid:${m.cardMid || '#13091f'};--card-bottom:${m.cardBottom || '#08050f'};--card-glow:${m.cardGlow || 'rgba(178,0,237,.22)'};--card-border:${m.cardBorder || 'rgba(177,114,235,.45)'};--card-border-strong:${m.cardBorderStrong || 'rgba(222,178,255,.85)'};--card-halo:${m.cardHalo || 'rgba(178,0,237,.3)'};--card-orbit:${m.orbitColor || 'rgba(193,133,244,.26)'};--card-rim:${m.rim || '#B200ED'}`;
    card.innerHTML = cardHTML(m, i);
    const portrait = card.querySelector('.person-photo');
    portrait?.addEventListener('error', () => { portrait.classList.add('person-photo--missing'); portrait.removeAttribute('src'); }, { once: true });
    deck.appendChild(card);
    cards.push(card);

    let raf = 0, px = 0, py = 0;

    // cursor/finger position inside the card, -1 (left/top) .. +1 (right/bottom)
    function apply() {
      raf = 0;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = clamp(((px - rect.left) / rect.width - .5) * 2, -1, 1);
      const ny = clamp(((py - rect.top) / rect.height - .5) * 2, -1, 1);
      const s = card.style;
      card.classList.add('is-active');
      s.setProperty('--nx', nx.toFixed(3));
      s.setProperty('--ny', ny.toFixed(3));
      s.setProperty('--rx', reduceMotion ? '0deg' : (-ny * MAX_TILT * .85).toFixed(2) + 'deg');
      s.setProperty('--ry', reduceMotion ? '0deg' : (nx * MAX_TILT).toFixed(2) + 'deg');
      s.setProperty('--gx', ((nx + 1) * 50).toFixed(1) + '%');
      s.setProperty('--gy', ((ny + 1) * 50).toFixed(1) + '%');
    }
    function move(e) {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }
    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      card.classList.remove('is-active');
      ['--nx', '--ny', '--rx', '--ry', '--gx', '--gy'].forEach(p => card.style.removeProperty(p));
    }

    card.addEventListener('pointerenter', move);
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    card.addEventListener('focus', () => { if (card.matches(':focus-visible')) card.classList.add('is-active'); });
    card.addEventListener('blur', reset);

    card.addEventListener('click', () => {
      selected = selected === i ? null : i;
      cards.forEach((c, k) => c.classList.toggle('is-selected', k === selected));
      statusText.classList.toggle('picked', selected !== null);
      statusText.textContent = selected === null
        ? 'SELECT A CARD TO DISCOVER MORE'
        : `MIND ${String(i + 1).padStart(2, '0')} · ${MINDS[i].role.toUpperCase()}`;
    });
  });
})();

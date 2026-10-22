/*
 * SECTION 03 -> SECTION 04: purple laser transition + radial reveal.
 * Extracted/adapted from the supplied the-minds-laser HTML.
 * Uses OGL from esm.sh (no React/npm install required).
 */
(async function initMindsTransition() {
  const mindsSection = document.getElementById('minds');
  if (!mindsSection) return;

  const enableFallback = () => mindsSection.classList.add('tcp-minds-transition--fallback');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Repair the navbar target at runtime. This also supports navs whose visible label is
  // "THE MINDS" / "MEET THE MINDS" but whose original href points at an old demo anchor.
  document.addEventListener('click', (event) => {
    const target = event.target && event.target.closest
      ? event.target.closest('a, button, [role="link"], [data-target], [data-section]')
      : null;
    if (!target) return;

    const label = `${target.textContent || ''} ${target.getAttribute('aria-label') || ''}`
      .replace(/\s+/g, ' ').trim().toLowerCase();
    const href = (target.getAttribute('href') || '').toLowerCase();
    const targetHint = `${target.getAttribute('data-target') || ''} ${target.getAttribute('data-section') || ''}`.toLowerCase();
    const isMindsNavigation = href.includes('#minds') || targetHint.includes('minds') ||
      label === 'the minds' || label === 'meet the minds' || /\bthe minds\b/.test(label);
    if (!isMindsNavigation) return;

    event.preventDefault();
    if (target.tagName === 'A') target.setAttribute('href', '#minds');

    try {
      if (window.location.hash !== '#minds') {
        window.history.pushState({ tcpMindsNavigation: true }, '', `${window.location.pathname}${window.location.search}#minds`);
      }
    } catch (_) { /* The page may be running from file://; scrolling still works. */ }

    const rect = mindsSection.getBoundingClientRect();
    const alreadyAtMinds = rect.top <= 2 && rect.bottom >= window.innerHeight * 0.2;

    if (alreadyAtMinds && typeof window.__tcpReplayMindsTransition === 'function') {
      window.__tcpReplayMindsTransition();
    } else {
      window.__tcpMindsNavTransitionPending = true;
    }

    mindsSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, true);

  window.addEventListener('hashchange', () => {
    if (window.location.hash.toLowerCase() === '#minds') {
      mindsSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });

  if (reducedMotion) {
    enableFallback();
    return;
  }

  try {
    const { Renderer, Program, Mesh, Triangle, Texture } = await import('https://esm.sh/ogl@1.0.11');

    const LASER = {
      color: '#B200ED', intensity: 1.8, flare: 1.5, spread: 1.5,
      spill: 1, fog: 0.2, dust: 1.6, revealOpacity: 0
    };
    const hex = value => [1, 3, 5].map(index => parseInt(value.slice(index, index + 2), 16) / 255);
    const clamp01 = value => Math.min(Math.max(value, 0), 1);
    const ease = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };

    const image = new Image();
    image.src = new URL('../assets/minds-transition-empty.png', import.meta.url).href;
    await new Promise((resolve, reject) => {
      if (image.complete && image.naturalWidth) return resolve();
      image.onload = resolve;
      image.onerror = () => reject(new Error('Could not load the transparent Minds transition texture.'));
    });

    const canvas = document.createElement('canvas');
    canvas.id = 'tcp-minds-laser-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:40;pointer-events:none;';
    document.body.appendChild(canvas);

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      alpha: true,
      premultipliedAlpha: true,
      antialias: false
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const texture = new Texture(gl, {
      flipY: false,
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    });
    texture.image = image;
    texture.update();

    const vertex = `#version 300 es
      in vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

    /* Purple LaserFlow shader copied from the supplied source's reveal module. */
    const fragment = `#version 300 es
      precision highp float;
      uniform vec2 uRes; uniform float uDpr, uTime;
      uniform vec3 uColor;
      uniform float uIntensity, uFlare, uSpread, uSpill, uFog, uDust, uRevealOpacity;
      uniform float uBeamX, uStartY, uEndY, uHead;
      uniform float uMoonGlow, uReveal, uRevealMax;
      uniform float uJag, uFlash, uPulse, uTip, uFade;
      uniform vec2 uImg; uniform vec3 uFit; uniform vec2 uRect;
      uniform sampler2D tImg;
      out vec4 fragColor;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
                   mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0., a = .5;
        for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= .5; }
        return v;
      }

      void main() {
        vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
        float x = p.x - uBeamX, y = p.y;
        float t = clamp((y - uStartY) / max(uEndY - uStartY, 1.), 0., 1.);
        float xj = x - (fbm(vec2(y * .018, floor(uTime * 24.))) - .5) * 2. * uJag
          * smoothstep(0., .08, t) * (1. - smoothstep(.93, 1., t));
        float inBeam = smoothstep(uStartY, uStartY + 30., y) * (1. - smoothstep(uHead - 40., uHead + 4., y));
        float w = 2.5 * mix(11. * uSpread * uFlare * .5, 2.5, pow(t, .5));
        float flick = .72 + .55 * fbm(vec2(x * .04, y * .012 - uTime * 1.6));
        float core = exp(-xj * xj / (w * w)) * flick;
        float glow = exp(-abs(xj) / (w * 7.)) * (.35 + uFog);
        float beam = (core * 1.4 + glow) * inBeam * (.6 + .4 * (1. - t)) * uIntensity * uPulse;

        float src = exp(-abs(y - uStartY) / 40.) * exp(-abs(x) / (200. * uSpill)) * .5 * uIntensity;
        src *= step(.0001, uHead - uStartY) * step(uStartY, y + 20.);

        vec2 m = p - vec2(uBeamX, uEndY);
        float halo = (exp(-length(m) / 46.) * .9 + exp(-length(m) / 160.) * .25) * uMoonGlow * uIntensity;
        vec2 g = floor((p + vec2(0., uTime * 14.)) / 7.);
        float star = step(.9935 - .004 * uDust, hash(g));
        float tw = .5 + .5 * sin(uTime * 3. + hash(g + 4.) * 6.28);
        float dust = star * tw * exp(-abs(x) / 140.) * inBeam * uDust * 1.4;

        vec3 col = uFade * (uColor * (beam + src + halo + dust)
          + vec3(1., .9, 1.) * (core * inBeam * .5 + exp(-length(m) / 14.) * uMoonGlow * .6));

        vec2 uv = (p - uFit.xy) / (uImg * uFit.z);
        vec3 art = texture(tImg, clamp(uv, 0., 1.)).rgb;
        float inStage = step(uRect.x, y) * step(y, uRect.x + uRect.y);
        float d = distance(p, vec2(uBeamX, uEndY)) + (fbm(p * .012 + 3.) - .5) * 160.;
        float mask = (1. - smoothstep(uReveal * uRevealMax * .82, uReveal * uRevealMax, d))
          * step(.0001, uReveal) * inStage;
        vec3 rim = uColor * exp(-abs(d - uReveal * uRevealMax * .9) / 28.) * .6
          * step(.0001, uReveal) * (1. - uReveal * .7) * inStage;

        col += vec3(1., .85, 1.) * exp(-length(vec2(xj, y - uHead)) / 26.) * uTip;
        col += (uColor * .7 + .3) * uFlash * uFade * .55;
        col += rim;
        col = 1. - exp(-col * 1.15);
        float a = clamp(max(mask * uRevealOpacity, max(col.r, max(col.g, col.b))), 0., 1.);
        col = min(col + art * mask * uRevealOpacity, 1.);
        fragColor = vec4(col, a);
      }
    `;

    const U = {
      uRes: { value: [1, 1] }, uDpr: { value: 1 }, uTime: { value: 0 }, uColor: { value: hex(LASER.color) },
      uIntensity: { value: LASER.intensity }, uFlare: { value: LASER.flare }, uSpread: { value: LASER.spread },
      uSpill: { value: LASER.spill }, uFog: { value: LASER.fog }, uDust: { value: LASER.dust }, uRevealOpacity: { value: LASER.revealOpacity },
      uBeamX: { value: 0 }, uStartY: { value: 0 }, uEndY: { value: 0 }, uHead: { value: 0 },
      uMoonGlow: { value: 0 }, uReveal: { value: 0 }, uRevealMax: { value: 1 },
      uJag: { value: 0 }, uFlash: { value: 0 }, uPulse: { value: 1 }, uTip: { value: 0 }, uFade: { value: 1 },
      uImg: { value: [image.naturalWidth, image.naturalHeight] }, uFit: { value: [0, 0, 1] },
      uRect: { value: [0, window.innerHeight] }, tImg: { value: texture }
    };

    const mesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, { vertex, fragment, uniforms: U })
    });

    const resize = () => {
      const width = window.innerWidth, height = window.innerHeight;
      renderer.setSize(width, height);
      U.uRes.value = [width * renderer.dpr, height * renderer.dpr];
      U.uDpr.value = renderer.dpr;
      U.uRevealMax.value = Math.hypot(width, height) * 1.1;
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    let strike = null;
    let raf = 0;
    let wasInTriggerBand = false;
    let hasPlayedEntryTransition = false;
    let lastScrollY = window.scrollY;
    let firstFrameChecked = false;
    const STRIKE_MS = 380;

    // The effect is unchanged; only its permitted triggers are controlled here.
    const triggerTransition = (now = performance.now()) => {
      strike = now;
      hasPlayedEntryTransition = true;
      mindsSection.style.setProperty('--tcp-minds-reveal-radius', '0px');
    };

    // Explicit navbar navigation may replay the effect.
    window.__tcpReplayMindsTransition = (now = performance.now()) => {
      window.__tcpMindsNavTransitionPending = false;
      triggerTransition(now);
    };

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const W = window.innerWidth, H = window.innerHeight;
      U.uTime.value = now / 1000;

      const stageRect = mindsSection.getBoundingClientRect();
      const imageWidth = U.uImg.value[0], imageHeight = U.uImg.value[1];
      const fit = Math.max(W / imageWidth, H / imageHeight);
      const ox = (W - imageWidth * fit) / 2;
      const oy = stageRect.top + (H - imageHeight * fit) / 2;
      U.uFit.value = [ox, oy, fit];
      U.uRect.value = [stageRect.top, stageRect.height];

      // Allowed triggers:
      // 1. First downward entry into Minds from the page above (Output).
      // 2. Explicit navigation using the Minds navbar link.
      // 3. A fresh page load resets this per-page state.
      // Ordinary scrolling back into Minds must not replay the effect.
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY + 1;
      const inTriggerBand = stageRect.top <= 2 && stageRect.bottom >= H * 0.2;
      const enteredTriggerBand = inTriggerBand && !wasInTriggerBand;
      const directNavPending = window.__tcpMindsNavTransitionPending === true;
      const restoredIntoMinds = !firstFrameChecked && inTriggerBand;

      if (directNavPending && inTriggerBand) {
        window.__tcpMindsNavTransitionPending = false;
        triggerTransition(now);
      } else if (
        !hasPlayedEntryTransition &&
        (restoredIntoMinds || (enteredTriggerBand && scrollingDown))
      ) {
        triggerTransition(now);
      }

      firstFrameChecked = true;
      wasInTriggerBand = inTriggerBand;
      lastScrollY = currentScrollY;

      const startY = -24, endY = H;
      const elapsed = strike === null ? -1 : now - strike;
      const progress = elapsed < 0 ? 0 : clamp01(elapsed / STRIKE_MS);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      U.uBeamX.value = W / 2;
      U.uStartY.value = startY;
      U.uEndY.value = endY;
      U.uHead.value = startY + (endY - startY) * easedProgress + 60 * easedProgress;
      const sinceImpact = elapsed < 0 ? -1 : (elapsed - STRIKE_MS) / 1000;
      U.uTip.value = elapsed >= 0 && sinceImpact < .05 ? 1 : 0;
      U.uJag.value = 0;
      U.uFlash.value = sinceImpact < 0 ? 0 : Math.exp(-sinceImpact * 9);
      U.uPulse.value = 1;
      const t = sinceImpact < 0 ? -1 : sinceImpact;
      U.uMoonGlow.value = ease(t / .8);
      U.uReveal.value = ease((t - .4) / 3.2);
      const liveRevealRadius = U.uReveal.value * Math.hypot(W, H) * 1.65;
      mindsSection.style.setProperty('--tcp-minds-reveal-radius', `${liveRevealRadius.toFixed(1)}px`);
      U.uFade.value = t < 0 ? 1 : 1 - ease(t / .3);
      renderer.render({ scene: mesh });
    }

    mindsSection.style.setProperty('--tcp-minds-reveal-radius', '0px');
    mindsSection.classList.remove('tcp-minds-transition--fallback');
    raf = requestAnimationFrame(frame);

    // Keep a reference for page teardown/hot reload if needed.
    window.__tcpMindsTransitionCleanup = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
      mindsSection.classList.remove('tcp-minds-transition--fallback');
      if (window.__tcpReplayMindsTransition === triggerTransition) delete window.__tcpReplayMindsTransition;
    };
  } catch (error) {
    console.error('[TCP Minds transition] WebGL laser could not start; revealing the live Minds cards without the laser.', error);
    enableFallback();
  }
})();

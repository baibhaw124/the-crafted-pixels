
import { Renderer, Program, Mesh, Triangle, Plane, Texture, RenderTarget } from 'https://esm.sh/ogl@1.0.11';

// Project screenshots are local assets inside C:/TCP/P2/assets.

// ---- Your carousel items: swap these for your own images -------------------
const items = [
  {
    src: './assets/project-khetrakshak.png',
    alt: 'Khetrakshak AI crop health monitoring dashboard preview',
    title: 'Khetrakshak AI',
    subtitle: 'Agriculture / AI',
    category: 'AGRICULTURE / ARTIFICIAL INTELLIGENCE',
    description: 'An agricultural decision-support platform that analyzes plant-leaf images to predict possible crop diseases, assess risk, and provide treatment and prevention guidance.',
    features: [
      'Upload a plant-leaf image for AI-assisted crop disease detection.',
      'Validate leaf images before disease prediction.',
      'Review prediction confidence, risk level, symptoms, and severity.',
      'Explore treatment recommendations, prevention guidance, alerts, and risk maps.'
    ],
    tech: ['React', 'Vite', 'FastAPI', 'TensorFlow / Keras', 'Python'],
    liveUrl: 'https://khetrakshak-ai.vercel.app/',
    repoUrl: 'https://github.com/baibhaw124/Khetrakshak-AI',
    linkLabel: 'Visit live project'
  },
  {
    src: './assets/project-fit-bro.png',
    alt: 'FIT_BRO fitness platform homepage preview',
    title: 'FIT_BRO',
    subtitle: 'Fitness / Booking Platform',
    category: 'FITNESS / SESSION BOOKING',
    description: 'A full-stack gym platform for members to discover training sessions, book places, manage their bookings, and join a waitlist when sessions are full.',
    features: [
      'Member registration, login, and authenticated access.',
      'Browse sessions with remaining-seat information.',
      'Book or cancel a session, with waitlist promotion when capacity opens.',
      'Admin tools for session management and check-in.'
    ],
    tech: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL'],
    liveUrl: 'https://fit-bro-delta.vercel.app/',
    repoUrl: 'https://github.com/baibhaw124/FIT_BRO',
    linkLabel: 'Visit live project'
  },
  {
    src: './assets/project-stream-hub.svg',
    alt: 'Stream Hub live television and video-on-demand project preview',
    title: 'Stream Hub',
    subtitle: 'Entertainment / Streaming',
    category: 'ENTERTAINMENT / LIVE TV & VOD',
    description: 'A responsive, frontend-based streaming platform for browsing live TV channels, movies, and shows with category filtering, search, and an in-page player.',
    features: [
      'Browse live-TV channels and video-on-demand content.',
      'Filter by category and search available content.',
      'Use a modal video player with playlist navigation.',
      'Support HLS, DASH, and MP4 playback through web-player libraries.'
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'HLS.js', 'DASH.js'],
    liveUrl: '',
    repoUrl: 'https://github.com/baibhaw124/-Stream-Hub-Live-TV-Streaming-Platform',
    linkLabel: 'Visit live project'
  },
  {
    src: './assets/project-swad-mahal.jpg',
    alt: 'Swad Mahal pure vegetarian Indian and Chinese restaurant website preview',
    title: 'Swad Mahal',
    subtitle: 'Restaurant / Food & Hospitality',
    category: 'FOOD & HOSPITALITY / RESTAURANT WEBSITE',
    description: 'A restaurant website for Swad Mahal, a pure-vegetarian Indian and Chinese restaurant in Shakarpur, Delhi, showcasing food categories, offers, ordering, and WhatsApp contact.',
    features: [
      'Showcase Indian and Chinese menu categories and restaurant offers.',
      'Provide navigation for ordering, contact, and WhatsApp enquiries.',
      'Highlight delivery within 2 KM and a minimum order of ₹100.',
      'Display the restaurant hours shown in the supplied preview: 11:00 AM–11:00 PM.'
    ],
    tech: [],
    liveUrl: '',
    repoUrl: '',
    linkLabel: 'Visit live project'
  }
];

// ---- Carousel options (same as your config) --------------------------------
const options = {
  preset: 'liquid',
  intro: 'flow',        // project cards flow in diagonally, as in the reference
  fit: 'landscape',     // wide rectangular cards for project previews
  cardHeight: 0.74,
  gap: 16,
  radius: 10,
  squeeze: 0.08,
  focusOnClick: false,
  captions: false,     // project name and live link use the larger HTML info panel below
  drift: 0,             // keep the active project steady until the visitor interacts
  // Vertical wheel/trackpad movement is handled at the whole Output section,
  // so it works over the background, project title, and cards—not only the canvas.
  captureWheel: false
};

// The carousel rises once the image has fully settled (end of its flash animation).
// This is only a safety fallback in case that animation event never fires (ms).
const FALLBACK_DELAY = window.matchMedia('(max-width: 760px)').matches ? 2200 : 4400;

const BEND_PRESETS = {
  liquid: {
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    roundness: 1,
    bend: 0.34,
    reach: 0.38,
    curl: 'twist',
    dispersion: 0.45,
    liquid: 0,
    followCursor: false
  },
  ribbon: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.34,
    reach: 0.34,
    curl: 'twist',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  },
  vortex: {
    lensWidth: 0.7,
    lensHeight: 0.95,
    tilt: 30,
    roundness: 1,
    bend: 0.46,
    reach: 0.3,
    curl: 'twist',
    dispersion: 0.5,
    liquid: 0,
    followCursor: false
  },
  arch: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.3,
    reach: 0.36,
    curl: 'rise',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  }
};

const FIT_ASPECT = { portrait: 0.75, square: 1, landscape: 1.6 }; // widescreen project cards
const TAPS = 12;
const PIXEL_BUDGET = 4.5e6;
const INTRO_DURATION = { flow: 1.25, rise: 1.7, bloom: 1.3, spin: 1.7, deal: 1.2, fade: 0.25 };

const wrap = (value, size) => ((((value + size / 2) % size) + size) % size) - size / 2;
const clamp01 = value => Math.min(Math.max(value, 0), 1);
const easeOut = value => 1 - Math.pow(1 - clamp01(value), 3);
const easeOutQuint = value => 1 - Math.pow(1 - clamp01(value), 5);
const easeInOut = value => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const cardVertex = `#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`;

const cardFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uShift;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`;

const lensVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const lensFragment = `#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
uniform float uSceneAlpha;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);

  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;

  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));

  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${TAPS}; i++) {
      float s = (float(i) + 0.5) / float(${TAPS});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }

  fragColor = color * uSceneAlpha;
}
`;


function FlexCarousel(container, props) {
  const {
    items = [],
    preset = 'liquid',
    intro = 'rise',
    cardHeight = 0.5,
    gap = 12,
    radius = 0,
    fit = 'natural',
    squeeze = 0.2,
    focusOnClick = true,
    autoplay = false,
    interval = 4,
    drift = 0,
    captions = true,
    captureWheel = true,
    onChange,
    onSelect
  } = props;

  const base = BEND_PRESETS[preset] || BEND_PRESETS.liquid;
  const list = items;

  const itemsRef = { current: list };
  const callbacksRef = { current: { onChange, onSelect } };
  const settingsRef = {
    current: {
      intro, cardHeight, gap, radius, fit,
      lensWidth: base.lensWidth, lensHeight: base.lensHeight, tilt: base.tilt,
      roundness: base.roundness, bend: base.bend, reach: base.reach, curl: base.curl,
      dispersion: base.dispersion, liquid: base.liquid, followCursor: base.followCursor,
      squeeze, focusOnClick, autoplay, interval, drift, captureWheel
    }
  };
  const engineRef = { current: null };

  // ---- DOM (replaces the React render) -------------------------------------
  container.classList.add('flex-carousel');
  container.setAttribute('role', 'region');
  container.setAttribute('aria-roledescription', 'carousel');
  container.setAttribute('aria-label', 'Image carousel');
  container.tabIndex = 0;
  container.style.setProperty('--flex-carousel-half', `${Math.min(Math.max(cardHeight, 0.05), 1) * 50}%`);

  const live = document.createElement('div');
  live.className = 'flex-carousel__live';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  container.appendChild(live);

  // Each rendered WebGL preview gets a transparent native button above it.
  // This keeps cards genuinely clickable even when the liquid shader distorts pixels.
  const hitLayer = document.createElement('div');
  hitLayer.className = 'flex-carousel__hit-layer';
  hitLayer.setAttribute('aria-label', 'Project preview controls');
  container.appendChild(hitLayer);
  const hitTargets = new Map();

  const state = { active: 0, revealed: false, focusOpen: false };
  let caption = null, titleEl = null, countEl = null, reels = [];

  const buildCaption = () => {
    caption = document.createElement('div');
    caption.className = 'flex-carousel__caption';
    caption.setAttribute('aria-hidden', 'true');
    titleEl = document.createElement('span');
    countEl = document.createElement('span');
    countEl.className = 'flex-carousel__count';
    const digits = document.createElement('span');
    digits.className = 'flex-carousel__digits';
    reels = [0, 1].map(() => {
      const digit = document.createElement('span');
      digit.className = 'flex-carousel__digit';
      const reel = document.createElement('span');
      reel.className = 'flex-carousel__reel';
      '0123456789'.split('').forEach(n => {
        const s = document.createElement('span');
        s.textContent = n;
        reel.appendChild(s);
      });
      digit.appendChild(reel);
      digits.appendChild(digit);
      return reel;
    });
    const slash = document.createElement('span');
    slash.className = 'flex-carousel__slash';
    slash.textContent = '/';
    const total = document.createElement('span');
    total.textContent = String(list.length).padStart(2, '0');
    countEl.append(digits, slash, total);
    caption.append(titleEl, countEl);
    container.appendChild(caption);
  };

  const render = () => {
    const current = list[state.active] || list[0];
    const label = current ? current.title || current.alt || `Image ${state.active + 1}` : '';
    live.textContent = `${label}, ${state.active + 1} of ${list.length}`;
    if (!captions || !current || !state.revealed) return;
    if (!caption) buildCaption();
    // New element each time so the title animation replays (React used key={active})
    const next = document.createElement('span');
    next.className = 'flex-carousel__title';
    next.append(document.createTextNode(current.title || current.alt || ''));
    if (current.subtitle) {
      const sub = document.createElement('span');
      sub.className = 'flex-carousel__subtitle';
      sub.textContent = current.subtitle;
      next.appendChild(sub);
    }
    if (titleEl.dataset.key !== String(state.active)) {
      next.dataset.key = String(state.active);
      caption.replaceChild(next, titleEl);
      titleEl = next;
    }
    String(state.active + 1).padStart(2, '0').split('').forEach((d, i) => {
      reels[i].style.transform = `translateY(${-Number(d) * 10}%)`;
    });
    if (state.focusOpen) countEl.setAttribute('data-hidden', '');
    else countEl.removeAttribute('data-hidden');
  };

  const setActive = v => { state.active = v; render(); };
  const setRevealed = v => { state.revealed = v; render(); };
  const setFocusOpen = v => { state.focusOpen = v; render(); };

  // ---- WebGL engine (unchanged from the component) -------------------------
  const destroy = (() => {
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false
    });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return undefined;
    }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    container.prepend(canvas);

    const cardProgram = new Program(gl, {
      vertex: cardVertex,
      fragment: cardFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tMap: { value: new Texture(gl) },
        uRect: { value: [0, 0, 1, 1] },
        uResolution: { value: [1, 1] },
        uSize: { value: [1, 1] },
        uImage: { value: [1, 1] },
        uRadius: { value: 16 },
        uAlpha: { value: 1 },
        uReady: { value: 0 },
        uShift: { value: 0 },
        uDpr: { value: 1 },
        uPlaceholder: { value: [0.5, 0.5, 0.5] }
      }
    });
    cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });

    const target = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR_MIPMAP_LINEAR,
      magFilter: gl.LINEAR
    });

    const lensUniforms = {
      tScene: { value: target.texture },
      uResolution: { value: [1, 1] },
      uDpr: { value: 1 },
      uCenter: { value: [0, 0] },
      uHalf: { value: [1, 1] },
      uAngle: { value: 0 },
      uExponent: { value: 2 },
      uInner: { value: 60 },
      uOuter: { value: 80 },
      uFlow: { value: 0 },
      uCurl: { value: 0 },
      uDispersion: { value: 0 },
      uStrength: { value: 0 },
      uSceneAlpha: { value: 0 }
    };
    const lensMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: lensVertex,
        fragment: lensFragment,
        uniforms: lensUniforms,
        depthTest: false,
        depthWrite: false
      })
    });

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const anisotropy = renderer.getExtension('EXT_texture_filter_anisotropic') ? 8 : 0;

    let slots = [];
    let width = 1;
    let height = 1;
    let pos = 0;
    let vel = 0;
    let goal = 0;
    let mode = 'spring';
    let wheelAt = 0;
    let wheelGestureLockedUntil = 0;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let alive = true;
    let dirty = true;
    let activeIndex = -1;
    let interactedAt = -Infinity;
    let autoplayAt = performance.now();
    let hasFocus = false;
    let deform = 0;
    let deformVel = 0;
    let layout = null;
    let resnap = false;
    let hover = '';
    let hoveredInstanceKey = '';
    const hoverProgress = new Map();
    let lastPreviewSelection = { at: -Infinity, x: -10000, y: -10000, index: -1 };
    let lift = 1;
    let energy = 0;
    let lastPos = 0;
    const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false };
    const pointer = {
      x: 0,
      y: 0,
      over: false,
      down: false,
      id: -1,
      startX: 0,
      startY: 0,
      startPos: 0,
      dragging: false,
      touch: false,
      samples: []
    };
    const introState = { kind: 'none', t: 0, running: false, done: false, readyAt: 0 };
    const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
    let instances = [];

    const loadSlot = (item, index) => {
      const texture = new Texture(gl, {
        generateMipmaps: true,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR,
        anisotropy
      });
      const slot = {
        item,
        index,
        texture,
        aspect: 0.8,
        loaded: false,
        failed: false,
        ready: 0,
        color: [0.5, 0.5, 0.5],
        image: [1, 1],
        dispose: () => { }
      };
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.decoding = 'async';
      image.onload = () => {
        if (!alive || !slots.includes(slot)) return;
        texture.image = image;
        texture.update();
        slot.image = [image.naturalWidth || 1, image.naturalHeight || 1];
        slot.aspect = slot.image[0] / slot.image[1];
        try {
          const probe = document.createElement('canvas');
          probe.width = 8;
          probe.height = 8;
          const ctx = probe.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(image, 0, 0, 8, 8);
            const data = ctx.getImageData(0, 0, 8, 8).data;
            const avg = [0, 0, 0];
            for (let i = 0; i < data.length; i += 4) {
              avg[0] += data[i];
              avg[1] += data[i + 1];
              avg[2] += data[i + 2];
            }
            slot.color = avg.map(v => v / 64 / 255);
          }
        } catch {
          slot.color = [0.5, 0.5, 0.5];
        }
        slot.loaded = true;
        dirty = true;
        start();
      };
      image.onerror = () => {
        if (!alive) return;
        slot.failed = true;
        dirty = true;
        start();
      };
      image.src = item.src;
      slot.dispose = () => {
        image.onload = null;
        image.onerror = null;
        gl.deleteTexture(texture.texture);
      };
      return slot;
    };

    const setItems = next => {
      slots.forEach(slot => slot.dispose());
      slots = next.map(loadSlot);
      activeIndex = -1;
      layout = null;
      resnap = true;
      focus.target = 0;
      focus.t = 0;
      focus.v = 0;
      focus.pending = -1;
      setFocusOpen(false);
      introState.readyAt = performance.now();
      dirty = true;
      start();
    };

    const metrics = s => {
      const cardH = Math.max(24, s.cardHeight * height);
      const fixed = FIT_ASPECT[s.fit];
      const widths = slots.map(slot => (fixed || slot.aspect) * cardH);
      const centers = [];
      let cursor = 0;
      for (let i = 0; i < widths.length; i++) {
        centers.push(cursor + widths[i] / 2);
        cursor += widths[i] + s.gap;
      }
      return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
    };

    const nearest = (m, at) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < m.centers.length; i++) {
        const dist = Math.abs(wrap(m.centers[i] - at, m.loop));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };

    const snapPoint = (m, at) => {
      const i = nearest(m, at);
      return at + wrap(m.centers[i] - at, m.loop);
    };

    const remap = (from, to, at) => {
      const i = nearest(from, at);
      const offset = wrap(at - from.centers[i], from.loop);
      const cycles = Math.round((at - offset - from.centers[i]) / from.loop);
      return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i]);
    };

    const step = (m, delta) => {
      let at = snapPoint(m, goal);
      let index = nearest(m, at);
      const n = m.centers.length;
      for (let k = 0; k < Math.abs(delta); k++) {
        const next = (index + (delta > 0 ? 1 : n - 1)) % n;
        const distance =
          delta > 0
            ? m.widths[index] / 2 + m.gap + m.widths[next] / 2
            : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2);
        at += distance;
        index = next;
      }
      goal = at;
      mode = 'spring';
      dirty = true;
      start();
    };

    const goTo = (m, index) => {
      const i = ((index % m.centers.length) + m.centers.length) % m.centers.length;
      goal = goal + wrap(m.centers[i] - goal, m.loop);
      mode = 'spring';
      dirty = true;
      start();
    };

    const openFocus = index => {
      focus.index = index;
      focus.pending = -1;
      focus.target = 1;
      setFocusOpen(true);
      dirty = true;
      start();
    };

    const closeFocus = () => {
      focus.pending = -1;
      if (focus.target === 0) return false;
      focus.target = 0;
      setFocusOpen(false);
      dirty = true;
      start();
      return true;
    };

    const skipIntro = () => {
      if (introState.running) introState.t = 1;
    };

    const introEffects = () => {
      const t = introState.running ? introState.t : introState.done ? 1 : 0;
      const e = { sceneAlpha: 1, strength: 1, card: null };
      if (!introState.done && !introState.running) {
        e.sceneAlpha = 0;
        e.strength = 0;
        return e;
      }
      if (t >= 1) return e;
      const kind = introState.kind;
      if (kind === 'flow') {
        e.strength = easeInOut((t - 0.3) / 0.65);
        e.card = rel => {
          // Left-most cards lead, the rest follow in from the right
          const delay = clamp01((rel + width * 0.6) / (width * 1.2)) * 0.34;
          const local = clamp01((t - delay) / 0.6);
          const eased = easeOutQuint(local);
          return {
            alpha: clamp01(local * 4),
            x: (1 - eased) * width * 0.7,
            y: -(1 - eased) * height * 0.62,
            scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82)
          };
        };
      } else if (kind === 'rise') {
        e.strength = easeInOut((t - 0.3) / 0.65);
        e.card = rel => {
          const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34;
          const local = clamp01((t - delay) / 0.6);
          return {
            alpha: clamp01(local * 4),
            x: 0,
            y: (1 - easeOutQuint(local)) * height * 0.62,
            scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82)
          };
        };
      } else if (kind === 'bloom') {
        e.strength = easeInOut((t - 0.2) / 0.8);
        e.card = rel => {
          const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25;
          const local = easeOut((t - delay) / 0.55);
          return { alpha: local, x: 0, y: 0, scale: 0.92 + 0.08 * local };
        };
      } else if (kind === 'spin') {
        e.sceneAlpha = easeOut(t / 0.25);
        e.strength = easeOut((t - 0.55) / 0.45);
      } else if (kind === 'deal') {
        e.strength = easeOut((t - 0.45) / 0.5);
        e.card = rel => {
          const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3;
          const local = easeOut((t - 0.12 - spread) / 0.5);
          return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - local), y: 0, scale: 1 };
        };
      } else {
        e.sceneAlpha = easeOut(t);
        e.strength = easeOut(t);
      }
      return e;
    };

    const beginIntro = (s, m) => {
      const kind = reducedMotion && s.intro !== 'none' ? 'fade' : s.intro;
      introState.kind = INTRO_DURATION[kind] ? kind : 'none';
      introState.running = introState.kind !== 'none';
      introState.done = !introState.running;
      introState.t = 0;
      if (introState.done) setRevealed(true);
      if (introState.kind === 'spin') {
        const distance = m.loop * 1.6 + width;
        pos = goal + distance;
        vel = -distance * 3;
        mode = 'spring';
      }
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
      lensUniforms.tScene.value = target.texture;
      dirty = true;
      start();
    };

    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      if (!s || !slots.length) {
        if (visible) raf = requestAnimationFrame(frame);
        return;
      }

      const m = metrics(s);
      const n = slots.length;
      let animating = false;

      if (resnap) {
        goal = snapPoint(m, goal);
        pos = goal;
        vel = 0;
        resnap = false;
      } else if (layout && layout.loop !== m.loop) {
        pos = remap(layout, m, pos);
        goal = remap(layout, m, goal);
        pointer.startPos = pos + (pointer.x - pointer.startX);
        animating = true;
      }
      layout = m;

      if (!introState.running && !introState.done) {
        const allSettled = slots.every(slot => slot.loaded || slot.failed);
        if (allSettled || now - introState.readyAt > 1300) {
          goal = snapPoint(m, goal);
          pos = goal;
          beginIntro(s, m);
        }
      }
      if (introState.running) {
        introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1));
        if (introState.t >= 1) {
          introState.running = false;
          introState.done = true;
          setRevealed(true);
        }
        animating = true;
      }

      if (mode === 'wheel' && now - wheelAt > 150) {
        goal = snapPoint(m, goal);
        mode = 'spring';
      }
      if (!pointer.dragging) {
        const spinning = introState.running && introState.kind === 'spin';
        const stiffness = spinning ? 9 : mode === 'wheel' ? 80 : 55;
        const damping = 2 * Math.sqrt(stiffness);
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          const acc = stiffness * (goal - pos) - damping * vel;
          vel += acc * h;
          pos += vel * h;
        }
        if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
          pos = goal;
          vel = 0;
        } else {
          animating = true;
        }
      } else {
        animating = true;
      }

      if (Math.abs(pos) > m.loop * 8) {
        const shift = Math.round(pos / m.loop) * m.loop;
        pos -= shift;
        goal -= shift;
        pointer.startPos -= shift;
      }

      const current = nearest(m, pos);
      if (current !== activeIndex) {
        activeIndex = current;
        setActive(current);
        const activeItem = itemsRef.current[current];
        container.dispatchEvent(new CustomEvent('tcp-output-project-change', {
          detail: { index: current, item: activeItem }
        }));
        callbacksRef.current.onChange?.(current, activeItem);
      }

      if (focus.pending >= 0 && mode === 'spring' && Math.abs(goal - pos) < 1.5 && Math.abs(vel) < 30) {
        if (current === focus.pending) openFocus(current);
        else focus.pending = -1;
      }

      if (
        s.autoplay &&
        !reducedMotion &&
        introState.done &&
        focus.target === 0 &&
        focus.t < 0.01 &&
        !pointer.over &&
        !pointer.down &&
        !hasFocus &&
        mode === 'spring' &&
        Math.abs(goal - pos) < 1 &&
        now - interactedAt > 3000 &&
        now - autoplayAt > s.interval * 1000
      ) {
        autoplayAt = now;
        step(m, 1);
      }
      if (s.autoplay && !reducedMotion) animating = true;

      // Continuous drift: the strip keeps gliding on its own, like a video.
      // Pauses while hovering, dragging or viewing a focused card, and resumes shortly after.
      if (
        s.drift &&
        !reducedMotion &&
        introState.done &&
        focus.target === 0 &&
        focus.t < 0.01 &&
        !pointer.over &&
        !pointer.down &&
        mode === 'spring' &&
        now - interactedAt > 1500
      ) {
        goal += s.drift * Math.min(dt, 0.05);
        animating = true;
      }

      const travel = Math.abs(pos - lastPos) / dt;
      lastPos = pos;
      const energyTarget = reducedMotion ? 0 : Math.min(travel / 2600, 1);
      energy += (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.35)));
      if (energy > 0.001) animating = true;
      const liquidAmount = reducedMotion ? 0 : s.liquid;
      const push = Math.max(-1, Math.min(1, vel / 2200));
      const deformStiffness = 120;
      const deformDamping = 2 * Math.sqrt(deformStiffness) * 0.32;
      deformVel += (deformStiffness * (push - deform) - deformDamping * deformVel) * dt;
      deform += deformVel * dt;
      if (Math.abs(deform) > 0.0005 || Math.abs(deformVel) > 0.005) animating = true;

      const focusStiffness = 64;
      focus.v += (focusStiffness * (focus.target - focus.t) - 2 * Math.sqrt(focusStiffness) * focus.v) * dt;
      focus.t += focus.v * dt;
      if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) {
        focus.t = focus.target;
        focus.v = 0;
      } else {
        animating = true;
      }
      const focusAmount = clamp01(focus.t);
      const focusEase = easeInOut(focusAmount);
      const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH;
      const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW));
      const nextLift = 1 + (focusScale - 1) * focusEase;
      if (Math.abs(nextLift - lift) > 0.0005) {
        lift = nextLift;
        container.style.setProperty('--flex-carousel-lift', lift.toFixed(4));
      }

      const effects = introEffects();

      const homeX = width / 2;
      const homeY = height / 2;
      const follow = s.followCursor && pointer.over && !pointer.dragging && !pointer.touch && focus.target === 0;
      const aimX = follow ? pointer.x : homeX;
      const aimY = follow ? pointer.y : homeY;
      if (!lens.ready) {
        lens.x = homeX;
        lens.y = homeY;
        lens.ready = true;
      }
      const lensK = 110;
      const lensC = 2 * Math.sqrt(lensK) * 0.8;
      lens.vx += (lensK * (aimX - lens.x) - lensC * lens.vx) * dt;
      lens.vy += (lensK * (aimY - lens.y) - lensC * lens.vy) * dt;
      lens.x += lens.vx * dt;
      lens.y += lens.vy * dt;
      if (Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 || Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5)
        animating = true;

      const cardH = m.cardH;
      let halfW = (s.lensWidth * width) / 2;
      let halfH = (s.lensHeight * width) / 2;
      const squash = Math.abs(deform) * liquidAmount;
      halfW *= 1 + squash * 0.16;
      halfH *= 1 - squash * 0.08;
      const lensX = lens.x - deform * 14 * liquidAmount;

      for (let i = 0; i < n; i++) {
        const slot = slots[i];
        if (slot.loaded && slot.ready < 1) {
          slot.ready = Math.min(1, slot.ready + dt / 0.45);
          animating = true;
        }
      }

      const waiting = !introState.done;
      if (dirty || animating || pointer.dragging) {
        dirty = false;
        instances = [];
        const dpr = renderer.dpr;
        cardProgram.uniforms.uResolution.value = [width, height];
        cardProgram.uniforms.uDpr.value = dpr;
        cardProgram.uniforms.uRadius.value = s.radius;
        const shrink = 1 - clamp01(s.squeeze) * energy;
        const draws = [];
        for (let i = 0; i < n; i++) {
          const w = m.widths[i];
          const baseRel = wrap(m.centers[i] - pos, m.loop);
          for (let k = -3; k <= 3; k++) {
            const rel = baseRel + k * m.loop;
            if (Math.abs(rel) - w / 2 > width + 40) continue;
            const fx = effects.card ? effects.card(rel) : null;
            let x = homeX + rel + (fx ? fx.x : 0);
            let scale = shrink * (fx ? fx.scale : 1);
            let alpha = fx ? fx.alpha : 1;
            if (focusAmount > 0) {
              if (i === focus.index && Math.abs(rel) < w) {
                scale *= 1 + (focusScale - 1) * focusEase;
              } else {
                const order = Math.min(Math.abs(rel) / width, 1) * 0.25;
                const part = easeInOut(focusAmount * 1.25 - order);
                x += Math.sign(rel) * part * width * 0.7;
                alpha *= 1 - part;
              }
            }
            const instanceKey = `${i}:${k}`;
            const previousHover = hoverProgress.get(instanceKey) || 0;
            const targetHover = instanceKey === hoveredInstanceKey ? 1 : 0;
            const hoverAmount = previousHover + (targetHover - previousHover) * Math.min(1, dt * 12);
            if (Math.abs(targetHover - hoverAmount) > 0.004) animating = true;
            if (hoverAmount < 0.002 && targetHover === 0) hoverProgress.delete(instanceKey);
            else hoverProgress.set(instanceKey, hoverAmount);

            // The hovered preview lifts and scales forward; other cards keep their layout.
            const hoverScale = 1 + 0.055 * hoverAmount;
            const cw = w * scale * hoverScale;
            const ch = cardH * scale * hoverScale;
            const cy = homeY + (fx ? fx.y : 0) - 12 * hoverAmount;
            if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue;
            draws.push({ i, rel, x, y: cy, cw, ch, alpha, instanceKey, hovered: targetHover > 0 });
          }
        }
        // Render the hovered card last so it visually sits in front of overlapping cards.
        draws.sort((a, b) => Number(a.hovered) - Number(b.hovered) || Math.abs(b.rel) - Math.abs(a.rel));
        let first = true;
        for (const draw of draws) {
          const slot = slots[draw.i];
          cardProgram.uniforms.tMap.value = slot.texture;
          cardProgram.uniforms.uRect.value = [draw.x, draw.y, draw.cw + 2, draw.ch + 2];
          cardProgram.uniforms.uSize.value = [draw.cw, draw.ch];
          cardProgram.uniforms.uImage.value = slot.image;
          cardProgram.uniforms.uAlpha.value = draw.alpha;
          cardProgram.uniforms.uReady.value = slot.ready;
          cardProgram.uniforms.uShift.value = reducedMotion ? 0 : Math.max(-1, Math.min(1, draw.rel / (width * 0.75)));
          cardProgram.uniforms.uPlaceholder.value = slot.color;
          renderer.render({ scene: cardMesh, target, clear: first });
          first = false;
          instances.push({
            index: draw.i,
            instanceKey: draw.instanceKey,
            x0: draw.x - draw.cw / 2,
            x1: draw.x + draw.cw / 2,
            y0: draw.y - draw.ch / 2,
            y1: draw.y + draw.ch / 2
          });
        }
        syncHitTargets(instances);
        if (first) {
          renderer.bindFramebuffer(target);
          gl.viewport(0, 0, target.width, target.height);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        renderer.bindFramebuffer();
        target.texture.bind();
        gl.generateMipmap(gl.TEXTURE_2D);

        lensUniforms.uResolution.value = [width, height];
        lensUniforms.uDpr.value = dpr;
        lensUniforms.uCenter.value = [lensX, lens.y];
        lensUniforms.uHalf.value = [Math.max(halfW, 1), Math.max(halfH, 1)];
        lensUniforms.uAngle.value = (s.tilt * Math.PI) / 180;
        lensUniforms.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10;
        const spanW = Math.max(halfW, 1);
        const spanH = Math.max(halfH, 1);
        const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5);
        lensUniforms.uInner.value = inner;
        lensUniforms.uOuter.value = inner * 1.6;
        lensUniforms.uFlow.value = s.bend * (spanW + spanH) * 0.45;
        lensUniforms.uCurl.value = s.curl === 'rise' ? 1 : s.curl === 'fall' ? -1 : 0;
        lensUniforms.uDispersion.value = s.dispersion * 0.12 * (1 + Math.abs(deform) * liquidAmount * 1.2);
        lensUniforms.uStrength.value = effects.strength * (1 - focusEase);
        lensUniforms.uSceneAlpha.value = effects.sceneAlpha;
        renderer.render({ scene: lensMesh });
      }

      let hoveredInstance = null;
      if (pointer.over && !pointer.dragging && !pointer.down && introState.done && focus.target === 0) {
        const exactHits = instances.filter(inst =>
          pointer.x >= inst.x0 && pointer.x <= inst.x1 && pointer.y >= inst.y0 && pointer.y <= inst.y1
        );
        if (exactHits.length) {
          hoveredInstance = exactHits[exactHits.length - 1];
        } else if (instances.length) {
          // The shader can bend card edges beyond their original rectangle.
          const nearest = instances.map((inst, order) => {
            const cardWidth = Math.max(1, inst.x1 - inst.x0);
            const cardHeight = Math.max(1, inst.y1 - inst.y0);
            const dx = pointer.x < inst.x0 ? inst.x0 - pointer.x : pointer.x > inst.x1 ? pointer.x - inst.x1 : 0;
            const dy = pointer.y < inst.y0 ? inst.y0 - pointer.y : pointer.y > inst.y1 ? pointer.y - inst.y1 : 0;
            const distance = Math.hypot(dx / (cardWidth * 0.32), dy / (cardHeight * 0.32));
            return { inst, order, distance };
          }).sort((a, b) => a.distance - b.distance || b.order - a.order)[0];
          if (nearest && nearest.distance <= 1.65) hoveredInstance = nearest.inst;
        }
      }

      const nextHoveredKey = hoveredInstance?.instanceKey || '';
      if (nextHoveredKey !== hoveredInstanceKey) {
        hoveredInstanceKey = nextHoveredKey;
        if (hoveredInstance) {
          container.dataset.previewIndex = String(hoveredInstance.index);
          container.setAttribute('data-card-hover', 'true');
        } else {
          delete container.dataset.previewIndex;
          container.removeAttribute('data-card-hover');
        }
        dirty = true;
        start();
      }
      const nextHover = pointer.over && !pointer.dragging && hoveredInstance ? 'open' : '';
      if (nextHover !== hover) {
        hover = nextHover;
        if (hover) container.setAttribute('data-hover', hover);
        else container.removeAttribute('data-hover');
      }
      container.style.cursor = pointer.down ? 'grabbing' : (hoveredInstance ? 'pointer' : 'grab');

      if (visible && (animating || waiting || dirty || pointer.down)) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const localPoint = e => {
      const rect = container.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const activatePreview = (index, event) => {
      const selectedItem = itemsRef.current[index];
      if (!selectedItem) return;
      const now = performance.now();
      // Pointer-up and native button click often fire for the same tap; handle it once.
      if (now - lastPreviewSelection.at < 320 &&
          lastPreviewSelection.index === index &&
          Math.abs(event.clientX - lastPreviewSelection.x) < 5 &&
          Math.abs(event.clientY - lastPreviewSelection.y) < 5) return;
      lastPreviewSelection = { at: now, x: event.clientX, y: event.clientY, index };
      callbacksRef.current.onSelect?.(index, selectedItem);
    };

    const syncHitTargets = (nextInstances) => {
      const visibleKeys = new Set();
      nextInstances.forEach((inst, order) => {
        const key = inst.instanceKey;
        visibleKeys.add(key);
        let button = hitTargets.get(key);
        if (!button) {
          button = document.createElement('button');
          button.type = 'button';
          button.className = 'flex-carousel__hit-target';
          button.tabIndex = -1;
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            activatePreview(Number(button.dataset.index), event);
          });
          hitTargets.set(key, button);
          hitLayer.appendChild(button);
        }
        const item = itemsRef.current[inst.index];
        button.dataset.index = String(inst.index);
        button.setAttribute('aria-label', `Explore ${item?.title || `project ${inst.index + 1}`}`);
        button.title = `Explore ${item?.title || `project ${inst.index + 1}`}`;
        button.style.left = `${inst.x0}px`;
        button.style.top = `${inst.y0}px`;
        button.style.width = `${Math.max(1, inst.x1 - inst.x0)}px`;
        button.style.height = `${Math.max(1, inst.y1 - inst.y0)}px`;
        button.style.borderRadius = `${Math.max(0, settingsRef.current?.radius || 0)}px`;
        button.style.zIndex = String(order + 1);
        button.dataset.hovered = inst.instanceKey === hoveredInstanceKey ? 'true' : 'false';
      });
      for (const [key, button] of hitTargets) {
        if (!visibleKeys.has(key)) {
          button.remove();
          hitTargets.delete(key);
        }
      }
    };

    const onPointerDown = e => {
      if (e.button !== undefined && e.button > 0) return;
      skipIntro();
      const [x, y] = localPoint(e);
      pointer.down = true;
      pointer.id = e.pointerId;
      pointer.touch = e.pointerType === 'touch';
      pointer.startX = x;
      pointer.startY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.startPos = pos;
      pointer.dragging = false;
      pointer.samples = [{ x, t: performance.now() }];
      interactedAt = performance.now();
      if (Math.abs(vel) > 40) {
        goal = pos;
        vel = 0;
      }
      dirty = true;
      start();
    };

    const onPointerMove = e => {
      const [x, y] = localPoint(e);
      pointer.x = x;
      pointer.y = y;
      pointer.over = true;
      if (pointer.down && e.pointerId === pointer.id) {
        const dx = x - pointer.startX;
        const dy = y - pointer.startY;
        const slop = pointer.touch ? 10 : 5;
        if (!pointer.dragging) {
          if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
            pointer.down = false;
            return;
          }
          if (Math.abs(dx) > slop) {
            pointer.dragging = true;
            pointer.startX = x;
            pointer.startPos = pos;
            closeFocus();
            try {
              container.setPointerCapture(e.pointerId);
            } catch {
              pointer.dragging = true;
            }
            container.setAttribute('data-dragging', '');
          }
        }
        if (pointer.dragging) {
          pos = pointer.startPos - (x - pointer.startX);
          goal = pos;
          vel = 0;
          const now = performance.now();
          pointer.samples.push({ x, t: now });
          while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
        }
      }
      dirty = true;
      start();
    };

    const onPointerUp = e => {
      if (!pointer.down || e.pointerId !== pointer.id) return;
      pointer.down = false;
      container.removeAttribute('data-dragging');
      const s = settingsRef.current;
      if (!s) return;
      const m = metrics(s);
      interactedAt = performance.now();
      if (pointer.dragging) {
        pointer.dragging = false;
        const now = performance.now();
        const first = pointer.samples[0];
        const lastSample = pointer.samples[pointer.samples.length - 1];
        let velocity = 0;
        if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 70) {
          velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1000;
        }
        vel = velocity;
        const landing = snapPoint(m, pos + velocity * 0.32);
        goal = landing;
        if (Math.abs(velocity) > 400 && Math.abs(landing - pos) < 1) step(m, velocity > 0 ? 1 : -1);
        mode = 'spring';
        start();
        return;
      }
      if (closeFocus()) return;
      const [x, y] = localPoint(e);

      // Prefer an exact card hit. Instances are rendered from back to front,
      // so the last exact hit is the visible/topmost card when cards overlap.
      const exactHits = instances.filter(inst =>
        x >= inst.x0 && x <= inst.x1 && y >= inst.y0 && y <= inst.y1
      );
      let hit = exactHits.length ? exactHits[exactHits.length - 1] : null;

      // The liquid lens shader bends the preview after the hit rectangles are
      // calculated, so some visible pixels can land just outside those rects.
      // In that case pick the closest rendered card, rather than ignoring click.
      if (!hit && instances.length) {
        const nearest = instances.map((inst, order) => {
          const cardWidth = Math.max(1, inst.x1 - inst.x0);
          const cardHeight = Math.max(1, inst.y1 - inst.y0);
          const dx = x < inst.x0 ? inst.x0 - x : x > inst.x1 ? x - inst.x1 : 0;
          const dy = y < inst.y0 ? inst.y0 - y : y > inst.y1 ? y - inst.y1 : 0;
          const distance = Math.hypot(dx / (cardWidth * 0.32), dy / (cardHeight * 0.32));
          return { inst, order, distance };
        }).sort((a, b) => a.distance - b.distance || b.order - a.order)[0];
        hit = nearest?.inst || null;
      }

      // As a final fallback, a click on the canvas during a frame update should
      // still open a project instead of doing nothing. This is scoped to the
      // carousel host, so it cannot affect other sections or page controls.
      const selectedIndex = hit?.index ?? (activeIndex >= 0 ? activeIndex : 0);
      const selectedItem = itemsRef.current[selectedIndex];
      if (!selectedItem) return;

      // Open details immediately for every clicked preview, including non-center cards.
      activatePreview(selectedIndex, e);

      if (hit && hit.index === activeIndex && Math.abs(goal - pos) < 2) {
        if (s.focusOnClick) openFocus(hit.index);
      } else if (hit) {
        const rel = ((hit.x0 + hit.x1) / 2) - width / 2;
        goal = snapPoint(m, pos + rel);
        mode = 'spring';
        if (s.focusOnClick) focus.pending = hit.index;
        start();
      }
    };

    const onPointerLeave = () => {
      pointer.over = false;
      hoveredInstanceKey = '';
      delete container.dataset.previewIndex;
      container.removeAttribute('data-card-hover');
      container.style.cursor = 'grab';
      dirty = true;
      start();
    };

    const onPointerCancel = () => {
      pointer.down = false;
      pointer.dragging = false;
      container.removeAttribute('data-dragging');
      const s = settingsRef.current;
      if (!s) return;
      goal = snapPoint(metrics(s), pos);
      mode = 'spring';
      start();
    };

    const onWheel = e => {
      const s = settingsRef.current;
      if (!s || e.ctrlKey) return;

      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
        dx = dy;
        dy = 0;
      }

      const horizontal = Math.abs(dx) > Math.abs(dy);
      if (!s.captureWheel) return;
      const delta = horizontal ? dx : dy;
      if (Math.abs(delta) < 2) return;
      const direction = delta > 0 ? 1 : -1;

      // At the first/last card, let vertical scrolling leave this section.
      // This prevents the carousel from trapping the page scroll forever.
      if (!horizontal && activeIndex >= 0) {
        const atFirst = activeIndex === 0;
        const atLast = activeIndex === slots.length - 1;
        if ((direction < 0 && atFirst) || (direction > 0 && atLast)) return;
      }

      e.preventDefault();
      const now = performance.now();
      // Trackpads emit many wheel events per gesture. Treat them as one move.
      if (now < wheelGestureLockedUntil) return;
      wheelGestureLockedUntil = now + 520;

      skipIntro();
      interactedAt = now;
      if (closeFocus()) return;
      step(metrics(s), direction);
      mode = 'spring';
      wheelAt = now;
      start();
    };

    const onKeyDown = e => {
      const s = settingsRef.current;
      if (!s) return;
      const m = metrics(s);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        skipIntro();
        closeFocus();
        interactedAt = performance.now();
        step(m, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        skipIntro();
        closeFocus();
        interactedAt = performance.now();
        step(m, -1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        closeFocus();
        goTo(m, 0);
      } else if (e.key === 'End') {
        e.preventDefault();
        closeFocus();
        goTo(m, slots.length - 1);
      } else if (e.key === 'Escape') {
        if (closeFocus()) e.preventDefault();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (closeFocus() || activeIndex < 0) return;
        callbacksRef.current.onSelect?.(activeIndex, itemsRef.current[activeIndex]);
        if (s.focusOnClick) openFocus(activeIndex);
      }
    };

    const onFocus = () => {
      hasFocus = true;
    };
    const onBlur = () => {
      hasFocus = false;
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('focus', onFocus);
    container.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(container);

    engineRef.current = {
      wake: () => {
        dirty = true;
        start();
      },
      setItems
    };

    resize();
    setItems(itemsRef.current);

    return () => {
      alive = false;
      visible = false;
      engineRef.current = null;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('focus', onFocus);
      container.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      slots.forEach(slot => slot.dispose());
      slots = [];
      hitTargets.clear();
      if (hitLayer.parentNode) hitLayer.parentNode.removeChild(hitLayer);
      hoverProgress.clear();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  })();

  render();
  return {
    destroy: () => {
      if (typeof destroy === 'function') destroy();
      container.replaceChildren();
      container.removeAttribute('data-hover');
      container.removeAttribute('data-dragging');
      container.classList.remove('flex-carousel');
      container.style.removeProperty('--flex-carousel-half');
      container.style.removeProperty('--flex-carousel-lift');
    }
  };
}

// Responsive card proportions: wide landscape cards on desktop, smaller landscape cards on mobile.
function getCardHeight() {
  return window.matchMedia('(max-width: 760px)').matches ? 0.45 : options.cardHeight;
}

// ---- Section 03 controller: replay the flash on every re-entry. ----
const outputSection = document.querySelector('#projects.tcp-output-section');
const stage = outputSection?.querySelector('.tcp-output-stage');
const bg = outputSection?.querySelector('.flash-image');
const overlay = outputSection?.querySelector('.flash-overlay');
const cloudTransition = outputSection?.querySelector('.tcp-output-cloud-transition');
const host = outputSection?.querySelector('.tcp-output-carousel-host');
if (!outputSection || !stage || !bg || !overlay || !cloudTransition || !host) {
  throw new Error('TCP Output section markup is missing a required element.');
}

let carousel = null;
let timer = 0;
let token = 0;
let inOutputSection = false;
let flashEndHandler = null;

const projectInfo = {
  category: outputSection.querySelector('[data-project-category]'),
  title: outputSection.querySelector('[data-project-title]'),
  counter: outputSection.querySelector('[data-project-counter]'),
  detailTrigger: outputSection.querySelector('[data-open-project-details]')
};

const details = {
  root: outputSection.querySelector('[data-output-details]'),
  dialog: outputSection.querySelector('[data-output-details-dialog]'),
  category: outputSection.querySelector('[data-details-category]'),
  title: outputSection.querySelector('[data-details-title]'),
  description: outputSection.querySelector('[data-details-description]'),
  features: outputSection.querySelector('[data-details-features]'),
  tech: outputSection.querySelector('[data-details-tech]'),
  stackWrap: outputSection.querySelector('[data-details-stack-wrap]') || outputSection.querySelector('.tcp-output-details__stack-wrap'),
  live: outputSection.querySelector('[data-details-live]'),
  repo: outputSection.querySelector('[data-details-repo]')
};

let currentProjectIndex = 0;

// Scroll-controlled navigation for Section 03.
// Listen at window capture phase so wheel events over the WebGL canvas,
// project text, or section edges are handled consistently before the page scrolls.
// At the first/last project, outward scrolling is released to the page.
let outputWheelLockedUntil = 0;
const OUTPUT_WHEEL_LOCK_MS = 680;
const outputPrevButton = outputSection.querySelector('[data-output-prev]');
const outputNextButton = outputSection.querySelector('[data-output-next]');

function outputSectionOwnsScroll() {
  const rect = outputSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  const overlap = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
  const requiredOverlap = Math.min(viewportHeight * 0.58, rect.height * 0.58);
  return rect.height > 0 && overlap >= requiredOverlap;
}

function handleOutputSectionWheel(event) {
  if (event.ctrlKey) return; // Preserve browser zoom gestures.
  if (!outputSectionOwnsScroll()) return;
  if (details.root && !details.root.hidden) return; // Allow scrolling inside project details.

  const dx = event.deltaX || 0;
  const dy = event.deltaY || 0;
  // Prefer vertical wheel movement. Use horizontal trackpad movement when it dominates.
  const delta = Math.abs(dx) > Math.abs(dy) * 1.15 ? dx : dy;
  if (Math.abs(delta) < 0.5) return;

  const direction = delta > 0 ? 1 : -1;
  const lastIndex = items.length - 1;

  // While the flash is still running, hold the Output section in place so it
  // cannot scroll past before the carousel appears.
  if (!carousel) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // Release the document scroll only when moving outward at the ends.
  if ((direction < 0 && currentProjectIndex <= 0) ||
      (direction > 0 && currentProjectIndex >= lastIndex)) {
    return;
  }

  // Prevent the next page section from moving while the active project advances.
  event.preventDefault();
  event.stopPropagation();

  // Trackpad streams produce many wheel events per gesture; consume one card per gesture.
  const now = performance.now();
  if (now < outputWheelLockedUntil) return;
  outputWheelLockedUntil = now + OUTPUT_WHEEL_LOCK_MS;

  const control = direction > 0 ? outputNextButton : outputPrevButton;
  if (control && !control.disabled) control.click();
}

// Capture-phase window listener avoids bubbling/pointer-overlay issues.
window.addEventListener('wheel', handleOutputSectionWheel, { capture: true, passive: false });

function updateExternalLink(anchor, url, label) {
  if (!anchor) return;
  const safeUrl = typeof url === 'string' && /^https?:\/\//i.test(url.trim())
    ? url.trim()
    : '';
  if (safeUrl) {
    anchor.href = safeUrl;
    anchor.textContent = label;
    anchor.hidden = false;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.removeAttribute('aria-hidden');
    anchor.style.pointerEvents = 'auto';
  } else {
    anchor.hidden = true;
    anchor.removeAttribute('href');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
    anchor.removeAttribute('aria-label');
  }
}

function updateProjectInfo(index, item) {
  if (!item) return;
  currentProjectIndex = index;
  if (projectInfo.category) projectInfo.category.textContent = item.category || item.subtitle || `PROJECT ${String(index + 1).padStart(2, '0')}`;
  if (projectInfo.title) projectInfo.title.textContent = item.title || item.alt || `Project ${index + 1}`;
  if (projectInfo.counter) projectInfo.counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  if (projectInfo.detailTrigger) projectInfo.detailTrigger.setAttribute('aria-label', `View details for ${item.title}`);
}

function openProjectDetails(index = currentProjectIndex, item = items[index]) {
  item = item || items[index];
  if (!item || !details.root || !details.dialog) return;
  updateProjectInfo(index, item);
  if (details.category) details.category.textContent = item.category || item.subtitle || 'SELECTED PROJECT';
  if (details.title) details.title.textContent = item.title || 'Selected project';
  if (details.description) details.description.textContent = item.description || '';

  if (details.features) {
    details.features.replaceChildren();
    (item.features || []).forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      details.features.appendChild(li);
    });
  }
  if (details.tech) {
    details.tech.replaceChildren();
    (item.tech || []).forEach((technology) => {
      const chip = document.createElement('span');
      chip.className = 'tcp-output-tech-chip';
      chip.textContent = technology;
      details.tech.appendChild(chip);
    });
  }
  if (details.stackWrap) details.stackWrap.hidden = !(Array.isArray(item.tech) && item.tech.length > 0);
  updateExternalLink(details.live, item.liveUrl, 'Visit live project ↗');
  updateExternalLink(details.repo, item.repoUrl, 'View GitHub repository ↗');

  details.root.hidden = false;
  outputSection.classList.add('tcp-output-details-open');
  requestAnimationFrame(() => details.dialog.focus({ preventScroll: true }));
}

function closeProjectDetails() {
  if (!details.root || details.root.hidden) return;
  details.root.hidden = true;
  outputSection.classList.remove('tcp-output-details-open');
  requestAnimationFrame(() => {
    const focusTarget = projectInfo.detailTrigger || host;
    focusTarget?.focus?.({ preventScroll: true });
  });
}

updateProjectInfo(0, items[0]);
host.addEventListener('tcp-output-project-change', (event) => {
  updateProjectInfo(event.detail?.index ?? 0, event.detail?.item);
});

// Clicking a card or the title panel opens a detail overlay, not the zoom-focus effect.
const detailConfig = { onSelect: (index, item) => openProjectDetails(index, item) };
projectInfo.detailTrigger?.addEventListener('click', () => openProjectDetails());
// Delegate the close actions so both the backdrop and close button always work,
// including after the detail view is reused for another project.
details.root?.addEventListener('click', (event) => {
  const closeControl = event.target.closest('[data-close-details-button], [data-close-details]');
  if (!closeControl || !details.root.contains(closeControl)) return;
  event.preventDefault();
  event.stopPropagation();
  closeProjectDetails();
});

// Keep real anchor navigation native. Do not let clicks bubble into the modal controls.
details.root?.querySelectorAll('a[data-details-live], a[data-details-repo]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    if (!anchor.href || !/^https?:$/.test(new URL(anchor.href, window.location.href).protocol)) {
      event.preventDefault();
      return;
    }
    event.stopPropagation();
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && details.root && !details.root.hidden) closeProjectDetails();
});

function flash() {
  bg.classList.remove('play');
  overlay.classList.remove('play');
  void bg.offsetWidth;
  bg.classList.add('play');
  overlay.classList.add('play');
}

function reset() {
  token++;
  clearTimeout(timer);
  if (flashEndHandler) {
    bg.removeEventListener('animationend', flashEndHandler);
    flashEndHandler = null;
  }
  if (carousel) carousel.destroy();
  carousel = null;
  bg.classList.remove('play');
  overlay.classList.remove('play');
  cloudTransition.classList.remove('play');
  closeProjectDetails();
}

function preloadProjectImages() {
  items.forEach((item) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = item.src;
  });
}

function play() {
  const mine = ++token;
  const raise = () => {
    if (mine !== token || carousel) return;
    clearTimeout(timer);
    if (flashEndHandler) {
      bg.removeEventListener('animationend', flashEndHandler);
      flashEndHandler = null;
    }
    carousel = FlexCarousel(host, {
      items,
      ...options,
      ...detailConfig,
      cardHeight: getCardHeight(),
      focusOnClick: false
    });
  };

  preloadProjectImages();
  cloudTransition.classList.remove('play');
  void cloudTransition.offsetWidth;
  cloudTransition.classList.add('play');
  flash();
  flashEndHandler = (event) => {
    if (event.animationName === 'tcpOutputFlashImage') raise();
  };
  bg.addEventListener('animationend', flashEndHandler);
  timer = window.setTimeout(raise, FALLBACK_DELAY);
}

outputSection.querySelector('[data-output-prev]')?.addEventListener('click', () => {
  host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
});
outputSection.querySelector('[data-output-next]')?.addEventListener('click', () => {
  host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
});

let compactMode = window.matchMedia('(max-width: 760px)').matches;
window.addEventListener('resize', () => {
  const nextCompactMode = window.matchMedia('(max-width: 760px)').matches;
  if (nextCompactMode === compactMode) return;
  compactMode = nextCompactMode;
  if (!carousel) return;
  carousel.destroy();
  carousel = FlexCarousel(host, {
    items,
    ...options,
    ...detailConfig,
    cardHeight: getCardHeight(),
    focusOnClick: false
  });
});

// Run the lighting flash and carousel entrance each time the visitor re-enters
// Section 03. A small exit threshold prevents flicker during minor scroll movement.
const outputObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const ratio = entry.intersectionRatio;
    if (entry.isIntersecting && ratio >= 0.18 && !inOutputSection) {
      inOutputSection = true;
      play();
    } else if ((!entry.isIntersecting || ratio < 0.08) && inOutputSection) {
      inOutputSection = false;
      reset();
    }
  }
}, { threshold: [0, 0.08, 0.18, 0.35] });
outputObserver.observe(outputSection);

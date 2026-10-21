
/* =========================================================
   THE CRAFTED PIXELS — ASTRONAUT SCROLL ANIMATION
   Astronaut retreat, tilt/fall, fade, and cloud parallax
   ========================================================= */

(() => {
  const hero = document.querySelector("#comp-lte8dpkb");
  const astronaut = document.querySelector("#comp-lte8dpl4");

  if (!hero || !astronaut) {
    console.warn(
      "TCP animation: hero or astronaut was not found.",
      {
        heroFound: Boolean(hero),
        astronautFound: Boolean(astronaut)
      }
    );
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const heroImages = [...hero.querySelectorAll("img")];
  const astronautImg = astronaut.querySelector("img");

  let rafPending = false;

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const smooth = (value) =>
    value * value * (3 - 2 * value);

  function update() {
    rafPending = false;

    if (reduceMotion) return;

    const heroRect = hero.getBoundingClientRect();

    /*
      Keep enough scroll distance for the animation to be visible,
      even when the hero is approximately one viewport tall.
    */
    const scrollDistance = Math.max(
      hero.offsetHeight - window.innerHeight,
      window.innerHeight * 0.85
    );

    const scrollProgress = -heroRect.top;

    const progress = clamp(
      scrollProgress / scrollDistance
    );

    const eased = smooth(progress);

    /* ASTRONAUT MOVEMENT */

    // Shrink as the astronaut appears to recede.
    const scale = 1 - eased * 0.78;

    // Initial movement away from the viewer.
    const retreatX =
      eased * window.innerWidth * 0.025;

    const retreatY =
      -eased * window.innerHeight * 0.20;

    // Gradually begin the falling/tilting movement.
    const fallProgress = clamp(
      (progress - 0.10) / 0.35
    );

    const fall = fallProgress * fallProgress;

    // Counterclockwise tilt: the astronaut leans left.
    const rotation = -32 * fall;

    const fallX =
      -window.innerWidth * 0.04 * fall;

    const fallY =
      window.innerHeight * 0.055 * fall;

    // Fade and blur gradually as the astronaut recedes.
    const opacity = 1 - eased * 0.52;
    const blur = eased * 0.7;

    astronaut.style.setProperty(
      "transform-origin",
      "50% 50%",
      "important"
    );

    astronaut.style.setProperty(
      "transform",
      `translate3d(
        ${retreatX + fallX}px,
        ${retreatY + fallY}px,
        0
      ) rotate(${rotation}deg) scale(${scale})`,
      "important"
    );

    astronaut.style.setProperty(
      "opacity",
      String(opacity),
      "important"
    );

    astronaut.style.setProperty(
      "filter",
      `blur(${blur}px)`,
      "important"
    );

    /* EXISTING CLOUD PARALLAX */

    heroImages.forEach((img, index) => {
      if (
        img === astronautImg ||
        img.closest("#comp-lte8dpl4")
      ) {
        return;
      }

      const direction = index % 2 === 0 ? -1 : 1;
      const depth = 8 + (index % 4) * 5;

      img.style.willChange = "transform";

      img.style.transform = `translate3d(
        ${direction * eased * depth}px,
        ${-eased * depth * 0.45}px,
        0
      )`;
    });
  }

  function requestUpdate() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", requestUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestUpdate, {
    passive: true
  });

  update();

  /* =========================================================
     LOWER SECTION REVEAL ANIMATIONS
     ========================================================= */

  const revealSelectors = [
    "#comp-lte8dplw17",
    "#comp-luhxjweh",
    "#comp-lte8dpmd13",
    "#comp-lte8dpoi14",
    "#comp-lte8dpu2",
    "#comp-lte8dpv39",
    "#comp-lte8dpvd19",
    "#comp-lte8dpw414",
    "#comp-lte8dpxh3",
    "#comp-lte8dpz29"
  ];

  const revealTargets = revealSelectors
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);

  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "standalone-in-view"
            );

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealTargets.forEach((element) => {
      element.classList.add("standalone-reveal");
      observer.observe(element);
    });
  }

  /* =========================================================
     TCP MOTTO — WORD-BY-WORD REVEAL
     Runs only when .motto-section exists.
     ========================================================= */

  const motto = document.querySelector(".motto-section");

  if (
    motto &&
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    const animatedText = [
      motto.querySelector(".motto-description"),
      ...motto.querySelectorAll(".motto-principle p")
    ].filter(Boolean);

    animatedText.forEach((element) => {
      if (element.querySelector(".motto-word")) {
        return;
      }

      const originalText = element.textContent.trim();

      if (!originalText) return;

      element.setAttribute("aria-label", originalText);
      element.textContent = "";

      const words = originalText.split(/\s+/);

      words.forEach((word, index) => {
        const span = document.createElement("span");

        span.className = "motto-word";
        span.textContent = word;
        span.setAttribute("aria-hidden", "true");
        span.style.setProperty("--word-index", index);

        element.appendChild(span);

        if (index < words.length - 1) {
          element.appendChild(
            document.createTextNode(" ")
          );
        }
      });
    });

    const mottoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            motto.classList.add("motto-visible");
            mottoObserver.unobserve(motto);
          }
        });
      },
      { threshold: 0.2 }
    );

    mottoObserver.observe(motto);
  }
})();

/* TCP — Gentle astronaut hover animation */
(() => {
  const astronaut = document.querySelector("#comp-lte8dpl4");

  if (!astronaut || astronaut.dataset.tcpHoverReady === "true") return;
  astronaut.dataset.tcpHoverReady = "true";

  // Respect reduced-motion accessibility settings.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  astronaut.animate(
    [
      { transform: "translate3d(0, 0, 0) rotate(0deg)" },
      { transform: "translate3d(0, -12px, 0) rotate(-1deg)" },
      { transform: "translate3d(0, 0, 0) rotate(0deg)" },
      { transform: "translate3d(0, 10px, 0) rotate(1deg)" },
      { transform: "translate3d(0, 0, 0) rotate(0deg)" }
    ],
    {
      duration: 5000,
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
})();

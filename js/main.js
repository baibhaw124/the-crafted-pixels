
/* =========================================================
   THE CRAFTED PIXELS — ASTRONAUT FALLING ANIMATION
   ========================================================= */

(() => {
  const hero = document.querySelector("#comp-lte8dpkb");
  const astronaut = document.querySelector("#comp-lte8dpl4");

  if (!hero || !astronaut) {
    console.warn("Hero or astronaut element was not found.");
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

    // Scroll progress through the hero section.
    const scrollDistance = Math.max(
      1,
      hero.offsetHeight - window.innerHeight
    );

    const progress = clamp(
      -heroRect.top / scrollDistance
    );

    const eased = smooth(progress);

    /* =====================================================
       ASTRONAUT MOVEMENT
       1. Starts upright.
       2. Recedes into the distance.
       3. Tips and falls toward the left.
       4. Disappears into the clouds.
       ===================================================== */

    // Shrink to create the illusion of moving away.
    const scale = 1 - eased * 0.78;

    // Initial movement into the distance.
    const retreatX =
      eased * window.innerWidth * 0.025;

    const retreatY =
      -eased * window.innerHeight * 0.20;

    /*
     * FALL TIMING
     * Stay upright through the early scroll.
     * Begin falling at 38% progress.
     * Complete the main tilt around 78% progress.
     */
    const fallProgress = clamp(
      (progress - 0.10) / 0.35
    );

    const fall = fallProgress *fallProgress;

    // Counterclockwise rotation makes the top lean left.
    const rotation = -32 * fall;

    // Drift left and downward as the astronaut loses balance.
    const fallX =
      -window.innerWidth * 0.04 * fall;

    const fallY =
      window.innerHeight * 0.055 * fall;

    // Fade later so the falling movement remains visible.
    const opacity = 1 - eased * 0.52;

    // Slight atmospheric blur as the astronaut recedes.
    const blur = eased * 0.7;

    astronaut.style.setProperty(
      "transform-origin",
      "50% 50%",
      "important"
    );

    astronaut.style.setProperty(
      "transform",
      `
        translate3d(
          ${retreatX + fallX}px,
          ${retreatY + fallY}px,
          0
        )
        rotate(${rotation}deg)
        scale(${scale})
      `,
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

    /* =====================================================
       EXISTING CLOUD PARALLAX
       Clouds keep their existing subtle movement.
       No additional clouds are created.
       ===================================================== */

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

      img.style.transform = `
        translate3d(
          ${direction * eased * depth}px,
          ${-eased * depth * 0.45}px,
          0
        )
      `;
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

  /* =====================================================
     LOWER SECTION REVEAL ANIMATIONS
     ===================================================== */

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
})();

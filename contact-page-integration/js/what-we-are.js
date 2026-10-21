
/* THE CRAFTED PIXELS — WHAT WE ARE
   Original heading reveal preserved.
   Paragraph has its own scroll-driven reveal.
   Principle cards enter slightly faster.
*/
(() => {
  const section = document.querySelector("#comp-lte8dpln");

  if (!section) {
    console.warn("TCP: What We Are section not found.");
    return;
  }

  const intro = section.querySelector("[data-what-intro]");
  const points = [
    ...section.querySelectorAll("[data-what-point]")
  ];

  if (!intro) {
    console.warn("TCP: Main intro element not found.");
    return;
  }

  const clamp = (v, min = 0, max = 1) =>
    Math.min(max, Math.max(min, v));

  const smooth = (v) => {
    v = clamp(v);
    return v * v * (3 - 2 * v);
  };

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Wrap words without changing the original text or HTML formatting.
  function wrapWords(element, wordClass, marker) {
    if (!element || element.dataset[marker] === "true") {
      return;
    }

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return node.nodeValue.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      const tokens = node.nodeValue.match(/\s+|[^\s]+/g) || [];

      tokens.forEach((token) => {
        if (/^\s+$/.test(token)) {
          fragment.appendChild(
            document.createTextNode(token)
          );
        } else {
          const span = document.createElement("span");
          span.className = wordClass;
          span.textContent = token;
          fragment.appendChild(span);
        }
      });

      node.parentNode.replaceChild(fragment, node);
    });

    element.dataset[marker] = "true";
  }

  const heading = intro.querySelector(".tcp-what-heading");
  const description = intro.querySelector(
    ".tcp-what-description"
  );

  // Heading animation: existing class and reveal behavior preserved.
  wrapWords(heading, "tcp-reveal-word", "tcpHeadingWordsWrapped");

  // Paragraph: separate class for its own scroll animation.
  wrapWords(
    description,
    "tcp-paragraph-word",
    "tcpParagraphWordsWrapped"
  );

  const words = [
    ...intro.querySelectorAll(".tcp-reveal-word")
  ];

  const paragraphWords = [
    ...intro.querySelectorAll(".tcp-paragraph-word")
  ];
  
  // Highlight only the brand name "Crafted Pixels".
  paragraphWords.forEach((word, index) => {
    const current = word.textContent
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();

    const next = paragraphWords[index + 1]?.textContent
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();

    const previous = paragraphWords[index - 1]?.textContent
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();

    if (
      (current === "crafted" && next === "pixels") ||
      (current === "pixels" && previous === "crafted")
    ) {
      word.classList.add("tcp-brand-name-word");
    }
  });
  // Accessibility: disable motion when requested by the visitor.
  if (reduceMotion) {
    words.forEach((word) => {
      word.style.clipPath = "none";
      word.style.opacity = "1";
      word.style.transform = "none";
    });

    paragraphWords.forEach((word) => {
      word.style.color = "#111111";
    });

    points.forEach((point) => {
      point.style.opacity = "1";
      point.style.transform = "none";
    });

    return;
  }

  let framePending = false;

  function updateAnimation() {
    framePending = false;

    const vh = window.innerHeight || 1;
    const sectionRect = section.getBoundingClientRect();

    // ORIGINAL HEADING REVEAL — unchanged.
    words.forEach((word) => {
      const rect = word.getBoundingClientRect();

      const progress = smooth(
        (vh * 0.82 - rect.top) / (vh * 0.24)
      );

      const hiddenPercent = (1 - progress) * 100;
      const opacity = 0.12 + progress * 0.88;
      const translateY = (1 - progress) * 0.18;

      word.style.clipPath =
        `inset(0 0 ${hiddenPercent.toFixed(2)}% 0)`;

      word.style.opacity = String(opacity);

      word.style.transform =
        `translate3d(0, ${translateY.toFixed(3)}em, 0)`;
    });

    // PARAGRAPH REVEAL:
    // Words progressively darken as the paragraph travels through
    // the viewport, inspired by Wix Studio Space's "THE BRIEF".
    // Scrolling upward reverses the reveal.
  
    // PARAGRAPH-ONLY WORD REVEAL
    if (description && paragraphWords.length) {
      const paragraphRect = description.getBoundingClientRect();

      const paragraphProgress = clamp(
        (vh * 0.94 - paragraphRect.top) /
        Math.max(vh * 0.48, paragraphRect.height * 1.1, 1)
      );

      const finalWordIndex = Math.max(
        paragraphWords.length - 1,
        1
      );

      paragraphWords.forEach((word, index) => {
        const wordStart = (index / finalWordIndex) * 0.84;

        const reveal = smooth(
          (paragraphProgress - wordStart) / 0.084
        );

        const hiddenPercent = (1 - reveal) * 100;
        const opacity = 0.12 + reveal * 0.88;
        const translateY = (1 - reveal) * 0.12;

        word.style.clipPath =
          `inset(0 0 ${hiddenPercent.toFixed(2)}% 0)`;

        word.style.opacity = String(opacity);

        word.style.transform =
          `translate3d(0, ${translateY.toFixed(3)}em, 0)`;
      });
    }
    // PRINCIPLE CARDS:
    // Same movement and exit behavior, with a slightly faster entrance.
    const sectionProgress = clamp(
      (vh - sectionRect.top) /
      (vh + sectionRect.height)
    );

    points.forEach((point, index) => {
      const start = 0.23 + index * 0.075;

      const arrival = smooth(
        (sectionProgress - start) / 0.36
      );

      // Original departure timing preserved.
      const departure =
        1 - smooth(
          (sectionProgress - 0.89) / 0.10
        );

      const opacity = clamp(arrival * departure);
      const direction = index % 2 === 0 ? -1 : 1;

      const translateX =
        direction * (1 - arrival) * 100;

      const translateY =
        (1 - arrival) * 10;

      point.style.opacity = String(opacity);

      point.style.transform =
        `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }

  function requestUpdate() {
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(updateAnimation);
    }
  }

  window.addEventListener(
    "scroll",
    requestUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestUpdate,
    { passive: true }
  );

  updateAnimation();
})();

(() => {
  const nav = document.querySelector(".tcp-nebula-nav");
  const toggle = nav?.querySelector(".tcp-nav-toggle");
  const links = nav?.querySelector("#tcp-nav-links");

  if (!nav || !toggle || !links) return;

  // Preserve the dropdown's original place in the navbar.
  const placeholder = document.createComment("TCP nav links location");
  links.parentNode.insertBefore(placeholder, links);

  const isOpen = () =>
    toggle.getAttribute("aria-expanded") === "true";

  function positionMenu() {
    const rect = nav.getBoundingClientRect();

    const left = Math.max(
      6,
      Math.min(rect.left, window.innerWidth - rect.width - 6)
    );

    const width = Math.min(
      rect.width,
      window.innerWidth - left - 12
    );

    const top = Math.max(
      8,
      Math.min(rect.bottom + 10, window.innerHeight - 220)
    );

    links.style.setProperty("--tcp-menu-top", `${top}px`);
    links.style.setProperty("--tcp-menu-left", `${left}px`);
    links.style.setProperty("--tcp-menu-width", `${width}px`);
  }

  function openMenu() {
    positionMenu();

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");

    // Move the dropdown outside the clipped hero section.
    links.classList.add("is-open", "tcp-nav-links-floating");
    document.body.appendChild(links);
  }

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");

    links.classList.remove("is-open", "tcp-nav-links-floating");

    // Restore its original position in the navbar.
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(
        links,
        placeholder.nextSibling
      );
    }

    links.style.removeProperty("--tcp-menu-top");
    links.style.removeProperty("--tcp-menu-left");
    links.style.removeProperty("--tcp-menu-width");
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  links.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("pointerdown", event => {
    if (
      isOpen() &&
      !links.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (isOpen()) positionMenu();
  });

  window.addEventListener("scroll", () => {
    if (isOpen()) closeMenu();
  }, { passive: true });
})();
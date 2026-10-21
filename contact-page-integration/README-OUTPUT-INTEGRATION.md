# The Crafted Pixels — corrected Section 03: The Output

This package replaces **only the existing `#projects` Output section** and its section-specific CSS/JS. It leaves the astronaut, navbar and What We Are code alone.

## Intended sequence

1. The full-frame `hug1.jpeg` planet scene appears first on black.
2. As the visitor scrolls, `hug2.jpeg` (the mountain scene) reveals from the bottom upward.
3. The two scenes crossfade into `hug3.jpeg`, the composite planet/mountain scene. The background remains black through this sequence.
4. When the sticky scroll-story finishes, the neon-lime project gallery appears with four projects and a React Bits FlexCarousel.

There is no introductory text over the animation; the only text there is `03 THE OUTPUT`.

## Install while preserving existing files

1. Back up `index.html` before editing.
2. Replace only the existing `<section id="projects" ...> ... </section>` block with `output-section.html`. Do not insert a second `id="projects"` section.
3. Copy `css/tcp-output.css` to the existing `css/tcp-output.css`, replacing only the previous Output stylesheet.
4. Copy `js/tcp-output.js` to the existing `js/tcp-output.js`, replacing only the previous Output scroll script.
5. Copy `js/FlexCarousel.jsx` and `js/tcp-output-carousel.jsx` into your existing `js/` folder.
6. Copy `css/FlexCarousel.css` into your existing `css/` folder.
7. Copy the `assets/` folder into the project root, merging the three `hug*.jpeg` files and `assets/projects/*.svg` in it. The poster SVGs are temporary original artwork to make the four project items previewable; replace them with real project screenshots when ready.
8. In `index.html`, make sure this stylesheet link exists inside `<head>` (keep existing stylesheet links):

   ```html
   <link href="./css/tcp-output.css" rel="stylesheet" />
   ```

9. Keep the existing `tcp-output.js` script reference if already present; add `tcp-output-carousel.jsx` as a module before `</body>`:

   ```html
   <script type="module" src="./js/tcp-output-carousel.jsx"></script>
   ```

10. In the project root, run:

   ```bash
   npm install react react-dom ogl
   npm run dev
   ```

Vite can transform the `.jsx` module in this project. Installing these packages updates `package.json` and `package-lock.json` to add only the dependencies needed for the isolated carousel.

## Safety boundaries

- Do not edit `js/main.js`, `js/tcp-navbar.js`, or `js/what-we-are.js`.
- Do not edit `css/styles-updated.css`, `css/tcp-navbar.css`, or `css/what-we-are.css`.
- Do not replace your complete `index.html` with the snippet; replace only the old Output section block and add the new module line.
- The carousel uses React Bits' supplied FlexCarousel source (OGL/WebGL2). A browser without WebGL2 may not render the image ribbon; it does not change the rest of the page.
- Project preview images and summaries are placeholders based on the project names and broad descriptions. Add verified links and screenshots once those are available.

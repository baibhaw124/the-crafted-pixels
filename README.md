# Cosmic Scroll — standalone Vite project

## Run locally (Windows / PowerShell)

1. Extract the ZIP directly into `C:\TCP\P1` (or any folder). The extracted folder must contain `package.json` and `index.html` immediately, not another nested project folder.
2. In VS Code, open that exact folder.
3. Open Terminal and run:

```powershell
npm install
npm run dev
```

4. Open the `Local` URL printed by Vite (usually `http://localhost:5173`). Keep the terminal running.

If you see `ENOENT ... package.json`, the terminal is in the wrong folder. Run `dir` and confirm `package.json` is listed, or use `cd C:\TCP\P1` before running npm.

## Notes
- Image URLs are rebuilt from the image metadata in the supplied Wix HTML, requesting high-quality, unblurred versions instead of the tiny blurred placeholders. Internet access is required for Wix-hosted images.
- The astronaut animation scales and moves toward a vanishing point, fades slightly, and gains only a subtle blur as you scroll down; scrolling up reverses the progress. Cloud layers drift at different rates.
- This is a standalone recreation, not Wix's original runtime, so proprietary Wix-specific motion may not be identical.

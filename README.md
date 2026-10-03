# SI1ENCE Client

A lightweight Eaglercraft 26.2 launcher shell focused on:
- FPS/render optimizations
- chunk loading improvements
- custom crosshair + HUD polish
- PvP utility toggles and combat feel
- easy local client injection workflow

This repo is designed to host a playable browser client shell. It does not include the proprietary Minecraft/Eaglercraft game files themselves; instead, it lets you load your own compiled Eaglercraft 26.2 client HTML or website build into the launcher.

## What is included

- `index.html` — single-page launcher UI
- `styles.css` — dark optimized client styling / HUD overlays
- `app.js` — local file loading, presets, overlays, and client config
- `package.json` — local static serve script

## Recommended workflow

1. Build or obtain your Eaglercraft 26.2 browser client HTML.
2. Put it in a local folder or serve it from a local web server.
3. Open this repo in a browser.
4. Use the launcher to load the client from a URL or a local HTML file.

## Quick start

```bash
npm start
```

Then open:

- http://localhost:8080

## Notes for optimization

The launcher includes presets for:
- `Balanced` (safe default)
- `Performance` (max FPS / lower visual overhead)
- `PvP` (crosshair + combat-friendly HUD)
- `Chunk Boost` (rendering- and chunk-priority assumptions)

These are not game-engine patches themselves; they are UI and runtime hooks for a local client build plus a convenient loader shell.

## Next step

The next phase is to wire this repo directly into the `Eaglercraft-26.2-Workspace` project and add a build script that packages a release-ready HTML client automatically.

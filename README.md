# 📷 Snapshot

**Beautiful screenshots, in seconds.**

Drop a screenshot, set it on a gorgeous background, frame it like a real macOS
window and export a high-resolution PNG ready to share. Free, no account, no
watermark — and 100% in your browser: no image ever leaves your machine.

**➡️ Try it: https://valtielchan.github.io/snapshot/**

☕ Enjoying it? [Buy me a coffee](https://ko-fi.com/valtiel_)

## Features

- **Import** via drag-and-drop, file picker or clipboard paste (`Ctrl+V`)
- **156 backgrounds** across 7 families (gradients and solid colors)
- **Custom gradients**: linear, radial, angular, diamond — adjustable
  direction, 2 to 4 hideable colors, or a solid fill
- **macOS window frame**, light or dark, with a soft drop shadow
- **Pixel-precise width and padding**, zoom, unlimited undo/redo
- **Export** 2× PNG: download or copy straight to the clipboard
- **Neo-brutalist** design: coral `#EF8783` × peach `#FFC38C`

## Stack

React 18 + Vite, Zustand, html-to-image, Font Awesome. No backend: fully
static app, hosted on GitHub Pages.

## Development

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173/snapshot/
```

Or in VS Code: `Ctrl+Shift+B` (task "Dev: Lancer l'app").

```bash
npm run build      # production build → frontend/dist
npm run preview    # serve the build locally
```

## Deployment

Automatic: every push to `main` triggers the GitHub Actions workflow
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) which builds
and publishes to GitHub Pages.

## Structure

```
frontend/src/
├── App.jsx            # routes: / (landing), /editor, /design
├── styles/            # design system tokens + base
├── ui/                # reusable neo-brutalist components
├── editor/            # the editor (scene, toolbar, backgrounds, export)
└── pages/             # landing + design system showcase
```

Conventions and contribution guide: see [AGENTS.md](AGENTS.md).

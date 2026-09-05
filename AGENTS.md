# AGENTS.md

Reference guide for anyone (human or agent) working on this repository.
Read it before writing code. **Update it** whenever a convention changes.

---

## 1. The product

A web app that makes screenshots look good: import an image, drop it on a
background (gradient or solid), wrap it in a macOS window frame with padding
and a shadow, then export a PNG (download or clipboard).

**Positioning: free, public, open.** No account, no premium tier, no
watermark, no tracking. **No backend**: everything runs client side, the
image never leaves the browser. That is both a product argument (privacy)
and an architectural constraint: every feature must work as a static site.

## 2. Architecture

```
Snapshot/
├── frontend/                  # React 18 + Vite, 100% static SPA
│   ├── index.html             # SEO: meta, OG, JSON-LD, favicons, fonts
│   ├── public/                # favicons, manifest, robots.txt, sitemap, og-image
│   └── src/
│       ├── main.jsx           # entry point: mounts <App/>, imports tokens+base
│       ├── App.jsx            # HashRouter: / (landing), /editor, /design
│       ├── assets/logo.png    # logo
│       ├── styles/
│       │   ├── tokens.css     # ALL design system tokens
│       │   └── base.css       # reset + typographic foundations
│       ├── ui/                # design system (reusable components)
│       ├── editor/            # editor domain
│       │   ├── EditorPage.jsx # assembly + keyboard shortcuts
│       │   ├── Toolbar.jsx    # import, background, width/padding, frame, export
│       │   ├── CanvasStage.jsx# exported scene + zoom wrapper (.scene-sizer)
│       │   ├── BackgroundPanel.jsx # 7 categories + custom builder
│       │   ├── editorStore.js # Zustand state + undo/redo history
│       │   ├── backgrounds.js # categories + buildGradient()
│       │   ├── backgrounds.data.js # 156 GENERATED backgrounds (do not edit)
│       │   └── exportImage.js # html-to-image rasterization
│       └── pages/             # LandingPage (home) + DesignSystemPage
├── docs/media/                # README showcase assets (screenshots, GIFs, video)
├── scripts/                   # demo fixture + Playwright recording script
├── .github/workflows/deploy.yml # build + GitHub Pages deployment
└── .vscode/tasks.json         # Dev / Build / Preview
```

## 3. Running and deploying

| What | How |
|---|---|
| Dev | `Ctrl+Shift+B` in VS Code, or `cd frontend && npm run dev` |
| Dev URL | http://localhost:5173/snapshot/ (`base` applies in dev too) |
| Build | `npm run build`, output in `frontend/dist` |
| Preview build | `npm run preview`, http://localhost:4173/snapshot/ |
| Prod | push to `main`, GitHub Actions, https://valtielchan.github.io/snapshot/ |

**GitHub Pages constraints** (pure static hosting):
- `base: '/snapshot/'` in `vite.config.js` must match the repository name.
- **HashRouter** (not BrowserRouter): no server rewrite is possible, the hash
  avoids 404s when reloading a route.
- Absolute URLs (OG, canonical, sitemap) point at
  `https://valtielchan.github.io/snapshot/`, update them if the repo moves.

## 4. Design system (front)

**Style: two-tone neo-brutalism.** Living reference on `/design`.

### Non-negotiable rules
1. **Two accent colors, not one more**: `--primary: #EF8783` (coral) and
   `--secondary: #FFC38C` (peach). Neutrals: `--ink`, `--paper`, `--surface`,
   `--muted`. Semantic (sparingly): `--danger`, `--success`.
2. **No gradients, no rounded corners, no blurred shadows in the UI.**
   Borders `3px solid var(--ink)`, hard offset shadows
   (`box-shadow: 3px 3px 0 var(--ink)`, keep it restrained), sharp angles.
   *Controlled exception*: the **exported scene** (CanvasStage) is product
   content, gradients and soft shadows are normal there.
3. **Every visual value comes from a token** (`styles/tokens.css`).
4. **Type**: Archivo Black (titles, uppercase), Archivo (body), monospace for
   numeric values.
5. Interactions: hover = **-1px** translation + 1px larger shadow; click =
   +1px translation + reduced shadow. Subtle, never spectacular.
6. **Buttons have a FIXED height per size** (sm 32 / md 40 / lg 48,
   IconButton 40). **The toggle/pressed state never moves the geometry**:
   inverted colors, same position, same shadow.

### Adding a UI component
1. Write it in `src/ui/index.jsx` + `.ds-<name>` styles in `ui.css`.
2. Use tokens only.
3. **Add it to the `/design` showcase** with all its variants.
4. Accessibility: aria-label, visible focus, keyboard support.

## 5. Front-end conventions (React)

- **Function components + hooks**, named exports, PascalCase.
- **Global state: Zustand** (`editorStore`). No Redux.
- **Editor: every visual document property goes through `apply(patch)`**,
  that is what feeds undo/redo. Zoom and image stay out of history
  (navigation, not edition), on purpose.
- CSS per domain (`editor.css`, `landing.css`), BEM-light class names.
- UI text, landing, SEO, code and documentation are all in **English**.
- **Icons: Font Awesome** (`@fortawesome/react-fontawesome`), never emojis in
  the interface.
- **No em dashes anywhere**: not in the UI, not in the code, not in the docs.
  Use a colon, a comma or a full stop.
- **History, two families of actions**: instant action (swatch click, toggle)
  goes through `apply(patch)`; continuous gesture (slider drag, color picker)
  uses `preview(patch)` during the gesture then `commit()` at the end
  (release, picker close). A whole drag = ONE history entry. The `Slider`
  component exposes `onCommit` for that; native color inputs commit on the
  DOM `change` event (see `ColorInput` in BackgroundPanel).
- **No application network calls**: no fetch, no analytics. If a feature seems
  to require a server, rethink the feature.

### Adding an editor feature (recipe)
1. **State**: property in `editorStore.js` (+ `DOC_KEYS` if undoable).
2. **Render**: apply it in `CanvasStage.jsx`.
3. **Control**: Toolbar or panel, built from design system components.
4. **Shortcut** if relevant: `EditorPage.jsx`.
5. Check the result on screen **AND** in the exported PNG (html-to-image does
   not support all of CSS, testing the export is mandatory).

## 6. SEO and assets

- `index.html` carries all the SEO: title/description, Open Graph + 1200x630
  image, Twitter card, canonical, `WebApplication` JSON-LD, theme color.
- `public/`: multi-size favicon.ico, 16/32/192/512 PNGs, apple-touch-icon,
  `manifest.webmanifest`, `robots.txt`, `sitemap.xml`.
- The landing page (`pages/LandingPage.jsx`) is the `/` route: semantic HTML
  (article, nav, aria-labelledby), a single H1.
- Showcase media for the README lives in `docs/media/` and is regenerated by
  `scripts/record-demo.mjs` (see section 9).

## 7. Quality and verification

- **No commit without a smoke test**: `npm run dev`, import an image, change
  the background, export a PNG.
- Before pushing: `npm run build && npm run preview` and retest on the build
  (`base` and HashRouter can behave differently between dev and prod).
- Check `/design` after any design system change.
- Browser console errors are to be fixed, not ignored.

## 8. Known traps

- **html-to-image + external fonts**: `skipFonts: true` is mandatory in
  `exportImage.js`. If the scene ever contains text, embed the font as a
  data URI rather than removing that flag.
- **Scene zoom and scroll**: zoom is a `transform: scale()` that does not
  change the layout size. Hence `.scene-sizer` (sized to `size x zoom`) plus
  `margin: auto` centering inside `.editor__scroll`. Do not move the scroll
  back to `.editor__body` (it carries the sticky floating panels), and do not
  center with `place-items: center` (the top becomes unreachable on overflow).
  The export neutralizes the transform (`style: {transform: 'none'}`).
- **React StrictMode**: effects mount twice in dev, so global listeners must
  be idempotent and clean up after themselves.
- **`backgrounds.data.js` is generated**: do not edit it by hand.
- **Vite base**: if the GitHub repo is renamed, change `base` in
  `vite.config.js` AND the absolute URLs in
  `index.html` / `robots.txt` / `sitemap.xml`.

## 9. Regenerating the showcase media

`scripts/record-demo.mjs` drives the app with Playwright, records the session
and writes `docs/media/`. The root `package.json` exists only for that script.
It needs ffmpeg on the PATH:

```bash
npm install && npx playwright install chromium    # once, at the repo root
cd frontend && npm run build && npm run preview   # serves http://localhost:4173/snapshot/
npm run demo                                      # from the repo root
```

The demo input image (`docs/media/demo-input.png`) is itself generated from
`scripts/demo-app.html`, so the whole showcase is reproducible.

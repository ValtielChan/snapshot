# AGENTS.md — Snapshot

Guide de référence pour toute personne (ou agent) qui travaille sur ce dépôt.
À lire avant de coder. À **mettre à jour** dès qu'une convention change.

---

## 1. Le produit

Application web de mise en valeur de captures d'écran : on importe une image,
elle est posée sur un fond (dégradé/uni), entourée d'un cadre de fenêtre macOS,
avec marge et ombre, puis exportée en PNG (téléchargement ou presse-papier).

**Positionnement : gratuit, public, ouvert.** Pas de compte, pas de premium,
pas de watermark, pas de tracking. **Aucun backend** : tout se passe côté
client, l'image ne quitte jamais le navigateur. C'est un argument produit
(confidentialité) et une contrainte d'architecture — toute feature doit
fonctionner en statique.

L'analyse du produit de référence (ilovesnapshots.online) est dans
[`research/cahier-des-charges.html`](research/cahier-des-charges.html) —
utile pour les idées de features, ignorer tout ce qui est premium/auth.

## 2. Architecture

```
Snapshot/
├── frontend/                  # React 18 + Vite — SPA 100 % statique
│   ├── index.html             # SEO : meta, OG, JSON-LD, favicons, fonts
│   ├── public/                # favicons, manifest, robots.txt, sitemap, og-image
│   └── src/
│       ├── main.jsx           # entrée : monte <App/>, importe tokens+base
│       ├── App.jsx            # HashRouter : / (landing), /editor, /design
│       ├── assets/logo.png    # logo (généré par IA, détouré)
│       ├── styles/
│       │   ├── tokens.css     # TOUS les tokens du design system
│       │   └── base.css       # reset + fondations typo
│       ├── ui/                # design system (composants réutilisables)
│       ├── editor/            # domaine éditeur
│       │   ├── EditorPage.jsx # assemblage + raccourcis clavier
│       │   ├── Toolbar.jsx    # import, fond, largeur/marge, cadre, export
│       │   ├── CanvasStage.jsx# scène exportée + wrapper zoom (.scene-sizer)
│       │   ├── BackgroundPanel.jsx # 7 catégories + constructeur custom
│       │   ├── editorStore.js # état Zustand + historique undo/redo
│       │   ├── backgrounds.js # catégories + buildGradient()
│       │   ├── backgrounds.data.js # 156 fonds GÉNÉRÉS (ne pas éditer)
│       │   └── exportImage.js # rasterisation html-to-image
│       └── pages/             # LandingPage (accueil) + DesignSystemPage
├── .github/workflows/deploy.yml # build + déploiement GitHub Pages
├── research/                  # analyse du produit de référence (pas de code)
└── .vscode/tasks.json         # Dev / Build / Preview
```

## 3. Démarrage & déploiement

| Quoi | Comment |
|---|---|
| Dev | `Ctrl+Shift+B` dans VS Code, ou `cd frontend && npm run dev` |
| URL dev | http://localhost:5173/snapshot/ (le `base` s'applique aussi en dev) |
| Build | `npm run build` → `frontend/dist` |
| Preview build | `npm run preview` → http://localhost:4173/snapshot/ |
| Prod | push sur `main` → GitHub Actions → https://valtielchan.github.io/snapshot/ |

**Contraintes GitHub Pages** (hébergement statique pur) :
- `base: '/snapshot/'` dans `vite.config.js` — doit correspondre au nom du repo.
- **HashRouter** (pas BrowserRouter) : pas de rewrite serveur possible, le
  hash évite les 404 au rechargement des routes.
- Les URL absolues (OG, canonical, sitemap) pointent sur
  `https://valtielchan.github.io/snapshot/` — à changer si le repo bouge.

## 4. Design system (front)

**Style : néo-brutalisme bicolore.** Références vivantes sur `/design`.

### Règles non négociables
1. **Deux couleurs d'accent, pas une de plus** : `--primary: #EF8783`
   (corail) et `--secondary: #FFC38C` (pêche). Neutres : `--ink`, `--paper`,
   `--surface`, `--muted`. Sémantiques (parcimonie) : `--danger`, `--success`.
2. **Zéro dégradé, zéro arrondi, zéro ombre floue dans l'UI.**
   Bordures `3px solid var(--ink)`, ombres dures décalées
   (`box-shadow: 3px 3px 0 var(--ink)` — rester sobre), angles vifs.
   *Exception contrôlée* : la **scène exportée** (CanvasStage) est du contenu
   produit — dégradés et ombres douces y sont normaux.
3. **Toute valeur visuelle vient d'un token** (`styles/tokens.css`).
4. **Typo** : Archivo Black (titres, uppercase), Archivo (texte),
   monospace pour les valeurs numériques.
5. Interactions : hover = translation **-1px** + ombre +1px ; clic =
   translation +1px + ombre réduite. Subtil, jamais spectaculaire.
6. **Les boutons ont une hauteur FIXE par taille** (sm 32 / md 40 / lg 48,
   IconButton 40). **L'état toggle/pressed ne bouge pas la géométrie** :
   couleurs inversées, même position, même ombre.

### Ajouter un composant UI
1. Le coder dans `src/ui/index.jsx` + styles `.ds-<nom>` dans `ui.css`.
2. N'utiliser que des tokens.
3. **L'ajouter à la vitrine `/design`** avec toutes ses variantes.
4. Accessibilité : aria-label, focus visible, clavier.

## 5. Conventions front (React)

- **Composants fonction + hooks**, export nommé, PascalCase.
- **État global : Zustand** (`editorStore`). Pas de Redux.
- **Éditeur : toute propriété visuelle du document passe par `apply(patch)`**
  — c'est ce qui alimente l'undo/redo. Zoom et image sont hors historique
  (navigation, pas édition), c'est voulu.
- CSS par domaine (`editor.css`, `landing.css`), classes BEM-light.
- Texte UI, landing et SEO en **anglais** (produit international), code en
  **anglais**. Cette doc (AGENTS.md) reste en français.
- **Icônes : Font Awesome** (`@fortawesome/react-fontawesome`), jamais
  d'emojis dans l'interface.
- **Historique — deux familles d'actions** : action instantanée (clic swatch,
  toggle) → `apply(patch)` ; geste continu (drag de slider, color picker) →
  `preview(patch)` pendant le geste puis `commit()` à la fin (relâchement,
  fermeture du picker). Un drag entier = UNE entrée d'historique. Le composant
  `Slider` expose `onCommit` pour ça ; les inputs couleur natifs committent
  sur l'événement DOM `change` (voir `ColorInput` dans BackgroundPanel).
- **Aucun appel réseau applicatif** : pas de fetch, pas d'analytics. Si une
  feature semble exiger un serveur, repenser la feature.

### Ajouter une feature à l'éditeur (recette)
1. **État** : propriété dans `editorStore.js` (+ `DOC_KEYS` si annulable).
2. **Rendu** : l'appliquer dans `CanvasStage.jsx`.
3. **Contrôle** : Toolbar ou panneau, en composants du design system.
4. **Raccourci** éventuel : `EditorPage.jsx`.
5. Vérifier le rendu à l'écran **ET** dans le PNG exporté (html-to-image ne
   supporte pas tout le CSS — tester l'export est obligatoire).

## 6. SEO & assets

- `index.html` porte tout le SEO : title/description, Open Graph + image
  1200×630, Twitter card, canonical, JSON-LD `WebApplication`, thème.
- `public/` : favicon.ico multi-tailles, PNG 16/32/192/512, apple-touch-icon,
  `manifest.webmanifest`, `robots.txt`, `sitemap.xml`.
- Le logo source est généré par IA (voir `research/dev-checks/logo-raw.png`),
  détouré et décliné par `scratchpad/make_assets.py` (script conservé dans
  l'historique de session ; le refaire à la main est simple : PIL, flood-fill
  depuis les bords, resize LANCZOS).
- La landing (`pages/LandingPage.jsx`) est la page d'accueil `/` : HTML
  sémantique (article, nav, aria-labelledby), un seul H1.

## 7. Qualité & vérification

- **Pas de commit sans smoke test** : `npm run dev`, importer une image,
  changer le fond, exporter un PNG.
- Avant un push : `npm run build && npm run preview` et re-tester sur le
  build (le `base` et le HashRouter peuvent diverger entre dev et prod).
- Vérifier `/design` après toute modif du design system.
- Erreurs console navigateur = à traiter, pas à ignorer.

## 8. Pièges connus

- **html-to-image + fonts externes** : `skipFonts: true` obligatoire dans
  `exportImage.js`. Si un jour la scène contient du texte, embarquer la
  fonte en data-URI plutôt que retirer ce flag.
- **Zoom & scroll de la scène** : le zoom est un `transform: scale()` qui ne
  change pas la taille layout. D'où `.scene-sizer` (dimensionné à
  `taille × zoom`) + centrage `margin: auto` dans `.editor__scroll`.
  Ne pas remettre le scroll sur `.editor__body` (il porte les panneaux
  flottants sticky), ne pas centrer avec grid `place-items: center` (haut
  inatteignable en overflow). L'export neutralise le transform
  (`style: {transform: 'none'}`).
- **StrictMode React** : les effets se montent deux fois en dev — listeners
  globaux idempotents avec cleanup.
- **`backgrounds.data.js` est généré** : ne pas l'éditer à la main.
- **base Vite** : si le repo GitHub est renommé, changer `base` dans
  `vite.config.js` ET les URL absolues de `index.html`/`robots.txt`/`sitemap.xml`.

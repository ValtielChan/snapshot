# 📷 Snapshot

**De belles captures d'écran, en quelques secondes.**

Importez un screenshot, posez-le sur un fond qui claque, encadrez-le comme une
vraie fenêtre macOS et exportez un PNG haute résolution prêt à publier.
Gratuit, sans compte, sans watermark — et 100 % dans votre navigateur :
aucune image n'est envoyée sur un serveur.

**➡️ Essayer : https://valtielchan.github.io/snapshot/**

## Fonctionnalités

- **Import** par glisser-déposer, sélecteur de fichier ou collage (`Ctrl+V`)
- **156 fonds** en 7 familles (dégradés et couleurs unies)
- **Dégradés custom** : linéaire, radial, angulaire, diamant — direction
  réglable, 2 à 4 couleurs masquables, ou couleur solide
- **Cadre de fenêtre macOS** clair/sombre, ombre portée douce
- **Largeur et marges** réglables au pixel, zoom, annuler/rétablir illimité
- **Export** PNG ×2 : téléchargement ou copie dans le presse-papier
- Design **néo-brutaliste** : corail `#EF8783` × pêche `#FFC38C`

## Stack

React 18 + Vite, Zustand, html-to-image. Aucun backend : application
entièrement statique, hébergée sur GitHub Pages.

## Développement

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173/snapshot/
```

Ou dans VS Code : `Ctrl+Shift+B` (tâche « Dev: Lancer l'app »).

```bash
npm run build      # build de production → frontend/dist
npm run preview    # sert le build en local
```

## Déploiement

Automatique : chaque push sur `main` déclenche le workflow GitHub Actions
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) qui build et
publie sur GitHub Pages.

## Structure

```
frontend/src/
├── App.jsx            # routes : / (landing), /editor, /design
├── styles/            # tokens du design system + base
├── ui/                # composants néo-brutalistes réutilisables
├── editor/            # l'éditeur (scène, toolbar, fonds, export)
└── pages/             # landing + vitrine du design system
```

Conventions et guide de contribution : voir [AGENTS.md](AGENTS.md).
L'analyse du produit de référence est dans [research/](research/).

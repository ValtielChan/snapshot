import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// App 100 % statique (aucun backend). `base` correspond au nom du dépôt
// GitHub pour l'hébergement sur GitHub Pages :
// https://<user>.github.io/snapshot/
export default defineConfig({
  plugins: [react()],
  base: '/snapshot/',
  server: {
    port: 5173,
  },
})

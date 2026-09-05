import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 100% static app (no backend). `base` matches the GitHub repository name
// for GitHub Pages hosting:
// https://<user>.github.io/snapshot/
export default defineConfig({
  plugins: [react()],
  base: '/snapshot/',
  server: {
    port: 5173,
  },
})

import { HashRouter, Route, Routes } from 'react-router-dom'
import { EditorPage } from './editor/EditorPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { LandingPage } from './pages/LandingPage'

// HashRouter : GitHub Pages ne sert que des fichiers statiques (pas de
// rewrite serveur) — le hash routing évite les 404 au rechargement.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/design" element={<DesignSystemPage />} />
      </Routes>
    </HashRouter>
  )
}

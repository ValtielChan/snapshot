import { HashRouter, Route, Routes } from 'react-router-dom'
import { EditorPage } from './editor/EditorPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { LandingPage } from './pages/LandingPage'

// HashRouter: GitHub Pages only serves static files (no server rewrite),
// so hash routing avoids 404s on reload.
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

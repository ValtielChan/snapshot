/**
 * Page éditeur : assemble toolbar, scène et panneaux flottants.
 * Raccourcis : Ctrl+Z / Ctrl+Shift+Z (historique), Ctrl+0 (zoom), Ctrl+V (import).
 * 100 % côté client : l'image ne quitte jamais le navigateur.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logoUrl from '../assets/logo.png'
import { Toast } from '../ui'
import { BackgroundPanel } from './BackgroundPanel'
import { CanvasStage } from './CanvasStage'
import { Dropzone } from './Dropzone'
import { copyScene, downloadScene } from './exportImage'
import { loadImageFile, useEditor } from './editorStore'
import { Toolbar } from './Toolbar'
import { ZoomControl } from './ZoomControl'
import './editor.css'

export function EditorPage() {
  const { image, undo, redo, setZoom } = useEditor()

  const sceneRef = useRef(null)
  const [bgPanelOpen, setBgPanelOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [exporting, setExporting] = useState(false)

  // Raccourcis clavier globaux
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const key = e.key.toLowerCase()
      if (key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if (key === '0') {
        e.preventDefault()
        setZoom(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, setZoom])

  // Coller une image même quand la dropzone n'est plus montée
  useEffect(() => {
    const onPaste = (e) => {
      const file = [...(e.clipboardData?.items ?? [])]
        .find((item) => item.type.startsWith('image/'))
        ?.getAsFile()
      if (file) loadImageFile(file)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  const flash = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2200)
  }

  const handleExport = async (fn, successMessage) => {
    if (!sceneRef.current) return
    setExporting(true)
    try {
      await fn(sceneRef.current)
      flash(successMessage)
    } catch (err) {
      flash(`Échec : ${err.message}`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="editor">
      <header className="editor__header">
        <Link to="/" className="editor__brand" title="Retour à l'accueil">
          <img className="editor__brand-mark" src={logoUrl} alt="" width="34" height="34" />
          Snapshot
        </Link>

        <Toolbar
          onToggleBackgroundPanel={() => setBgPanelOpen((v) => !v)}
          onCopy={() => handleExport(copyScene, 'Copié dans le presse-papier !')}
          onDownload={() => handleExport(downloadScene, 'Image téléchargée !')}
          exporting={exporting}
        />
      </header>

      <div className="editor__body">
        <div className="editor__scroll">
          {image ? <CanvasStage ref={sceneRef} /> : <Dropzone />}
        </div>

        {/* Panneaux flottants : hors du conteneur scrollable → sticky à l'écran */}
        {bgPanelOpen && image && <BackgroundPanel onClose={() => setBgPanelOpen(false)} />}
        {image && <ZoomControl />}
      </div>

      <Toast>{toast}</Toast>
    </div>
  )
}

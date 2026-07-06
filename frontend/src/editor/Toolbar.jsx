/**
 * Barre d'outils principale de l'éditeur.
 * Groupes : import · fond/format · cadre · historique · export.
 */

import { useEffect, useRef, useState } from 'react'
import { Button, IconButton, Slider } from '../ui'
import { loadImageFile, useEditor } from './editorStore'

/** Popover ancré sous un bouton de la toolbar, fermé au clic extérieur. */
function ToolbarPopover({ open, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (ref.current && !ref.current.parentElement.contains(e.target)) onClose()
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="popover" ref={ref}>
      {children}
    </div>
  )
}

export function Toolbar({ onToggleBackgroundPanel, onCopy, onDownload, exporting }) {
  const {
    image,
    frame,
    frameDark,
    showBackground,
    padding,
    width,
    apply,
    undo,
    redo,
    past,
    future,
  } = useEditor()

  const [popover, setPopover] = useState(null) // 'width' | 'spacing' | null
  const fileRef = useRef(null)

  const hasImage = Boolean(image)

  return (
    <div className="editor__tools">
      <Button variant="primary" size="md" onClick={() => fileRef.current?.click()}>
        ⬆ Importer
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => loadImageFile(e.target.files?.[0])}
      />

      <div className="editor__sep" aria-hidden="true" />

      <Button size="md" disabled={!hasImage} onClick={onToggleBackgroundPanel}>
        🎨 Fond
      </Button>

      <Button
        size="md"
        pressed={hasImage && showBackground}
        disabled={!hasImage}
        onClick={() => apply({ showBackground: !showBackground })}
        title="Afficher / masquer le fond"
      >
        Fond visible
      </Button>

      <div className="toolbar-popover-anchor">
        <Button size="md" disabled={!hasImage} onClick={() => setPopover(popover === 'width' ? null : 'width')}>
          ↔ Largeur
        </Button>
        <ToolbarPopover open={popover === 'width'} onClose={() => setPopover(null)}>
          <Slider
            label="Largeur de scène"
            value={width}
            min={480}
            max={1600}
            step={10}
            unit="px"
            onChange={(v) => apply({ width: v })}
          />
        </ToolbarPopover>
      </div>

      <div className="toolbar-popover-anchor">
        <Button size="md" disabled={!hasImage} onClick={() => setPopover(popover === 'spacing' ? null : 'spacing')}>
          ⊡ Marge
        </Button>
        <ToolbarPopover open={popover === 'spacing'} onClose={() => setPopover(null)}>
          <Slider
            label="Marge autour"
            value={padding}
            min={0}
            max={200}
            step={4}
            unit="px"
            onChange={(v) => apply({ padding: v })}
          />
        </ToolbarPopover>
      </div>

      <div className="editor__sep" aria-hidden="true" />

      <Button
        size="md"
        pressed={hasImage && frame}
        disabled={!hasImage}
        onClick={() => apply({ frame: !frame })}
        title="Cadre de fenêtre macOS"
      >
        ▭ Cadre
      </Button>

      <Button
        size="md"
        disabled={!hasImage || !frame}
        onClick={() => apply({ frameDark: !frameDark })}
        title="Thème du cadre"
      >
        {frameDark ? '◐ Sombre' : '◑ Clair'}
      </Button>

      <div className="editor__sep" aria-hidden="true" />

      <IconButton label="Annuler (Ctrl+Z)" disabled={past.length === 0} onClick={undo}>
        ↶
      </IconButton>
      <IconButton label="Rétablir (Ctrl+Shift+Z)" disabled={future.length === 0} onClick={redo}>
        ↷
      </IconButton>

      <div className="editor__spacer" />

      <Button size="md" disabled={!hasImage || exporting} onClick={onCopy}>
        Copier
      </Button>
      <Button variant="secondary" size="md" disabled={!hasImage || exporting} onClick={onDownload}>
        {exporting ? '…' : '⬇ Télécharger'}
      </Button>
    </div>
  )
}

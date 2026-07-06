/** Contrôle de zoom flottant : −, valeur cliquable (reset 100 %), +. */

import { IconButton } from '../ui'
import { useEditor } from './editorStore'

const STEP = 0.25

export function ZoomControl() {
  const { zoom, setZoom } = useEditor()

  return (
    <div className="editor__floating editor__floating--zoom">
      <div className="zoombox">
        <IconButton label="Zoom arrière" onClick={() => setZoom(zoom - STEP)}>
          −
        </IconButton>
        <button
          type="button"
          className="zoombox__value"
          onClick={() => setZoom(1)}
          title="Réinitialiser (Ctrl+0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <IconButton label="Zoom avant" onClick={() => setZoom(zoom + STEP)}>
          +
        </IconButton>
      </div>
    </div>
  )
}

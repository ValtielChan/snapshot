/** Floating zoom control: −, clickable value (reset 100%), +. */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '../ui'
import { useEditor } from './editorStore'

const STEP = 0.25

export function ZoomControl() {
  const { zoom, setZoom } = useEditor()

  return (
    <div className="editor__floating editor__floating--zoom">
      <div className="zoombox">
        <IconButton label="Zoom out" onClick={() => setZoom(zoom - STEP)}>
          <FontAwesomeIcon icon={faMinus} />
        </IconButton>
        <button
          type="button"
          className="zoombox__value"
          onClick={() => setZoom(1)}
          title="Reset zoom (Ctrl+0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <IconButton label="Zoom in" onClick={() => setZoom(zoom + STEP)}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
      </div>
    </div>
  )
}

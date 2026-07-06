/**
 * Main editor toolbar.
 * Groups: import · background/layout · frame · history · export.
 */

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faDownload,
  faExpand,
  faEye,
  faLeftRight,
  faMoon,
  faPalette,
  faRotateLeft,
  faRotateRight,
  faSun,
  faUpload,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons'
import { Button, IconButton, Slider } from '../ui'
import { loadImageFile, useEditor } from './editorStore'

/** Popover anchored under a toolbar button, closed on outside click. */
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
    preview,
    commit,
    undo,
    redo,
    past,
    future,
  } = useEditor()

  const [popover, setPopover] = useState(null) // 'width' | 'padding' | null
  const fileRef = useRef(null)

  const hasImage = Boolean(image)

  return (
    <div className="editor__tools">
      <Button variant="primary" size="md" onClick={() => fileRef.current?.click()}>
        <FontAwesomeIcon icon={faUpload} /> Import
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
        <FontAwesomeIcon icon={faPalette} /> Background
      </Button>

      <Button
        size="md"
        pressed={hasImage && showBackground}
        disabled={!hasImage}
        onClick={() => apply({ showBackground: !showBackground })}
        title="Show / hide the background"
      >
        <FontAwesomeIcon icon={faEye} /> Show BG
      </Button>

      <div className="toolbar-popover-anchor">
        <Button
          size="md"
          disabled={!hasImage}
          onClick={() => setPopover(popover === 'width' ? null : 'width')}
        >
          <FontAwesomeIcon icon={faLeftRight} /> Width
        </Button>
        <ToolbarPopover open={popover === 'width'} onClose={() => setPopover(null)}>
          <Slider
            label="Scene width"
            value={width}
            min={480}
            max={1600}
            step={10}
            unit="px"
            onChange={(v) => preview({ width: v })}
            onCommit={commit}
          />
        </ToolbarPopover>
      </div>

      <div className="toolbar-popover-anchor">
        <Button
          size="md"
          disabled={!hasImage}
          onClick={() => setPopover(popover === 'padding' ? null : 'padding')}
        >
          <FontAwesomeIcon icon={faExpand} /> Padding
        </Button>
        <ToolbarPopover open={popover === 'padding'} onClose={() => setPopover(null)}>
          <Slider
            label="Padding around"
            value={padding}
            min={0}
            max={200}
            step={4}
            unit="px"
            onChange={(v) => preview({ padding: v })}
            onCommit={commit}
          />
        </ToolbarPopover>
      </div>

      <div className="editor__sep" aria-hidden="true" />

      <Button
        size="md"
        pressed={hasImage && frame}
        disabled={!hasImage}
        onClick={() => apply({ frame: !frame })}
        title="macOS window frame"
      >
        <FontAwesomeIcon icon={faWindowMaximize} /> Frame
      </Button>

      <Button
        size="md"
        disabled={!hasImage || !frame}
        onClick={() => apply({ frameDark: !frameDark })}
        title="Frame theme"
      >
        <FontAwesomeIcon icon={frameDark ? faMoon : faSun} /> {frameDark ? 'Dark' : 'Light'}
      </Button>

      <div className="editor__sep" aria-hidden="true" />

      <IconButton label="Undo (Ctrl+Z)" disabled={past.length === 0} onClick={undo}>
        <FontAwesomeIcon icon={faRotateLeft} />
      </IconButton>
      <IconButton label="Redo (Ctrl+Shift+Z)" disabled={future.length === 0} onClick={redo}>
        <FontAwesomeIcon icon={faRotateRight} />
      </IconButton>

      <div className="editor__spacer" />

      <Button size="md" disabled={!hasImage || exporting} onClick={onCopy}>
        <FontAwesomeIcon icon={faCopy} /> Copy
      </Button>
      <Button variant="secondary" size="md" disabled={!hasImage || exporting} onClick={onDownload}>
        <FontAwesomeIcon icon={faDownload} /> {exporting ? '…' : 'Download'}
      </Button>
    </div>
  )
}

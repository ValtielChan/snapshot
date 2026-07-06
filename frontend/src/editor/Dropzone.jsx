/** Zone d'import : drag-and-drop, clic (file picker), et collage Ctrl+V. */

import { useEffect, useRef, useState } from 'react'
import { Badge } from '../ui'
import { loadImageFile } from './editorStore'

const FORMATS = ['PNG', 'JPG', 'GIF', 'WebP']

export function Dropzone() {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

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

  return (
    <div
      className={`dropzone ${over ? 'dropzone--over' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        loadImageFile(e.dataTransfer.files?.[0])
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      aria-label="Importer une image"
    >
      <div className="dropzone__icon">⬆</div>
      <h2 className="dropzone__title">Dépose une image ici</h2>
      <p className="dropzone__hint">
        Clique pour parcourir, ou colle depuis le presse-papier (Ctrl+V).
        <br />
        Ton image ne quitte jamais ton navigateur.
      </p>
      <div className="dropzone__formats">
        {FORMATS.map((f) => (
          <Badge key={f}>{f}</Badge>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => loadImageFile(e.target.files?.[0])}
      />
    </div>
  )
}

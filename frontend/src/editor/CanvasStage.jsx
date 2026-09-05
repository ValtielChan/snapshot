/**
 * The scene: what the user composes and exports.
 * Background (gradient/solid) + framed window (macOS title bar) + image.
 *
 * Zoom is a transform: scale() on .scene, which does NOT change the layout
 * size, hence the .scene-sizer wrapper sized explicitly to the zoomed
 * dimensions: the scrollable container then sees the real visual size (no
 * scrollbar when it fits, full scroll when it does not).
 *
 * `sceneRef` points at the node rasterized on export (the transform is
 * neutralized there, see exportImage.js).
 */

import { forwardRef } from 'react'
import { useEditor } from './editorStore'

const DOT_COLORS = ['#ff5f57', '#febc2e', '#28c840']
const TITLEBAR_HEIGHT = 34

/** Layout height (unzoomed) of the scene, derived from state. */
function sceneHeight({ image, width, padding, frame, showBackground }) {
  const pad = showBackground ? padding : 0
  const contentWidth = width - 2 * pad
  const imageHeight = contentWidth * (image.naturalHeight / image.naturalWidth)
  return Math.round(imageHeight + (frame ? TITLEBAR_HEIGHT : 0) + 2 * pad)
}

export const CanvasStage = forwardRef(function CanvasStage(_, sceneRef) {
  const state = useEditor()
  const { image, background, showBackground, frame, frameDark, padding, width, zoom } = state

  if (!image) return null

  const height = sceneHeight(state)

  return (
    <div
      className="scene-sizer"
      style={{ width: Math.round(width * zoom), height: Math.round(height * zoom) }}
    >
      <div
        className="scene"
        ref={sceneRef}
        data-testid="scene"
        style={{
          width: `${width}px`,
          padding: showBackground ? `${padding}px` : 0,
          background: showBackground ? background.css : 'transparent',
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        <div className={`scene__window ${frame ? '' : 'scene__window--bare'}`}>
          {frame && (
            <div
              className={`scene__titlebar ${
                frameDark ? 'scene__titlebar--dark' : 'scene__titlebar--light'
              }`}
            >
              {DOT_COLORS.map((c) => (
                <span key={c} className="scene__dot" style={{ background: c }} />
              ))}
            </div>
          )}
          <img className="scene__img" src={image.src} alt="Imported screenshot" />
        </div>
      </div>
    </div>
  )
})

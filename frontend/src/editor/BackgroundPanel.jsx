/**
 * Background picker panel.
 * - Themes tab: 7 categories (156 backgrounds).
 * - Custom tab: linear/radial/conic/diamond gradient, 0-360° direction,
 *   2 to 4 colors (individually hideable, hex input), or a solid color.
 *
 * History: dragging a color picker or the direction slider previews live
 * and commits ONE history entry when the gesture ends (see editorStore).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Panel, Slider, Swatch, Tabs } from '../ui'
import { BACKGROUND_CATEGORIES, buildGradient, GRADIENT_TYPES } from './backgrounds'
import { useEditor } from './editorStore'

const HEX_RE = /^#[0-9a-f]{6}$/i

/**
 * Native color input wrapper: React's onChange fires continuously while the
 * picker is open (= preview) ; the native 'change' event fires when the
 * picker is confirmed/closed (= commit).
 */
function ColorInput({ value, disabled, label, onPreview, onCommit }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !onCommit) return undefined
    el.addEventListener('change', onCommit)
    return () => el.removeEventListener('change', onCommit)
  }, [onCommit])

  return (
    <input
      ref={ref}
      type="color"
      value={value}
      disabled={disabled}
      onChange={(e) => onPreview(e.target.value)}
      aria-label={label}
    />
  )
}

/** One color stop: picker + hex field + hide toggle (except color 1). */
function ColorStop({ index, color, hidden, onPreview, onCommit, onToggle }) {
  const [hexDraft, setHexDraft] = useState(null) // in-progress typing

  const commitHex = (value) => {
    if (HEX_RE.test(value)) onCommit(value)
    setHexDraft(null)
  }

  return (
    <div className={`bgc-stop ${hidden ? 'bgc-stop--hidden' : ''}`}>
      <div className="bgc-stop__head">
        <span className="ds-label">C{index + 1}</span>
        {index > 0 && (
          <button
            type="button"
            className="bgc-stop__toggle"
            onClick={onToggle}
            aria-pressed={hidden}
          >
            {hidden ? 'Off' : 'On'}
          </button>
        )}
      </div>
      <ColorInput
        value={color}
        disabled={hidden}
        label={`Color ${index + 1}`}
        onPreview={onPreview}
        onCommit={onCommit ? () => onCommit() : undefined}
      />
      <input
        className="ds-input bgc-stop__hex"
        value={hexDraft ?? color}
        disabled={hidden}
        onChange={(e) => setHexDraft(e.target.value)}
        onBlur={(e) => commitHex(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && commitHex(e.target.value)}
        spellCheck={false}
        aria-label={`Hex color ${index + 1}`}
      />
    </div>
  )
}

export function BackgroundPanel({ onClose }) {
  const { background, apply, preview, commit } = useEditor()
  const [tab, setTab] = useState('themes')

  // Custom builder state
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState(135)
  const [colors, setColors] = useState(['#ef8783', '#ffc38c', '#1a1a2e', '#f5f5f5'])
  const [hidden, setHidden] = useState([false, false, true, true])
  const [solid, setSolid] = useState('#ededed')
  const [solidDraft, setSolidDraft] = useState(null)

  const activeColors = useMemo(() => colors.filter((_, i) => !hidden[i]), [colors, hidden])

  const gradientPatch = (t = type, a = angle, cs = activeColors) => ({
    background: { id: 'custom', css: buildGradient(t, a, cs) },
  })

  const previewColor = (i, value) => {
    const next = colors.map((c, idx) => (idx === i ? value : c))
    setColors(next)
    preview(gradientPatch(type, angle, next.filter((_, idx) => !hidden[idx])))
  }

  const commitColor = (i, value) => {
    if (value !== undefined) previewColor(i, value)
    commit()
  }

  const toggleHidden = (i) => {
    const next = hidden.map((h, idx) => (idx === i ? !h : h))
    // A gradient always keeps at least 2 visible colors
    if (next.filter((h) => !h).length < 2) return
    setHidden(next)
    apply(gradientPatch(type, angle, colors.filter((_, idx) => !next[idx])))
  }

  const previewSolid = (value) => {
    setSolid(value)
    preview({ background: { id: 'custom-solid', css: value } })
  }

  return (
    <div className="editor__floating editor__floating--bg">
      <Panel
        title="Background"
        actions={
          <button
            type="button"
            className="ds-modal__close"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
            onClick={onClose}
            aria-label="Close panel"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        }
      >
        <Tabs
          tabs={[
            { id: 'themes', label: 'Themes' },
            { id: 'custom', label: 'Custom' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'themes' &&
          BACKGROUND_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div className="bg-panel__section-title">{cat.label}</div>
              <div className="bg-panel__grid">
                {cat.items.map((item) => (
                  <Swatch
                    key={item.id}
                    background={item.css}
                    label={item.id}
                    active={background.id === item.id}
                    onClick={() => apply({ background: { id: item.id, css: item.css } })}
                  />
                ))}
              </div>
            </div>
          ))}

        {tab === 'custom' && (
          <div className="bg-panel__custom">
            <div className="bg-panel__section-title">Gradient</div>

            <div className="bgc-types">
              {GRADIENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`bgc-type ${type === t.id ? 'bgc-type--active' : ''}`}
                  onClick={() => {
                    setType(t.id)
                    apply(gradientPatch(t.id))
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Slider
              label="Direction"
              value={angle}
              min={0}
              max={360}
              unit="°"
              onChange={(v) => {
                setAngle(v)
                preview(gradientPatch(type, v))
              }}
              onCommit={commit}
            />

            <div className="bgc-stops">
              {colors.map((c, i) => (
                <ColorStop
                  key={i}
                  index={i}
                  color={c}
                  hidden={hidden[i]}
                  onPreview={(value) => previewColor(i, value)}
                  onCommit={(value) => commitColor(i, value)}
                  onToggle={() => toggleHidden(i)}
                />
              ))}
            </div>

            <div className="bg-panel__section-title">Solid color</div>
            <div className="bgc-solid">
              <ColorInput
                value={solid}
                label="Solid color"
                onPreview={previewSolid}
                onCommit={commit}
              />
              <input
                className="ds-input bgc-stop__hex"
                value={solidDraft ?? solid}
                onChange={(e) => setSolidDraft(e.target.value)}
                onBlur={(e) => {
                  if (HEX_RE.test(e.target.value)) {
                    previewSolid(e.target.value)
                    commit()
                  }
                  setSolidDraft(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && HEX_RE.test(e.target.value)) {
                    previewSolid(e.target.value)
                    commit()
                    setSolidDraft(null)
                  }
                }}
                spellCheck={false}
                aria-label="Solid color hex"
              />
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

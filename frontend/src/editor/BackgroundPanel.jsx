/**
 * Panneau de choix du fond.
 * - Onglet Thèmes : 7 catégories (156 fonds) issues de l'analyse de référence.
 * - Onglet Custom : dégradé linéaire/radial/angulaire/diamant, direction
 *   0-360°, 2 à 4 couleurs (masquables individuellement, saisie hex), ou
 *   couleur solide.
 */

import { useMemo, useState } from 'react'
import { Badge, Panel, Slider, Swatch, Tabs } from '../ui'
import { BACKGROUND_CATEGORIES, buildGradient, GRADIENT_TYPES } from './backgrounds'
import { useEditor } from './editorStore'

const HEX_RE = /^#[0-9a-f]{6}$/i

/** Un arrêt de couleur : picker + hex + bouton masquer (sauf couleur 1). */
function ColorStop({ index, color, hidden, onColor, onToggle }) {
  const [hexDraft, setHexDraft] = useState(null) // saisie en cours

  const commitHex = (value) => {
    if (HEX_RE.test(value)) onColor(value)
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
      <input
        type="color"
        value={color}
        disabled={hidden}
        onChange={(e) => onColor(e.target.value)}
        aria-label={`Couleur ${index + 1}`}
      />
      <input
        className="ds-input bgc-stop__hex"
        value={hexDraft ?? color}
        disabled={hidden}
        onChange={(e) => setHexDraft(e.target.value)}
        onBlur={(e) => commitHex(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && commitHex(e.target.value)}
        spellCheck={false}
        aria-label={`Hex couleur ${index + 1}`}
      />
    </div>
  )
}

export function BackgroundPanel({ onClose }) {
  const { background, apply } = useEditor()
  const [tab, setTab] = useState('themes')

  // État du constructeur custom
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState(135)
  const [colors, setColors] = useState(['#ef8783', '#ffc38c', '#1a1a2e', '#f5f5f5'])
  const [hidden, setHidden] = useState([false, false, true, true])
  const [solid, setSolid] = useState('#ededed')
  const [solidDraft, setSolidDraft] = useState(null)

  const activeColors = useMemo(
    () => colors.filter((_, i) => !hidden[i]),
    [colors, hidden],
  )

  const applyGradient = (t = type, a = angle, cs = activeColors) =>
    apply({ background: { id: 'custom', css: buildGradient(t, a, cs) } })

  const setColor = (i, value) => {
    const next = colors.map((c, idx) => (idx === i ? value : c))
    setColors(next)
    applyGradient(type, angle, next.filter((_, idx) => !hidden[idx]))
  }

  const toggleHidden = (i) => {
    const next = hidden.map((h, idx) => (idx === i ? !h : h))
    // Toujours au moins 2 couleurs visibles pour un dégradé
    if (next.filter((h) => !h).length < 2) return
    setHidden(next)
    applyGradient(type, angle, colors.filter((_, idx) => !next[idx]))
  }

  const applySolid = (value) => {
    setSolid(value)
    apply({ background: { id: 'custom-solid', css: value } })
  }

  return (
    <div className="editor__floating editor__floating--bg">
      <Panel
        title="Fond"
        actions={
          <button
            type="button"
            className="ds-modal__close"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
            onClick={onClose}
            aria-label="Fermer le panneau"
          >
            ✕
          </button>
        }
      >
        <Tabs
          tabs={[
            { id: 'themes', label: 'Thèmes' },
            { id: 'custom', label: 'Custom' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'themes' &&
          BACKGROUND_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div className="bg-panel__section-title">
                {cat.label}
                {cat.premium && <Badge variant="secondary">Pro</Badge>}
              </div>
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
            <div className="bg-panel__section-title">Dégradé</div>

            <div className="bgc-types">
              {GRADIENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`bgc-type ${type === t.id ? 'bgc-type--active' : ''}`}
                  onClick={() => {
                    setType(t.id)
                    applyGradient(t.id)
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
                applyGradient(type, v)
              }}
            />

            <div className="bgc-stops">
              {colors.map((c, i) => (
                <ColorStop
                  key={i}
                  index={i}
                  color={c}
                  hidden={hidden[i]}
                  onColor={(value) => setColor(i, value)}
                  onToggle={() => toggleHidden(i)}
                />
              ))}
            </div>

            <div className="bg-panel__section-title">Couleur solide</div>
            <div className="bgc-solid">
              <input
                type="color"
                value={solid}
                onChange={(e) => applySolid(e.target.value)}
                aria-label="Couleur solide"
              />
              <input
                className="ds-input bgc-stop__hex"
                value={solidDraft ?? solid}
                onChange={(e) => setSolidDraft(e.target.value)}
                onBlur={(e) => {
                  if (HEX_RE.test(e.target.value)) applySolid(e.target.value)
                  setSolidDraft(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && HEX_RE.test(e.target.value)) {
                    applySolid(e.target.value)
                    setSolidDraft(null)
                  }
                }}
                spellCheck={false}
                aria-label="Hex couleur solide"
              />
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

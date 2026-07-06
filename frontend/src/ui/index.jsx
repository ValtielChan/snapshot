/**
 * Design system Snapshot — composants néo-brutalistes.
 * Un seul point d'import : `import { Button, Panel, ... } from '../ui'`.
 * Styles dans ui.css, tokens dans styles/tokens.css.
 */

import { useEffect } from 'react'
import './ui.css'

/* --- Button ------------------------------------------------------ */
export function Button({
  variant = 'default', // default | primary | secondary | danger | ghost
  size = 'md', // sm | md | lg
  pressed = false,
  className = '',
  children,
  ...props
}) {
  const cls = [
    'ds-btn',
    `ds-btn--${size}`,
    variant !== 'default' && `ds-btn--${variant}`,
    pressed && 'ds-btn--pressed',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}

/* --- IconButton --------------------------------------------------- */
export function IconButton({ pressed = false, label, className = '', children, ...props }) {
  const cls = ['ds-iconbtn', pressed && 'ds-iconbtn--pressed', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={cls} aria-label={label} title={label} {...props}>
      {children}
    </button>
  )
}

/* --- Panel --------------------------------------------------------- */
export function Panel({ title, actions, className = '', children }) {
  return (
    <div className={`ds-panel ${className}`}>
      {title && (
        <div className="ds-panel__header">
          <span className="ds-panel__title">{title}</span>
          {actions}
        </div>
      )}
      <div className="ds-panel__body">{children}</div>
    </div>
  )
}

/* --- Modal ---------------------------------------------------------- */
export function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="ds-modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="ds-modal">
        <div className="ds-modal__header">
          <span className="ds-modal__title">{title}</span>
          <button type="button" className="ds-modal__close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>
        <div className="ds-modal__body">{children}</div>
      </div>
    </div>
  )
}

/* --- Field / Input --------------------------------------------------- */
export function Field({ label, error, children }) {
  return (
    <div className="ds-field">
      {label && <span className="ds-label">{label}</span>}
      {children}
      {error && <span className="ds-error">{error}</span>}
    </div>
  )
}

export function Input({ error = false, className = '', ...props }) {
  const cls = ['ds-input', error && 'ds-input--error', className].filter(Boolean).join(' ')
  return <input className={cls} {...props} />
}

/* --- Slider ------------------------------------------------------------ */
export function Slider({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div className="ds-slider">
      <div className="ds-slider__head">
        {label && <span className="ds-label">{label}</span>}
        <span className="ds-slider__value">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

/* --- Toggle -------------------------------------------------------------- */
export function Toggle({ label, checked, onChange, ...props }) {
  return (
    <label className="ds-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        {...props}
      />
      <span className="ds-toggle__track">
        <span className="ds-toggle__thumb" />
      </span>
      {label && <span className="ds-toggle__label">{label}</span>}
    </label>
  )
}

/* --- Tabs ------------------------------------------------------------------ */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="ds-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          className={`ds-tab ${active === t.id ? 'ds-tab--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* --- Badge / Kbd -------------------------------------------------------------- */
export function Badge({ variant = 'outline', className = '', children }) {
  return <span className={`ds-badge ds-badge--${variant} ${className}`}>{children}</span>
}

export function Kbd({ children }) {
  return <kbd className="ds-kbd">{children}</kbd>
}

/* --- Swatch ---------------------------------------------------------------------- */
export function Swatch({ background, active = false, label, ...props }) {
  return (
    <button
      type="button"
      className={`ds-swatch ${active ? 'ds-swatch--active' : ''}`}
      style={{ background }}
      aria-label={label}
      title={label}
      aria-pressed={active}
      {...props}
    />
  )
}

/* --- Toast (affichage simple, piloté par le parent) ------------------------------- */
export function Toast({ children }) {
  if (!children) return null
  return <div className="ds-toast">{children}</div>
}

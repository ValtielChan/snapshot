/**
 * Design system showcase: /design
 * Living visual reference: every component is mounted here with all its
 * variants. Update it whenever a component is added (see AGENTS.md).
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faRotateLeft,
  faRotateRight,
  faWindowMaximize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import {
  Badge,
  Button,
  Field,
  IconButton,
  Input,
  Kbd,
  Modal,
  Panel,
  Slider,
  Swatch,
  Tabs,
  Toggle,
} from '../ui'
import './design.css'

const TOKENS = [
  { name: '--primary', value: '#EF8783', ink: '#111' },
  { name: '--secondary', value: '#FFC38C', ink: '#111' },
  { name: '--ink', value: '#111111', ink: '#fff' },
  { name: '--paper', value: '#FAF5EC', ink: '#111' },
  { name: '--surface', value: '#FFFFFF', ink: '#111' },
  { name: '--danger', value: '#E02409', ink: '#fff' },
  { name: '--success', value: '#0F9D58', ink: '#fff' },
]

function Section({ title, children }) {
  return (
    <section className="dsp-section">
      <h2 className="dsp-section__title">{title}</h2>
      {children}
    </section>
  )
}

export function DesignSystemPage() {
  const [toggleOn, setToggleOn] = useState(true)
  const [slider, setSlider] = useState(64)
  const [tab, setTab] = useState('a')
  const [modalOpen, setModalOpen] = useState(false)
  const [swatch, setSwatch] = useState('#EF8783')

  return (
    <div className="dsp">
      <header className="dsp-hero">
        <h1>Design System</h1>
        <p>
          Two-color neo-brutalism: coral <Kbd>#EF8783</Kbd> × peach <Kbd>#FFC38C</Kbd>, 3px
          borders, hard shadows, zero gradients, zero rounded corners.
        </p>
        <Link to="/">
          <Button variant="primary">← Back to home</Button>
        </Link>
      </header>

      <Section title="01 · Colors">
        <div className="dsp-tokens">
          {TOKENS.map((t) => (
            <div key={t.name} className="dsp-token" style={{ background: t.value, color: t.ink }}>
              <span className="dsp-token__name">{t.name}</span>
              <span className="dsp-token__value">{t.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="02 · Typography">
        <div className="dsp-type">
          <h1>Display heading H1</h1>
          <h2>Display heading H2</h2>
          <h3>Display heading H3</h3>
          <p>
            Body text, Archivo. Readable, direct, no frills. Numeric values switch to{' '}
            <span className="dsp-mono">monospace 123 456</span>.
          </p>
          <p>
            Shortcuts: <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd> to undo, <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd> to
            paste.
          </p>
        </div>
      </Section>

      <Section title="03 · Buttons">
        <div className="dsp-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button>Default</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <Button pressed>Active / tool</Button>
        </div>
        <div className="dsp-row">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
        <div className="dsp-row">
          <IconButton label="Undo">
            <FontAwesomeIcon icon={faRotateLeft} />
          </IconButton>
          <IconButton label="Redo">
            <FontAwesomeIcon icon={faRotateRight} />
          </IconButton>
          <IconButton label="Zoom in">
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
          <IconButton label="Active" pressed>
            <FontAwesomeIcon icon={faWindowMaximize} />
          </IconButton>
          <IconButton label="Disabled" disabled>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </div>
      </Section>

      <Section title="04 · Forms">
        <div className="dsp-grid2">
          <Field label="Email">
            <Input placeholder="you@example.com" />
          </Field>
          <Field label="With error" error="This field is required">
            <Input placeholder="…" error />
          </Field>
          <Slider label="Padding" value={slider} min={0} max={200} unit="px" onChange={setSlider} />
          <div className="dsp-row" style={{ alignItems: 'center' }}>
            <Toggle label="Frame visible" checked={toggleOn} onChange={setToggleOn} />
          </div>
        </div>
      </Section>

      <Section title="05 · Navigation">
        <div className="dsp-grid2">
          <Tabs
            tabs={[
              { id: 'a', label: 'Themes' },
              { id: 'b', label: 'Custom' },
            ]}
            active={tab}
            onChange={setTab}
          />
          <div className="dsp-row">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="danger">Error</Badge>
          </div>
        </div>
      </Section>

      <Section title="06 · Surfaces">
        <div className="dsp-grid2">
          <Panel title="Titled panel" actions={<Badge variant="secondary">Action</Badge>}>
            Panel content. Coral header, 3px border, hard 3×3 shadow.
          </Panel>
          <div className="dsp-row">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open a modal
            </Button>
          </div>
        </div>
      </Section>

      <Section title="07 · Swatches (product content)">
        <p className="dsp-note">
          Controlled exception: gradients are allowed <em>inside the exported scene</em> (that's
          the product), never in the UI.
        </p>
        <div className="dsp-row">
          {['#EF8783', '#FFC38C', '#111111', 'linear-gradient(135deg,#667eea,#f093fb)'].map((c) => (
            <Swatch
              key={c}
              background={c}
              label={c}
              active={swatch === c}
              onClick={() => setSwatch(c)}
            />
          ))}
        </div>
      </Section>

      <Modal open={modalOpen} title="Example modal" onClose={() => setModalOpen(false)}>
        <p style={{ marginBottom: 'var(--sp-4)' }}>
          Peach header, closes with Escape, overlay click or the ✕ button.
        </p>
        <Button variant="primary" onClick={() => setModalOpen(false)}>
          Got it
        </Button>
      </Modal>
    </div>
  )
}

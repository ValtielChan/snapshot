/**
 * Vitrine du design system — /design
 * Référence visuelle vivante : chaque composant y est monté avec toutes
 * ses variantes. À mettre à jour à chaque ajout de composant (AGENTS.md).
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
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
          Néo-brutalisme bicolore : corail <Kbd>#EF8783</Kbd> × pêche <Kbd>#FFC38C</Kbd>, bordures
          3px, ombres dures, zéro dégradé, zéro arrondi.
        </p>
        <Link to="/">
          <Button variant="primary">← Retour à l'éditeur</Button>
        </Link>
      </header>

      <Section title="01 · Couleurs">
        <div className="dsp-tokens">
          {TOKENS.map((t) => (
            <div key={t.name} className="dsp-token" style={{ background: t.value, color: t.ink }}>
              <span className="dsp-token__name">{t.name}</span>
              <span className="dsp-token__value">{t.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="02 · Typographie">
        <div className="dsp-type">
          <h1>Titre display H1</h1>
          <h2>Titre display H2</h2>
          <h3>Titre display H3</h3>
          <p>
            Corps de texte — Archivo. Lisible, direct, sans fioriture. Les valeurs numériques
            passent en <span className="dsp-mono">monospace 123 456</span>.
          </p>
          <p>
            Raccourcis : <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd> pour annuler, <Kbd>Ctrl</Kbd> +{' '}
            <Kbd>V</Kbd> pour coller.
          </p>
        </div>
      </Section>

      <Section title="03 · Boutons">
        <div className="dsp-row">
          <Button variant="primary">Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button>Défaut</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Désactivé</Button>
          <Button pressed>Actif / outil</Button>
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
          <IconButton label="Annuler">↶</IconButton>
          <IconButton label="Rétablir">↷</IconButton>
          <IconButton label="Zoom avant">+</IconButton>
          <IconButton label="Actif" pressed>
            ▭
          </IconButton>
          <IconButton label="Désactivé" disabled>
            ✕
          </IconButton>
        </div>
      </Section>

      <Section title="04 · Formulaires">
        <div className="dsp-grid2">
          <Field label="Email">
            <Input placeholder="toi@exemple.com" />
          </Field>
          <Field label="Avec erreur" error="Ce champ est requis">
            <Input placeholder="…" error />
          </Field>
          <Slider label="Marge" value={slider} min={0} max={200} unit="px" onChange={setSlider} />
          <div className="dsp-row" style={{ alignItems: 'center' }}>
            <Toggle label="Cadre visible" checked={toggleOn} onChange={setToggleOn} />
          </div>
        </div>
      </Section>

      <Section title="05 · Navigation">
        <div className="dsp-grid2">
          <Tabs
            tabs={[
              { id: 'a', label: 'Thèmes' },
              { id: 'b', label: 'Custom' },
            ]}
            active={tab}
            onChange={setTab}
          />
          <div className="dsp-row">
            <Badge variant="primary">Primaire</Badge>
            <Badge variant="secondary">Pro</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="danger">Erreur</Badge>
          </div>
        </div>
      </Section>

      <Section title="06 · Surfaces">
        <div className="dsp-grid2">
          <Panel title="Panneau titré" actions={<Badge variant="secondary">Action</Badge>}>
            Contenu du panneau. Header jaune, bordure 3px, ombre dure 5×5.
          </Panel>
          <div className="dsp-row">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Ouvrir une modale
            </Button>
          </div>
        </div>
      </Section>

      <Section title="07 · Swatches (contenu produit)">
        <p className="dsp-note">
          Exception contrôlée : les dégradés sont autorisés <em>dans la scène exportée</em> (c'est
          le produit), jamais dans l'UI.
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

      <Modal open={modalOpen} title="Exemple de modale" onClose={() => setModalOpen(false)}>
        <p style={{ marginBottom: 'var(--sp-4)' }}>
          Header violet, fermeture par Échap, clic overlay ou bouton ✕.
        </p>
        <Button variant="primary" onClick={() => setModalOpen(false)}>
          Compris
        </Button>
      </Modal>
    </div>
  )
}

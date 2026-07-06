/**
 * Landing page (home) — fully static presentation of the app.
 * Clean semantic HTML for SEO; the main CTA leads to the editor.
 */

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBolt,
  faImages,
  faLock,
  faMugHot,
  faRulerCombined,
  faSliders,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons'
import logoUrl from '../assets/logo.png'
import { Badge, Button, Kbd } from '../ui'
import './landing.css'

const FEATURES = [
  {
    icon: faImages,
    title: '156 ready-made backgrounds',
    text: 'Seven families of gradients and colors — from calm pastels to cosmic neons — applied in one click.',
  },
  {
    icon: faSliders,
    title: 'Custom gradients',
    text: 'Linear, radial, angular or diamond: adjustable direction, up to four colors, or a solid fill.',
  },
  {
    icon: faWindowMaximize,
    title: 'macOS window frame',
    text: 'Dress your capture in a credible window, light or dark, with a soft drop shadow.',
  },
  {
    icon: faRulerCombined,
    title: 'Precise width & padding',
    text: 'Adjust the scene size and the space around your image to the pixel, with zoom and unlimited undo.',
  },
  {
    icon: faBolt,
    title: 'Instant export',
    text: 'High-resolution PNG (2×), downloaded or copied straight to your clipboard, ready to publish.',
  },
  {
    icon: faLock,
    title: '100% private',
    text: 'Everything happens in your browser: no image ever leaves your machine, no account, no limits.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Import',
    text: 'Drag and drop an image, click to browse, or paste it with Ctrl+V.',
  },
  {
    n: '2',
    title: 'Style',
    text: 'Pick a background, tune the frame, width and padding. It looks great from the first second.',
  },
  {
    n: '3',
    title: 'Export',
    text: 'Download the high-resolution PNG or copy it, and publish it anywhere.',
  },
]

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__nav-brand">
          <img src={logoUrl} alt="Snapshot logo" width="40" height="40" />
          <span>Snapshot</span>
        </div>
        <nav className="landing__nav-links" aria-label="Main navigation">
          <Link to="/design" className="landing__nav-link">
            Design system
          </Link>
          <a
            href="https://github.com/ValtielChan/snapshot"
            className="landing__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>
          <a
            href="https://ko-fi.com/valtiel_"
            className="landing__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faMugHot} /> Buy me a coffee
          </a>
          <Link to="/editor">
            <Button variant="primary" size="md">
              Open the editor
            </Button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="landing__hero">
          <img
            className="landing__hero-logo"
            src={logoUrl}
            alt=""
            width="180"
            height="180"
            aria-hidden="true"
          />
          <h1>
            Beautiful screenshots,
            <br />
            <mark>in seconds.</mark>
          </h1>
          <p className="landing__hero-sub">
            Drop a screenshot, set it on a gorgeous background, frame it like a real window and
            export a ready-to-share PNG. Free, no account, no watermark.
          </p>
          <div className="landing__hero-cta">
            <Link to="/editor">
              <Button variant="primary" size="lg">
                Open the editor →
              </Button>
            </Link>
            <div className="landing__hero-badges">
              <Badge variant="secondary">Free</Badge>
              <Badge variant="outline">No account</Badge>
              <Badge variant="outline">100% local</Badge>
            </div>
          </div>
        </section>

        <section className="landing__section" aria-labelledby="features-title">
          <h2 id="features-title">Everything you need, nothing you don't</h2>
          <div className="landing__features">
            {FEATURES.map((f) => (
              <article key={f.title} className="landing__feature">
                <span className="landing__feature-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing__section" aria-labelledby="steps-title">
          <h2 id="steps-title">Three moves, that's it</h2>
          <div className="landing__steps">
            {STEPS.map((s) => (
              <article key={s.n} className="landing__step">
                <span className="landing__step-n" aria-hidden="true">
                  {s.n}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <p className="landing__shortcuts">
            Shortcuts: <Kbd>Ctrl</Kbd>+<Kbd>V</Kbd> paste · <Kbd>Ctrl</Kbd>+<Kbd>Z</Kbd> undo ·{' '}
            <Kbd>Ctrl</Kbd>+<Kbd>0</Kbd> reset zoom
          </p>
        </section>

        <section className="landing__section landing__final">
          <h2>Your next screenshot deserves better than a raw PNG.</h2>
          <Link to="/editor">
            <Button variant="primary" size="lg">
              Try it now — it's free
            </Button>
          </Link>
        </section>
      </main>

      <footer className="landing__footer">
        <span>Snapshot — open source, no tracking, no server.</span>
        <nav aria-label="Footer links">
          <Link to="/editor">Editor</Link>
          <Link to="/design">Design system</Link>
          <a
            href="https://github.com/ValtielChan/snapshot"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code
          </a>
          <a href="https://ko-fi.com/valtiel_" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faMugHot} /> Buy me a coffee
          </a>
        </nav>
      </footer>
    </div>
  )
}

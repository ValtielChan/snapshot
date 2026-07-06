/**
 * Landing page (accueil) — présentation de l'app, 100 % statique.
 * Sémantique HTML soignée pour le SEO ; le CTA principal mène à l'éditeur.
 */

import { Link } from 'react-router-dom'
import logoUrl from '../assets/logo.png'
import { Badge, Button, Kbd } from '../ui'
import './landing.css'

const FEATURES = [
  {
    icon: '🖼️',
    title: '156 fonds prêts à l\'emploi',
    text: 'Sept familles de dégradés et couleurs — du pastel calme au néon cosmique — appliqués en un clic.',
  },
  {
    icon: '🎛️',
    title: 'Dégradés sur mesure',
    text: 'Linéaire, radial, angulaire ou diamant : direction réglable et jusqu\'à quatre couleurs, ou un aplat uni.',
  },
  {
    icon: '💻',
    title: 'Cadre de fenêtre macOS',
    text: 'Habillez votre capture d\'une fenêtre crédible, en clair ou en sombre, avec ombre portée douce.',
  },
  {
    icon: '📐',
    title: 'Largeur & marges précises',
    text: 'Ajustez la taille de scène et l\'espace autour de l\'image au pixel près, avec zoom et annulation illimitée.',
  },
  {
    icon: '⚡',
    title: 'Export instantané',
    text: 'PNG haute résolution (×2) téléchargé ou copié directement dans le presse-papier, prêt à publier.',
  },
  {
    icon: '🔒',
    title: '100 % privé',
    text: 'Tout se passe dans votre navigateur : aucune image envoyée sur un serveur, aucun compte, aucune limite.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Importez',
    text: 'Glissez-déposez une image, cliquez pour parcourir, ou collez-la avec Ctrl+V.',
  },
  {
    n: '2',
    title: 'Habillez',
    text: 'Choisissez un fond, ajustez cadre, largeur et marges. Le rendu est beau dès la première seconde.',
  },
  {
    n: '3',
    title: 'Exportez',
    text: 'Téléchargez le PNG haute résolution ou copiez-le, et publiez-le où vous voulez.',
  },
]

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__nav-brand">
          <img src={logoUrl} alt="Logo Snapshot" width="40" height="40" />
          <span>Snapshot</span>
        </div>
        <nav className="landing__nav-links" aria-label="Navigation principale">
          <Link to="/design" className="landing__nav-link">
            Design system
          </Link>
          <a
            href="https://github.com/ValtielChan/snapshot"
            className="landing__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <Link to="/editor">
            <Button variant="primary" size="md">
              Ouvrir l'éditeur
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
            De belles captures d'écran,
            <br />
            <mark>en quelques secondes.</mark>
          </h1>
          <p className="landing__hero-sub">
            Importez un screenshot, posez-le sur un fond qui claque, encadrez-le comme une vraie
            fenêtre et exportez un PNG prêt à publier. Gratuit, sans compte, sans watermark.
          </p>
          <div className="landing__hero-cta">
            <Link to="/editor">
              <Button variant="primary" size="lg">
                Ouvrir l'éditeur →
              </Button>
            </Link>
            <div className="landing__hero-badges">
              <Badge variant="secondary">Gratuit</Badge>
              <Badge variant="outline">Sans compte</Badge>
              <Badge variant="outline">100 % local</Badge>
            </div>
          </div>
        </section>

        <section className="landing__section" aria-labelledby="features-title">
          <h2 id="features-title">Tout ce qu'il faut, rien de superflu</h2>
          <div className="landing__features">
            {FEATURES.map((f) => (
              <article key={f.title} className="landing__feature">
                <span className="landing__feature-icon" aria-hidden="true">
                  {f.icon}
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing__section" aria-labelledby="steps-title">
          <h2 id="steps-title">Trois gestes, c'est tout</h2>
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
            Raccourcis : <Kbd>Ctrl</Kbd>+<Kbd>V</Kbd> coller · <Kbd>Ctrl</Kbd>+<Kbd>Z</Kbd>{' '}
            annuler · <Kbd>Ctrl</Kbd>+<Kbd>0</Kbd> zoom 100 %
          </p>
        </section>

        <section className="landing__section landing__final">
          <h2>Votre prochaine capture mérite mieux qu'un PNG brut.</h2>
          <Link to="/editor">
            <Button variant="primary" size="lg">
              Essayer maintenant — c'est gratuit
            </Button>
          </Link>
        </section>
      </main>

      <footer className="landing__footer">
        <span>Snapshot — open source, sans tracking, sans serveur.</span>
        <nav aria-label="Liens de pied de page">
          <Link to="/editor">Éditeur</Link>
          <Link to="/design">Design system</Link>
          <a
            href="https://github.com/ValtielChan/snapshot"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code source
          </a>
        </nav>
      </footer>
    </div>
  )
}

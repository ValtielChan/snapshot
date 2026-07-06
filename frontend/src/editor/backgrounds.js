/**
 * Bibliothèque de fonds + constructeur de dégradés custom.
 *
 * NB : les dégradés sont un contenu produit (le visuel exporté par
 * l'utilisateur), pas des couleurs d'UI — le design system, lui, reste
 * strictement bicolore et sans dégradé.
 *
 * Les 7 catégories (156 fonds) proviennent de l'app de référence
 * (research/) via backgrounds.data.js (généré, ne pas éditer à la main).
 */

import { RAW_CATEGORIES } from './backgrounds.data'

export const BACKGROUND_CATEGORIES = RAW_CATEGORIES

export const DEFAULT_BACKGROUND = RAW_CATEGORIES[0].items[9] // dusk (Calme)

/* ------------------------------------------------------------------ */
/* Constructeur custom : 4 types de dégradé, direction, 2 à 4 couleurs */
/* ------------------------------------------------------------------ */

export const GRADIENT_TYPES = [
  { id: 'linear', label: 'Linéaire' },
  { id: 'radial', label: 'Radial' },
  { id: 'angular', label: 'Angulaire' },
  { id: 'diamond', label: 'Diamant' },
]

/**
 * Construit la valeur CSS d'un fond custom.
 * @param {'linear'|'radial'|'angular'|'diamond'} type
 * @param {number} angle 0–360
 * @param {string[]} colors couleurs actives (2 à 4), déjà filtrées
 */
export function buildGradient(type, angle, colors) {
  if (colors.length === 0) return '#ffffff'
  if (colors.length === 1) return colors[0]

  const stops = colors
    .map((c, i) => `${c} ${Math.round((i / (colors.length - 1)) * 100)}%`)
    .join(', ')

  switch (type) {
    case 'radial': {
      // L'angle déplace le foyer du dégradé sur un cercle autour du centre.
      const rad = (angle * Math.PI) / 180
      const x = Math.round(50 + 35 * Math.cos(rad))
      const y = Math.round(50 + 35 * Math.sin(rad))
      return `radial-gradient(circle at ${x}% ${y}%, ${stops})`
    }
    case 'angular':
      return `conic-gradient(from ${angle}deg at 50% 50%, ${stops})`
    case 'diamond':
      // CSS n'a pas de vrai dégradé "diamant" : on l'approxime avec une
      // ellipse closest-side, visuellement distincte du radial standard.
      return `radial-gradient(ellipse closest-side at 50% 50%, ${stops})`
    case 'linear':
    default:
      return `linear-gradient(${angle}deg, ${stops})`
  }
}

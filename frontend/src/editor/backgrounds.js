/**
 * Background library + custom gradient builder.
 *
 * Note: gradients here are product content (the visual the user exports),
 * not UI colors. The design system itself stays strictly two-tone and
 * gradient-free.
 *
 * The 7 categories (156 backgrounds) live in backgrounds.data.js
 * (generated, do not edit by hand).
 */

import { RAW_CATEGORIES } from './backgrounds.data'

export const BACKGROUND_CATEGORIES = RAW_CATEGORIES

export const DEFAULT_BACKGROUND = RAW_CATEGORIES[0].items[9] // dusk (Calm)

/* ------------------------------------------------------------------ */
/* Custom builder: 4 gradient types, direction, 2 to 4 colors          */
/* ------------------------------------------------------------------ */

export const GRADIENT_TYPES = [
  { id: 'linear', label: 'Linear' },
  { id: 'radial', label: 'Radial' },
  { id: 'angular', label: 'Angular' },
  { id: 'diamond', label: 'Diamond' },
]

/**
 * Builds the CSS value of a custom background.
 * @param {'linear'|'radial'|'angular'|'diamond'} type
 * @param {number} angle 0 to 360
 * @param {string[]} colors active colors (2 to 4), already filtered
 */
export function buildGradient(type, angle, colors) {
  if (colors.length === 0) return '#ffffff'
  if (colors.length === 1) return colors[0]

  const stops = colors
    .map((c, i) => `${c} ${Math.round((i / (colors.length - 1)) * 100)}%`)
    .join(', ')

  switch (type) {
    case 'radial': {
      // The angle moves the gradient focus along a circle around the center.
      const rad = (angle * Math.PI) / 180
      const x = Math.round(50 + 35 * Math.cos(rad))
      const y = Math.round(50 + 35 * Math.sin(rad))
      return `radial-gradient(circle at ${x}% ${y}%, ${stops})`
    }
    case 'angular':
      return `conic-gradient(from ${angle}deg at 50% 50%, ${stops})`
    case 'diamond':
      // CSS has no true "diamond" gradient: approximated with a
      // closest-side ellipse, visually distinct from the standard radial.
      return `radial-gradient(ellipse closest-side at 50% 50%, ${stops})`
    case 'linear':
    default:
      return `linear-gradient(${angle}deg, ${stops})`
  }
}

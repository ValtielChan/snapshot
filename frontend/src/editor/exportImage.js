/**
 * Export de la scène en image.
 * On rasterise le nœud DOM de la scène avec html-to-image (pixelRatio 2
 * pour un rendu net), puis on télécharge ou copie le blob.
 */

import { toBlob } from 'html-to-image'

// skipFonts : la scène n'affiche pas de texte, et les feuilles Google Fonts
// (cross-origin) feraient échouer l'inlining CSS de html-to-image.
// style.transform: la scène porte le scale() du zoom d'affichage — on le
// neutralise pour que l'export soit toujours à taille réelle (100 %).
const EXPORT_OPTIONS = {
  pixelRatio: 2,
  cacheBust: true,
  skipFonts: true,
  style: { transform: 'none' },
}

async function sceneToBlob(node) {
  const blob = await toBlob(node, EXPORT_OPTIONS)
  if (!blob) throw new Error('Export failed')
  return blob
}

export async function downloadScene(node, filename = 'snapshot.png') {
  const blob = await sceneToBlob(node)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyScene(node) {
  const blob = await sceneToBlob(node)
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

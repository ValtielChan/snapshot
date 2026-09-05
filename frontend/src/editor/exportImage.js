/**
 * Scene export to image.
 * The scene DOM node is rasterized with html-to-image (pixelRatio 2 for a
 * crisp result), then the blob is downloaded or copied.
 */

import { toBlob } from 'html-to-image'

// skipFonts: the scene shows no text, and the cross-origin Google Fonts
// stylesheets would break html-to-image CSS inlining.
// style.transform: the scene carries the display zoom scale(), neutralized
// here so the export is always at real size (100%).
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

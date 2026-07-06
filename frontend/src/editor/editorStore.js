/**
 * Store de l'éditeur (Zustand) avec historique undo/redo.
 *
 * Principe : les propriétés visuelles du document (fond, cadre, padding,
 * largeur…) passent par `apply(patch)`, qui pousse l'état précédent dans
 * `past` et vide `future`. `undo()`/`redo()` naviguent dans ces piles.
 * Le zoom et l'image sont hors historique (navigation, pas édition).
 */

import { create } from 'zustand'
import { DEFAULT_BACKGROUND } from './backgrounds'

/** Propriétés du document suivies par l'historique. */
const DOC_KEYS = ['background', 'showBackground', 'frame', 'frameDark', 'padding', 'width']

const initialDoc = {
  background: { id: DEFAULT_BACKGROUND.id, css: DEFAULT_BACKGROUND.css },
  showBackground: true,
  frame: true,
  frameDark: true,
  padding: 64, // px autour de la fenêtre
  width: 900, // largeur de la scène en px
}

const pickDoc = (state) =>
  Object.fromEntries(DOC_KEYS.map((k) => [k, state[k]]))

const HISTORY_LIMIT = 100

export const useEditor = create((set, get) => ({
  ...initialDoc,

  image: null, // { src, naturalWidth, naturalHeight }
  zoom: 1,

  past: [],
  future: [],

  /** Modifie le document en enregistrant un point d'historique. */
  apply: (patch) =>
    set((state) => ({
      ...patch,
      past: [...state.past.slice(-HISTORY_LIMIT), pickDoc(state)],
      future: [],
    })),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {}
      const previous = state.past[state.past.length - 1]
      return {
        ...previous,
        past: state.past.slice(0, -1),
        future: [pickDoc(state), ...state.future],
      }
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return {}
      const [next, ...rest] = state.future
      return {
        ...next,
        past: [...state.past, pickDoc(state)],
        future: rest,
      }
    }),

  setImage: (image) => set({ image }),
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.25, zoom)) }),

  reset: () => set({ ...initialDoc, image: null, zoom: 1, past: [], future: [] }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}))

/** Charge un fichier image (File/Blob) dans le store. */
export function loadImageFile(file) {
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () =>
      useEditor.getState().setImage({
        src: reader.result,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      })
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

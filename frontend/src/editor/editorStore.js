/**
 * Editor store (Zustand) with undo/redo history.
 *
 * Two ways to change the document:
 * - `apply(patch)`   instant action (swatch click, toggle): pushes ONE
 *                      history entry immediately.
 * - `preview(patch)` + `commit()` continuous gestures (slider drag, color
 *                      picker): `preview` updates the document live WITHOUT
 *                      touching history, but remembers the pre-gesture state
 *                      once; `commit` (on release/close) pushes that single
 *                      snapshot. A whole drag = one undo step.
 *
 * Zoom and image stay out of history (navigation, not edition).
 */

import { create } from 'zustand'
import { DEFAULT_BACKGROUND } from './backgrounds'

/** Document properties tracked by history. */
const DOC_KEYS = ['background', 'showBackground', 'frame', 'frameDark', 'padding', 'width']

const initialDoc = {
  background: { id: DEFAULT_BACKGROUND.id, css: DEFAULT_BACKGROUND.css },
  showBackground: true,
  frame: true,
  frameDark: true,
  padding: 64, // px around the window
  width: 900, // scene width in px
}

const pickDoc = (state) => Object.fromEntries(DOC_KEYS.map((k) => [k, state[k]]))

const sameDoc = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const HISTORY_LIMIT = 100

export const useEditor = create((set, get) => ({
  ...initialDoc,

  image: null, // { src, naturalWidth, naturalHeight }
  zoom: 1,

  past: [],
  future: [],
  previewBase: null, // doc snapshot taken at the start of a gesture

  /** Instant document change: one history entry. */
  apply: (patch) =>
    set((state) => ({
      ...patch,
      past: [...state.past.slice(-HISTORY_LIMIT), state.previewBase ?? pickDoc(state)],
      future: [],
      previewBase: null,
    })),

  /** Live change during a gesture: no history entry yet. */
  preview: (patch) =>
    set((state) => ({
      ...patch,
      previewBase: state.previewBase ?? pickDoc(state),
    })),

  /** Ends a gesture: pushes the pre-gesture snapshot as ONE history entry. */
  commit: () =>
    set((state) => {
      const base = state.previewBase
      if (!base) return {}
      if (sameDoc(base, pickDoc(state))) return { previewBase: null } // no-op gesture
      return {
        past: [...state.past.slice(-HISTORY_LIMIT), base],
        future: [],
        previewBase: null,
      }
    }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {}
      const previous = state.past[state.past.length - 1]
      return {
        ...previous,
        past: state.past.slice(0, -1),
        future: [pickDoc(state), ...state.future],
        previewBase: null,
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
        previewBase: null,
      }
    }),

  setImage: (image) => set({ image }),
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.25, zoom)) }),

  reset: () =>
    set({ ...initialDoc, image: null, zoom: 1, past: [], future: [], previewBase: null }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}))

/** Loads an image file (File/Blob) into the store. */
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

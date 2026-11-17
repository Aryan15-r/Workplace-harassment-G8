import { create } from 'zustand'
import { descendantIds, INITIAL_POSITIONS, type Vec3 } from '@/data/graphLayout'
import { SEQUENCE, sequenceIndex } from '@/data/topics'
import type { Quality } from '@/types'

export interface FocusRequest {
  id: string
  nonce: number
}

let focusCounter = 0

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function initialQuality(): Quality {
  if (typeof window === 'undefined' || !window.matchMedia) return 'high'
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const smallScreen = window.innerWidth < 900
  return coarsePointer || smallScreen ? 'medium' : 'high'
}

export interface AppState {
  selectedId: string | null
  hoveredId: string | null
  sidebarOpen: boolean
  settingsOpen: boolean
  presentation: boolean
  poster: boolean
  feedbackQrOpen: boolean
  quality: Quality
  reducedMotion: boolean
  autoQuality: boolean
  positions: Record<string, Vec3>
  focus: FocusRequest | null
  resetNonce: number

  select: (id: string | null) => void
  focusNode: (id: string) => void
  setHovered: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSettingsOpen: (open: boolean) => void
  setPresentation: (on: boolean) => void
  setPoster: (on: boolean) => void
  setFeedbackQrOpen: (open: boolean) => void
  setQuality: (quality: Quality) => void
  downgradeQuality: () => void
  setReducedMotion: (value: boolean) => void
  setAutoQuality: (value: boolean) => void
  /** Moves a node and carries its whole branch by the same offset. */
  moveNodeGroup: (id: string, position: Vec3) => void
  resetLayout: () => void
  resetCamera: () => void
  next: () => void
  prev: () => void
  goToSequenceIndex: (index: number) => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  selectedId: null,
  hoveredId: null,
  sidebarOpen: false,
  settingsOpen: false,
  presentation: false,
  poster: false,
  feedbackQrOpen: false,
  quality: initialQuality(),
  reducedMotion: prefersReducedMotion(),
  autoQuality: true,
  positions: { ...INITIAL_POSITIONS },
  focus: null,
  resetNonce: 0,

  select: (id) => {
    if (id === null) {
      set({ selectedId: null, hoveredId: null })
      return
    }
    focusCounter += 1
    set({ selectedId: id, focus: { id, nonce: focusCounter } })
  },

  focusNode: (id) => {
    focusCounter += 1
    set({ focus: { id, nonce: focusCounter } })
  },

  setHovered: (id) => {
    if (get().hoveredId === id) return
    set({ hoveredId: id })
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSettingsOpen: (open) => set({ settingsOpen: open }),

  setPresentation: (on) => {
    if (on) {
      const { selectedId } = get()
      set({ presentation: true, sidebarOpen: false, settingsOpen: false })
      if (!selectedId) get().select(SEQUENCE[1] ?? SEQUENCE[0])
    } else {
      set({ presentation: false })
    }
  },

  setPoster: (on) => set({ poster: on, sidebarOpen: false, settingsOpen: false }),
  setFeedbackQrOpen: (open) => set({ feedbackQrOpen: open }),

  setQuality: (quality) => set({ quality }),
  downgradeQuality: () =>
    set((state) => ({ quality: state.quality === 'high' ? 'medium' : 'low' })),

  setReducedMotion: (value) => set({ reducedMotion: value }),
  setAutoQuality: (value) => set({ autoQuality: value }),

  moveNodeGroup: (id, position) =>
    set((state) => {
      const previous = state.positions[id]
      const positions = { ...state.positions, [id]: position }

      if (previous) {
        const [dx, dy, dz] = [
          position[0] - previous[0],
          position[1] - previous[1],
          position[2] - previous[2],
        ]

        if (dx !== 0 || dy !== 0 || dz !== 0) {
          for (const descendantId of descendantIds(id)) {
            const current = state.positions[descendantId]
            if (!current) continue
            positions[descendantId] = [
              current[0] + dx,
              current[1] + dy,
              current[2] + dz,
            ]
          }
        }
      }

      return { positions }
    }),

  resetLayout: () => set({ positions: { ...INITIAL_POSITIONS } }),

  resetCamera: () => set((state) => ({ resetNonce: state.resetNonce + 1 })),

  next: () => {
    const current = sequenceIndex(get().selectedId)
    const target = current < 0 ? 0 : Math.min(SEQUENCE.length - 1, current + 1)
    get().select(SEQUENCE[target])
  },

  prev: () => {
    const current = sequenceIndex(get().selectedId)
    const target = current < 0 ? 0 : Math.max(0, current - 1)
    get().select(SEQUENCE[target])
  },

  goToSequenceIndex: (index) => {
    const clamped = Math.min(Math.max(index, 0), SEQUENCE.length - 1)
    get().select(SEQUENCE[clamped])
  },
}))

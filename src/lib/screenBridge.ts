/**
 * Bridge between the WebGL frame loop and the DOM overlay.
 *
 * Labels and the panel connector live in normal React DOM, but their positions
 * come from the 3D camera. Updating them through React state sixty times a
 * second would re-render the whole interface, so they are written directly to
 * DOM nodes instead.
 */

export interface ProjectedPoint {
  x: number
  y: number
  visible: boolean
}

export type LabelAlign = 'center' | 'top'

/** Registry key of the overview card that sits under the central node. */
export const OVERVIEW_CARD_ID = 'overview-card'

interface LabelEntry {
  el: HTMLElement
  align: LabelAlign
}

class LabelRegistry {
  private entries = new Map<string, LabelEntry>()

  register(id: string, el: HTMLElement, align: LabelAlign = 'center') {
    this.entries.set(id, { el, align })
  }

  unregister(id: string, el?: HTMLElement) {
    const entry = this.entries.get(id)
    if (!entry) return
    if (el && entry.el !== el) return
    this.entries.delete(id)
  }

  write(id: string, x: number, y: number, opacity: number, visible: boolean) {
    const entry = this.entries.get(id)
    if (!entry) return
    const { el, align } = entry
    const translateY = align === 'top' ? '0' : '-50%'
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, ${translateY})`
    el.style.opacity = opacity.toFixed(3)
    el.style.visibility = visible ? 'visible' : 'hidden'
  }

  getAll(): Map<string, LabelEntry> {
    return this.entries
  }
}

export const labelRegistry = new LabelRegistry()

type Listener = (point: ProjectedPoint) => void

export const screenBridge = {
  point: { x: 0, y: 0, visible: false } as ProjectedPoint,
  listeners: new Set<Listener>(),
  publish(next: ProjectedPoint) {
    this.point = next
    this.listeners.forEach((listener) => listener(next))
  },
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.point)
    return () => {
      this.listeners.delete(listener)
    }
  },
}

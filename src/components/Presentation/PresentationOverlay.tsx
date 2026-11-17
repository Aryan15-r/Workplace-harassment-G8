import { useEffect } from 'react'
import { Minimize2 } from 'lucide-react'
import { TOPIC_COUNT } from '@/data/topics'
import { useTopicNavigation } from '@/hooks/useTopicNavigation'
import { useAppStore } from '@/store/useAppStore'

/**
 * Presentation chrome: progress, topic label and the exit control. The panel
 * itself provides Previous / Next, and the arrow keys work everywhere.
 */
export function PresentationOverlay() {
  const presentation = useAppStore((state) => state.presentation)
  const setPresentation = useAppStore((state) => state.setPresentation)
  const { label, position } = useTopicNavigation()

  useEffect(() => {
    if (!presentation) return
    const root = document.documentElement
    if (!document.fullscreenElement && root.requestFullscreen) {
      root.requestFullscreen().catch(() => {
        /* Fullscreen can be blocked by the browser; presentation still works. */
      })
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          /* ignore */
        })
      }
    }
  }, [presentation])

  if (!presentation) return null

  const progress = Math.round((Math.max(position, 0) / TOPIC_COUNT) * 100)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center p-3 sm:p-4">
      <div className="glass pointer-events-auto flex items-center gap-3 rounded-full px-3.5 py-2">
        <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.24em] text-gold/60 sm:inline">
          Presentation
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#EFEDE6] tabular-nums">
          {label}
        </span>
        <span className="relative h-[3px] w-16 overflow-hidden rounded-full bg-white/12 sm:w-24">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gold transition-[width] duration-500 ease-cinema"
            style={{ width: `${progress}%` }}
          />
        </span>
        <button
          type="button"
          onClick={() => setPresentation(false)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-[10px] font-medium text-white/60 transition-colors hover:border-gold/35 hover:text-gold"
        >
          <Minimize2 className="h-3 w-3" strokeWidth={1.7} />
          Exit
        </button>
      </div>
    </div>
  )
}

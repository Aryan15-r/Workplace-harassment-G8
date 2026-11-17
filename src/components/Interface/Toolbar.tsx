import { RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const LEGEND = [
  { label: 'Overview', className: 'bg-gold shadow-[0_0_10px_2px_rgba(255,211,78,0.45)]' },
  { label: 'Topic', className: 'bg-gold-soft' },
  { label: 'Sub-topic', className: 'bg-gold-soft/50' },
]

export function Toolbar() {
  const resetCamera = useAppStore((state) => state.resetCamera)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 p-4 sm:p-6">
      <div className="pointer-events-auto flex flex-col gap-2.5">
        <div className="glass hidden rounded-xl px-4 py-3 sm:block">
          <p className="eyebrow">Legend</p>
          <div className="mt-2 flex items-center gap-4">
            {LEGEND.map((item) => (
              <span key={item.label} className="flex items-center gap-2 text-[10.5px] text-haze">
                <span className={`h-1.5 w-1.5 rounded-full ${item.className}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={resetCamera}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10.5px] font-medium text-haze transition-colors duration-200 hover:border-gold/30 hover:text-[#F5F5F5]"
        >
          <RotateCcw className="h-3 w-3" strokeWidth={1.7} />
          Reset view
        </button>
      </div>

      <p className="pointer-events-none hidden font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/25 lg:block">
        Drag to orbit · Scroll to zoom · Click a node
      </p>
    </div>
  )
}

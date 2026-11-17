import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTopicNavigation } from '@/hooks/useTopicNavigation'

export function TopicNavigation() {
  const { next, prev, label, canNext, canPrev } = useTopicNavigation()

  return (
    <div className="border-t border-white/[0.07] bg-black/20 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={!canPrev}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-[#DAD6CC] transition-colors duration-200 enabled:hover:border-gold/35 enabled:hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.8} />
          Previous
        </button>

        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/70 tabular-nums">
          {label}
        </span>

        <button
          type="button"
          onClick={next}
          disabled={!canNext}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-gold transition-colors duration-200 enabled:hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
          <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

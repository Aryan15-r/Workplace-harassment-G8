import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useTopicNavigation } from '@/hooks/useTopicNavigation'
import { useAppStore } from '@/store/useAppStore'

export function TopicNavigation() {
  const { next, prev, label, canNext, canPrev } = useTopicNavigation()
  const setFeedbackQrOpen = useAppStore((state) => state.setFeedbackQrOpen)

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

        {!canNext ? (
          <button
            type="button"
            onClick={() => setFeedbackQrOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold bg-gold px-2.5 py-1.5 text-[11px] font-semibold text-[#14120b] shadow-[0_0_12px_rgba(255,211,78,0.4)] transition-all hover:bg-gold-glow"
          >
            <Sparkles className="h-3 w-3 text-[#14120b]" />
            Give Feedback
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-gold transition-colors duration-200 enabled:hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
            <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
          </button>
        )}
      </div>
    </div>
  )
}

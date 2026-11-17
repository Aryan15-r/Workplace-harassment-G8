import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, X } from 'lucide-react'
import { CHILDREN, getTopic } from '@/data/topics'
import { useAppStore } from '@/store/useAppStore'
import { TopicNavigation } from './TopicNavigation'

export function TopicPanel() {
  const selectedId = useAppStore((state) => state.selectedId)
  const presentation = useAppStore((state) => state.presentation)
  const reducedMotion = useAppStore((state) => state.reducedMotion)
  const select = useAppStore((state) => state.select)

  const topic = getTopic(selectedId)
  const parent = topic?.parentId ? getTopic(topic.parentId) : null
  const children = topic ? (CHILDREN[topic.id] ?? []) : []

  return (
    <AnimatePresence>
      {topic && (
        <motion.div
          key="panel-layer"
          className="pointer-events-none fixed inset-0 z-30 flex items-end justify-center lg:items-center lg:justify-end lg:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <motion.aside
            key={topic.id}
            id="topic-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="topic-panel-title"
            className={`glass pointer-events-auto flex max-h-[62dvh] w-full flex-col overflow-hidden rounded-t-2xl lg:max-h-[84vh] lg:rounded-2xl ${
              presentation ? 'lg:w-[496px]' : 'lg:w-[410px]'
            }`}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
              <div className="min-w-0">
                <p className="eyebrow">{topic.kicker}</p>
                <h2
                  id="topic-panel-title"
                  className={`mt-2 font-display font-semibold leading-snug text-[#F7F5EF] ${
                    presentation ? 'text-[22px]' : 'text-[19px]'
                  }`}
                >
                  {topic.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => select(null)}
                aria-label="Close information panel"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors hover:border-gold/30 hover:text-gold"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.7} />
              </button>
            </div>

            <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-5">
              <p className="text-[13px] leading-[1.65] text-[#DCD8CE]">{topic.definition}</p>

              {topic.points.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {topic.points.map((point) => (
                    <li key={point.label} className="flex gap-2.5">
                      <span className="mt-[8px] h-[3px] w-[3px] shrink-0 rounded-full bg-gold/80" />
                      <p className="text-[12px] leading-[1.6] text-[#ACA79C]">
                        <span className="font-medium text-[#EDEAE2]">{point.label}. </span>
                        {point.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {topic.example && (
                <div className="mt-4 rounded-lg border border-gold/15 bg-gold/[0.045] px-3.5 py-3">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-gold/60">
                    {topic.id === 'case-study' ? 'Fictional example' : 'In practice'}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#D8D2C2]">
                    {topic.example}
                  </p>
                </div>
              )}

              {topic.note && (
                <div className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 py-3">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-white/40">
                    Note
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#A8A49A]">{topic.note}</p>
                </div>
              )}

              {topic.keywords.length > 0 && (
                <div className="mt-4">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-white/35">
                    Keywords
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {topic.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-white/10 px-2.5 py-[3px] font-mono text-[9px] tracking-[0.04em] text-[#C9C4B7]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {parent && (
                <button
                  type="button"
                  onClick={() => select(parent.id)}
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-gold"
                >
                  <BookOpen className="h-3 w-3" strokeWidth={1.6} />
                  Part of {parent.navTitle}
                </button>
              )}

              {children.length > 0 && (
                <div className="mt-4 border-t border-white/[0.06] pt-3">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-white/35">
                    Explore next
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => select(child.id)}
                        className="rounded-md border border-white/10 px-2.5 py-1 text-[10.5px] text-[#CFCBC0] transition-colors duration-200 hover:border-gold/35 hover:text-gold"
                      >
                        {child.navTitle}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <TopicNavigation />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

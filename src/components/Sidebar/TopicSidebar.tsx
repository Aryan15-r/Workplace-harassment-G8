import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquarePlus, Play, X } from 'lucide-react'
import { getAncestors, MAIN_TOPICS, ROOT_TOPIC, SUB_TOPICS } from '@/data/topics'
import { useAppStore } from '@/store/useAppStore'
import { TopicTree } from './TopicTree'

const INITIAL_EXPANDED = ['overview', 'laws', 'posh', 'provisions']

export function TopicSidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const selectedId = useAppStore((state) => state.selectedId)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const select = useAppStore((state) => state.select)
  const setPresentation = useAppStore((state) => state.setPresentation)
  const setFeedbackQrOpen = useAppStore((state) => state.setFeedbackQrOpen)
  const reducedMotion = useAppStore((state) => state.reducedMotion)

  const [expanded, setExpanded] = useState<Set<string>>(new Set(INITIAL_EXPANDED))

  const toggle = useCallback((id: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Keep the tree open along the active branch.
  useEffect(() => {
    if (!selectedId) return
    const ancestors = getAncestors(selectedId).map((topic) => topic.id)
    setExpanded((current) => {
      const next = new Set(current)
      ancestors.forEach((id) => next.add(id))
      return next
    })
  }, [selectedId])

  const handleSelect = useCallback(
    (id: string) => {
      select(id)
      setSidebarOpen(false)
    },
    [select, setSidebarOpen],
  )

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          key="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {sidebarOpen && (
        <motion.aside
          key="sidebar"
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[352px] flex-col border-l border-white/10 bg-[#0b0b0d]/95 shadow-[-30px_0_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          initial={{ x: reducedMotion ? 0 : 360, opacity: reducedMotion ? 0 : 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: reducedMotion ? 0 : 360, opacity: reducedMotion ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Topic explorer"
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-5">
            <div>
              <p className="eyebrow">Topic explorer</p>
              <h2 className="mt-1.5 font-display text-[15px] font-semibold text-[#F5F5F5]">
                Knowledge hierarchy
              </h2>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                {MAIN_TOPICS.length} topics · {SUB_TOPICS.length} sub-topics
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close topic explorer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-gold/30 hover:text-gold"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.7} />
            </button>
          </div>

          <div className="thin-scroll flex-1 overflow-y-auto px-3 py-4">
            <TopicTree
              topicId={ROOT_TOPIC.id}
              depth={0}
              expanded={expanded}
              onToggle={toggle}
              onSelect={handleSelect}
            />
          </div>

          <div className="border-t border-white/[0.07] px-5 py-4">
            <button
              type="button"
              onClick={() => setPresentation(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2.5 text-[11.5px] font-medium text-gold transition-colors hover:bg-gold/15"
            >
              <Play className="h-3.5 w-3.5" strokeWidth={1.7} />
              Start guided presentation
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false)
                setFeedbackQrOpen(true)
              }}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-medium text-[#c4c0b4] transition-colors hover:border-gold/35 hover:text-gold"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span>Share Feedback / QR</span>
            </button>
            <p className="mt-2.5 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
              ← → to navigate
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

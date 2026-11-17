import { useAppStore } from '@/store/useAppStore'
import { sequenceIndex, TOPIC_COUNT } from '@/data/topics'

/**
 * Presentation progress helpers. Sequence index 0 is the overview; 1–12 are the
 * numbered topics, which is what the "TOPIC 05 / 12" indicator reports.
 */
export function useTopicNavigation() {
  const selectedId = useAppStore((state) => state.selectedId)
  const next = useAppStore((state) => state.next)
  const prev = useAppStore((state) => state.prev)

  const index = sequenceIndex(selectedId)
  const overview = index <= 0
  const position = Math.max(1, Math.min(TOPIC_COUNT, index))
  const label = overview
    ? 'OVERVIEW'
    : `TOPIC ${String(position).padStart(2, '0')} / ${String(TOPIC_COUNT).padStart(2, '0')}`

  return {
    next,
    prev,
    index,
    position,
    label,
    overview,
    canPrev: index > 0,
    canNext: index >= 0 && index < TOPIC_COUNT,
  }
}

import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { getTopic } from '@/data/topics'

/** The currently selected topic plus its directly related node ids. */
export function useGraphSelection() {
  const selectedId = useAppStore((state) => state.selectedId)
  const selected = useMemo(() => getTopic(selectedId), [selectedId])
  return { selectedId, selected }
}

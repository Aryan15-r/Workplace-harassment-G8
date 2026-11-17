import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '@/store/useAppStore'

/**
 * Watches the frame rate and steps the quality down once or twice if the
 * machine cannot hold a comfortable frame rate. Never steps back up, so the
 * experience cannot oscillate.
 */
export function PerformanceGuard() {
  const frames = useRef(0)
  const elapsed = useRef(0)
  const age = useRef(0)

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.25)
    age.current += step
    frames.current += 1
    elapsed.current += step
    if (elapsed.current < 2.5) return

    const fps = frames.current / elapsed.current
    frames.current = 0
    elapsed.current = 0

    const state = useAppStore.getState()
    if (!state.autoQuality || age.current < 5) return
    if (fps < 36 && state.quality !== 'low') state.downgradeQuality()
  })

  return null
}

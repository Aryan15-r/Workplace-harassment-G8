import { useEffect, useRef } from 'react'
import { screenBridge } from '@/lib/screenBridge'
import { useAppStore } from '@/store/useAppStore'

/**
 * The animated link between the selected 3D node and its panel. It is written
 * directly to the SVG (no React state) so following the camera costs nothing.
 */
export function PanelConnector() {
  const selectedId = useAppStore((state) => state.selectedId)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const haloRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let target: { x: number; y: number } | null = null

    const measure = () => {
      const panel = document.getElementById('topic-panel')
      if (!panel || window.innerWidth < 1024) {
        target = null
        return
      }
      const rect = panel.getBoundingClientRect()
      target = {
        x: rect.left - 4,
        y: rect.top + Math.min(rect.height * 0.3, 168),
      }
    }

    measure()
    const timers = [window.setTimeout(measure, 120), window.setTimeout(measure, 420)]
    const interval = window.setInterval(measure, 700)

    const unsubscribe = screenBridge.subscribe((point) => {
      const path = pathRef.current
      const dot = dotRef.current
      const halo = haloRef.current
      if (!path || !dot || !halo) return

      const active = Boolean(target) && point.visible
      path.style.opacity = active ? '1' : '0'
      dot.style.opacity = active ? '1' : '0'
      halo.style.opacity = active ? '1' : '0'
      if (!active || !target) return

      const anchor = target
      const midX = (point.x + anchor.x) / 2
      path.setAttribute(
        'd',
        `M ${point.x.toFixed(1)} ${point.y.toFixed(1)} C ${midX.toFixed(1)} ${(
          point.y + 26
        ).toFixed(1)}, ${midX.toFixed(1)} ${anchor.y.toFixed(1)}, ${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)}`,
      )

      dot.setAttribute('cx', point.x.toFixed(1))
      dot.setAttribute('cy', point.y.toFixed(1))
      halo.setAttribute('cx', point.x.toFixed(1))
      halo.setAttribute('cy', point.y.toFixed(1))
    })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearInterval(interval)
      unsubscribe()
    }
  }, [selectedId])

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[25] hidden h-full w-full lg:block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="connector-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD34E" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFD34E" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="url(#connector-stroke)"
        strokeWidth="1"
        strokeDasharray="2 6"
        strokeLinecap="round"
        opacity="0"
        className="connector-path"
      />
      <circle ref={haloRef} r="9" fill="#FFD34E" opacity="0" fillOpacity="0.1" />
      <circle ref={dotRef} r="2.6" fill="#FFD34E" opacity="0" />
    </svg>
  )
}

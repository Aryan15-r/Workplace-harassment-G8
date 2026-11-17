import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { ComponentRef } from 'react'
import * as THREE from 'three'
import {
  EDGES,
  nodePosition,
  nodeRadius,
  relatedIds,
} from '@/data/graphLayout'
import { TOPICS } from '@/data/topics'
import { computeDraggedPosition, computeGrabOffset } from '@/lib/dragMath'
import { QUALITY_CONFIG } from '@/lib/quality'
import { useAppStore } from '@/store/useAppStore'
import { BackgroundParticles } from './BackgroundParticles'
import { CameraController } from './CameraController'
import { ChainConnection } from './ChainConnection'
import { LabelProjector } from './LabelProjector'
import { Node3D } from './Node3D'
import { PerformanceGuard } from './PerformanceGuard'
import { SceneLighting } from './SceneLighting'

type OrbitControlsRef = ComponentRef<typeof OrbitControls>

interface DragState {
  id: string
  offset: THREE.Vector3
  camera: THREE.Camera
  startX: number
  startY: number
  moved: boolean
}

export function SceneContent() {
  const quality = useAppStore((state) => state.quality)
  const positions = useAppStore((state) => state.positions)
  const selectedId = useAppStore((state) => state.selectedId)
  const hoveredId = useAppStore((state) => state.hoveredId)
  const reducedMotion = useAppStore((state) => state.reducedMotion)
  const select = useAppStore((state) => state.select)
  const setHovered = useAppStore((state) => state.setHovered)

  const config = QUALITY_CONFIG[quality]
  const controlsRef = useRef<OrbitControlsRef | null>(null)
  const dragRef = useRef<DragState | null>(null)

  const plane = useMemo(() => new THREE.Plane(), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const hitPoint = useMemo(() => new THREE.Vector3(), [])
  const pointerNdc = useMemo(() => new THREE.Vector2(), [])

  const related = useMemo(() => relatedIds(selectedId), [selectedId])
  const focusId = selectedId ?? hoveredId

  const handleNodePointerDown = useCallback(
    (id: string, event: ThreeEvent<PointerEvent>) => {
      const state = useAppStore.getState()
      const position = nodePosition(id, state.positions)
      const offset = computeGrabOffset(
        position,
        event.camera,
        event.pointer,
        raycaster,
        plane,
        hitPoint,
      )

      dragRef.current = {
        id,
        offset,
        camera: event.camera,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      }
      setHovered(id)
      if (controlsRef.current) controlsRef.current.enabled = false
    },
    [hitPoint, plane, raycaster, setHovered],
  )

  // Dragging is driven by pointer events, not the frame loop, so a node follows
  // the cursor even on a slow machine and keeps tracking outside the canvas.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return

      if (!drag.moved) {
        const dx = event.clientX - drag.startX
        const dy = event.clientY - drag.startY
        if (dx * dx + dy * dy > 16) drag.moved = true
      }
      if (!drag.moved) return

      const rect = document.querySelector('canvas')?.getBoundingClientRect()
      if (!rect || rect.width === 0 || rect.height === 0) return
      pointerNdc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      )

      const current = useAppStore.getState().positions[drag.id]
      const next = computeDraggedPosition(
        current,
        drag.offset,
        drag.camera,
        pointerNdc,
        raycaster,
        plane,
        hitPoint,
      )
      if (next) useAppStore.getState().moveNodeGroup(drag.id, next)
    }

    const finish = () => {
      const drag = dragRef.current
      if (!drag) return
      dragRef.current = null
      if (controlsRef.current) controlsRef.current.enabled = true
      if (!drag.moved) select(drag.id)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
    }
  }, [select, hitPoint, plane, pointerNdc, raycaster])

  return (
    <>
      <SceneLighting quality={quality} />
      <BackgroundParticles count={config.particles} reducedMotion={reducedMotion} />

      {EDGES.map((edge, index) => {
        const active = focusId
          ? edge.from === focusId || edge.to === focusId
          : false
        return (
          <ChainConnection
            key={edge.id}
            from={nodePosition(edge.from, positions)}
            to={nodePosition(edge.to, positions)}
            fromRadius={nodeRadius(edge.from)}
            toRadius={nodeRadius(edge.to)}
            seed={index + 1}
            active={active}
            dimmed={Boolean(selectedId) && !active}
            quality={quality}
            reducedMotion={reducedMotion}
          />
        )
      })}

      {TOPICS.map((topic) => (
        <Node3D
          key={topic.id}
          topic={topic}
          position={nodePosition(topic.id, positions)}
          radius={nodeRadius(topic.id)}
          selected={selectedId === topic.id}
          hovered={hoveredId === topic.id}
          dimmed={Boolean(selectedId) && !related.has(topic.id)}
          reducedMotion={reducedMotion}
          quality={quality}
          onNodePointerDown={handleNodePointerDown}
          onHover={setHovered}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.075}
        minDistance={3.5}
        maxDistance={62}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
        panSpeed={0.7}
        screenSpacePanning
      />

      <CameraController controlsRef={controlsRef} reducedMotion={reducedMotion} />
      <LabelProjector />
      <PerformanceGuard />
    </>
  )
}

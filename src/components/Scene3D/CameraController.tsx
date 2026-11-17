import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ComponentRef } from 'react'
import type { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { nodePosition, nodeRadius } from '@/data/graphLayout'
import { useAppStore } from '@/store/useAppStore'

type OrbitControlsRef = ComponentRef<typeof OrbitControls>

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsRef | null>
  reducedMotion: boolean
}

const FLIGHT_DURATION = 1.25

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/**
 * Cinematic camera flight.
 *
 * Selecting a node asks for a focus. The move is interpolated in spherical
 * coordinates around the origin with a slight outward bow, so the camera arcs
 * past the graph instead of cutting straight through nodes. The orbit target
 * eases alongside it, and a manual orbit, pan or zoom cancels the flight.
 */
export function CameraController({ controlsRef, reducedMotion }: CameraControllerProps) {
  const { camera } = useThree()
  const focus = useAppStore((state) => state.focus)
  const resetNonce = useAppStore((state) => state.resetNonce)

  const desiredPosition = useRef(new THREE.Vector3(0, 7.2, 31.2))
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0))
  const startPosition = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const progress = useRef(1)
  const thetaEnd = useRef(0)

  const startSpherical = useMemo(() => new THREE.Spherical(), [])
  const endSpherical = useMemo(() => new THREE.Spherical(), [])
  const animated = useMemo(() => new THREE.Spherical(), [])
  const direction = useMemo(() => new THREE.Vector3(), [])
  const scratch = useMemo(() => new THREE.Vector3(), [])

  const beginFlight = useCallback(() => {
    const controls = controlsRef.current
    startPosition.current.copy(camera.position)
    if (controls) startTarget.current.copy(controls.target)
    else startTarget.current.set(0, 0, 0)

    startSpherical.setFromVector3(startPosition.current)
    endSpherical.setFromVector3(desiredPosition.current)

    let delta = endSpherical.theta - startSpherical.theta
    if (delta > Math.PI) delta -= Math.PI * 2
    if (delta < -Math.PI) delta += Math.PI * 2
    thetaEnd.current = startSpherical.theta + delta

    if (reducedMotion) {
      camera.position.copy(desiredPosition.current)
      if (controls) {
        controls.target.copy(desiredTarget.current)
        controls.update()
      } else {
        camera.lookAt(desiredTarget.current)
      }
      progress.current = 1
      return
    }

    progress.current = 0
  }, [camera, controlsRef, endSpherical, reducedMotion, startSpherical])

  const applyDefaultView = useCallback(() => {
    const width = window.innerWidth
    const distance = width < 720 ? 42 : width < 1100 ? 36 : 32
    // Tilted vertically (~13 deg vertical perspective) for layered depth
    desiredPosition.current.set(0, distance * 0.225, distance * 0.974)
    desiredTarget.current.set(0, 0, 0)
    beginFlight()
  }, [beginFlight])

  useEffect(() => {
    if (!focus) return
    const state = useAppStore.getState()
    const position = new THREE.Vector3(...nodePosition(focus.id, state.positions))
    const radius = nodeRadius(focus.id)
    const isMobile = window.innerWidth < 900
    const distance = Math.max(radius * 7.4, isMobile ? 11 : 10.5)

    if (position.lengthSq() < 0.4) {
      direction.set(0, 0.22, 1)
    } else {
      direction.copy(position).normalize().multiplyScalar(0.78).add(scratch.set(0, 0.34, 0))
    }
    direction.normalize()

    const lookAt = position.clone()
    const right = new THREE.Vector3()
      .crossVectors(new THREE.Vector3(0, 1, 0), direction)
      .normalize()

    if (isMobile) {
      // Keep the node above the bottom sheet.
      lookAt.y -= distance * 0.3
    } else {
      // Keep the node clear of the information panel on the right.
      lookAt.addScaledVector(right, distance * 0.22)
    }

    desiredTarget.current.copy(lookAt)
    desiredPosition.current.copy(lookAt).addScaledVector(direction, distance)
    beginFlight()
  }, [focus, direction, scratch, beginFlight])

  useEffect(() => {
    if (resetNonce === 0) return
    applyDefaultView()
  }, [resetNonce, applyDefaultView])

  // Manual navigation cancels an in-flight transition.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const cancel = () => {
      progress.current = 1
    }
    controls.addEventListener('start', cancel)
    return () => controls.removeEventListener('start', cancel)
  }, [controlsRef])

  useFrame((_, delta) => {
    if (progress.current >= 1) return
    progress.current = Math.min(
      1,
      progress.current + Math.min(delta, 0.25) / FLIGHT_DURATION,
    )
    const t = easeInOutCubic(progress.current)

    const radius =
      THREE.MathUtils.lerp(startSpherical.radius, endSpherical.radius, t) *
      (1 + 0.16 * Math.sin(Math.PI * t))
    animated.set(
      radius,
      THREE.MathUtils.lerp(startSpherical.phi, endSpherical.phi, t),
      THREE.MathUtils.lerp(startSpherical.theta, thetaEnd.current, t),
    )
    camera.position.setFromSpherical(animated)

    const controls = controlsRef.current
    if (controls) {
      controls.target.lerpVectors(startTarget.current, desiredTarget.current, t)
      controls.update()
    } else {
      camera.lookAt(
        scratch.lerpVectors(startTarget.current, desiredTarget.current, t),
      )
    }
  })

  return null
}

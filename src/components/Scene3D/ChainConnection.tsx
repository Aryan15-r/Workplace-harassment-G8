import { memo, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QUALITY_CONFIG } from '@/lib/quality'
import {
  buildChainCurve,
  computeLinkMatrices,
  getChainLinkGeometry,
  linkCountFor,
} from '@/lib/chainGeometry'
import type { Quality, Vec3 } from '@/types'

interface ChainConnectionProps {
  from: Vec3
  to: Vec3
  fromRadius: number
  toRadius: number
  active: boolean
  dimmed: boolean
  seed: number
  quality: Quality
  reducedMotion: boolean
}

const BASE_COLOR = new THREE.Color('#ECECEC')
const ACTIVE_COLOR = new THREE.Color('#FFD98A')
const DIM_COLOR = new THREE.Color('#3C3A34')
const EMISSIVE_OFF = new THREE.Color('#000000')
const EMISSIVE_ON = new THREE.Color('#8A6A16')

/**
 * A real chain: one instanced mesh of oval metal links following a curved path.
 * Every link is a hollow tube loop, and consecutive links alternate their plane
 * by 90° around the tangent so they visually interlock.
 */
function ChainConnectionComponent({
  from,
  to,
  fromRadius,
  toRadius,
  active,
  dimmed,
  seed,
  quality,
  reducedMotion,
}: ChainConnectionProps) {
  const config = QUALITY_CONFIG[quality]
  const geometry = useMemo(() => getChainLinkGeometry(config.chain), [config.chain])

  const curve = useMemo(
    () => buildChainCurve(from, to, seed, fromRadius * 0.94, toRadius * 0.94),
    [from, to, seed, fromRadius, toRadius],
  )
  const count = useMemo(() => linkCountFor(curve), [curve])
  const matrices = useMemo(() => computeLinkMatrices(curve, count), [curve, count])

  const mesh = useRef<THREE.InstancedMesh>(null)

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: BASE_COLOR.clone(),
        metalness: 0.94,
        roughness: 0.26,
        emissive: EMISSIVE_OFF.clone(),
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0.95,
        envMapIntensity: 1.4,
      }),
    [],
  )

  useLayoutEffect(() => {
    const instance = mesh.current
    if (!instance) return
    matrices.forEach((matrix, index) => instance.setMatrixAt(index, matrix))
    instance.count = matrices.length
    instance.instanceMatrix.needsUpdate = true
    instance.computeBoundingSphere()
  }, [matrices])

  useFrame((_, delta) => {
    const step = reducedMotion ? 1 : 1 - Math.exp(-6 * Math.min(delta, 0.05))
    const highlighted = active && !dimmed
    material.color.lerp(dimmed ? DIM_COLOR : highlighted ? ACTIVE_COLOR : BASE_COLOR, step)
    material.emissive.lerp(highlighted ? EMISSIVE_ON : EMISSIVE_OFF, step)
    material.emissiveIntensity +=
      ((highlighted ? 0.7 : 0) - material.emissiveIntensity) * step
    const targetOpacity = dimmed ? 0.22 : 0.95
    material.opacity += (targetOpacity - material.opacity) * step
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, matrices.length]}
      frustumCulled={false}
    />
  )
}

export const ChainConnection = memo(ChainConnectionComponent)

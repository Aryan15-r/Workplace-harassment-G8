import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BackgroundParticlesProps {
  count: number
  reducedMotion: boolean
}

/** A slow field of dust that gives the scene depth without costing much. */
export function BackgroundParticles({ count, reducedMotion }: BackgroundParticlesProps) {
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      // Distribute in a shell so nothing sits on the camera's nose.
      const radius = 20 + Math.random() * 42
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.62
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return array
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion || !points.current) return
    points.current.rotation.y += delta * 0.01
    points.current.rotation.x += delta * 0.003
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        sizeAttenuation
        color="#9b8a5c"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

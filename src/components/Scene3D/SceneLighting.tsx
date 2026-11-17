import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getEnvironmentTexture } from '@/lib/textures'
import type { Quality } from '@/types'

/**
 * Lighting is deliberately small: one key, one fill, two practicals and a tiny
 * procedural environment map for the metal. No shadow maps, no post-processing.
 */
export function SceneLighting({ quality }: { quality: Quality }) {
  const { gl, scene } = useThree()

  useEffect(() => {
    const texture = getEnvironmentTexture()
    const pmrem = new THREE.PMREMGenerator(gl)
    const target = pmrem.fromEquirectangular(texture)
    scene.environment = target.texture
    ;(scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = 0.85

    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#3a3324', '#050506', 0.55]} />
      <directionalLight position={[14, 18, 12]} intensity={1.55} color="#FFE7B4" />
      <directionalLight position={[-16, -10, -14]} intensity={0.5} color="#8899bb" />
      <pointLight
        position={[0, 0, 0]}
        intensity={quality === 'low' ? 10 : 22}
        distance={26}
        decay={2}
        color="#FFD34E"
      />
      <pointLight position={[-11, 9, 8]} intensity={16} distance={34} decay={2} color="#D9A52E" />
    </>
  )
}

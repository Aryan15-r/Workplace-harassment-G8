import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { QUALITY_CONFIG } from '@/lib/quality'
import { PALETTE } from '@/lib/palette'
import { useAppStore } from '@/store/useAppStore'
import { SceneContent } from './SceneContent'

/**
 * The 3D canvas. It owns the camera, the quality-dependent renderer settings
 * and the atmospheric background; everything inside is composed by
 * SceneContent.
 */
export function KnowledgeUniverse() {
  const quality = useAppStore((state) => state.quality)
  const config = QUALITY_CONFIG[quality]

  return (
    <div className="absolute inset-0">
      <Canvas
        key={quality}
        dpr={config.dpr}
        gl={{
          antialias: config.antialias,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 7.2, 31.2], fov: 46, near: 0.1, far: 260 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.12
        }}
      >
        <color attach="background" args={[PALETTE.bg]} />
        <fog attach="fog" args={[PALETTE.bg, 40, 120]} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}

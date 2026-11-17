import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import type { Topic } from '@/data/topics'
import { getNodeGeometry } from '@/lib/geometry'
import { getGlowTexture } from '@/lib/textures'
import { QUALITY_CONFIG } from '@/lib/quality'
import type { Quality, Vec3 } from '@/types'

interface Node3DProps {
  topic: Topic
  position: Vec3
  radius: number
  selected: boolean
  hovered: boolean
  dimmed: boolean
  reducedMotion: boolean
  quality: Quality
  onNodePointerDown: (id: string, event: ThreeEvent<PointerEvent>) => void
  onHover: (id: string | null) => void
}

const noRaycast = () => {}

function baseColors(level: Topic['level']) {
  if (level === 'central') {
    return { color: '#231d12', emissive: '#FFD34E' }
  }
  if (level === 'main') {
    return { color: '#241f15', emissive: '#D9A52E' }
  }
  return { color: '#211d16', emissive: '#D9A52E' }
}

/**
 * One node of the universe: a dark metallic faceted body, a thin emissive shell
 * that reads as a bright outline, and a soft halo sprite for the glow.
 */
function Node3DComponent({
  topic,
  position,
  radius,
  selected,
  hovered,
  dimmed,
  reducedMotion,
  quality,
  onNodePointerDown,
  onHover,
}: Node3DProps) {
  const group = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)
  const glowMaterial = useRef<THREE.SpriteMaterial>(null)
  const shellMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const level = topic.level
  const config = QUALITY_CONFIG[quality]

  const geometry = useMemo(() => getNodeGeometry(level, quality), [level, quality])
  const glowTexture = useMemo(() => getGlowTexture(), [])
  const palette = useMemo(() => baseColors(level), [level])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.color),
        emissive: new THREE.Color(palette.emissive),
        metalness: level === 'central' ? 0.92 : 0.82,
        roughness: level === 'central' ? 0.22 : level === 'main' ? 0.34 : 0.42,
        emissiveIntensity: level === 'central' ? 0.34 : level === 'main' ? 0.22 : 0.14,
        envMapIntensity: 1.15,
      }),
    [level, palette],
  )

  const targetColor = useMemo(() => new THREE.Color(palette.color), [palette])
  const dimColor = useMemo(() => new THREE.Color(level === 'central' ? '#1a1409' : '#141311'), [level])

  useCursor(hovered)

  useFrame((_, delta) => {
    const step = reducedMotion ? 1 : 1 - Math.exp(-8 * Math.min(delta, 0.05))
    const node = group.current
    if (!node) return

    const factor = selected ? 1.3 : hovered ? 1.1 : 1
    const targetScale = radius * factor * (dimmed ? 0.95 : 1)
    const nextScale = node.scale.x + (targetScale - node.scale.x) * step
    node.scale.setScalar(nextScale)

    const targetEmissive = dimmed
      ? 0.05
      : selected
        ? level === 'central'
          ? 1.2
          : 1.45
        : hovered
          ? 0.95
          : level === 'central'
            ? 0.38
            : level === 'main'
              ? 0.24
              : 0.16
    material.emissiveIntensity += (targetEmissive - material.emissiveIntensity) * step
    material.color.lerp(dimmed ? dimColor : targetColor, step)

    if (glowMaterial.current) {
      const target = !config.glow
        ? 0
        : dimmed
          ? 0.02
          : selected
            ? 0.9
            : hovered
              ? 0.6
                              : level === 'central'
                ? 0.34
                : level === 'main'
                  ? 0.12
                  : 0.05
      glowMaterial.current.opacity += (target - glowMaterial.current.opacity) * step
    }

    if (shellMaterial.current) {
      const target = dimmed
        ? 0.02
        : selected
          ? 0.55
          : hovered
            ? 0.36
            : level === 'central'
              ? 0.3
              : 0.14
      shellMaterial.current.opacity += (target - shellMaterial.current.opacity) * step
    }

    if (rings.current && !reducedMotion) {
      rings.current.rotation.y += delta * 0.16
      rings.current.rotation.z += delta * 0.06
    }
  })

  return (
    <group
      ref={group}
      position={position}
      scale={radius}
      onPointerDown={(event) => {
        event.stopPropagation()
        onNodePointerDown(topic.id, event)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(topic.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh geometry={geometry} material={material} />

      {config.shells && (
        <mesh geometry={geometry} scale={1.045} raycast={noRaycast}>
          <meshBasicMaterial
            ref={shellMaterial}
            color="#FFD34E"
            wireframe
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
      )}

      {config.glow && (
        <sprite scale={[level === 'central' ? 5.8 : 4.6, level === 'central' ? 5.8 : 4.6, 1]} raycast={noRaycast}>
          <spriteMaterial
            ref={glowMaterial}
            map={glowTexture}
            color="#FFD34E"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      )}

      {level === 'central' && (
        <group ref={rings} raycast={noRaycast}>
          <mesh rotation={[Math.PI / 2.35, 0.25, 0]} raycast={noRaycast}>
            <torusGeometry args={[1.42, 0.0075, 6, 128]} />
            <meshBasicMaterial color="#FFD34E" transparent opacity={0.42} />
          </mesh>
          <mesh rotation={[Math.PI / 1.75, 0.6, 0.35]} raycast={noRaycast}>
            <torusGeometry args={[1.64, 0.005, 6, 128]} />
            <meshBasicMaterial color="#FFF0A6" transparent opacity={0.2} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/** Memoised so that dragging one node does not re-render the other forty-five. */
export const Node3D = memo(Node3DComponent)

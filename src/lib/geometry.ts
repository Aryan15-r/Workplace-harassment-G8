import * as THREE from 'three'
import type { Quality } from '@/types'
import type { TopicLevel } from '@/data/topics'

/**
 * Node geometry is created once per level and shared by every node of that
 * level, which keeps the draw-call inputs cheap and the memory flat.
 */
const cache = new Map<string, THREE.BufferGeometry>()

export function getNodeGeometry(level: TopicLevel, quality: Quality): THREE.BufferGeometry {
  const detail = level === 'central' ? (quality === 'low' ? 1 : quality === 'medium' ? 2 : 3) : level === 'main' ? 1 : 0
  const key = `${level}:${detail}`
  const cached = cache.get(key)
  if (cached) return cached

  const geometry =
    level === 'central'
      ? new THREE.IcosahedronGeometry(1, detail)
      : level === 'main'
        ? new THREE.IcosahedronGeometry(1, detail)
        : new THREE.OctahedronGeometry(1, detail)

  geometry.computeVertexNormals()
  cache.set(key, geometry)
  return geometry
}

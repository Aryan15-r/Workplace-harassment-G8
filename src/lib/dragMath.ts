import * as THREE from 'three'
import type { Vec3 } from '@/types'

export interface DragBounds {
  x: number
  y: number
  z: number
}

export const DEFAULT_DRAG_BOUNDS: DragBounds = { x: 22, y: 20, z: 22 }

/**
 * Where a dragged node should sit for a given pointer position.
 *
 * The pointer is projected onto a plane through the node that faces the camera,
 * so the node follows the cursor at a constant depth. The grab offset keeps the
 * node from jumping to the cursor on the first move, and the result is clamped
 * to a generous box so a node can never be dragged out of reach.
 */
export function computeDraggedPosition(
  nodePosition: Vec3,
  grabOffset: THREE.Vector3,
  camera: THREE.Camera,
  ndc: THREE.Vector2,
  raycaster: THREE.Raycaster,
  plane: THREE.Plane,
  hit: THREE.Vector3,
  bounds: DragBounds = DEFAULT_DRAG_BOUNDS,
): Vec3 | null {
  const node = new THREE.Vector3(nodePosition[0], nodePosition[1], nodePosition[2])
  const direction = new THREE.Vector3()
  camera.getWorldDirection(direction)

  plane.setFromNormalAndCoplanarPoint(direction, node)
  raycaster.setFromCamera(ndc, camera)

  const point = raycaster.ray.intersectPlane(plane, hit)
  if (!point) return null

  return [
    Math.min(Math.max(point.x + grabOffset.x, -bounds.x), bounds.x),
    Math.min(Math.max(point.y + grabOffset.y, -bounds.y), bounds.y),
    Math.min(Math.max(point.z + grabOffset.z, -bounds.z), bounds.z),
  ]
}

/** Grab offset so the node does not snap to the cursor when the drag begins. */
export function computeGrabOffset(
  nodePosition: Vec3,
  camera: THREE.Camera,
  ndc: THREE.Vector2,
  raycaster: THREE.Raycaster,
  plane: THREE.Plane,
  hit: THREE.Vector3,
): THREE.Vector3 {
  const node = new THREE.Vector3(nodePosition[0], nodePosition[1], nodePosition[2])
  const direction = new THREE.Vector3()
  camera.getWorldDirection(direction)

  plane.setFromNormalAndCoplanarPoint(direction, node)
  raycaster.setFromCamera(ndc, camera)
  const point = raycaster.ray.intersectPlane(plane, hit)

  return point ? node.clone().sub(point) : new THREE.Vector3()
}

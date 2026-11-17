import * as THREE from 'three'
import type { Vec3 } from '@/types'

/**
 * Chain geometry.
 *
 * Each link is an elongated oval ring: an ellipse swept by a thin circular
 * tube, so the loop is hollow and every link has a real metallic profile.
 * Links are placed along a curved path and alternate their plane by 90° around
 * the path tangent, which is what makes a chain read as interlocking rather
 * than as a string of beads.
 */

class OvalCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly radiusX: number,
    private readonly radiusY: number,
  ) {
    super()
  }

  getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const angle = t * Math.PI * 2
    return target.set(Math.cos(angle) * this.radiusX, Math.sin(angle) * this.radiusY, 0)
  }
}

export const CHAIN_LINK_RADIUS_X = 0.148
export const CHAIN_LINK_RADIUS_Y = 0.086
/** Centre-to-centre distance between links. Shorter than the link length, so they interlock. */
export const CHAIN_SPACING = 0.246

const geometryCache = new Map<string, THREE.TubeGeometry>()

export function getChainLinkGeometry(config: { tubular: number; radial: number }): THREE.TubeGeometry {
  const key = `${config.tubular}:${config.radial}`
  const cached = geometryCache.get(key)
  if (cached) return cached

  const path = new OvalCurve(CHAIN_LINK_RADIUS_X, CHAIN_LINK_RADIUS_Y)
  const geometry = new THREE.TubeGeometry(path, config.tubular, 0.0148, config.radial, true)
  geometry.computeVertexNormals()
  geometryCache.set(key, geometry)
  return geometry
}

/**
 * Graceful curved path between two nodes. The bow direction is derived from a
 * per-edge seed so chains fan out instead of collapsing onto each other.
 */
export function buildChainCurve(
  from: Vec3,
  to: Vec3,
  seed: number,
  startInset: number,
  endInset: number,
): THREE.CubicBezierCurve3 {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const delta = b.clone().sub(a)
  const distance = delta.length() || 0.0001
  const unit = delta.clone().divideScalar(distance)

  const start = a.clone().addScaledVector(unit, startInset)
  const end = b.clone().addScaledVector(unit, -endInset)

  const reference =
    Math.abs(unit.y) > 0.85 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
  const perpendicularA = new THREE.Vector3().crossVectors(unit, reference).normalize()
  const perpendicularB = new THREE.Vector3().crossVectors(unit, perpendicularA).normalize()

  const angle = (seed * 2.399963) % (Math.PI * 2)
  const bow = perpendicularA
    .multiplyScalar(Math.cos(angle))
    .addScaledVector(perpendicularB, Math.sin(angle))

  const bend = Math.min(start.distanceTo(end) * 0.14, 1.5)
  const controlA = start.clone().lerp(end, 0.32).addScaledVector(bow, bend)
  const controlB = start.clone().lerp(end, 0.68).addScaledVector(bow, bend)

  return new THREE.CubicBezierCurve3(start, controlA, controlB, end)
}

export function linkCountFor(curve: THREE.Curve<THREE.Vector3>): number {
  return Math.max(2, Math.round(curve.getLength() / CHAIN_SPACING))
}

/** One matrix per link: elongated axis along the tangent, plane alternating per link. */
export function computeLinkMatrices(
  curve: THREE.Curve<THREE.Vector3>,
  count: number,
): THREE.Matrix4[] {
  const matrices: THREE.Matrix4[] = []
  const up = new THREE.Vector3(0, 1, 0)
  const right = new THREE.Vector3(1, 0, 0)

  for (let index = 0; index < count; index += 1) {
    const t = (index + 0.5) / count
    const position = curve.getPointAt(Math.min(t, 1))
    const tangent = curve.getTangentAt(Math.min(t, 1)).normalize()

    const reference = Math.abs(tangent.y) > 0.9 ? right : up
    const normalA = new THREE.Vector3().crossVectors(tangent, reference).normalize()
    const normalB = new THREE.Vector3().crossVectors(tangent, normalA).normalize()

    const inPlane = index % 2 === 0 ? normalA : normalB
    const ringAxis = new THREE.Vector3().crossVectors(tangent, inPlane).normalize()

    const matrix = new THREE.Matrix4().makeBasis(tangent, inPlane, ringAxis)
    matrix.setPosition(position)
    matrices.push(matrix)
  }

  return matrices
}

/**
 * Spatial layout of the knowledge universe.
 *
 * Positions are hand-placed in three dimensions — never a flat ring — so the
 * graph reads as a cloud with real depth. Radii follow the visual hierarchy:
 * central topic > main topics > sub-topics.
 */

import { CHILDREN, TOPIC_BY_ID, TOPICS } from './topics'

export type Vec3 = [number, number, number]

export interface NodeLayout {
  position: Vec3
  radius: number
}

export const NODE_LAYOUT: Record<string, NodeLayout> = {
  /* central ------------------------------------------------------------ */
  overview: { position: [0, 0, 0], radius: 2.15 },

  /* main topics -------------------------------------------------------- */
  introduction: { position: [9.0, 3.2, 2.0], radius: 0.82 },
  types: { position: [4.2, -1.8, 9.0], radius: 0.86 },
  causes: { position: [-4.0, 5.0, 7.2], radius: 0.8 },
  effects: { position: [-9.2, 2.0, 3.5], radius: 0.8 },
  laws: { position: [-8.6, -3.4, -2.2], radius: 0.86 },
  posh: { position: [-2.4, 2.2, -9.6], radius: 0.84 },
  provisions: { position: [3.2, -4.6, -8.2], radius: 0.78 },
  responsibilities: { position: [8.4, -3.0, -4.0], radius: 0.8 },
  ethics: { position: [7.0, 6.4, -7.2], radius: 0.78 },
  prevention: { position: [0.6, 8.2, 3.0], radius: 0.8 },
  'case-study': { position: [-6.4, -6.2, 6.0], radius: 0.78 },
  conclusion: { position: [-1.2, -8.0, -6.0], radius: 0.8 },

  /* sub-topics --------------------------------------------------------- */
  'definition-scope': { position: [10.6, 1.0, 4.6], radius: 0.4 },
  'why-it-matters': { position: [9.2, 6.8, -0.8], radius: 0.42 },

  'verbal-physical': { position: [1.6, -4.4, 8.2], radius: 0.42 },
  'psychological-bullying': { position: [6.6, -0.4, 11.6], radius: 0.4 },
  discrimination: { position: [3.0, 1.8, 7.2], radius: 0.38 },
  'sexual-harassment': { position: [7.6, -4.0, 8.6], radius: 0.42 },

  'power-imbalance': { position: [-7.2, 3.4, 8.6], radius: 0.4 },
  'culture-awareness': { position: [-3.4, 8.0, 9.4], radius: 0.4 },
  'weak-complaints': { position: [-5.6, 7.0, 4.4], radius: 0.38 },

  'mental-health': { position: [-11.6, -0.6, 3.8], radius: 0.4 },
  'productivity-growth': { position: [-10.4, 4.6, 5.6], radius: 0.4 },
  'teams-reputation': { position: [-9.0, -1.6, 6.0], radius: 0.38 },

  constitutional: { position: [-10.6, -1.2, -4.6], radius: 0.38 },
  'criminal-law': { position: [-6.2, -5.6, -3.8], radius: 0.4 },
  'other-safeguards': { position: [-9.8, -6.2, 0.6], radius: 0.38 },

  'posh-objectives': { position: [-3.0, 5.6, -10.6], radius: 0.4 },
  'posh-coverage': { position: [0.6, 3.4, -8.8], radius: 0.4 },
  'posh-definition': { position: [-5.2, 0.2, -8.2], radius: 0.38 },

  'internal-committee': { position: [5.8, -2.2, -10.4], radius: 0.42 },
  'local-committee': { position: [1.2, -7.4, -9.4], radius: 0.42 },
  'complaint-procedure': { position: [5.4, -6.6, -6.0], radius: 0.42 },

  'safe-environment': { position: [10.8, -1.0, -1.8], radius: 0.38 },
  'awareness-display': { position: [11.0, -5.4, -4.6], radius: 0.38 },
  'action-confidentiality': { position: [7.0, 0.0, -5.4], radius: 0.38 },

  'respect-dignity': { position: [4.4, 8.4, -5.4], radius: 0.4 },
  'equality-empathy': { position: [9.4, 8.8, -5.6], radius: 0.4 },
  'integrity-accountability': { position: [7.6, 4.4, -10.0], radius: 0.38 },

  'awareness-training': { position: [2.0, 11.6, 4.6], radius: 0.38 },
  'reporting-channels': { position: [-2.6, 9.6, 4.2], radius: 0.4 },
  'employee-support': { position: [1.0, 6.0, 5.8], radius: 0.38 },

  'case-situation': { position: [-8.8, -8.0, 7.4], radius: 0.4 },
  'case-response': { position: [-4.2, -8.6, 7.6], radius: 0.4 },
  'case-lessons': { position: [-7.6, -4.2, 8.4], radius: 0.38 },

  'beyond-law': { position: [-3.8, -6.6, -4.0], radius: 0.4 },
  'shared-responsibility': { position: [1.0, -9.6, -4.2], radius: 0.4 },
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  kind: 'structural' | 'cross'
}

/** Extra conceptual links that make the universe feel connected rather than tree-like. */
export const CROSS_LINKS: Array<[string, string]> = [
  ['effects', 'prevention'],
  ['causes', 'ethics'],
  ['types', 'case-study'],
  ['laws', 'conclusion'],
  ['responsibilities', 'posh'],
]

export const EDGES: GraphEdge[] = [
  ...TOPICS.filter((topic) => topic.parentId).map((topic) => ({
    id: `${topic.parentId}->${topic.id}`,
    from: topic.parentId as string,
    to: topic.id,
    kind: 'structural' as const,
  })),
  ...CROSS_LINKS.map(([from, to]) => ({
    id: `${from}~${to}`,
    from,
    to,
    kind: 'cross' as const,
  })),
]

export const NEIGHBORS: Record<string, string[]> = EDGES.reduce(
  (acc, edge) => {
    ;(acc[edge.from] = acc[edge.from] ?? []).push(edge.to)
    ;(acc[edge.to] = acc[edge.to] ?? []).push(edge.from)
    return acc
  },
  {} as Record<string, string[]>,
)

const PARENT_OF: Record<string, string> = Object.fromEntries(
  TOPICS.filter((topic) => topic.parentId).map((topic) => [topic.id, topic.parentId as string]),
)

/**
 * Everything that should stay bright when a node is selected: the node itself,
 * its ancestors, its direct children and its chained neighbours.
 */
export function relatedIds(id: string | null | undefined): Set<string> {
  const set = new Set<string>()
  if (!id) return set
  set.add(id)

  let ancestor = PARENT_OF[id]
  while (ancestor) {
    set.add(ancestor)
    ancestor = PARENT_OF[ancestor]
  }

  for (const [child, parent] of Object.entries(PARENT_OF)) {
    if (parent === id) set.add(child)
  }

  for (const neighbour of NEIGHBORS[id] ?? []) set.add(neighbour)
  return set
}

export function isRelated(id: string | null, other: string | null): boolean {
  if (!id) return true
  return relatedIds(id).has(other ?? '')
}

/**
 * Every node below `id` in the hierarchy, depth first. Used when a parent node is
 * dragged: its whole branch moves with it so the layout keeps its shape.
 */
export function descendantIds(id: string): string[] {
  const descendants: string[] = []
  const walk = (parentId: string) => {
    for (const child of CHILDREN[parentId] ?? []) {
      descendants.push(child.id)
      walk(child.id)
    }
  }
  walk(id)
  return descendants
}

export const INITIAL_POSITIONS: Record<string, Vec3> = Object.fromEntries(
  Object.entries(NODE_LAYOUT).map(([id, layout]) => [id, [...layout.position] as Vec3]),
)

export const NODE_RADIUS: Record<string, number> = Object.fromEntries(
  Object.entries(NODE_LAYOUT).map(([id, layout]) => [id, layout.radius]),
)

export function nodeRadius(id: string): number {
  return NODE_RADIUS[id] ?? (TOPIC_BY_ID[id]?.level === 'central' ? 2.15 : 0.45)
}

export function nodePosition(id: string, positions: Record<string, Vec3>): Vec3 {
  return positions[id] ?? INITIAL_POSITIONS[id] ?? [0, 0, 0]
}

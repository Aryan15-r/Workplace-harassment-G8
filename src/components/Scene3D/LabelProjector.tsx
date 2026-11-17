import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { nodePosition, nodeRadius, relatedIds } from '@/data/graphLayout'
import { TOPIC_BY_ID } from '@/data/topics'
import { OVERVIEW_CARD_ID, labelRegistry, screenBridge } from '@/lib/screenBridge'
import { useAppStore } from '@/store/useAppStore'

/**
 * Projects the world into the DOM: positions every node label, fades unrelated
 * labels when something is selected, and publishes the selected node's screen
 * point for the panel connector.
 */
export function LabelProjector() {
  const { camera, size } = useThree()
  const projected = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const { selectedId, hoveredId, positions } = useAppStore.getState()
    const related = relatedIds(selectedId)
    const width = size.width
    const height = size.height

    labelRegistry.getAll().forEach((_entry, id) => {
      let opacity = 0.6

      if (id === OVERVIEW_CARD_ID) {
        const position = nodePosition('overview', positions)
        projected.set(
          position[0],
          position[1] - nodeRadius('overview') * 1.0,
          position[2],
        )
        opacity = 1
      } else {
        const topic = TOPIC_BY_ID[id]
        if (!topic) return
        const position = nodePosition(id, positions)
        const radius = nodeRadius(id)
        const lift =
          topic.level === 'central' ? radius * 1.45 + 0.8 : radius * 1.1 + 0.42
        projected.set(position[0], position[1] + lift, position[2])
        opacity =
          topic.level === 'central' ? 1 : topic.level === 'main' ? 0.92 : 0.62

        // Sub-topic labels appear as the camera approaches the branch, so the
        // overview stays quiet instead of showing forty labels at once.
        if (topic.level === 'sub' && !selectedId && !hoveredId) {
          const distance = Math.hypot(
            position[0] - camera.position.x,
            position[1] - camera.position.y,
            position[2] - camera.position.z,
          )
          opacity *= 1 - Math.min(Math.max((distance - 15) / 15, 0), 1)
        }
      }

      projected.project(camera)
      const inFront = projected.z > -1 && projected.z < 1
      const x = (projected.x * 0.5 + 0.5) * width
      const y = (-projected.y * 0.5 + 0.5) * height
      const onScreen =
        inFront && x > -240 && x < width + 240 && y > -160 && y < height + 160

      if (id !== OVERVIEW_CARD_ID && selectedId) {
        if (id === selectedId) opacity = 1
        else if (related.has(id)) opacity = Math.max(opacity, 0.7)
        else opacity = 0.06
      }
      if (hoveredId && id === hoveredId) opacity = 1
      if (selectedId && id === OVERVIEW_CARD_ID) opacity = 0

      labelRegistry.write(id, x, y, opacity, onScreen)
    })

    if (selectedId) {
      const position = nodePosition(selectedId, positions)
      projected.set(position[0], position[1], position[2]).project(camera)
      const inFront = projected.z > -1 && projected.z < 1
      const x = (projected.x * 0.5 + 0.5) * width
      const y = (-projected.y * 0.5 + 0.5) * height
      screenBridge.publish({
        x,
        y,
        visible: inFront && x > 0 && x < width && y > 0 && y < height,
      })
    } else {
      screenBridge.publish({ x: 0, y: 0, visible: false })
    }
  })

  return null
}

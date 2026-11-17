import { ROOT_TOPIC, TOPICS } from '@/data/topics'
import { OVERVIEW_CARD_ID, labelRegistry } from '@/lib/screenBridge'
import { useAppStore } from '@/store/useAppStore'

/**
 * DOM labels for the 3D nodes. Positions are written by LabelProjector inside
 * the canvas, so these elements never re-render during the frame loop.
 */
export function NodeLabels() {
  const selectedId = useAppStore((state) => state.selectedId)
  const presentation = useAppStore((state) => state.presentation)
  const select = useAppStore((state) => state.select)

  return (
    <div className="ui-layer pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {TOPICS.map((topic) => (
        <div
          key={topic.id}
          data-level={topic.level}
          className="node-label"
          ref={(element) => {
            if (element) labelRegistry.register(topic.id, element, 'center')
            else labelRegistry.unregister(topic.id)
          }}
        >
          {topic.navTitle}
        </div>
      ))}

      {!selectedId && !presentation && (
        <div className="node-label overview-shell" ref={(element) => {
          if (element) labelRegistry.register(OVERVIEW_CARD_ID, element, 'top')
          else labelRegistry.unregister(OVERVIEW_CARD_ID)
        }}>
          <button
            type="button"
            onClick={() => select('overview')}
            className="overview-card pointer-events-auto text-left"
          >
            <span className="eyebrow">Central topic</span>
            <span className="overview-card__title">{ROOT_TOPIC.title}</span>
            <span className="overview-card__text">{ROOT_TOPIC.summary}</span>
            <span className="overview-card__hint">Open overview</span>
          </button>
        </div>
      )}
    </div>
  )
}

import { ChevronRight } from 'lucide-react'
import { CHILDREN, TOPIC_BY_ID } from '@/data/topics'
import { useAppStore } from '@/store/useAppStore'

interface TopicTreeProps {
  topicId: string
  depth: number
  expanded: Set<string>
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

export function TopicTree({
  topicId,
  depth,
  expanded,
  onToggle,
  onSelect,
}: TopicTreeProps) {
  const selectedId = useAppStore((state) => state.selectedId)
  const topic = TOPIC_BY_ID[topicId]
  if (!topic) return null

  const children = CHILDREN[topicId] ?? []
  const isOpen = expanded.has(topicId)
  const active = selectedId === topicId

  return (
    <div>
      <div className="flex items-center gap-1">
        {children.length > 0 ? (
          <button
            type="button"
            onClick={() => onToggle(topicId)}
            aria-expanded={isOpen}
            aria-label={isOpen ? `Collapse ${topic.navTitle}` : `Expand ${topic.navTitle}`}
            className="flex h-6 w-5 shrink-0 items-center justify-center text-white/35 transition-colors hover:text-gold"
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
          </button>
        ) : (
          <span className="flex h-6 w-5 shrink-0 items-center justify-center">
            <span
              className={`h-[3px] w-[3px] rounded-full ${active ? 'bg-gold' : 'bg-white/25'}`}
            />
          </span>
        )}

        <button
          type="button"
          onClick={() => onSelect(topicId)}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-[6px] text-left transition-colors duration-150 ${
            active
              ? 'bg-gold/10 text-gold'
              : 'text-[#CFCBC2] hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          {topic.index !== null && topic.index > 0 && (
            <span
              className={`font-mono text-[8.5px] tabular-nums ${
                active ? 'text-gold/70' : 'text-white/25'
              }`}
            >
              {String(topic.index).padStart(2, '0')}
            </span>
          )}
          <span
            className={`truncate ${
              topic.level === 'central'
                ? 'font-display text-[12px] font-semibold uppercase tracking-[0.12em]'
                : 'text-[11.5px]'
            }`}
          >
            {topic.navTitle}
          </span>
        </button>
      </div>

      {children.length > 0 && isOpen && (
        <div className="tree-children">
          {children.map((child) => (
            <TopicTree
              key={child.id}
              topicId={child.id}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

/**
 * Keyboard shortcuts for presenting:
 * ← / → move through the topic sequence, Esc closes the topmost surface,
 * Enter re-opens the selected topic.
 */
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return

      const state = useAppStore.getState()
      if (state.poster) {
        if (event.key === 'Escape') state.setPoster(false)
        return
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          state.next()
          break
        case 'ArrowLeft':
          event.preventDefault()
          state.prev()
          break
        case 'Escape':
          if (state.settingsOpen) state.setSettingsOpen(false)
          else if (state.sidebarOpen) state.setSidebarOpen(false)
          else if (state.presentation) state.setPresentation(false)
          else if (state.selectedId) state.select(null)
          break
        case 'Enter': {
          if (state.selectedId) break
          const target = state.hoveredId
          if (target) {
            event.preventDefault()
            state.select(target)
          }
          break
        }
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

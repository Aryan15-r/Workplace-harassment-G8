import { useCallback, useEffect, useState } from 'react'

export type AppRoute = 'universe' | 'feedback'

function checkIsFeedbackRoute(): boolean {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '')
  const hash = window.location.hash.toLowerCase()
  const search = window.location.search.toLowerCase()

  return (
    path.endsWith('/feedback') ||
    path === '/feedback' ||
    hash === '#/feedback' ||
    hash === '#feedback' ||
    search.includes('feedback')
  )
}

export function useRoute() {
  const [route, setRoute] = useState<AppRoute>(() =>
    checkIsFeedbackRoute() ? 'feedback' : 'universe',
  )

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(checkIsFeedbackRoute() ? 'feedback' : 'universe')
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const navigateTo = useCallback((target: AppRoute) => {
    if (target === 'feedback') {
      try {
        window.history.pushState(null, '', '/feedback')
      } catch {
        window.location.hash = '#/feedback'
      }
      setRoute('feedback')
    } else {
      try {
        window.history.pushState(null, '', '/')
      } catch {
        window.location.hash = ''
      }
      setRoute('universe')
    }
  }, [])

  return { route, navigateTo }
}

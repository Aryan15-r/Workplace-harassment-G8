import { useEffect } from 'react'
import { FeedbackPage } from '@/components/Feedback/FeedbackPage'
import { FeedbackQRModal } from '@/components/Feedback/FeedbackQRModal'
import { PanelConnector } from '@/components/InformationPanel/PanelConnector'
import { TopicPanel } from '@/components/InformationPanel/TopicPanel'
import { Header } from '@/components/Interface/Header'
import { NodeLabels } from '@/components/Interface/NodeLabels'
import { SettingsPanel } from '@/components/Interface/SettingsPanel'
import { Toolbar } from '@/components/Interface/Toolbar'
import { PosterView } from '@/components/Poster/PosterView'
import { PresentationOverlay } from '@/components/Presentation/PresentationOverlay'
import { KnowledgeUniverse } from '@/components/Scene3D/KnowledgeUniverse'
import { TopicSidebar } from '@/components/Sidebar/TopicSidebar'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useRoute } from '@/hooks/useRoute'
import { useAppStore } from '@/store/useAppStore'

export function App() {
  const { route, navigateTo } = useRoute()
  const poster = useAppStore((state) => state.poster)
  const presentation = useAppStore((state) => state.presentation)
  const reducedMotion = useAppStore((state) => state.reducedMotion)
  const feedbackQrOpen = useAppStore((state) => state.feedbackQrOpen)
  const setFeedbackQrOpen = useAppStore((state) => state.setFeedbackQrOpen)

  useKeyboardNavigation()

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion)
  }, [reducedMotion])

  if (route === 'feedback') {
    return <FeedbackPage onBackToUniverse={() => navigateTo('universe')} />
  }

  if (poster) return <PosterView />

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink-0">
      <KnowledgeUniverse />
      <div className="vignette pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-28 bg-gradient-to-b from-[#0a0a0b]/85 via-[#0a0a0b]/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-24 bg-gradient-to-t from-[#0a0a0b]/80 to-transparent"
        aria-hidden="true"
      />

      <NodeLabels />

      {!presentation && <Header onOpenFeedback={() => navigateTo('feedback')} />}
      {!presentation && <Toolbar />}

      <PanelConnector />
      <TopicPanel />
      <PresentationOverlay />

      <TopicSidebar />
      <SettingsPanel />

      <FeedbackQRModal
        open={feedbackQrOpen}
        onClose={() => setFeedbackQrOpen(false)}
        onNavigateFeedback={() => navigateTo('feedback')}
      />
    </div>
  )
}

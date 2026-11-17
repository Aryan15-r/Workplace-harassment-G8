import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { QRCodeCard } from './QRCodeCard'

interface FeedbackQRModalProps {
  open: boolean
  onClose: () => void
  onNavigateFeedback: () => void
}

export function FeedbackQRModal({ open, onClose, onNavigateFeedback }: FeedbackQRModalProps) {
  const reducedMotion = useAppStore((state) => state.reducedMotion)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="qr-backdrop"
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="qr-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Feedback QR code"
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.94, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.94, y: reducedMotion ? 0 : 12 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/60 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <X className="h-4 w-4" />
            </button>

            <QRCodeCard
              showActions
              onNavigateFeedback={() => {
                onClose()
                onNavigateFeedback()
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download, ExternalLink, QrCode } from 'lucide-react'
import { getFeedbackQrUrl } from '@/config/feedbackConfig'
import { downloadHighResQrPng, renderQrToCanvas } from '@/lib/qrCodeUtil'

interface QRCodeCardProps {
  compact?: boolean
  showActions?: boolean
  className?: string
  onNavigateFeedback?: () => void
}

export function QRCodeCard({
  compact = false,
  showActions = true,
  className = '',
  onNavigateFeedback,
}: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const qrUrl = getFeedbackQrUrl()

  useEffect(() => {
    if (canvasRef.current) {
      renderQrToCanvas(canvasRef.current, qrUrl, {
        width: compact ? 120 : 200,
        margin: 1,
        color: {
          dark: '#0a0a0b',
          light: '#ffffff',
        },
      }).catch((err) => {
        console.error('Failed to render QR code to canvas:', err)
      })
    }
  }, [qrUrl, compact])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  const handleDownloadPng = async () => {
    setIsDownloading(true)
    try {
      await downloadHighResQrPng(qrUrl)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <div className="relative shrink-0 rounded-lg bg-white p-1.5 shadow-md">
          <canvas ref={canvasRef} className="block rounded" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-gold/80">Feedback</p>
          <h4 className="font-display text-[12px] font-semibold text-[#f5f5f5]">
            Share Your Feedback
          </h4>
          <p className="mt-0.5 text-[10px] text-haze">Scan to submit your review</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`glass relative flex flex-col items-center rounded-2xl p-6 text-center shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <QrCode className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold/80">
          Mobile Access
        </span>
      </div>

      <h3 className="mt-3 font-display text-[20px] font-semibold text-[#F5F5F5]">
        Share Your Feedback
      </h3>
      <p className="mt-1 max-w-[280px] text-[12px] leading-relaxed text-haze">
        Scan to submit your review directly from your mobile device.
      </p>

      {/* High-contrast QR canvas inside white protective card */}
      <div className="relative mt-5 rounded-2xl bg-white p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
        <canvas ref={canvasRef} className="block rounded-lg" />
      </div>

      {/* Target URL Pill */}
      <div className="mt-4 flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/70">
        <span className="truncate">{qrUrl}</span>
      </div>

      {showActions && (
        <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3.5 py-2 text-[11px] font-medium text-gold transition-colors hover:bg-gold/20"
          >
            <Download className="h-3.5 w-3.5" />
            {isDownloading ? 'Generating...' : 'Download QR (PNG)'}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-medium text-[#ECE8DE] transition-colors hover:border-gold/30 hover:text-gold"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {onNavigateFeedback && (
            <button
              type="button"
              onClick={onNavigateFeedback}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-medium text-[#ECE8DE] transition-colors hover:border-gold/30 hover:text-gold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Form Here</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

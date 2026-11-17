import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Loader2,
  MessageSquare,
  QrCode,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  User,
} from 'lucide-react'
import { RATING_DESCRIPTIONS } from '@/config/feedbackConfig'
import { submitFeedback, validateFeedback, type FeedbackSubmission } from '@/lib/feedbackApi'
import { useAppStore } from '@/store/useAppStore'
import { FeedbackQRModal } from './FeedbackQRModal'

interface FeedbackPageProps {
  onBackToUniverse: () => void
}

export function FeedbackPage({ onBackToUniverse }: FeedbackPageProps) {
  const reducedMotion = useAppStore((state) => state.reducedMotion)

  // Form State
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [honeypot, setHoneypot] = useState('')

  // UI / Status State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<FeedbackSubmission | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successInfo, setSuccessInfo] = useState<{ message: string; isSimulated?: boolean } | null>(
    null,
  )
  const [qrModalOpen, setQrModalOpen] = useState(false)

  // Field validation on blur
  const handleBlur = (field: 'name' | 'studentId' | 'feedback' | 'rating') => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const res = validateFeedback({ name, studentId, feedback, rating, honeypot })
    if (res.errors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: res.errors[field]! }))
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleRatingSelect = (selected: number) => {
    setRating(selected)
    setTouched((prev) => ({ ...prev, rating: true }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next.rating
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all touched
    setTouched({ name: true, studentId: true, feedback: true, rating: true })

    const submission: FeedbackSubmission = {
      name,
      studentId,
      feedback,
      rating,
      honeypot,
    }

    const validation = validateFeedback(submission)
    if (!validation.valid) {
      setFieldErrors(validation.errors as Record<string, string>)
      setSubmitError('Please address the highlighted fields before submitting.')
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const res = await submitFeedback(submission)
      if (res.success) {
        setSubmittedData(submission)
        setSuccessInfo({ message: res.message, isSimulated: res.isSimulated })
        setIsSuccess(true)
      } else {
        setSubmitError(res.message)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setName('')
    setStudentId('')
    setFeedback('')
    setRating(0)
    setHoveredRating(0)
    setHoneypot('')
    setFieldErrors({})
    setTouched({})
    setSubmitError(null)
    setIsSuccess(false)
    setSubmittedData(null)
    setSuccessInfo(null)
  }

  const activeRatingDisplay = hoveredRating || rating
  const ratingDescription = activeRatingDisplay ? RATING_DESCRIPTIONS[activeRatingDisplay] : ''

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-ink-0 text-[#f5f5f5] selection:bg-gold/30 selection:text-white">
      {/* Background Ambience */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(255,211,78,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(#ffd34e_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0a0a0b]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBackToUniverse}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11.5px] font-medium text-[#ECE8DE] transition-all hover:border-gold/40 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Universe</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/80">
              Workplace Harassment G8
            </span>
          </div>

          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            title="Display QR code for mobile scanning"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[11px] font-medium text-gold transition-colors hover:bg-gold/20"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Show QR Code</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* ====================================================================
               SUCCESS SCREEN
               ==================================================================== */
            <motion.div
              key="success-screen"
              className="glass rounded-3xl p-6 sm:p-10 text-center shadow-2xl"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : -16 }}
              transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 shadow-[0_0_30px_rgba(255,211,78,0.3)]">
                <CheckCircle2 className="h-8 w-8 text-gold" strokeWidth={2} />
              </div>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                Submission Recorded
              </p>
              <h2 className="mt-2 font-display text-[26px] font-semibold text-[#f5f5f5] sm:text-[32px]">
                Thank You for Your Feedback!
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-[#c4c0b4]">
                Your response has been successfully submitted and stored in our presentation review
                records. We appreciate your time and perspective.
              </p>

              {successInfo?.isSimulated && (
                <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Demo Mode: Connect Google Apps Script URL in .env for live sheet sync</span>
                </div>
              )}

              {/* Submission Summary Card */}
              {submittedData && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 text-left text-sm">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/70">
                    Response Summary
                  </p>
                  <div className="mt-3 flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-[12px] text-haze">Submitted By:</span>
                    <span className="font-medium text-[#f5f5f5]">{submittedData.name}</span>
                  </div>
                  {submittedData.studentId && (
                    <div className="mt-2.5 flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                      <span className="text-[12px] text-haze">Student ID:</span>
                      <span className="font-mono text-[12px] text-[#f5f5f5]">
                        {submittedData.studentId}
                      </span>
                    </div>
                  )}
                  <div className="mt-2.5 flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-[12px] text-haze">Rating:</span>
                    <span className="flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < submittedData.rating
                              ? 'fill-gold text-gold'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-[11px] font-medium text-white/80">
                        ({submittedData.rating}/5)
                      </span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[12px] text-haze">Review:</span>
                    <p className="mt-1 line-clamp-4 rounded-lg bg-white/[0.02] p-2.5 text-[12.5px] italic leading-relaxed text-[#dcd8ce]">
                      “{submittedData.feedback}”
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onBackToUniverse}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-gold px-6 py-3 font-display text-[13px] font-semibold text-[#14120b] shadow-[0_4px_20px_rgba(255,211,78,0.3)] transition-all hover:bg-gold-glow sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Interactive Universe</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[12.5px] font-medium text-[#ECE8DE] transition-colors hover:border-gold/40 hover:text-gold sm:w-auto"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Submit Another Response</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ====================================================================
               FEEDBACK FORM
               ==================================================================== */
            <motion.div
              key="feedback-form"
              className="glass rounded-3xl p-6 sm:p-10 shadow-2xl"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
              transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="border-b border-white/[0.08] pb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.06] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-gold">
                  <Sparkles className="h-3 w-3" />
                  Presentation Review
                </div>
                <h1 className="mt-3 font-display text-[26px] font-semibold tracking-tight text-[#f5f5f5] sm:text-[34px]">
                  Share Your Feedback
                </h1>
                <p className="mt-2 text-[13px] leading-relaxed text-[#c0bcb0]">
                  Help us evaluate the clarity and impact of our 3D presentation on Workplace
                  Harassment and legal accountability under the POSH Act, 2013.
                </p>
              </div>

              {/* Form Failure Alert with Retry */}
              {submitError && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <div className="flex-1 text-[12px] leading-relaxed">
                    <p className="font-semibold text-rose-300">Submission Notice</p>
                    <p className="mt-0.5">{submitError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitError(null)}
                    className="text-[11px] underline opacity-80 hover:opacity-100"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                {/* Honeypot field (hidden from legitimate users) */}
                <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                  <label htmlFor="hp_website">Leave this field blank</label>
                  <input
                    type="text"
                    id="hp_website"
                    name="website"
                    value={honeypot}
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Rating Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 font-display text-[13px] font-medium text-[#ECE8DE]">
                      <span>Overall Rating</span>
                      <span className="text-gold" aria-hidden="true">
                        *
                      </span>
                    </label>
                    {ratingDescription && (
                      <span className="font-mono text-[11px] font-medium text-gold">
                        {ratingDescription}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-haze">
                    How would you rate the presentation content, visual design, and clarity?
                  </p>

                  <div
                    role="radiogroup"
                    aria-label="Star rating out of 5"
                    className="mt-3 flex items-center gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = activeRatingDisplay >= starValue
                      return (
                        <button
                          key={starValue}
                          type="button"
                          role="radio"
                          aria-checked={rating === starValue}
                          aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
                          onClick={() => handleRatingSelect(starValue)}
                          onMouseEnter={() => setHoveredRating(starValue)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onFocus={() => setHoveredRating(starValue)}
                          onBlur={() => {
                            setHoveredRating(0)
                            handleBlur('rating')
                          }}
                          className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] transition-all hover:scale-110 hover:border-gold/50 hover:bg-gold/10 focus-visible:border-gold"
                        >
                          <Star
                            className={`h-6 w-6 transition-all duration-200 ${
                              isFilled
                                ? 'fill-gold text-gold drop-shadow-[0_0_8px_rgba(255,211,78,0.55)]'
                                : 'text-white/25 group-hover:text-gold/60'
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                  {touched.rating && fieldErrors.rating && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {fieldErrors.rating}
                    </p>
                  )}
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="feedback-name"
                    className="flex items-center gap-1.5 font-display text-[13px] font-medium text-[#ECE8DE]"
                  >
                    <User className="h-3.5 w-3.5 text-gold/70" />
                    <span>Your Name</span>
                    <span className="text-gold" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="feedback-name"
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g., Alex Morgan"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => {
                            const next = { ...prev }
                            delete next.name
                            return next
                          })
                        }
                      }}
                      onBlur={() => handleBlur('name')}
                      className={`w-full rounded-xl border bg-black/30 px-4 py-3 text-[13px] text-[#f5f5f5] placeholder:text-white/20 transition-all focus:bg-black/50 focus:outline-none ${
                        touched.name && fieldErrors.name
                          ? 'border-rose-500/80 focus:border-rose-500'
                          : 'border-white/10 hover:border-white/20 focus:border-gold/60 focus:ring-1 focus:ring-gold/30'
                      }`}
                    />
                  </div>
                  {touched.name && fieldErrors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Student ID Field (Optional) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="feedback-student-id"
                      className="flex items-center gap-1.5 font-display text-[13px] font-medium text-[#ECE8DE]"
                    >
                      <GraduationCap className="h-3.5 w-3.5 text-gold/70" />
                      <span>Student ID / Roll No.</span>
                    </label>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-haze">
                      Optional
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-haze">
                    Provide if needed for college presentation attendance or course records.
                  </p>
                  <div className="relative mt-2">
                    <input
                      id="feedback-student-id"
                      type="text"
                      maxLength={50}
                      placeholder="e.g., 2024-ETH-042"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value)
                        if (fieldErrors.studentId) {
                          setFieldErrors((prev) => {
                            const next = { ...prev }
                            delete next.studentId
                            return next
                          })
                        }
                      }}
                      onBlur={() => handleBlur('studentId')}
                      className={`w-full rounded-xl border bg-black/30 px-4 py-3 text-[13px] text-[#f5f5f5] placeholder:text-white/20 transition-all focus:bg-black/50 focus:outline-none ${
                        touched.studentId && fieldErrors.studentId
                          ? 'border-rose-500/80 focus:border-rose-500'
                          : 'border-white/10 hover:border-white/20 focus:border-gold/60 focus:ring-1 focus:ring-gold/30'
                      }`}
                    />
                  </div>
                  {touched.studentId && fieldErrors.studentId && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {fieldErrors.studentId}
                    </p>
                  )}
                </div>

                {/* Feedback Textarea Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="feedback-review"
                      className="flex items-center gap-1.5 font-display text-[13px] font-medium text-[#ECE8DE]"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-gold/70" />
                      <span>Feedback / Review</span>
                      <span className="text-gold" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        feedback.length > 2000 ? 'text-amber-400' : 'text-white/30'
                      }`}
                    >
                      {feedback.length} / 2500
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-haze">
                    What stood out? Any key takeaway or suggestions regarding the 3D presentation?
                  </p>
                  <div className="relative mt-2">
                    <textarea
                      id="feedback-review"
                      required
                      rows={5}
                      maxLength={2500}
                      placeholder="Share your thoughts on the topics covered, the interactive experience, or suggestions for our team..."
                      value={feedback}
                      onChange={(e) => {
                        setFeedback(e.target.value)
                        if (fieldErrors.feedback) {
                          setFieldErrors((prev) => {
                            const next = { ...prev }
                            delete next.feedback
                            return next
                          })
                        }
                      }}
                      onBlur={() => handleBlur('feedback')}
                      className={`thin-scroll w-full resize-y rounded-xl border bg-black/30 p-4 text-[13px] leading-relaxed text-[#f5f5f5] placeholder:text-white/20 transition-all focus:bg-black/50 focus:outline-none ${
                        touched.feedback && fieldErrors.feedback
                          ? 'border-rose-500/80 focus:border-rose-500'
                          : 'border-white/10 hover:border-white/20 focus:border-gold/60 focus:ring-1 focus:ring-gold/30'
                      }`}
                    />
                  </div>
                  {touched.feedback && fieldErrors.feedback && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {fieldErrors.feedback}
                    </p>
                  )}
                </div>

                {/* Submit Button & Security Note */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-display text-[14px] font-semibold text-[#14120b] shadow-[0_4px_24px_rgba(255,211,78,0.35)] transition-all hover:bg-gold-glow hover:shadow-[0_4px_30px_rgba(255,211,78,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#14120b]" />
                        <span>Submitting Feedback to Sheets...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-[#14120b]" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/30">
                    No sign-in required · Encrypted direct transmission
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* QR Code Modal */}
      <FeedbackQRModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onNavigateFeedback={() => setQrModalOpen(false)}
      />
    </div>
  )
}

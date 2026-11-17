import { AnimatePresence, motion } from 'framer-motion'
import { Accessibility, Cpu, LayoutGrid, RotateCcw, X } from 'lucide-react'
import { QUALITY_LABEL } from '@/lib/quality'
import { useAppStore } from '@/store/useAppStore'
import type { Quality } from '@/types'

const QUALITIES: Quality[] = ['low', 'medium', 'high']

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div>
        <p className="text-[11.5px] font-medium text-[#E9E6DE]">{label}</p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-white/40">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-[18px] w-[32px] shrink-0 rounded-full border transition-colors duration-200 ${
          checked ? 'border-gold/50 bg-gold/25' : 'border-white/15 bg-white/5'
        }`}
      >
        <span
          className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full transition-all duration-200 ${
            checked ? 'left-[16px] bg-gold' : 'left-[2px] bg-white/40'
          }`}
        />
      </button>
    </div>
  )
}

export function SettingsPanel() {
  const settingsOpen = useAppStore((state) => state.settingsOpen)
  const setSettingsOpen = useAppStore((state) => state.setSettingsOpen)
  const quality = useAppStore((state) => state.quality)
  const setQuality = useAppStore((state) => state.setQuality)
  const reducedMotion = useAppStore((state) => state.reducedMotion)
  const setReducedMotion = useAppStore((state) => state.setReducedMotion)
  const autoQuality = useAppStore((state) => state.autoQuality)
  const setAutoQuality = useAppStore((state) => state.setAutoQuality)
  const resetLayout = useAppStore((state) => state.resetLayout)
  const resetCamera = useAppStore((state) => state.resetCamera)

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          <motion.div
            key="settings-backdrop"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSettingsOpen(false)}
          />
          <motion.div
            key="settings"
            role="dialog"
            aria-label="Display settings"
            className="glass fixed right-4 top-[74px] z-50 w-[302px] rounded-2xl px-5 py-4 sm:right-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Display</p>
                <h2 className="mt-1 font-display text-[13px] font-semibold text-[#F5F5F5]">
                  Experience settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
                className="text-white/40 transition-colors hover:text-gold"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.7} />
              </button>
            </div>

            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/35">
                <Cpu className="h-3 w-3" strokeWidth={1.6} /> Quality
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-white/10 p-1">
                {QUALITIES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setQuality(option)}
                    aria-pressed={quality === option}
                    className={`rounded-md px-2 py-1.5 text-[10.5px] font-medium transition-colors duration-200 ${
                      quality === option
                        ? 'bg-gold/15 text-gold'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    {QUALITY_LABEL[option]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 divide-y divide-white/[0.06] border-t border-white/[0.06]">
              <Toggle
                label="Reduced motion"
                description="Snap camera moves and stop ambient animation."
                checked={reducedMotion}
                onChange={setReducedMotion}
              />
              <Toggle
                label="Auto quality"
                description="Step effects down if the frame rate drops."
                checked={autoQuality}
                onChange={setAutoQuality}
              />
            </div>

            <div className="mt-3 grid gap-1.5 border-t border-white/[0.06] pt-3">
              <button
                type="button"
                onClick={resetCamera}
                className="inline-flex items-center gap-2 rounded-md px-1 py-1.5 text-left text-[11px] text-white/55 transition-colors hover:text-gold"
              >
                <RotateCcw className="h-3 w-3" strokeWidth={1.6} /> Reset camera
              </button>
              <button
                type="button"
                onClick={resetLayout}
                className="inline-flex items-center gap-2 rounded-md px-1 py-1.5 text-left text-[11px] text-white/55 transition-colors hover:text-gold"
              >
                <LayoutGrid className="h-3 w-3" strokeWidth={1.6} /> Restore node positions
              </button>
            </div>

            <p className="mt-3 flex items-start gap-1.5 border-t border-white/[0.06] pt-3 font-mono text-[8.5px] leading-relaxed text-white/25">
              <Accessibility className="mt-[1px] h-3 w-3 shrink-0" strokeWidth={1.5} />
              Shortcuts: ← → topics · Esc close · Enter open
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

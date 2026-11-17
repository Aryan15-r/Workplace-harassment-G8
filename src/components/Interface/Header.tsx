import { LayoutList, Play, Printer, Settings2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

interface HeaderButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  active?: boolean
}

function HeaderButton({ icon: Icon, label, onClick, active = false }: HeaderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[11px] font-medium transition-colors duration-200 ${
        active
          ? 'border-gold/40 bg-gold/10 text-gold'
          : 'border-white/10 bg-white/[0.03] text-haze hover:border-gold/30 hover:text-[#F5F5F5]'
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export function Header() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const settingsOpen = useAppStore((state) => state.settingsOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const setSettingsOpen = useAppStore((state) => state.setSettingsOpen)
  const setPresentation = useAppStore((state) => state.setPresentation)
  const setPoster = useAppStore((state) => state.setPoster)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4 sm:p-6">
      <div className="pointer-events-auto flex items-center gap-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.04]">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_14px_5px_rgba(255,211,78,0.45)]" />
          <span className="absolute inset-0 rounded-full border border-gold/10" />
        </span>
        <div className="leading-tight">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-gold/65">
            Interactive knowledge universe
          </p>
          <h1 className="mt-1 font-display text-[12.5px] font-semibold uppercase tracking-[0.2em] text-[#F5F5F5]">
            Workplace Harassment
          </h1>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-1.5">
        <HeaderButton icon={Play} label="Present" onClick={() => setPresentation(true)} />
        <HeaderButton icon={Printer} label="Poster" onClick={() => setPoster(true)} />
        <HeaderButton
          icon={Settings2}
          label="Settings"
          active={settingsOpen}
          onClick={() => setSettingsOpen(!settingsOpen)}
        />
        <span className="mx-1 h-5 w-px bg-white/10" aria-hidden />
        <HeaderButton
          icon={LayoutList}
          label="Topics"
          active={sidebarOpen}
          onClick={toggleSidebar}
        />
      </div>
    </header>
  )
}

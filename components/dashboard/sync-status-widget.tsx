\"use client\"

import { useEffect, useState } from \"react\"
import { Database, Cloud, RefreshCw, Wifi, WifiOff } from \"lucide-react\"
import { cn } from \"@/lib/utils\"

type SyncState = \"synced\" | \"syncing\" | \"offline\"

type SyncSystemId = \"local\" | \"powersync\" | \"supabase\"

type SyncSystemStatus = {
  id: SyncSystemId
  state: SyncState
}

type SyncStatusWidgetProps = {
  systems?: SyncSystemStatus[]
  globalState?: SyncState
  noteCountLabel?: string
  lastSyncLabel?: string
}

const GLOBAL_STATUS_CONFIG: Record<
  SyncState,
  {
    label: string
    color: string
    glowFrom: string
    glowTo: string
    icon: typeof Wifi | typeof RefreshCw | typeof WifiOff
  }
> = {
  synced: {
    label: \"All changes synced\",
    color: \"text-emerald-400\",
    glowFrom: \"from-emerald-500/20\",
    glowTo: \"to-emerald-400/0\",
    icon: Wifi,
  },
  syncing: {
    label: \"Syncing in the background\",
    color: \"text-amber-300\",
    glowFrom: \"from-amber-400/25\",
    glowTo: \"to-amber-300/0\",
    icon: RefreshCw,
  },
  offline: {
    label: \"Offline – changes queued\",
    color: \"text-muted-foreground\",
    glowFrom: \"from-neutral-500/10\",
    glowTo: \"to-neutral-500/0\",
    icon: WifiOff,
  },
}

const SYSTEM_LABELS: Record<SyncSystemId, string> = {
  local: \"Local SQLite\",
  powersync: \"PowerSync\",
  supabase: \"Supabase\",
}

const SYSTEM_BADGE_COLORS: Record<
  SyncSystemId,
  { border: string; bg: string; text: string }
> = {
  local: {
    border: \"border-emerald-400/40\",
    bg: \"bg-emerald-500/10\",
    text: \"text-emerald-300\",
  },
  powersync: {
    border: \"border-primary/40\",
    bg: \"bg-primary/10\",
    text: \"text-primary\",
  },
  supabase: {
    border: \"border-secondary/40\",
    bg: \"bg-secondary/10\",
    text: \"text-secondary\",
  },
}

const SYSTEM_STATE_LABEL: Record<SyncState, string> = {
  synced: \"Synced\",
  syncing: \"Syncing\",
  offline: \"Offline\",
}

function useMockSyncState() {
  const [globalState, setGlobalState] = useState<SyncState>(\"synced\")
  const [systems, setSystems] = useState<SyncSystemStatus[]>([
    { id: \"local\", state: \"synced\" },
    { id: \"powersync\", state: \"synced\" },
    { id: \"supabase\", state: \"synced\" },
  ])
  const [noteCountLabel, setNoteCountLabel] = useState(\"847 notes\")
  const [lastSyncLabel, setLastSyncLabel] = useState(\"Last sync: moments ago\")

  useEffect(() => {
    const sequence: {
      global: SyncState
      systems: SyncSystemStatus[]
      noteCount: string
      lastSync: string
    }[] = [
      {
        global: \"synced\",
        systems: [
          { id: \"local\", state: \"synced\" },
          { id: \"powersync\", state: \"synced\" },
          { id: \"supabase\", state: \"synced\" },
        ],
        noteCount: \"847 notes\",
        lastSync: \"Last sync: moments ago\",
      },
      {
        global: \"syncing\",
        systems: [
          { id: \"local\", state: \"syncing\" },
          { id: \"powersync\", state: \"syncing\" },
          { id: \"supabase\", state: \"synced\" },
        ],
        noteCount: \"Syncing recent changes…\",
        lastSync: \"Last sync: < 1 min ago\",
      },
      {
        global: \"offline\",
        systems: [
          { id: \"local\", state: \"synced\" },
          { id: \"powersync\", state: \"offline\" },
          { id: \"supabase\", state: \"offline\" },
        ],
        noteCount: \"Working locally – queued\",
        lastSync: \"Last cloud sync: 4 min ago\",
      },
    ]

    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % sequence.length
      const current = sequence[index]
      setGlobalState(current.global)
      setSystems(current.systems)
      setNoteCountLabel(current.noteCount)
      setLastSyncLabel(current.lastSync)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return { globalState, systems, noteCountLabel, lastSyncLabel }
}

export function SyncStatus() {
  return <SyncStatusWidget />
}

export function SyncStatusWidget(props: SyncStatusWidgetProps) {
  const mock = useMockSyncState()

  const globalState: SyncState = props.globalState ?? mock.globalState
  const systems: SyncSystemStatus[] = props.systems ?? mock.systems
  const noteCountLabel = props.noteCountLabel ?? mock.noteCountLabel
  const lastSyncLabel = props.lastSyncLabel ?? mock.lastSyncLabel

  const [isExpanded, setIsExpanded] = useState(false)

  const globalConfig = GLOBAL_STATUS_CONFIG[globalState]
  const GlobalIcon = globalConfig.icon

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "group relative flex w-full items-center gap-2 overflow-hidden rounded-xl border border-border/60 bg-card/70 px-2.5 py-2 text-xs shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-colors",
          "hover:border-primary/40 hover:bg-card/90"
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className={cn(
              "absolute inset-x-[-40%] top-0 h-16 bg-gradient-to-br",
              globalConfig.glowFrom,
              globalConfig.glowTo
            )}
          />
        </div>

        <div className="relative flex items-center gap-2">
          <div className="relative">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full shadow-[0_0_0_1px_rgba(15,23,42,0.9)]",
                globalState === "synced" && "bg-emerald-400",
                globalState === "syncing" && "bg-amber-300",
                globalState === "offline" && "bg-muted-foreground/60"
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full blur-md transition-opacity",
                globalState === "synced" && "bg-emerald-400/50",
                globalState === "syncing" && "bg-amber-300/40",
                globalState === "offline" && "bg-muted-foreground/30",
                globalState !== "offline" ? "opacity-70" : "opacity-40"
              )}
            />
          </div>

          <div className="flex flex-col">
            <span className={cn("flex items-center gap-1.5 font-medium", globalConfig.color)}>
              <span className="inline-flex items-center rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Sync
              </span>
              <span className="truncate">{globalConfig.label}</span>
            </span>
            <span className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
              {noteCountLabel}
            </span>
          </div>
        </div>

        <div className="relative ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline-flex">{lastSyncLabel}</span>
          <GlobalIcon
            className={cn(
              "h-3.5 w-3.5",
              globalConfig.color,
              globalState === "syncing" && "animate-spin-slow"
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-3 rounded-xl border border-border/70 bg-card/80 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium text-muted-foreground">
              Sync path
            </span>
            <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] text-muted-foreground">
              Local → PowerSync → Supabase
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <SyncSystemPill
              id="local"
              status={systems.find((s) => s.id === "local")?.state ?? "offline"}
            />

            <SyncArrow
              isActive={
                (systems.find((s) => s.id === "local")?.state ?? "offline") ===
                "syncing"
              }
              variant="primary"
            />

            <SyncSystemPill
              id="powersync"
              status={systems.find((s) => s.id === "powersync")?.state ?? "offline"}
            />

            <SyncArrow
              isActive={
                (systems.find((s) => s.id === "powersync")?.state ?? "offline") ===
                "syncing"
              }
              variant="secondary"
            />

            <SyncSystemPill
              id="supabase"
              status={systems.find((s) => s.id === "supabase")?.state ?? "offline"}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/40 pt-2.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              End-to-end encrypted local-first sync
            </span>
            <span className="hidden text-[10px] text-muted-foreground/80 sm:inline">
              Status updates automatically – no manual refresh needed
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

type SyncSystemPillProps = {
  id: SyncSystemId
  status: SyncState
}

function SyncSystemPill({ id, status }: SyncSystemPillProps) {
  const colors = SYSTEM_BADGE_COLORS[id]

  const Icon =
    id === "local" ? Database : id === "powersync" ? RefreshCw : Cloud

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br from-background/80 to-background/40 shadow-[0_12px_30px_rgba(15,23,42,0.7)]",
          colors.border,
          colors.bg
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            colors.text,
            status === "syncing" && "animate-spin-slow"
          )}
        />
        {status === "synced" && (
          <div className="pointer-events-none absolute inset-0 rounded-xl border border-emerald-400/40 opacity-60 blur-[2px]" />
        )}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">
        {SYSTEM_LABELS[id]}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[9px]",
          status === "synced" && "bg-emerald-500/10 text-emerald-300",
          status === "syncing" && "bg-amber-400/10 text-amber-200",
          status === "offline" && "bg-neutral-700/60 text-neutral-300"
        )}
      >
        {SYSTEM_STATE_LABEL[status]}
      </span>
    </div>
  )
}

type SyncArrowProps = {
  isActive: boolean
  variant: "primary" | "secondary"
}

function SyncArrow({ isActive, variant }: SyncArrowProps) {
  const baseColor =
    variant === "primary" ? "text-primary/60" : "text-secondary/60"

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg
        width="26"
        height="10"
        viewBox="0 0 26 10"
        className={cn(
          baseColor,
          isActive && "drop-shadow-[0_0_12px_rgba(94,92,255,0.5)]"
        )}
      >
        <path
          d="M1,5 L22,5 M18,2 L22,5 L18,8"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {isActive && (
        <div className="h-0.5 w-6 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full w-full animate-[shimmer_1.1s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-current to-transparent",
              variant === "primary" ? "text-primary" : "text-secondary"
            )}
          />
        </div>
      )}
    </div>
  )
}

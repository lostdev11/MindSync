"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Sparkles } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

type TimelineDay = {
  date: string
  entries: string[]
}

type TimelineResponse = {
  success: boolean
  days: TimelineDay[]
  error?: string
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  })
}

export default function MemoryTimelinePage() {
  const [days, setDays] = useState<TimelineDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTimeline = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/memory-timeline")

        if (!res.ok) {
          throw new Error("Failed to load memory timeline")
        }

        const data: TimelineResponse = await res.json()
        if (!data.success) {
          throw new Error(data.error || "Failed to load memory timeline")
        }

        setDays(data.days || [])
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err)
        setError(err.message || "Something went wrong loading your memory timeline.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimeline()
  }, [])

  const hasTimeline = days.length > 0

  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Memory Timeline" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Hero / Intro */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-40 w-40 bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent opacity-40 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-25 blur-md" />
                <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-primary/40 bg-card">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  AI Memory Timeline
                </h2>
                <p className="text-sm text-muted-foreground">
                  MindSync scans your recent notes and compresses them into a daily memory stream—short,
                  human-friendly snapshots of what you&apos;ve been thinking about.
                </p>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="absolute inset-2 animate-pulse rounded-full bg-primary/30" />
                <Clock className="relative h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">We&apos;re piecing together your memories…</p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!error && !isLoading && !hasTimeline && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/60 bg-card/40 p-10 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-border/60 bg-card">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">No memories yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Capture a few notes, then come back here to see how MindSync turns them into a story of your
                  week.
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          {!error && !isLoading && hasTimeline && (
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-border/60 to-transparent" />
              <div className="space-y-8">
                {days.map((day) => (
                  <div key={day.date} className="relative pl-10">
                    {/* Dot */}
                    <div className="absolute left-3 top-1.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-background">
                        <div className="h-full w-full rounded-full border border-primary/40 bg-primary/30" />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {formatDateLabel(day.date)}
                        </p>
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-medium text-primary">AI memory</span>
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {day.entries.map((entry, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-[6px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                            <span className="leading-relaxed text-foreground">{entry}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


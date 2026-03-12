"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NoteCard } from "@/components/dashboard/note-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import type { Note as DbNote, Collection as DbCollection } from "@/types/mindsync"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Clock,
  FileText,
  FolderOpen,
} from "lucide-react"

type DashboardNote = Pick<
  DbNote,
  "id" | "title" | "content" | "tags" | "created_at"
>

export default function DashboardPage() {
  const [notes, setNotes] = useState<DashboardNote[]>([])
  const [noteCount, setNoteCount] = useState<number | null>(null)
  const [collectionCount, setCollectionCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          if (!isMounted) return
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        if (!isMounted) return

        setIsAuthenticated(true)
        setUserEmail(user.email ?? null)

        const [notesResult, collectionsResult] = await Promise.all([
          supabase
            .from("notes")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(6),
          supabase
            .from("collections")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .is("deleted_at", null),
        ])

        if (notesResult.error) {
          throw notesResult.error
        }
        if (collectionsResult.error) {
          throw collectionsResult.error
        }

        if (!isMounted) return

        const mappedNotes: DashboardNote[] =
          (notesResult.data as DbNote[] | null)?.map((note) => ({
            id: note.id,
            title: note.title ?? "",
            content: note.content ?? "",
            tags: note.tags ?? [],
            created_at: note.created_at,
          })) ?? []

        setNotes(mappedNotes)
        setNoteCount(notesResult.count ?? mappedNotes.length)
        setCollectionCount(collectionsResult.count ?? 0)
      } catch (err: any) {
        if (!isMounted) return
        // eslint-disable-next-line no-console
        console.error("Failed to load dashboard data:", err)
        setError(err.message ?? "Failed to load your dashboard")
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  const lastActivityLabel = useMemo(() => {
    if (!notes.length) return "No notes yet"

    const last = new Date(notes[0].created_at)
    const now = new Date()
    const diffMs = now.getTime() - last.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`

    return last.toLocaleDateString()
  }, [notes])

  const hasAnyData =
    (noteCount ?? 0) > 0 || (collectionCount ?? 0) > 0 || notes.length > 0

  const hasNotes = (noteCount ?? notes.length) > 0
  const hasCollections = (collectionCount ?? 0) > 0
  const isFirstRun =
    isAuthenticated === true && !isLoading && !hasNotes && !hasCollections

  const handleGoToNotes = () => {
    router.push("/dashboard/notes")
  }

  const handleGoToCollections = () => {
    router.push("/dashboard/collections")
  }

  const handleGoToRecall = () => {
    router.push("/dashboard/recall")
  }

  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Dashboard" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {/* Auth / global empty state */}
          {isAuthenticated === false && (
            <div className="gold-gradient-card flex items-center justify-between gap-6 border border-border/60 p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-primary/40 bg-card">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Welcome to your MindSync workspace
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign in to start capturing notes and we&apos;ll surface your
                    activity, collections, and AI memory timeline here.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats + summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="gold-gradient-card relative overflow-hidden border border-border/60 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-primary/5 to-transparent opacity-40" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Notes
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {isLoading && noteCount === null ? "—" : noteCount ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Total notes in your second brain
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="gold-gradient-card relative overflow-hidden border border-border/60 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/5 to-transparent opacity-30" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Collections
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {isLoading && collectionCount === null
                      ? "—"
                      : collectionCount ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Themed spaces organizing your knowledge
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="gold-gradient-card relative overflow-hidden border border-border/60 p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-primary/5 to-transparent opacity-40" />
              <div className="relative flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Summary
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-foreground">
                  {hasAnyData ? (
                    <>
                      You have{" "}
                      <span className="font-semibold">
                        {noteCount ?? notes.length}
                      </span>{" "}
                      notes across{" "}
                      <span className="font-semibold">
                        {collectionCount ?? 0}
                      </span>{" "}
                      collections.
                    </>
                  ) : (
                    <>
                      Create your first note or collection to start building
                      your MindSync knowledge graph.
                    </>
                  )}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last activity: {lastActivityLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lightweight first-run onboarding */}
          {isFirstRun && (
            <section className="gold-gradient-card relative overflow-hidden border border-border/60 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-primary/5 to-transparent opacity-60" />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Welcome to MindSync
                  </p>
                  <h2 className="text-sm font-medium text-foreground">
                    Let&apos;s set up your second brain in three quick steps.
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Start by creating a collection, capture your first note, then ask Recall a question.
                    Everything here is powered only by the notes you actually add.
                  </p>
                </div>
                <div className="grid gap-2 text-xs md:grid-cols-3 md:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-between border-border/70 bg-background/60"
                    onClick={handleGoToCollections}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-3.5 w-3.5" />
                      Step 1 · Collection
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-between border-border/70 bg-background/60"
                    onClick={handleGoToNotes}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      Step 2 · First note
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-between border-border/70 bg-background/60"
                    onClick={handleGoToRecall}
                  >
                    <span className="flex items-center gap-2">
                      <Brain className="h-3.5 w-3.5" />
                      Step 3 · Try Recall
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Main content: recent notes + onboarding */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
            {/* Recent notes */}
            <section className="gold-gradient-card space-y-3 border border-border/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Recent notes
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    The latest things you&apos;ve captured.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleGoToNotes}
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>

              {error && (
                <p className="text-xs text-red-500">
                  {error}
                </p>
              )}

              {isLoading && notes.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className="h-16 animate-pulse rounded-xl border border-border/40 bg-muted/40"
                    />
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-background/40 p-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      No notes yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Start by capturing an idea, research thread, or quick
                      thought. MindSync will keep everything connected.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-1 gap-2"
                    onClick={handleGoToNotes}
                  >
                    <FileText className="h-4 w-4" />
                    Create your first note
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      title={note.title || "Untitled note"}
                      preview={
                        note.content
                          ? note.content.slice(0, 200)
                          : "No content yet"
                      }
                      date={new Date(note.created_at).toLocaleDateString()}
                      tags={note.tags}
                      variant="compact"
                      onClick={handleGoToNotes}
                    />
                  ))}
                </div>
              )}
            </section>

              {/* Right column: activity + onboarding actions */}
              <section className="space-y-4">
                <div className="gold-gradient-card relative overflow-hidden border border-border/60 p-5">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-primary/40 bg-background/80">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Today at a glance
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {hasAnyData
                        ? "MindSync is keeping track of what you read, write, and remember."
                        : "Once you add notes, this space becomes a living overview of your second brain."}
                    </p>
                  </div>
                </div>
                </div>

                <div className="gold-gradient-card space-y-3 border border-dashed border-border/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Next steps
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {hasAnyData
                        ? "Deepen your graph by adding collections and asking Recall questions."
                        : "You&apos;re one click away from your first MindSync note."}
                    </p>
                  </div>
                  {userEmail && (
                    <span className="hidden rounded-full bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground md:inline-flex">
                      Signed in as {userEmail}
                    </span>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-between border-primary/40 bg-primary/5 text-xs font-medium",
                      "hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={handleGoToNotes}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Capture a note
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-between text-xs font-medium"
                    onClick={handleGoToCollections}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Create a collection
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>

                  <Link
                    href="/dashboard/recall"
                    className="group inline-flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground sm:col-span-2"
                  >
                    <span className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Ask MindSync a question
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

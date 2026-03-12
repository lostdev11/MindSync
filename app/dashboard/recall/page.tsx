"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { RecallSearchBar } from "@/components/dashboard/recall-search-bar"
import { RecallResultCard } from "@/components/dashboard/recall-result-card"
import { Brain, Clock, History } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { RecallQuery } from "@/types/mindsync"

interface RecallSourceNote {
  id: string
  title: string
  snippet: string
  updatedAt?: string
  url?: string
}

interface RecallApiResponse {
  answer: string
  notes?: RecallSourceNote[]
  notesSearched?: number
  matches?: number
  responseTimeMs?: number
}

type RecallHistoryItem = Pick<
  RecallQuery,
  "id" | "question" | "answer" | "created_at"
>

function formatResponseTime(ms?: number): string {
  if (!ms || ms <= 0) return "-ms"
  if (ms < 1000) return `${ms}ms`
  const seconds = ms / 1000
  return `${seconds.toFixed(1)}s`
}

function RecallContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [answer, setAnswer] = useState("")
  const [notes, setNotes] = useState<RecallSourceNote[]>([])
  const [notesSearched, setNotesSearched] = useState<number | undefined>(undefined)
  const [matches, setMatches] = useState<number | undefined>(undefined)
  const [responseTime, setResponseTime] = useState<string>("-ms")
  const [error, setError] = useState<string | null>(null)

  const [history, setHistory] = useState<RecallHistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    try {
      setIsHistoryLoading(true)
      setHistoryError(null)

      const { data, error: historyFetchError } = await supabase
        .from("recall_queries")
        .select("id, question, answer, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(10)

      if (historyFetchError) {
        throw historyFetchError
      }

      setHistory((data as RecallHistoryItem[] | null) ?? [])
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to load recall history:", err)
      setHistoryError("We couldn't load your recall history right now.")
    } finally {
      setIsHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
    // Load recent recall history on first mount.
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setError(null)
    setHasResult(false)
    setQuery(searchQuery)

    const startedAt = performance.now()

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.access_token) {
        setError("You must be signed in for MindSync to recall from your notes.")
        setAnswer("")
        setNotes([])
        setHasResult(false)
        return
      }

      const res = await fetch("/api/recall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data: RecallApiResponse = await res.json()

      if (!res.ok || !data.success) {
        const message =
          data.error ??
          (res.status === 401
            ? "Your session expired. Please sign in again to use Recall."
            : "Something went wrong while recalling from your notes. Please try again.")
        throw new Error(message)
      }

      const apiNotes = data.matchedNotes ?? []

      const mappedNotes: RecallSourceNote[] = apiNotes.map((note) => ({
        id: note.id,
        title: note.title ?? "Untitled note",
        snippet: (note.content ?? "").slice(0, 260),
        updatedAt: note.updated_at ?? note.created_at,
      }))

      setAnswer(data.answer ?? "")
      setNotes(mappedNotes)
      setNotesSearched(apiNotes.length)
      setMatches(apiNotes.length)

      const elapsedMs = Math.round(performance.now() - startedAt)
      setResponseTime(formatResponseTime(elapsedMs))

      setHasResult(true)

      // Refresh history so the latest query appears immediately.
      loadHistory()
    } catch (err: any) {
      console.error(err)
      setError(
        typeof err?.message === "string"
          ? err.message
          : "Something went wrong while recalling from your notes. Please try again.",
      )
      setAnswer("")
      setNotes([])
      setHasResult(false)
    } finally {
      setIsLoading(false)
    }
  }

  const effectiveNotesSearched = notesSearched ?? notes.length
  const effectiveMatches = matches ?? notes.length

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 px-6 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 to-primary/10 opacity-25 blur-sm" />
            <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-primary/30 bg-card">
              <Brain className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Recall</h1>
            <p className="text-sm text-muted-foreground">Ask questions about your knowledge base</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Search Bar */}
          <RecallSearchBar 
            onSearch={handleSearch} 
            isLoading={isLoading}
            initialQuery={query}
          />

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="absolute inset-2 animate-pulse rounded-full bg-primary/30" />
                <Brain className="relative h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Searching your knowledge graph...</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Result / Empty states */}
          {hasResult && !isLoading ? (
            notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card">
                    <Brain className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-base font-medium text-foreground">No strong matches found yet</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  MindSync searched your notes but didn&apos;t find anything clearly relevant. Try rephrasing
                  your question or adding more detail.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <RecallResultCard
                  query={query}
                  answer={answer || "MindSync used your most relevant notes to craft this answer."}
                  notesSearched={effectiveNotesSearched}
                  matches={effectiveMatches}
                  responseTime={responseTime}
                />

                {/* Related source notes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Related notes</h3>
                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-left transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {note.title}
                          </p>
                          {note.updatedAt && (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {note.snippet && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {note.snippet}
                          </p>
                        )}
                        {note.url && (
                          <a
                            href={note.url}
                            className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
                          >
                            Open note
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : (
            !isLoading &&
            !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card">
                    <Brain className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground">Ask MindSync anything</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Query your personal knowledge base with natural language. MindSync will search your notes,
                  recall what&apos;s relevant, and synthesize clear, contextual answers.
                </p>
              </div>
            )
          )}

          {/* Recall history */}
          {!isLoading && (
            <section className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background/60">
                    <History className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Recall history
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Recent questions and quick answer previews.
                    </p>
                  </div>
                </div>
                {history.length > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    Showing last {history.length} queries
                  </span>
                )}
              </div>

              {historyError && (
                <p className="text-xs text-destructive">
                  {historyError}
                </p>
              )}

              {isHistoryLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div
                      key={i}
                      className="h-14 animate-pulse rounded-xl border border-border/40 bg-muted/40"
                    />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-border/60 bg-background/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      No recall history yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ask your first question above and your recent recalls will start appearing here for quick re-runs.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSearch(item.question)}
                      className="w-full rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-left text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="flex-1 font-medium text-foreground line-clamp-1">
                          {item.question}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(item.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      {item.answer && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {item.answer}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RecallPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    }>
      <RecallContent />
    </Suspense>
  )
}

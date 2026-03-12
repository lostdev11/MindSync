"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Lightbulb,
  BookOpen,
  Briefcase,
  Calendar,
  Plus,
  FileText,
  Link2,
  Loader2,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { NoteCard } from "@/components/dashboard/note-card"

type Collection = {
  id: string
  name: string
  color: string | null
  note_count: number
  connections_count: number
}

type CollectionNote = {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
}

const FALLBACK_COLORS = [
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
]

function getFallbackColor(index: number) {
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState("#3b82f6")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const newCollectionInputRef = useRef<HTMLInputElement | null>(null)
  const [notesSheetCollection, setNotesSheetCollection] = useState<Collection | null>(null)
  const [collectionNotes, setCollectionNotes] = useState<CollectionNote[]>([])
  const [isLoadingCollectionNotes, setIsLoadingCollectionNotes] = useState(false)

  const fetchNotesForCollection = useCallback(async (collectionId: string) => {
    setIsLoadingCollectionNotes(true)
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        setCollectionNotes([])
        return
      }
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, tags, created_at")
        .eq("user_id", user.id)
        .eq("collection_id", collectionId)
        .is("deleted_at", null)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
      if (error) throw error
      setCollectionNotes(
        (data ?? []).map((row) => ({
          id: row.id as string,
          title: (row as any).title ?? "",
          content: (row as any).content ?? "",
          tags: ((row as any).tags as string[]) ?? [],
          created_at: (row as any).created_at,
        }))
      )
    } catch {
      setCollectionNotes([])
    } finally {
      setIsLoadingCollectionNotes(false)
    }
  }, [])

  useEffect(() => {
    if (notesSheetCollection) {
      fetchNotesForCollection(notesSheetCollection.id)
    } else {
      setCollectionNotes([])
    }
  }, [notesSheetCollection, fetchNotesForCollection])

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) {
          setCollections([])
          return
        }

        const { data, error } = await supabase
          .from("collections")
          .select("id, name")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })

        if (error) throw error

        setCollections(
          (data ?? []).map((row, index) => ({
            id: row.id as string,
            name: (row as any).name ?? "Untitled collection",
            color: ((row as any).color as string | null) ?? getFallbackColor(index),
            note_count: (row as any).note_count ?? 0,
            connections_count: (row as any).connections_count ?? 0,
          })),
        )
      } catch (err: any) {
        setError(err.message ?? "Failed to load collections")
      } finally {
        setIsLoading(false)
      }
    }

    loadCollections()
  }, [])

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return

    setIsSaving(true)
    setError(null)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) throw new Error("You need to be signed in to create collections.")

      const { data, error } = await supabase
        .from("collections")
        .insert({
          user_id: user.id,
          name,
        })
        .select("id, name")
        .single()

      if (error) throw error

      const created: Collection = {
        id: (data as any).id as string,
        name: (data as any).name ?? name,
        color: ((data as any).color as string | null) ?? newColor,
        note_count: 0,
        connections_count: 0,
      }

      setCollections((prev) => [created, ...prev])
      setNewName("")
    } catch (err: any) {
      const parts = [err?.message ?? "Failed to create collection"]
      if (err?.details) parts.push(String(err.details))
      if (err?.hint) parts.push(`Hint: ${err.hint}`)
      setError(parts.join(" — "))
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartEdit = (collection: Collection) => {
    setEditingId(collection.id)
    setEditingName(collection.name)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    const name = editingName.trim()
    if (!name) {
      setEditingId(null)
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("collections")
        .update({ name })
        .eq("id", editingId)
        .select("id, name")
        .single()

      if (error) throw error

      setCollections((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: (data as any).name ?? name,
              }
            : c,
        ),
      )

      setEditingId(null)
      setEditingName("")
    } catch (err: any) {
      setError(err.message ?? "Failed to update collection")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSoftDelete = async (id: string) => {
    setError(null)
    const previous = collections
    setCollections((prev) => prev.filter((c) => c.id !== id))

    const { error } = await supabase
      .from("collections")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      setError(error.message)
      setCollections(previous)
    }
  }

  const enhancedCollections = useMemo(
    () =>
      collections.map((c, index) => {
        const baseColor = c.color || getFallbackColor(index)
        return {
          ...c,
          baseColor,
        }
      }),
    [collections],
  )

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/50 bg-card/30 px-6 py-6 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Collections</h1>
          <p className="text-sm text-muted-foreground">
            Organize your knowledge into themed collections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Input
              placeholder="New collection name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              ref={newCollectionInputRef}
              className="h-9 w-44 bg-background/40"
            />
            <input
              type="color"
              aria-label="Collection color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-md border border-border/50 bg-transparent p-1"
            />
          </div>
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleCreate}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New Collection
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">
          {error && (
            <p className="mb-3 text-sm text-red-500">
              {error}
            </p>
          )}

          {isLoading && collections.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading collections...</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enhancedCollections.map((collection, index) => {
                const Icon =
                  index % 4 === 0
                    ? Lightbulb
                    : index % 4 === 1
                      ? BookOpen
                      : index % 4 === 2
                        ? Briefcase
                        : Calendar

                const bgGradient = {
                  backgroundImage: `radial-gradient(circle at top left, ${collection.baseColor}33, transparent 60%)`,
                }

                const isEditing = editingId === collection.id
                return (
                  <button
                    type="button"
                    key={collection.id}
                    onClick={() => !isEditing && setNotesSheetCollection(collection)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 text-left transition-all duration-300",
                      "hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5",
                      !isEditing && "cursor-pointer",
                    )}
                    style={bgGradient}
                  >
                    {/* Decorative network lines */}
                    <svg
                      className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-10 transition-opacity group-hover:opacity-20"
                      viewBox="0 0 100 100"
                    >
                      <circle cx="70" cy="30" r="3" fill={collection.baseColor} />
                      <circle cx="85" cy="50" r="2" fill={collection.baseColor} />
                      <circle cx="60" cy="60" r="2" fill={collection.baseColor} />
                      <path
                        d="M70,30 Q77,40 85,50"
                        stroke={collection.baseColor}
                        strokeWidth="0.5"
                        fill="none"
                      />
                      <path
                        d="M70,30 Q65,45 60,60"
                        stroke={collection.baseColor}
                        strokeWidth="0.5"
                        fill="none"
                      />
                    </svg>

                    <div className="relative">
                      {/* Icon */}
                      <div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-card/80"
                        style={{ borderColor: `${collection.baseColor}80` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: collection.baseColor }} />
                      </div>

                      {/* Title / edit */}
                      <div className="flex items-center gap-2">
                        {editingId === collection.id ? (
                          <>
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit()
                                if (e.key === "Escape") {
                                  setEditingId(null)
                                  setEditingName("")
                                }
                              }}
                              className="h-8 flex-1 bg-background/40 text-sm"
                              autoFocus
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={handleSaveEdit}
                            >
                              <SaveIcon className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <h3 className="flex-1 text-lg font-semibold text-foreground">
                              {collection.name}
                            </h3>
                            <button
                              type="button"
                              className="rounded-full p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartEdit(collection)
                              }}
                              aria-label="Rename collection"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full p-1 text-muted-foreground hover:bg-background/60 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSoftDelete(collection.id)
                              }}
                              aria-label="Delete collection"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{collection.note_count} notes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Link2 className="h-3.5 w-3.5" />
                          <span>{collection.connections_count} links</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ "--tw-gradient-via": collection.baseColor } as any}
                    />
                  </button>
                )
              })}

              {enhancedCollections.length === 0 && !isLoading && (
                <div className="col-span-full">
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-gradient-to-b from-background/60 via-card/80 to-background/60 px-6 py-8 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-card/80 shadow-sm">
                      <Lightbulb className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      Create your first collection
                    </h2>
                    <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                      Group related ideas, projects, and research into collections. They&apos;ll power a cleaner notes workspace and smarter recall later on.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4 gap-2 border-border/70 bg-background/60"
                      onClick={() => newCollectionInputRef.current?.focus()}
                    >
                      <Plus className="h-4 w-4" />
                      Name your first collection
                    </Button>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Type a name above and press <span className="font-medium">New Collection</span> to save it.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes sheet: opens independently when a collection is chosen */}
      <Sheet open={!!notesSheetCollection} onOpenChange={(open) => !open && setNotesSheetCollection(null)}>
        <SheetContent
          side="right"
          className="flex w-full max-w-xl flex-col border-l border-border/50 p-0 sm:max-w-xl"
        >
          {notesSheetCollection && (
            <>
              <SheetHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: notesSheetCollection.color ?? getFallbackColor(0),
                    }}
                  />
                  <SheetTitle className="text-lg">{notesSheetCollection.name}</SheetTitle>
                </div>
                <SheetDescription>
                  Notes in this collection · {collectionNotes.length} total
                </SheetDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-fit gap-2"
                  onClick={() => router.push(`/dashboard/notes?collection=${notesSheetCollection.id}`)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Notes
                </Button>
              </SheetHeader>
              <div className="flex-1 overflow-auto p-4">
                {isLoadingCollectionNotes ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading notes...
                  </div>
                ) : collectionNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-muted-foreground">
                    <FileText className="h-10 w-10 opacity-50" />
                    <p className="text-sm">No notes in this collection yet.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/notes?collection=${notesSheetCollection.id}`)}
                    >
                      Add note
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {collectionNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        title={note.title || "Untitled note"}
                        preview={note.content || "No content yet"}
                        date={new Date(note.created_at).toLocaleDateString()}
                        tags={note.tags}
                        onClick={() => router.push(`/dashboard/notes?collection=${notesSheetCollection.id}`)}
                        variant="compact"
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function SaveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 20.5H19C19.8284 20.5 20.5 19.8284 20.5 19V8.91421C20.5 8.64899 20.3946 8.39464 20.2071 8.20711L15.7929 3.79289C15.6054 3.60536 15.351 3.5 15.0858 3.5H5C4.17157 3.5 3.5 4.17157 3.5 5V19C3.5 19.8284 4.17157 20.5 5 20.5Z"
        stroke="currentColor"
      />
      <path
        d="M9 20.5V14.5H15V20.5"
        stroke="currentColor"
      />
      <path
        d="M8.5 8H13.5"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

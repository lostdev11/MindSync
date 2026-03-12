"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { NoteEditor } from "@/components/dashboard/note-editor"
import { NoteCard } from "@/components/dashboard/note-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import type { Note, Collection } from "@/types/mindsync"
import { FileText, FolderOpen, Plus, Search, Trash2 } from "lucide-react"

export default function NotesPage() {
  const searchParams = useSearchParams()
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const [collectionsError, setCollectionsError] = useState<string | null>(null)
  const hasAppliedUrlCollection = useRef(false)

  // Preselect collection from URL once when collections have loaded
  useEffect(() => {
    if (hasAppliedUrlCollection.current || collections.length === 0) return
    const collectionId = searchParams.get("collection")
    if (!collectionId) return
    const exists = collections.some((c) => c.id === collectionId)
    if (exists) {
      setSelectedCollection(collectionId)
      hasAppliedUrlCollection.current = true
    }
  }, [collections, searchParams])

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  )

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsLoadingCollections(true)
      setError(null)
      setCollectionsError(null)

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !userData?.user) {
        setError(userError?.message ?? "You must be signed in to view notes.")
        setIsLoading(false)
        setIsLoadingCollections(false)
        return
      }

      const currentUserId = userData.user.id
      setUserId(currentUserId)

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", currentUserId)
        .is("deleted_at", null)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        setError(error.message)
      } else if (data) {
        setNotes(
          data.map((row) => ({
            id: row.id as string,
            user_id: (row as any).user_id ?? "",
            collection_id: (row as any).collection_id ?? null,
            title: (row as any).title ?? "",
            content: (row as any).content ?? "",
            tags: ((row as any).tags as string[]) ?? [],
            is_pinned: (row as any).is_pinned ?? false,
            created_at: (row as any).created_at,
            updated_at: (row as any).updated_at ?? null,
            deleted_at: (row as any).deleted_at ?? null,
          })),
        )
      }

      // Fetch collections for this user
      const { data: collectionsData, error: collectionsErr } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", currentUserId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (collectionsErr) {
        setCollectionsError(collectionsErr.message)
      } else if (collectionsData) {
        setCollections(
          collectionsData.map((row) => ({
            id: row.id as string,
            user_id: (row as any).user_id ?? "",
            name: (row as any).name ?? "Untitled collection",
            color: (row as any).color ?? null,
            created_at: (row as any).created_at,
            updated_at: (row as any).updated_at,
            deleted_at: (row as any).deleted_at,
          })),
        )
      }

      setIsLoading(false)
      setIsLoadingCollections(false)
    }

    fetchData()
  }, [])

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    const base = selectedCollection
      ? notes.filter((note) => note.collection_id === selectedCollection)
      : notes

    if (!q) return base

    return base.filter((note) => {
      const inTitle = note.title.toLowerCase().includes(q)
      const inContent = note.content.toLowerCase().includes(q)
      const inTags = note.tags.some((tag) => tag.toLowerCase().includes(q))
      return inTitle || inContent || inTags
    })
  }, [notes, searchQuery, selectedCollection])

  const handleCreateNew = () => {
    setSelectedNoteId(null)
  }

  const handleSave = async (data: { title: string; content: string; tags: string[] }) => {
    if (!userId) {
      setError("You must be signed in to save notes.")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      if (selectedNote) {
        const { data: updated, error } = await supabase
          .from("notes")
          .update({
            title: data.title,
            content: data.content,
            tags: data.tags,
          })
          .eq("id", selectedNote.id)
          .eq("user_id", userId)
          .select()
          .single()

        if (error) throw error

        if (updated) {
          setNotes((prev) =>
            prev.map((note) =>
              note.id === selectedNote.id
                ? {
                    ...note,
                    title: (updated as any).title ?? "",
                    content: (updated as any).content ?? "",
                    tags: ((updated as any).tags as string[]) ?? [],
                    updated_at: (updated as any).updated_at ?? null,
                  }
                : note
            )
          )
        }
      } else {
        // Notes require a collection_id: use selected collection, first collection, or create "Uncategorized"
        let collectionId = selectedCollection
        if (!collectionId && collections.length > 0) {
          collectionId = collections[0].id
        }
        if (!collectionId) {
          const { data: newCollection, error: createErr } = await supabase
            .from("collections")
            .insert({
              user_id: userId,
              name: "Uncategorized",
              color: "#64748b",
            })
            .select("id, name, color, created_at, updated_at, deleted_at")
            .single()
          if (createErr) throw createErr
          if (newCollection) {
            const uncategorized: Collection = {
              id: (newCollection as any).id as string,
              user_id: userId,
              name: (newCollection as any).name ?? "Uncategorized",
              color: (newCollection as any).color ?? "#64748b",
              created_at: (newCollection as any).created_at,
              updated_at: (newCollection as any).updated_at,
              deleted_at: (newCollection as any).deleted_at ?? null,
            }
            setCollections((prev) => [uncategorized, ...prev])
            collectionId = uncategorized.id
            setSelectedCollection(uncategorized.id)
          }
        }
        if (!collectionId) {
          throw new Error("Could not determine or create a collection for this note.")
        }

        const { data: inserted, error } = await supabase
          .from("notes")
          .insert({
            user_id: userId,
            collection_id: collectionId,
            title: data.title,
            content: data.content,
            tags: data.tags,
            is_pinned: false,
          })
          .select()
          .single()

        if (error) throw error

        if (inserted) {
          const newNote: Note = {
            id: (inserted as any).id as string,
            user_id: (inserted as any).user_id ?? "",
            collection_id: (inserted as any).collection_id ?? null,
            title: (inserted as any).title ?? "",
            content: (inserted as any).content ?? "",
            tags: ((inserted as any).tags as string[]) ?? [],
            is_pinned: (inserted as any).is_pinned ?? false,
            created_at: (inserted as any).created_at,
            updated_at: (inserted as any).updated_at ?? null,
            deleted_at: (inserted as any).deleted_at ?? null,
          }
          setNotes((prev) => [newNote, ...prev])
          setSelectedNoteId(newNote.id)
        }
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to save note")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!userId) {
      setError("You must be signed in to delete notes.")
      return
    }

    setError(null)
    const previousNotes = notes
    setNotes((prev) => prev.filter((note) => note.id !== id))

    if (selectedNoteId === id) {
      setSelectedNoteId(null)
    }

    const { error } = await supabase
      .from("notes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      setError(error.message)
      setNotes(previousNotes)
    }
  }

  return (
    <div className="flex h-full">
      {/* Collections Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border/50 bg-card/30 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Collections</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            aria-label="Create collection"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setSelectedCollection(null)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              !selectedCollection
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <FolderOpen className="h-4 w-4" />
            <span>All notes</span>
            <span className="ml-auto text-xs opacity-60">{notes.length}</span>
          </button>

          {collectionsError && (
            <p className="px-3 text-xs text-red-500">
              {collectionsError}
            </p>
          )}

          {isLoadingCollections && (
            <p className="px-3 text-xs text-muted-foreground">Loading collections...</p>
          )}

          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                selectedCollection === collection.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: collection.color ?? "#64748b" }}
              />
              <span className="truncate">{collection.name}</span>
              <span className="ml-auto text-xs opacity-60">
                {notes.filter((n) => n.collection_id === collection.id).length}
              </span>
            </button>
          ))}

          {collections.length === 0 && !isLoadingCollections && (
            <p className="px-3 text-xs text-muted-foreground">
              No collections yet. Create some from the Collections page to organize your notes.
            </p>
          )}
        </nav>
      </aside>

      {/* Notes List */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border/50 bg-card/20">
        {/* Search */}
        <div className="border-b border-border/50 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border/50 bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="flex-1 space-y-2 overflow-auto p-4">
          {error && (
            <p className="mb-2 text-xs text-red-500">
              {error}
            </p>
          )}

          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            </div>
          ) : notes.length === 0 && !searchQuery ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-border/60 bg-card/60">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No notes yet</p>
                <p className="text-xs text-muted-foreground">
                  Create your first note to start organizing your thoughts.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-1 gap-2"
                onClick={handleCreateNew}
              >
                <Plus className="h-4 w-4" />
                New Note
              </Button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">No notes match your search.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div key={note.id} className="group relative">
                  <NoteCard
                    title={note.title || "Untitled note"}
                    preview={note.content || "No content yet"}
                    date={new Date(note.created_at).toLocaleDateString()}
                    tags={note.tags}
                    onClick={() => setSelectedNoteId(note.id)}
                    variant="compact"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(note.id)
                    }}
                    className="absolute right-2 top-2 hidden rounded-full bg-background/90 p-1 text-xs text-muted-foreground shadow-sm hover:text-red-500 group-hover:flex"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Note Button */}
        <div className="border-t border-border/50 p-4">
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={handleCreateNew}
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <NoteEditor
          initialTitle={selectedNote?.title ?? ""}
          initialContent={selectedNote?.content ?? ""}
          initialTags={selectedNote?.tags ?? []}
          onSave={handleSave}
        />
        {isSaving && (
          <p className="mt-2 text-xs text-muted-foreground">
            Saving...
          </p>
        )}
      </div>
    </div>
  )
}

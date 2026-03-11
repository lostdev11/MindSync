"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Tag, Link2, Calendar, X, Plus } from "lucide-react"

interface NoteEditorProps {
  initialTitle?: string
  initialContent?: string
  initialTags?: string[]
  onSave?: (data: { title: string; content: string; tags: string[] }) => void
}

export function NoteEditor({ 
  initialTitle = "", 
  initialContent = "", 
  initialTags = [],
  onSave 
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [newTag, setNewTag] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
      setIsAddingTag(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    onSave?.({ title, content, tags })
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "short",
              month: "short", 
              day: "numeric",
              year: "numeric"
            })}
          </span>
        </div>
        <Button 
          onClick={handleSave}
          size="sm" 
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>

      {/* Title */}
      <div className="border-b border-border/30 px-5 py-4">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/30 px-5 py-3">
        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
        {tags.map((tag) => (
          <span 
            key={tag}
            className="group inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-0.5 rounded-full p-0.5 opacity-60 hover:bg-primary/20 hover:opacity-100"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {isAddingTag ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              onBlur={() => !newTag && setIsAddingTag(false)}
              autoFocus
              className="w-20 rounded-full border border-primary/30 bg-muted/30 px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button
              onClick={handleAddTag}
              className="rounded-full p-1 text-primary hover:bg-primary/10"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/50 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            Add tag
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <textarea
          placeholder="Start writing your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-full w-full resize-none bg-transparent text-foreground leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/30 px-5 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{content.length} characters</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link2 className="h-3 w-3 text-primary/60" />
          <span>Auto-linking enabled</span>
        </div>
      </div>
    </div>
  )
}

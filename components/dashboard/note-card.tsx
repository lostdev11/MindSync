"use client"

import { cn } from "@/lib/utils"
import { FileText, Calendar, Tag, Link2 } from "lucide-react"

interface NoteCardProps {
  title: string
  preview: string
  date: string
  tags?: string[]
  connections?: number
  onClick?: () => void
  variant?: "default" | "compact"
}

export function NoteCard({ 
  title, 
  preview, 
  date, 
  tags = [], 
  connections = 0,
  onClick,
  variant = "default"
}: NoteCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300",
        "hover:border-primary/30 hover:bg-card/80",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        variant === "compact" && "p-3"
      )}
    >
      {/* Hover glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative space-y-2">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex items-center justify-center rounded-lg border border-border/50 bg-muted/50",
            variant === "default" ? "h-9 w-9" : "h-7 w-7"
          )}>
            <FileText className={cn(
              "text-muted-foreground group-hover:text-primary transition-colors",
              variant === "default" ? "h-4 w-4" : "h-3.5 w-3.5"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-foreground truncate group-hover:text-primary transition-colors",
              variant === "default" ? "text-base" : "text-sm"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-muted-foreground line-clamp-2 mt-1",
              variant === "default" ? "text-sm" : "text-xs"
            )}>
              {preview}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>

          {connections > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-primary/70">
              <Link2 className="h-3 w-3" />
              <span>{connections} connections</span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="ml-auto flex items-center gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all group-hover:via-primary/50" />
    </button>
  )
}

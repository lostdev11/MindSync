"use client"

import { Brain, Clock, FileSearch, Sparkles, Zap } from "lucide-react"

interface RecallResultCardProps {
  query: string
  answer: string
  notesSearched: number
  matches: number
  responseTime: string
}

export function RecallResultCard({
  query,
  answer,
  notesSearched,
  matches,
  responseTime,
}: RecallResultCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
      {/* Header glow */}
      <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />
      
      {/* Decorative network lines */}
      <svg className="absolute right-0 top-0 h-48 w-48 opacity-20" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="recall-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="20" r="3" fill="url(#recall-grad)" opacity="0.5" />
        <circle cx="60" cy="40" r="2" fill="url(#recall-grad)" opacity="0.4" />
        <circle cx="90" cy="50" r="2" fill="url(#recall-grad)" opacity="0.3" />
        <path d="M80,20 Q70,30 60,40" stroke="url(#recall-grad)" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M60,40 Q75,45 90,50" stroke="url(#recall-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
      </svg>

      <div className="relative p-6">
        {/* Title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-20 blur-sm" />
            <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-primary/30 bg-card">
              <Brain className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Memory Recall</h2>
            <p className="text-sm text-muted-foreground">Powered by your knowledge graph</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">AI</span>
          </div>
        </div>

        {/* Query */}
        <div className="mb-4 rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            <span className="mr-2 text-primary">Q:</span>
            {query}
          </p>
        </div>

        {/* Answer */}
        <div className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.02] p-5">
          <p className="leading-relaxed text-foreground">{answer}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 border-t border-border/30 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileSearch className="h-4 w-4 text-primary/60" />
            <span>Searched <strong className="text-foreground">{notesSearched}</strong> notes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-secondary/60" />
            <span><strong className="text-foreground">{matches}</strong> matches</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-muted-foreground/60" />
            <span><strong className="text-foreground">{responseTime}</strong> response</span>
          </div>
        </div>
      </div>
    </div>
  )
}

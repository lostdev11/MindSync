"use client"

import { useState } from "react"
import { Brain, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RecallSearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
  initialQuery?: string
}

export function RecallSearchBar({ onSearch, isLoading = false, initialQuery = "" }: RecallSearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Background glow when focused */}
      <div 
        className={cn(
          "absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 opacity-0 blur-xl transition-opacity duration-300",
          isFocused && "opacity-100"
        )} 
      />

      <div 
        className={cn(
          "relative flex items-center gap-3 rounded-2xl border bg-card/80 p-2 pl-5 backdrop-blur-sm transition-all duration-300",
          isFocused ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/50"
        )}
      >
        {/* Icon */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <div className={cn(
            "absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-20 blur-sm transition-opacity",
            isFocused && "opacity-40"
          )} />
          <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-primary/30 bg-card">
            <Brain className={cn(
              "h-5 w-5 transition-colors",
              isFocused ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Ask MindSync about your knowledge..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="h-12 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="group relative h-12 gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
          {isLoading ? (
            <>
              <div className="relative h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              <span className="relative">Recalling...</span>
            </>
          ) : (
            <>
              <Sparkles className="relative h-4 w-4" />
              <span className="relative">Recall</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>

      {/* Example queries */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {[
          "What ideas did I write about NFTs?",
          "Summarize my Solana research",
          "Find my product roadmap notes"
        ].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuery(example)}
            className="rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  )
}

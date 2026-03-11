"use client"

import { Search, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  title?: string
  showSearch?: boolean
}

export function DashboardHeader({ title, showSearch = true }: DashboardHeaderProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleRecall = () => {
    if (query.trim()) {
      router.push(`/dashboard/recall?q=${encodeURIComponent(query)}`)
    } else {
      router.push("/dashboard/recall")
    }
  }

  return (
    <header className="flex flex-col gap-6 border-b border-border/50 bg-card/30 px-6 py-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
      {title && (
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      )}

      {showSearch && (
        <div className="flex flex-1 items-center gap-3 md:max-w-xl md:ml-auto">
          {/* Search/Ask Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Brain className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Ask MindSync anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRecall()}
              className="h-11 w-full rounded-xl border border-border/50 bg-muted/30 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Recall Button */}
          <Button 
            onClick={handleRecall}
            className="group relative h-11 gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
            <Sparkles className="relative h-4 w-4" />
            <span className="relative">Recall</span>
          </Button>
        </div>
      )}
    </header>
  )
}

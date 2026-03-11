"use client"

import { useEffect, useState, useRef } from "react"
import { 
  Brain, FileText, Lightbulb, Bookmark, ListTodo, Wallet, 
  Search, Sparkles, Clock, Zap, Database, Globe
} from "lucide-react"

// Memory nodes that orbit the central product
const memoryNodes = [
  // Left side nodes
  { id: 1, label: "Crypto Research", icon: Wallet, side: "left", row: 0, color: "primary" },
  { id: 2, label: "Product Notes", icon: FileText, side: "left", row: 1, color: "primary" },
  { id: 3, label: "Journal Entries", icon: Bookmark, side: "left", row: 2, color: "primary" },
  // Right side nodes
  { id: 4, label: "Startup Ideas", icon: Lightbulb, side: "right", row: 0, color: "secondary" },
  { id: 5, label: "Meeting Notes", icon: ListTodo, side: "right", row: 1, color: "secondary" },
  { id: 6, label: "Learning Log", icon: Brain, side: "right", row: 2, color: "secondary" },
]

// Secondary floating context nodes (smaller, more ambient)
const contextNodes = [
  { id: "c1", label: "API docs", x: 3, y: 20 },
  { id: "c2", label: "Bookmarks", x: 8, y: 45 },
  { id: "c3", label: "Highlights", x: 5, y: 70 },
  { id: "c4", label: "Screenshots", x: 92, y: 25 },
  { id: "c5", label: "Voice memos", x: 95, y: 55 },
  { id: "c6", label: "PDFs", x: 90, y: 75 },
]

const sourceNotes = [
  {
    title: "Solana NFT Strategy",
    excerpt: "Notes on staking rewards and governance tokens for long-term holding...",
    category: "Crypto",
    relevance: 94,
    time: "3 days ago",
  },
  {
    title: "NFT Market Research",
    excerpt: "Marketplace royalty structures and emerging trends in digital collectibles...",
    category: "Research",
    relevance: 87,
    time: "5 days ago",
  },
  {
    title: "Whitelist Mint Guide",
    excerpt: "Step-by-step minting strategies and gas optimization techniques...",
    category: "Notes",
    relevance: 82,
    time: "1 week ago",
  },
]

export function KnowledgeGraph() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div ref={containerRef} className="relative mx-auto" style={{ minHeight: '700px' }}>
      {/* SVG Connection Lines Layer */}
      <svg 
        className="absolute inset-0 h-full w-full pointer-events-none" 
        style={{ zIndex: 1 }}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* Gradient for left connections */}
          <linearGradient id="conn-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          
          {/* Gradient for right connections */}
          <linearGradient id="conn-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="conn-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from left nodes to center */}
        {mounted && (
          <>
            {/* Left connections - curved bezier paths */}
            <path
              d="M 15 25 Q 25 25, 35 40"
              stroke="url(#conn-left)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#conn-glow)"
              className="animate-pulse-glow"
              style={{ animationDelay: '0s' }}
            />
            <path
              d="M 15 50 Q 28 50, 35 50"
              stroke="url(#conn-left)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#conn-glow)"
              className="animate-pulse-glow"
              style={{ animationDelay: '0.3s' }}
            />
            <path
              d="M 15 75 Q 25 75, 35 60"
              stroke="url(#conn-left)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#conn-glow)"
              className="animate-pulse-glow"
              style={{ animationDelay: '0.6s' }}
            />
            
            {/* Right connections - curved bezier paths */}
            <path
              d="M 85 25 Q 75 25, 65 40"
              stroke="url(#conn-right)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#conn-glow)"
              className="animate-pulse-glow"
              style={{ animationDelay: '0.15s' }}
            />
            <path
              d="M 85 50 Q 72 50, 65 50"
              stroke="url(#conn-right)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#conn-glow)"
              className="animate-pulse-glow"
              style={{ animationDelay: '0.45s' }}
            />
            <path
              d="M 85 75 Q 75 75, 65 60"
              stroke="url(#conn-right)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#conn-glow)"
              className="animate-pulse-glow"
              style={{ animationDelay: '0.75s' }}
            />

            {/* Animated particles along paths */}
            {[0, 1, 2].map((i) => (
              <circle key={`left-${i}`} r="3" fill="#7c3aed" opacity="0.9">
                <animateMotion
                  dur={`${2.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={
                    i === 0 ? "M 60 175 Q 200 175, 280 280" :
                    i === 1 ? "M 60 350 Q 224 350, 280 350" :
                    "M 60 525 Q 200 525, 280 420"
                  }
                />
              </circle>
            ))}
            {[0, 1, 2].map((i) => (
              <circle key={`right-${i}`} r="3" fill="#06b6d4" opacity="0.9">
                <animateMotion
                  dur={`${2.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={
                    i === 0 ? "M 680 175 Q 600 175, 520 280" :
                    i === 1 ? "M 680 350 Q 576 350, 520 350" :
                    "M 680 525 Q 600 525, 520 420"
                  }
                />
              </circle>
            ))}
          </>
        )}
      </svg>

      {/* Left Memory Nodes */}
      <div className="absolute left-0 top-0 hidden h-full w-[180px] flex-col justify-center gap-16 lg:flex" style={{ zIndex: 10 }}>
        {memoryNodes.filter(n => n.side === "left").map((node, idx) => {
          const Icon = node.icon
          return (
            <div
              key={node.id}
              className="group relative"
              style={{
                animation: mounted ? `float 5s ease-in-out infinite` : 'none',
                animationDelay: `${idx * 0.2}s`,
              }}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/90 px-4 py-3 shadow-lg shadow-primary/5 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15 hover:scale-105">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{node.label}</span>
                  <div className="mt-0.5 flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-primary/60" />
                    <span className="text-[10px] text-muted-foreground">12 notes</span>
                  </div>
                </div>
              </div>
              {/* Glow effect on hover */}
              <div className="absolute -inset-2 -z-10 rounded-3xl bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>

      {/* Right Memory Nodes */}
      <div className="absolute right-0 top-0 hidden h-full w-[180px] flex-col justify-center gap-16 lg:flex" style={{ zIndex: 10 }}>
        {memoryNodes.filter(n => n.side === "right").map((node, idx) => {
          const Icon = node.icon
          return (
            <div
              key={node.id}
              className="group relative"
              style={{
                animation: mounted ? `float 5s ease-in-out infinite` : 'none',
                animationDelay: `${idx * 0.2 + 0.5}s`,
              }}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-secondary/30 bg-card/90 px-4 py-3 shadow-lg shadow-secondary/5 backdrop-blur-md transition-all duration-300 hover:border-secondary/50 hover:shadow-secondary/15 hover:scale-105">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15">
                  <Icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{node.label}</span>
                  <div className="mt-0.5 flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-secondary/60" />
                    <span className="text-[10px] text-muted-foreground">8 notes</span>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-2 -z-10 rounded-3xl bg-secondary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>

      {/* Ambient Context Nodes (tiny floating labels) */}
      {contextNodes.map((node) => (
        <div
          key={node.id}
          className="absolute hidden text-[10px] text-muted-foreground/50 lg:block"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animation: mounted ? `float 7s ease-in-out infinite` : 'none',
            animationDelay: `${Math.random() * 2}s`,
            zIndex: 5,
          }}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-border/30 bg-card/50 px-2.5 py-1 backdrop-blur-sm">
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            {node.label}
          </div>
        </div>
      ))}

      {/* Central Product Mockup */}
      <div className="relative mx-auto max-w-2xl px-4 lg:max-w-3xl lg:px-24" style={{ zIndex: 20 }}>
        {/* Outer glow rings */}
        <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-secondary/10 to-transparent blur-2xl" />
        
        {/* Main product card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Subtle top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-white/[0.05] bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]/90" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]/90" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]/90" />
              </div>
              <div className="hidden items-center gap-2 rounded-lg bg-background/60 px-3 py-1.5 sm:flex">
                <Brain className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">MindSync Recall</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 text-[11px] text-green-400">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>Synced</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Search input */}
            <div className="relative mb-5">
              <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-background/50 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_0_30px_rgba(124,58,237,0.06)]">
                <Search className="h-5 w-5 text-primary/70" />
                <span className="flex-1 text-sm text-foreground sm:text-base">What ideas did I write about Solana last week?</span>
                <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Recall</span>
                </button>
              </div>
            </div>

            {/* AI Response Card */}
            <div className="mb-5 rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/[0.06] via-secondary/[0.02] to-transparent p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15">
                    <Sparkles className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">AI Memory Recall</span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Searched 847 notes</span>
                      <span className="text-secondary">3 matches</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs text-secondary">
                  <Zap className="h-3 w-3" />
                  <span>0.8s</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                You wrote <span className="font-semibold text-foreground">3 notes</span> about Solana NFTs last week. Key themes: <span className="text-secondary font-medium">staking rewards</span>, <span className="text-secondary font-medium">governance mechanisms</span>, and <span className="text-secondary font-medium">whitelist strategies</span>. Your most detailed analysis compared Solana vs Ethereum gas efficiency.
              </p>
            </div>

            {/* Source Notes */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Memory Sources</h4>
                <span className="text-[10px] text-muted-foreground">Sorted by relevance</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {sourceNotes.map((note, i) => (
                  <div
                    key={note.title}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-muted/20 p-3.5 transition-all duration-300 hover:border-primary/25 hover:bg-muted/40"
                  >
                    {/* Relevance indicator */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                      <span className="text-[10px] font-semibold text-primary">{note.relevance}%</span>
                    </div>
                    
                    {/* Category */}
                    <div className="mb-2.5">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        i === 0 ? 'bg-primary/15 text-primary' : 
                        i === 1 ? 'bg-secondary/15 text-secondary' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        {note.category}
                      </span>
                    </div>
                    
                    <h5 className="mb-1.5 text-sm font-semibold text-foreground line-clamp-1">{note.title}</h5>
                    <p className="mb-2.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">{note.excerpt}</p>
                    
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                      <Clock className="h-3 w-3" />
                      <span>{note.time}</span>
                    </div>
                    
                    {/* Hover accent */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between border-t border-white/[0.05] bg-muted/20 px-4 py-2.5">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Database className="h-3 w-3" />
                <span>Local-first</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-green-400" />
                <span>Online</span>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground/60">
              Last sync: 2 min ago
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Simplified memory nodes above and below */}
      <div className="flex justify-center gap-3 pb-6 pt-2 lg:hidden">
        {memoryNodes.slice(0, 4).map((node, i) => {
          const Icon = node.icon
          const isPrimary = i < 2
          return (
            <div
              key={node.id}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md ${
                isPrimary 
                  ? 'border-primary/30 bg-primary/10' 
                  : 'border-secondary/30 bg-secondary/10'
              }`}
              style={{
                animation: mounted ? `float 5s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <Icon className={`h-5 w-5 ${isPrimary ? 'text-primary' : 'text-secondary'}`} />
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

"use client"

import { Search, FileText, Sparkles, Clock, Tag, ArrowUpRight, ChevronRight, Zap, Link2, Brain } from "lucide-react"

const sourceNotes = [
  {
    title: "NFT Market Research",
    excerpt: "Exploring different NFT marketplace dynamics and royalty structures across Solana and Ethereum...",
    date: "Mar 5, 2024",
    tags: ["NFT", "Research"],
    relevance: 98,
    connections: 4,
  },
  {
    title: "Solana NFT Strategy",
    excerpt: "Deep dive into Solana NFT collections and minting strategies. Key insights on staking rewards...",
    date: "Mar 3, 2024",
    tags: ["Solana", "Strategy"],
    relevance: 94,
    connections: 7,
  },
  {
    title: "Crypto Art Trends 2024",
    excerpt: "Emerging trends in digital art and generative NFTs. Analysis of top collections...",
    date: "Mar 1, 2024",
    tags: ["Art", "Trends"],
    relevance: 87,
    connections: 3,
  },
]

const relatedTopics = ["Ethereum NFTs", "Staking Rewards", "Mint Strategies", "Gas Optimization"]

export function AIDemo() {
  return (
    <section id="recall" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Ambient network pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="demo-line-fade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fafafa" stopOpacity="0" />
              <stop offset="45%" stopColor="#fafafa" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.2" />
              <stop offset="55%" stopColor="#fafafa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q200,50 400,100 T800,80" stroke="url(#demo-line-fade)" strokeWidth="1" fill="none" />
          <path d="M0,300 Q300,250 600,300 T1200,280" stroke="url(#demo-line-fade)" strokeWidth="1" fill="none" />
        </svg>
        
        <div className="absolute left-0 top-1/2 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-secondary/[0.04] blur-[150px]" />
        <div className="absolute right-0 bottom-1/4 h-[400px] w-[400px] translate-x-1/4 rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/[0.06] px-4 py-1.5">
            <Brain className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">AI Memory Recall</span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ask questions, get answers from{" "}
            <span className="text-secondary">your own memory</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            MindSync understands your knowledge graph and retrieves relevant memories instantly with full source attribution.
          </p>
        </div>

        {/* Demo UI */}
        <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-b from-white/12 via-white/5 to-transparent blur-3xl" />
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-b from-white/8 to-primary/5 blur-2xl" />
            
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-2xl shadow-black/30 backdrop-blur-xl">
              {/* Top highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-white/[0.05] bg-muted/30 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]/90" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]/90" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]/90" />
                  </div>
                  <div className="hidden items-center gap-2 rounded-lg bg-background/60 px-3 py-1.5 sm:flex">
                    <Sparkles className="h-3.5 w-3.5 text-secondary" />
                    <span className="text-xs font-medium text-foreground">MindSync Recall</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="hidden sm:inline">AI Ready</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-8">
                {/* Search bar */}
                <div className="relative mb-8">
                  <div className="flex items-center gap-3 rounded-xl border border-secondary/25 bg-background/50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_0_40px_rgba(212,175,55,0.05)]">
                    <Search className="h-5 w-5 text-secondary/70" />
                    <span className="flex-1 text-sm text-foreground sm:text-base">What did I write about NFTs and marketplace royalties?</span>
                    <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]">
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">Search Memory</span>
                    </button>
                  </div>
                </div>

                {/* Two column layout */}
                <div className="grid gap-6 lg:grid-cols-5">
                  {/* AI Response - Main column */}
                  <div className="lg:col-span-3">
                    <div className="relative rounded-xl border border-secondary/15 bg-gradient-to-br from-secondary/[0.05] via-transparent to-transparent p-5 sm:p-6">
                      {/* Connection lines to source cards */}
                      <svg className="absolute -right-6 top-1/2 hidden h-32 w-12 -translate-y-1/2 lg:block" style={{ zIndex: 10 }}>
                        <defs>
                          <linearGradient id="ai-conn" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fafafa" stopOpacity="0.35" />
                            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#fafafa" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        <path d="M0,64 Q24,32 48,16" stroke="url(#ai-conn)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                        <path d="M0,64 Q24,64 48,64" stroke="url(#ai-conn)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                        <path d="M0,64 Q24,96 48,112" stroke="url(#ai-conn)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                      </svg>

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Sparkles className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground">AI Memory Synthesis</span>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-secondary" />
                                0.8s
                              </span>
                              <span className="flex items-center gap-1">
                                <Link2 className="h-3 w-3" />
                                14 connections
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                          3 sources
                        </div>
                      </div>
                      
                      <div className="space-y-4 text-sm text-foreground/90 sm:text-[15px]">
                        <p className="leading-relaxed">
                          Based on your knowledge graph, you've been exploring <span className="font-semibold text-foreground">NFT market dynamics</span> with a focus on how different marketplaces handle <span className="text-secondary font-medium">royalty structures</span>.
                        </p>
                        <p className="leading-relaxed">
                          Your research covers the comparison between <span className="text-secondary font-medium">Solana</span> and <span className="text-secondary font-medium">Ethereum</span> ecosystems, noting that Solana's lower gas fees make it more attractive for frequent trading. You've also documented strategies for <span className="font-semibold text-foreground">whitelist mints</span> and <span className="font-semibold text-foreground">staking rewards</span> optimization.
                        </p>
                      </div>

                      {/* Related topics as connected nodes */}
                      <div className="mt-5 border-t border-white/[0.05] pt-5">
                        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Connected topics</div>
                        <div className="flex flex-wrap items-center gap-2">
                          {relatedTopics.map((topic, i) => (
                            <div key={topic} className="flex items-center">
                              <button className="flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs text-foreground transition-all hover:border-secondary/40 hover:bg-secondary/10">
                                <div className="h-1.5 w-1.5 rounded-full bg-secondary/60" />
                                {topic}
                                <ChevronRight className="h-3 w-3 text-secondary/60" />
                              </button>
                              {i < relatedTopics.length - 1 && (
                                <div className="mx-1 h-px w-4 bg-secondary/20" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Source notes - Side column */}
                  <div className="lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Memory Sources</h4>
                      <button className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80">
                        <span>View all</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {sourceNotes.map((note, idx) => (
                        <div
                          key={note.title}
                          className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-muted/20 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-muted/40"
                        >
                          {/* Top row: Relevance + Connections */}
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                {note.relevance}%
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Link2 className="h-3 w-3" />
                                <span>{note.connections} links</span>
                              </div>
                            </div>
                            <FileText className="h-4 w-4 text-muted-foreground/40" />
                          </div>

                          <h5 className="mb-1.5 text-sm font-semibold text-foreground line-clamp-1">{note.title}</h5>
                          <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">{note.excerpt}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {note.tags.map((tag) => (
                                <span key={tag} className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                  <Tag className="h-2.5 w-2.5" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground/60">{note.date}</span>
                          </div>

                          {/* Connection indicator dot */}
                          <div className={`absolute -left-1 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full lg:block ${
                            idx === 0 ? 'bg-secondary/60' : idx === 1 ? 'bg-secondary/40' : 'bg-secondary/20'
                          }`} />

                          {/* Hover accent */}
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent via-white/40 to-primary/60 transition-all duration-500 group-hover:w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

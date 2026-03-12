"use client"

import { Zap, Brain, WifiOff, ArrowRight, Sparkles, Link2, Database } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Capture",
    description: "Every thought enters your knowledge graph in milliseconds. Write, paste, or dictate — MindSync indexes and connects it automatically.",
    color: "primary" as const,
    stat: "< 100ms",
    statLabel: "capture time",
    nodes: ["Quick notes", "Voice memos", "Web clips"],
  },
  {
    icon: Brain,
    title: "AI Memory Recall",
    description: "Ask natural questions about your past thoughts. AI searches your entire knowledge base and synthesizes answers with full source attribution.",
    color: "secondary" as const,
    stat: "847",
    statLabel: "notes searchable",
    nodes: ["Semantic search", "Context aware", "Source linked"],
  },
  {
    icon: WifiOff,
    title: "Offline by Default",
    description: "Your brain never loses signal. MindSync stores everything locally first, then syncs seamlessly when you're back online.",
    color: "primary" as const,
    stat: "100%",
    statLabel: "offline capable",
    nodes: ["Local storage", "Auto sync", "No data loss"],
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Ambient glows */}
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/[0.03] blur-[100px]" />
        
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Core Capabilities</span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything you need to build a{" "}
            <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              second brain
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Powerful features designed to capture, connect, and recall your knowledge effortlessly.
          </p>
        </div>

        {/* Feature cards with connection visualization */}
        <div className="relative mt-16 sm:mt-20">
          {/* Connection lines between cards (desktop only) */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none hidden lg:block"
            style={{ zIndex: 0 }}
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="feat-conn-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fafafa" stopOpacity="0" />
                <stop offset="40%" stopColor="#fafafa" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#d4af37" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#fafafa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 33 50 Q 50 35, 67 50"
              stroke="url(#feat-conn-1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              className="animate-pulse-glow"
            />
          </svg>

          <div className="relative grid gap-6 lg:grid-cols-3" style={{ zIndex: 1 }}>
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isSecondary = feature.color === "secondary"
              
              return (
                <div key={feature.title} className="group relative">
                  {/* Card */}
                  <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 p-6 backdrop-blur-md transition-all duration-500 hover:border-primary/20 hover:bg-card/80 sm:p-8">
                    {/* Glow effect */}
                    <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${isSecondary ? 'bg-secondary/8' : 'bg-primary/8'} blur-3xl transition-all duration-500 group-hover:scale-150`} />
                    
                    {/* Top highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    {/* Icon and stat row */}
                    <div className="relative mb-6 flex items-start justify-between">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${isSecondary ? 'border-secondary/25 bg-secondary/10' : 'border-primary/25 bg-primary/10'} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className={`h-7 w-7 ${isSecondary ? 'text-secondary' : 'text-primary'}`} />
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold tabular-nums ${isSecondary ? 'text-secondary' : 'text-primary'}`}>{feature.stat}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{feature.statLabel}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="relative mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="relative mb-6 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    
                    {/* Mini node graph */}
                    <div className="relative flex items-center gap-2">
                      {feature.nodes.map((node, i) => (
                        <div key={node} className="flex items-center">
                          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                            isSecondary 
                              ? 'border-secondary/20 bg-secondary/5 text-secondary/80 group-hover:border-secondary/30' 
                              : 'border-primary/20 bg-primary/5 text-primary/80 group-hover:border-primary/30'
                          }`}>
                            <div className={`h-1 w-1 rounded-full ${isSecondary ? 'bg-secondary/60' : 'bg-primary/60'}`} />
                            {node}
                          </div>
                          {i < feature.nodes.length - 1 && (
                            <div className={`mx-1 h-px w-3 ${isSecondary ? 'bg-secondary/20' : 'bg-primary/20'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom accent */}
                    <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent via-white/40 to-primary/60 transition-all duration-500 group-hover:w-full`} />
                  </div>

                  {/* Connection dot to next card */}
                  {index < features.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-primary/40 lg:block" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link2 className="h-4 w-4 text-primary/60" />
            <span>Automatic knowledge linking</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4 text-secondary/60" />
            <span>Local-first architecture</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4 text-primary/60" />
            <span>AI-powered recall</span>
          </div>
        </div>
      </div>
    </section>
  )
}

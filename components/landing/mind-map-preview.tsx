"use client"

import { useEffect, useState } from "react"
import { Brain, Lightbulb, FileText, Bookmark, ListTodo, TrendingUp, Sparkles, Link2, Zap } from "lucide-react"

const outerNodes = [
  { id: 1, label: "AI Products", icon: Brain, angle: -30, distance: 42, notes: 24, color: "primary" },
  { id: 2, label: "NFT Research", icon: TrendingUp, angle: 30, distance: 40, notes: 18, color: "secondary" },
  { id: 3, label: "Startup Ideas", icon: Lightbulb, angle: 90, distance: 38, notes: 31, color: "primary" },
  { id: 4, label: "Meeting Notes", icon: FileText, angle: 150, distance: 42, notes: 45, color: "secondary" },
  { id: 5, label: "Reading List", icon: Bookmark, angle: 210, distance: 40, notes: 12, color: "primary" },
  { id: 6, label: "Weekly Goals", icon: ListTodo, angle: 270, distance: 38, notes: 8, color: "secondary" },
]

const secondaryConnections = [
  { from: 1, to: 2, strength: 0.8 },
  { from: 2, to: 3, strength: 0.6 },
  { from: 3, to: 4, strength: 0.4 },
  { from: 4, to: 5, strength: 0.7 },
  { from: 5, to: 6, strength: 0.5 },
  { from: 6, to: 1, strength: 0.3 },
  { from: 1, to: 4, strength: 0.4 },
  { from: 2, to: 5, strength: 0.3 },
]

export function MindMapPreview() {
  const [mounted, setMounted] = useState(false)
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getPosition = (angle: number, distance: number) => {
    const radian = (angle - 90) * (Math.PI / 180)
    return {
      x: 50 + distance * Math.cos(radian),
      y: 50 + distance * Math.sin(radian),
    }
  }

  return (
    <section id="demo" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[150px]" />
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-secondary/[0.02] blur-[100px]" />
        
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.02) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5">
            <Link2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Knowledge Graph</span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Visualize your{" "}
            <span className="bg-gradient-to-r from-primary via-[#a855f7] to-secondary bg-clip-text text-transparent">
              connected thoughts
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            See how your ideas relate to each other in an intuitive knowledge graph that grows with your mind.
          </p>
        </div>

        {/* Mind map visualization */}
        <div className="mx-auto mt-16 max-w-3xl sm:mt-20">
          <div className="relative aspect-square w-full max-w-2xl mx-auto">
            {/* Background pulse */}
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            
            {/* SVG connections */}
            <svg
              className="absolute inset-0 h-full w-full"
              style={{ zIndex: 5 }}
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="mindmap-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="mindmap-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="mindmap-active" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
                </linearGradient>
                <filter id="glow-line">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary connections to center */}
              {mounted && outerNodes.map((node) => {
                const pos = getPosition(node.angle, node.distance)
                const isActive = activeNode === node.id
                return (
                  <g key={`line-${node.id}`}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${pos.x}%`}
                      y2={`${pos.y}%`}
                      stroke={isActive ? "url(#mindmap-active)" : "url(#mindmap-primary)"}
                      strokeWidth={isActive ? "3" : "2"}
                      strokeLinecap="round"
                      filter="url(#glow-line)"
                      className="transition-all duration-300"
                      opacity={isActive ? 1 : 0.5}
                    />
                    {/* Animated particle */}
                    <circle r="3" fill={node.color === "primary" ? "#7c3aed" : "#06b6d4"} opacity="0.8">
                      <animateMotion
                        dur={`${2.5 + node.id * 0.2}s`}
                        repeatCount="indefinite"
                        path={`M ${pos.x * 5},${pos.y * 5} L 250,250`}
                      />
                    </circle>
                  </g>
                )
              })}

              {/* Secondary connections between nodes */}
              {mounted && secondaryConnections.map((conn, i) => {
                const fromNode = outerNodes.find(n => n.id === conn.from)
                const toNode = outerNodes.find(n => n.id === conn.to)
                if (!fromNode || !toNode) return null
                
                const fromPos = getPosition(fromNode.angle, fromNode.distance)
                const toPos = getPosition(toNode.angle, toNode.distance)
                const isHighlighted = activeNode === conn.from || activeNode === conn.to
                
                // Calculate control point for curved line
                const midX = (fromPos.x + toPos.x) / 2
                const midY = (fromPos.y + toPos.y) / 2
                const offset = 5
                const ctrlX = midX + (50 - midX) * 0.3
                const ctrlY = midY + (50 - midY) * 0.3
                
                return (
                  <path
                    key={`secondary-${i}`}
                    d={`M ${fromPos.x} ${fromPos.y} Q ${ctrlX} ${ctrlY} ${toPos.x} ${toPos.y}`}
                    stroke={isHighlighted ? "#06b6d4" : "url(#mindmap-secondary)"}
                    strokeWidth={isHighlighted ? "1.5" : "1"}
                    strokeDasharray="4 4"
                    fill="none"
                    opacity={isHighlighted ? 0.7 : 0.25}
                    className="transition-all duration-300"
                  />
                )
              })}
            </svg>

            {/* Center node */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 20 }}
            >
              <div className="relative">
                {/* Pulse rings */}
                <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute -inset-6 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
                
                <div className="flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-full border-2 border-primary/40 bg-card shadow-[0_0_60px_rgba(124,58,237,0.3)]">
                  <div className="text-center px-3">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-foreground">Your Mind</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">142 memories</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outer nodes */}
            {outerNodes.map((node, index) => {
              const pos = getPosition(node.angle, node.distance)
              const Icon = node.icon
              const isActive = activeNode === node.id
              const isPrimary = node.color === "primary"
              
              return (
                <div
                  key={node.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: mounted ? `float 5s ease-in-out infinite` : 'none',
                    animationDelay: `${index * 0.3}s`,
                    zIndex: isActive ? 25 : 15,
                  }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div className={`group flex items-center gap-2.5 rounded-2xl border bg-card/95 px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg backdrop-blur-md transition-all duration-300 ${
                    isActive 
                      ? 'border-secondary/60 scale-110 shadow-[0_0_35px_rgba(6,182,212,0.3)]' 
                      : isPrimary 
                        ? 'border-primary/25 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]'
                        : 'border-secondary/25 hover:border-secondary/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  }`}>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-secondary/20' 
                        : isPrimary 
                          ? 'bg-primary/10 group-hover:bg-primary/20' 
                          : 'bg-secondary/10 group-hover:bg-secondary/20'
                    }`}>
                      <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-secondary' : isPrimary ? 'text-primary' : 'text-secondary'}`} />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">{node.label}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className={`h-1 w-1 rounded-full ${isPrimary ? 'bg-primary/60' : 'bg-secondary/60'}`} />
                        <span>{node.notes} notes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "142", label: "Memories", icon: Brain },
              { value: "89", label: "Connections", icon: Link2 },
              { value: "12", label: "Topics", icon: Lightbulb },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="group rounded-2xl border border-white/[0.06] bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/60">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
      `}</style>
    </section>
  )
}

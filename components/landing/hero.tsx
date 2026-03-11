"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { KnowledgeGraph } from "./knowledge-graph"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 lg:pt-24">
      {/* Layered atmospheric background */}
      <div className="absolute inset-0">
        {/* Base */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Central radial glow - focused on product */}
        <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.06] blur-[150px]" />
        
        {/* Secondary accent glow */}
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-secondary/[0.03] blur-[100px]" />
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[100px]" />
        
        {/* Grid pattern - more subtle */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.4)_70%,rgba(2,6,23,0.8)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero content - more compact */}
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-2 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Offline-First AI Memory</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your thoughts,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-[#a855f7] to-secondary bg-clip-text text-transparent">
                perfectly recalled
              </span>
              <svg className="absolute -bottom-1 left-0 h-2 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0,6 Q50,2 100,6 T200,6" stroke="url(#hero-underline)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Capture ideas, organize knowledge, and ask AI anything about your thoughts — even when you're offline.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button 
              size="lg" 
              className="group relative h-12 overflow-hidden rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.45)] sm:h-14 sm:px-10 sm:text-base"
            >
              <span className="relative z-10">Start Building Your Memory</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 rounded-xl border-border/50 bg-card/40 px-6 text-sm text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/60 sm:h-14 sm:px-8 sm:text-base"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Knowledge Graph - The Main Visual */}
        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          <KnowledgeGraph />
        </div>
      </div>
    </section>
  )
}

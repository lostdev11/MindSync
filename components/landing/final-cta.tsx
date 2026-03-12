"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Zap, Brain } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[150px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] translate-x-1/4 -translate-y-1/4 rounded-full bg-secondary/[0.04] blur-[100px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
        
        {/* Decorative neural network lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-25"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="cta-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fafafa" stopOpacity="0" />
              <stop offset="40%" stopColor="#fafafa" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#fafafa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cta-line-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fafafa" stopOpacity="0" />
              <stop offset="45%" stopColor="#fafafa" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.25" />
              <stop offset="55%" stopColor="#fafafa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 25 Q 20 15 50 25 T 100 20"
            stroke="url(#cta-line-1)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 4"
          />
          <path
            d="M 0 75 Q 30 85 50 75 T 100 80"
            stroke="url(#cta-line-1)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 4"
          />
          <path
            d="M 10 0 Q 15 50 10 100"
            stroke="url(#cta-line-2)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 4"
          />
          <path
            d="M 90 0 Q 85 50 90 100"
            stroke="url(#cta-line-2)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Main content card */}
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/50 p-8 sm:p-12 lg:p-16 backdrop-blur-xl">
            {/* Corner accents */}
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
            
            <div className="relative text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-2 backdrop-blur-sm">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Start building your memory</span>
              </div>

              {/* Headline */}
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Build a memory system that{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                    actually remembers
                  </span>
                </span>
              </h2>

              {/* Subtext */}
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                MindSync turns your scattered thoughts into a searchable, AI-powered knowledge base that works even without internet.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="group relative h-14 w-full overflow-hidden rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-[0_0_40px_rgba(212,175,55,0.35)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 w-full rounded-xl border-border/40 bg-card/30 px-8 text-base text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/50 sm:w-auto"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  View Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
                {[
                  { icon: Zap, text: "Free to start" },
                  { icon: Shield, text: "No credit card" },
                  { icon: Sparkles, text: "Works offline" },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.text} className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                        <Icon className="h-3 w-3 text-green-400" />
                      </div>
                      <span>{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

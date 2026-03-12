"use client"

import { Database, RefreshCw, Cloud, Check, Smartphone, Laptop, Globe } from "lucide-react"

const steps = [
  {
    icon: Database,
    label: "Local SQLite",
    description: "Your data lives on your device. Fast reads, instant writes, complete privacy.",
    features: ["Offline editing", "Instant access", "Full encryption"],
    color: "primary" as const,
  },
  {
    icon: RefreshCw,
    label: "PowerSync",
    description: "Intelligent sync engine that handles conflicts and merges seamlessly.",
    features: ["Conflict resolution", "Delta sync", "Real-time updates"],
    color: "secondary" as const,
  },
  {
    icon: Cloud,
    label: "Supabase",
    description: "Secure cloud backup with PostgreSQL. Your data, always recoverable.",
    features: ["Cloud backup", "Cross-device", "Full history"],
    color: "primary" as const,
  },
]

export function OfflineArchitecture() {
  return (
    <section id="offline" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-secondary/[0.04] blur-[100px]" />
        <div className="absolute left-0 bottom-0 h-[400px] w-[400px] -translate-x-1/3 rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary">Offline-First Architecture</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              offline-first
            </span>{" "}
            reliability
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Your data is always available, whether you're online or off. Seamless sync when you reconnect.
          </p>
        </div>

        {/* Architecture flow */}
        <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 lg:block">
              <svg className="h-full w-8 -ml-4" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fafafa" stopOpacity="0.5" />
                    <stop offset="30%" stopColor="#fafafa" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#d4af37" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#fafafa" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fafafa" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <line x1="16" y1="0" x2="16" y2="100%" stroke="url(#flow-gradient)" strokeWidth="2" strokeDasharray="8 4" opacity="0.4" />
              </svg>
            </div>

            {/* Steps */}
            <div className="space-y-6 lg:space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isSecondary = step.color === "secondary"
                
                return (
                  <div key={step.label} className="relative">
                    {/* Step card */}
                    <div className={`relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 ${isSecondary ? 'border-secondary/30 hover:border-secondary/50' : 'border-border/50 hover:border-primary/30'}`}>
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
                          {/* Icon and step number */}
                          <div className="flex items-center gap-4 lg:w-48">
                            <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${isSecondary ? 'border-secondary/40 bg-secondary/10 shadow-[0_0_30px_rgba(250,250,250,0.15)]' : 'border-primary/40 bg-primary/10 shadow-[0_0_30px_rgba(212,175,55,0.15)]'}`}>
                              <Icon className={`h-8 w-8 ${isSecondary ? 'text-secondary' : 'text-primary'}`} />
                              {/* Step number badge */}
                              <div className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isSecondary ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                                {index + 1}
                              </div>
                            </div>
                            <div className="lg:hidden">
                              <h3 className="text-xl font-semibold text-foreground">{step.label}</h3>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="hidden text-xl font-semibold text-foreground lg:block">{step.label}</h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 lg:w-56 lg:justify-end">
                            {step.features.map((feature) => (
                              <div key={feature} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${isSecondary ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                <Check className="h-3 w-3" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom accent */}
                      <div className={`h-0.5 w-full ${isSecondary ? 'bg-gradient-to-r from-transparent via-secondary/30 to-transparent' : 'bg-gradient-to-r from-transparent via-primary/30 to-transparent'}`} />
                    </div>

                    {/* Arrow connector */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-3 lg:hidden">
                        <svg className="h-8 w-8 text-muted-foreground/30" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Device illustration */}
          <div className="mt-12 flex items-center justify-center gap-6 sm:gap-12">
            {[
              { icon: Smartphone, label: "Mobile" },
              { icon: Laptop, label: "Desktop" },
              { icon: Globe, label: "Web" },
            ].map((device, i) => {
              const Icon = device.icon
              return (
                <div key={device.label} className="flex flex-col items-center gap-2">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{device.label}</span>
                </div>
              )
            })}
          </div>

          {/* Sync status indicator */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2.5">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </div>
              <span className="text-sm font-medium text-green-400">All devices synced</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

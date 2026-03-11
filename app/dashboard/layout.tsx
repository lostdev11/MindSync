"use client"

import { Suspense } from "react"
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation"
import { SyncStatusWidget } from "@/components/dashboard/sync-status-widget"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading your workspace...</p>
          </div>
        </div>
      }
    >
      <AuthGuard>
        <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Ambient background effects */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-secondary/[0.02] blur-[100px]" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(124,58,237,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.015) 1px, transparent 1px)`,
              backgroundSize: '48px 48px'
            }}
          />
        </div>

        {/* Left Sidebar */}
        <aside className="relative z-10 flex h-full w-64 flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl">
          <SidebarNavigation />
          <div className="mt-auto border-t border-border/50 p-4">
            <SyncStatusWidget />
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-auto">
          {children}
        </main>
      </div>
      </AuthGuard>
    </Suspense>
  )
}


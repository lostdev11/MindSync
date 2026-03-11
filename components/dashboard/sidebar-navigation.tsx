"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Brain,
  Settings,
  Sparkles,
  Calendar,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes", icon: FileText },
  { href: "/dashboard/collections", label: "Collections", icon: FolderOpen },
  { href: "/dashboard/recall", label: "Recall", icon: Brain },
  { href: "/dashboard/timeline", label: "Timeline", icon: Calendar },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function SidebarNavigation() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border/50 px-5 py-5">
        <div className="relative flex h-9 w-9 items-center justify-center">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-20 blur-sm" />
          <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary/30 bg-card">
            <Brain className="h-5 w-5 text-primary" />
          </div>
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">MindSync</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-primary/5 blur-sm" />
              )}
              
              {/* Left accent line */}
              <div 
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]" 
                    : "bg-transparent group-hover:bg-muted-foreground/30"
                )}
              />

              <Icon className={cn(
                "relative h-4 w-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="relative">{item.label}</span>

              {/* Recall badge */}
              {item.label === "Recall" && (
                <div className="relative ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary">AI</span>
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { SyncStatusWidget } from "@/components/dashboard/sync-status-widget"
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Keyboard,
  HelpCircle,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsSections = [
  {
    id: "account",
    label: "Account",
    icon: User,
    description: "Manage your profile and preferences"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Configure notification settings"
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Shield,
    description: "Control your data and security options"
  },
  {
    id: "sync",
    label: "Sync & Storage",
    icon: Database,
    description: "Manage offline sync and data storage"
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Customize the look and feel"
  },
  {
    id: "shortcuts",
    label: "Keyboard Shortcuts",
    icon: Keyboard,
    description: "View and customize shortcuts"
  },
]

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 px-6 py-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your MindSync preferences</p>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Settings Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-5 text-left transition-all hover:border-primary/30 hover:bg-card/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/50 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{section.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Sync Status Section */}
          <section className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Sync Status</h2>
            <div className="rounded-xl border border-border/30 bg-muted/20 p-4">
              <SyncStatusWidget />
            </div>
          </section>

          {/* Help & Support */}
          <section className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Help & Support</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                <Shield className="h-4 w-4" />
                <span>Privacy Policy</span>
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <h2 className="mb-2 text-lg font-semibold text-foreground">Danger Zone</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="destructive" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}

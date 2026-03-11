"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "./auth-provider"

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (user) return

    const query = searchParams?.toString()
    const current = query ? `${pathname}?${query}` : pathname
    const redirect = encodeURIComponent(current || "/dashboard")

    router.replace(`/sign-in?redirect=${redirect}`)
  }, [loading, user, pathname, searchParams, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


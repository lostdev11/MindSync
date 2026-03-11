"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

export function AuthenticatedRedirect({ to = "/dashboard" }: { to?: string }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) return
    router.replace(to)
  }, [loading, user, to, router])

  return null
}


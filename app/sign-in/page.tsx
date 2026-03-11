"use client"

import { useEffect, useState, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams?.get("redirect") ?? "/dashboard"
  const { user, loading } = useAuth()

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      const target = redirectParam ? decodeURIComponent(redirectParam) : "/dashboard"
      router.replace(target)
    }
  }, [user, loading, redirectParam, router])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus("sending")
    setError(null)

    try {
      const redirectTo = `${window.location.origin}${redirectParam || "/dashboard"}`

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      })

      if (signInError) {
        throw signInError
      }

      setStatus("sent")
    } catch (err: any) {
      setStatus("error")
      setError(err?.message ?? "Something went wrong while sending your sign-in link.")
    }
  }

  const isSending = status === "sending"

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {/* Ambient background similar to dashboard */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] translate-x-1/4 translate-y-1/4 rounded-full bg-secondary/[0.03] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Sign in to MindSync
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a magic link to access your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}

          {status === "sent" && !error && (
            <p className="text-xs text-emerald-500">
              Magic link sent. Check your email to continue.
            </p>
          )}

          <Button
            type="submit"
            className="mt-2 w-full gap-2"
            disabled={isSending || status === "sent"}
          >
            {isSending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent" />
                Sending magic link...
              </>
            ) : status === "sent" ? (
              "Link sent"
            ) : (
              <>
                Continue with email
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to let MindSync store your session securely with Supabase.
        </p>
      </div>
    </div>
  )
}


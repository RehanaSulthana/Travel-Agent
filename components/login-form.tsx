"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { ok, message } = await loginUser({ email, password })
    setSubmitting(false)
    if (!ok) {
      setError(message || "Invalid credentials")
      return
    }
    router.push("/home")
  }

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground p-6">
      <h2 className="text-2xl font-semibold">Welcome back</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        New here?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:opacity-90">
          Create an account
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
            placeholder="you@example.com"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
            placeholder="Your password"
          />
        </div>

        {error && <div className="rounded-md border border-destructive p-3 text-sm">Invalid credentials</div>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-4 hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  )
}

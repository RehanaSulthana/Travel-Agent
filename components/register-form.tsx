"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { validatePasswordStrength, registerUser } from "@/lib/auth"

export function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { valid, reasons } = validatePasswordStrength(password)
    if (!valid) {
      setErrors(reasons)
      setShowRules(true)
      return
    }

    setSubmitting(true)
    setErrors([])
    const { ok, message } = await registerUser({ username, email, password })
    setSubmitting(false)

    if (!ok) {
      setErrors([message || "Registration failed"])
      return
    }
    router.push("/login")
  }

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground p-6">
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:opacity-90">
          Log in
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
            placeholder="wanderlust123"
          />
        </div>

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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-muted-foreground underline underline-offset-4"
              onClick={() => setShowRules((v) => !v)}
            >
              {showRules ? "Hide rules" : "Show rules"}
            </button>
          </div>
          <input
            id="password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
            placeholder="Strong password"
          />
          {showRules && (
            <ul className="text-xs text-muted-foreground list-disc pl-5">
              <li>At least 8 characters</li>
              <li>Contains uppercase and lowercase</li>
              <li>Contains a number</li>
              <li>Contains a special character</li>
            </ul>
          )}
        </div>

        {errors.length > 0 && (
          <div className="rounded-md border border-destructive p-3 text-sm">
            <p className="font-medium">Please fix the following:</p>
            <ul className="list-disc pl-5 mt-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-4 hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, logoutUser } from "@/lib/auth"
import { TravelForm } from "@/components/travel-form"
import { DestinationList } from "@/components/destination-list"
import { suggestDestinations } from "@/lib/recommendations"
import { Chatbot } from "@/components/chatbot"
import Link from "next/link"
import type { Destination } from "@/lib/destinations"

export default function HomePage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Destination[]>([])

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/login")
    }
  }, [router])

  const onSubmitPreferences = (params: {
    from: string
    days: number
    travellers: number
    budget: number
    interests: string[]
  }) => {
    const recs = suggestDestinations(params)
    setRecommendations(recs)
  }

  const welcomeName = useMemo(() => getSession()?.username ?? "Traveler", [])

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Welcome, {welcomeName}</h1>
          <nav className="flex items-center gap-2">
            <Link
              href="/bookings"
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-3 hover:opacity-90"
            >
              Bookings
            </Link>
            <button
              onClick={() => {
                logoutUser()
                router.push("/login")
              }}
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-3 hover:opacity-90"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto p-4 grid gap-6">
        <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
          <h2 className="text-lg font-semibold">Your trip preferences</h2>
          <p className="text-muted-foreground text-sm">
            Enter where you are traveling from and choose your interests. Recommendations use your location and
            interests.
          </p>
          <div className="mt-4">
            <TravelForm onSubmit={onSubmitPreferences} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
          <h2 className="text-lg font-semibold">Suggested destinations</h2>
          <p className="text-muted-foreground text-sm">Based on budget, popularity, and distance.</p>
          <div className="mt-4">
            <DestinationList destinations={recommendations} />
          </div>
        </div>
      </section>

      <Chatbot />
    </main>
  )
}

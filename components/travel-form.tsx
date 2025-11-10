"use client"

import { useState } from "react"

export function TravelForm({
  onSubmit,
}: {
  onSubmit: (params: {
    from: string
    days: number
    travellers: number
    budget: number
    interests: string[]
  }) => void
}) {
  const [from, setFrom] = useState("")
  const [days, setDays] = useState<number>(5)
  const [travellers, setTravellers] = useState<number>(2)
  const [budget, setBudget] = useState<number>(3000)
  const ALL_INTERESTS = [
    "Beach",
    "City",
    "Museums",
    "History",
    "Nightlife",
    "Architecture",
    "Culinary",
    "Mountains",
    "Winter Sports",
    "Markets",
    "Romance",
    "Classical Music",
    "Cycling",
  ]
  const [interests, setInterests] = useState<string[]>([])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          from,
          days: Number(days),
          travellers: Number(travellers),
          budget: Number(budget),
          interests,
        })
      }}
      className="grid gap-4 md:grid-cols-4"
    >
      <div className="grid gap-2">
        <label htmlFor="from" className="text-sm font-medium">
          From
        </label>
        <input
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="City, Country"
          className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="days" className="text-sm font-medium">
          Days
        </label>
        <input
          id="days"
          type="number"
          min={1}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="travellers" className="text-sm font-medium">
          Travellers
        </label>
        <input
          id="travellers"
          type="number"
          min={1}
          value={travellers}
          onChange={(e) => setTravellers(Number(e.target.value))}
          className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="budget" className="text-sm font-medium">
          Budget (total)
        </label>
        <input
          id="budget"
          type="number"
          min={100}
          step="100"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
          required
        />
      </div>

      <div className="grid gap-2 md:col-span-4">
        <label className="text-sm font-medium">Interests</label>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {ALL_INTERESTS.map((i) => {
            const checked = interests.includes(i)
            return (
              <label key={i} className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setInterests((prev) => (e.target.checked ? [...prev, i] : prev.filter((x) => x !== i)))
                  }}
                  className="h-4 w-4"
                  aria-label={`Interest ${i}`}
                />
                <span className="text-sm">{i}</span>
              </label>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Recommendations are based on your location and selected interests.
        </p>
      </div>

      <div className="md:col-span-4">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-4 hover:opacity-90"
        >
          Enter
        </button>
      </div>
    </form>
  )
}

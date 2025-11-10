import type { Destination } from "@/lib/destinations"

export function DestinationList({ destinations }: { destinations: Destination[] }) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No suggestions yet. Fill in your preferences to see recommendations.
      </div>
    )
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {destinations.map((d) => {
        const approx = Math.round(d.avgCostPerPersonPerDay)
        return (
          <li key={d.name} className="rounded-lg border border-border p-4 bg-background">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{d.name}</h3>
              <span className="text-xs rounded bg-secondary text-secondary-foreground px-2 py-1">
                Popularity {d.popularity}/5
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{d.country}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-md border border-input p-2">
                <div className="text-xs text-muted-foreground">Distance</div>
                <div className="font-medium">{d.distanceKm} km</div>
              </div>
              <div className="rounded-md border border-input p-2">
                <div className="text-xs text-muted-foreground">Avg/day</div>
                <div className="font-medium">${approx}</div>
              </div>
              <div className="rounded-md border border-input p-2">
                <div className="text-xs text-muted-foreground">Season</div>
                <div className="font-medium">{d.peakSeason}</div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

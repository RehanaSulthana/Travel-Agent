import { DESTINATIONS, type Destination } from "./destinations"

export function suggestDestinations(params: {
  from: string
  days: number
  travellers: number
  budget: number
  interests: string[]
}): Destination[] {
  const { days, travellers, budget, interests } = params
  const interestsLower = (interests || []).map((i) => i.toLowerCase())

  const filtered = DESTINATIONS.filter((d) => {
    if (!interestsLower.length) return true
    const hasOverlap = d.interests.some((tag) => interestsLower.includes(tag.toLowerCase()))
    return hasOverlap
  })

  // Estimate cost for destination
  const withCost = filtered.map((d) => {
    const total = d.avgCostPerPersonPerDay * days * travellers
    return { ...d, estimatedTotal: total }
  })

  // Filter by budget feasibility (within budget or up to 10% over as "stretch")
  const feasible = withCost.filter((d) => d.estimatedTotal <= budget * 1.1)

  // Sort by: within budget first, then popularity desc, then distance asc, then total asc
  const sorted = feasible.sort((a, b) => {
    const aWithin = a.estimatedTotal <= budget ? 1 : 0
    const bWithin = b.estimatedTotal <= budget ? 1 : 0
    if (aWithin !== bWithin) return bWithin - aWithin
    if (a.popularity !== b.popularity) return b.popularity - a.popularity
    if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm
    return a.estimatedTotal - b.estimatedTotal
  })

  return sorted.slice(0, 8)
}

export type Destination = {
  name: string
  country: string
  distanceKm: number
  popularity: 1 | 2 | 3 | 4 | 5
  avgCostPerPersonPerDay: number
  peakSeason: "Spring" | "Summer" | "Autumn" | "Winter" | "Year-round"
  interests: string[] // new
}

export const DESTINATIONS: Destination[] = [
  {
    name: "Paris",
    country: "France",
    distanceKm: 10000,
    popularity: 5,
    avgCostPerPersonPerDay: 500,
    peakSeason: "Spring",
    interests: ["City", "Museums", "History", "Romance", "Culinary"],
  },
  {
    name: "Barcelona",
    country: "Spain",
    distanceKm: 3000,
    popularity: 4,
    avgCostPerPersonPerDay: 500,
    peakSeason: "Summer",
    interests: ["Beach", "City", "Nightlife", "Architecture", "Culinary"],
  },
  {
    name: "Rome",
    country: "Italy",
    distanceKm: 2000,
    popularity: 5,
    avgCostPerPersonPerDay: 600,
    peakSeason: "Spring",
    interests: ["History", "Museums", "City", "Culinary", "Architecture"],
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    distanceKm: 12000,
    popularity: 4,
    avgCostPerPersonPerDay: 500,
    peakSeason: "Summer",
    interests: ["Museums", "City", "Nightlife", "Cycling", "Architecture"],
  },
  {
    name: "Prague",
    country: "Czech Republic",
    distanceKm: 5000,
    popularity: 4,
    avgCostPerPersonPerDay: 500,
    peakSeason: "Autumn",
    interests: ["History", "City", "Architecture"],
  },
  {
    name: "Vienna",
    country: "Austria",
    distanceKm: 3000,
    popularity: 3,
    avgCostPerPersonPerDay: 700,
    peakSeason: "Winter",
    interests: ["Museums", "Classical Music", "City", "History"],
  },
  {
    name: "Istanbul",
    country: "Türkiye",
    distanceKm: 2000,
    popularity: 5,
    avgCostPerPersonPerDay: 130,
    peakSeason: "Year-round",
    interests: ["History", "Markets", "City", "Culinary", "Architecture"],
  },
  {
    name: "Lisbon",
    country: "Portugal",
    distanceKm: 15000,
    popularity: 4,
    avgCostPerPersonPerDay: 600,
    peakSeason: "Spring",
    interests: ["Beach", "City", "Culinary", "History"],
  },
  {
    name: "Zurich",
    country: "Switzerland",
    distanceKm: 7000,
    popularity: 3,
    avgCostPerPersonPerDay: 700,
    peakSeason: "Winter",
    interests: ["Mountains", "Winter Sports", "City"],
  },
  {
    name: "Athens",
    country: "Greece",
    distanceKm: 18000,
    popularity: 4,
    avgCostPerPersonPerDay: 400,
    peakSeason: "Summer",
    interests: ["History", "Beach", "City", "Culinary"],
  },
]

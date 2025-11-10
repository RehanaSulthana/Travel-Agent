export type Booking = {
  reference: string
  destination: string
  checkIn: string
  checkOut: string
  travellers: number
  hotel: string
  price: number
  paymentMethod: string
  createdAt: string
}

const LS_KEY = "travel_demo_bookings"

function readAll(): Booking[] {
  if (typeof window === "undefined") return []
  try {
    const s = localStorage.getItem(LS_KEY)
    return s ? (JSON.parse(s) as Booking[]) : []
  } catch {
    return []
  }
}

function writeAll(bookings: Booking[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(LS_KEY, JSON.stringify(bookings))
  // notify listeners in this tab
  window.dispatchEvent(new CustomEvent("bookings:changed"))
}

export function listBookings(): Booking[] {
  return readAll()
}

export function addBooking(b: Booking) {
  const all = readAll()
  all.unshift(b)
  writeAll(all)
}

export function deleteBookingByRef(reference: string): boolean {
  const all = readAll()
  const next = all.filter((b) => b.reference !== reference)
  const changed = next.length !== all.length
  if (changed) writeAll(next)
  return changed
}

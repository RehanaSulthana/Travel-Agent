// "use client"

// import { useEffect, useMemo, useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { getSession } from "@/lib/auth"
// import { listBookings, deleteBookingByRef, type Booking } from "@/lib/bookings"

// export default function BookingsPage() {
//   const router = useRouter()
//   const [bookings, setBookings] = useState<Booking[]>([])

//   useEffect(() => {
//     const session = getSession()
//     if (!session) router.push("/login")
//   }, [router])

//   useEffect(() => {
//     const load = () => setBookings(listBookings())
//     load()
//     const handler = () => load()
//     window.addEventListener("bookings:changed", handler as EventListener)
//     return () => window.removeEventListener("bookings:changed", handler as EventListener)
//   }, [])

//   const username = useMemo(() => getSession()?.username ?? "Traveler", [])

//   return (
//     <main className="min-h-dvh bg-background text-foreground">
//       <header className="border-b border-border">
//         <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
//           <h1 className="text-xl font-semibold text-balance">Your bookings, {username}</h1>
//           <nav className="flex items-center gap-2">
//             <Link
//               href="/home"
//               className="inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-3 hover:opacity-90"
//             >
//               Home
//             </Link>
//           </nav>
//         </div>
//       </header>

//       <section className="max-w-5xl mx-auto p-4 grid gap-6">
//         <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
//           <h2 className="text-lg font-semibold">Bookings</h2>
//           <p className="text-muted-foreground text-sm">Newly confirmed bookings appear here automatically.</p>

//           {bookings.length === 0 ? (
//             <div className="mt-4 text-sm text-muted-foreground">No bookings yet.</div>
//           ) : (
//             <ul className="mt-4 grid gap-4">
//               {bookings.map((b) => (
//                 <li key={b.reference} className="rounded-lg border border-input p-4 bg-background">
//                   <div className="flex items-center justify-between">
//                     <div className="font-medium">{b.destination}</div>
//                     <span className="text-xs rounded bg-secondary text-secondary-foreground px-2 py-1">
//                       Ref {b.reference}
//                     </span>
//                   </div>
//                   <div className="mt-2 text-sm text-muted-foreground">
//                     {b.hotel} • {b.travellers} travellers • {b.checkIn} → {b.checkOut}
//                   </div>
//                   <div className="mt-1 text-sm">
//                     Total paid: ${b.price} via {b.paymentMethod}
//                   </div>
//                   <div className="mt-3">
//                     <button
//                       onClick={() => {
//                         deleteBookingByRef(b.reference)
//                         // list updates via event, but ensure local update
//                         setBookings((cur) => cur.filter((x) => x.reference !== b.reference))
//                       }}
//                       className="inline-flex h-9 items-center justify-center rounded-md bg-destructive text-white font-medium px-4 hover:opacity-90"
//                       aria-label={`Delete booking ${b.reference}`}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </section>
//     </main>
//   )
// }



"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import { listBookings, deleteBookingByRef, type Booking } from "@/lib/bookings"

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [deletedBookings, setDeletedBookings] = useState<Booking[]>([]) // for undo

  // ✅ Check if user session exists
  useEffect(() => {
    const session = getSession()
    if (!session) router.push("/login")
  }, [router])

  // ✅ Load bookings when page loads or updates
  useEffect(() => {
    const load = () => setBookings(listBookings())
    load()
    const handler = () => load()
    window.addEventListener("bookings:changed", handler as EventListener)
    return () => window.removeEventListener("bookings:changed", handler as EventListener)
  }, [])

  // ✅ Load any existing deleted bookings from storage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("deletedBookings") || "[]")
    setDeletedBookings(saved)
  }, [])

  const username = useMemo(() => getSession()?.username ?? "Traveler", [])

  // ✅ Handle delete with confirmation + backup
  const handleDelete = (ref: string) => {
    const bookingToDelete = bookings.find((b) => b.reference === ref)
    if (!bookingToDelete) return

    if (confirm(`Are you sure you want to delete booking Ref ${ref}?`)) {
      // Save backup for undo
      const existingBackups = JSON.parse(localStorage.getItem("deletedBookings") || "[]")
      existingBackups.push(bookingToDelete)
      localStorage.setItem("deletedBookings", JSON.stringify(existingBackups))
      setDeletedBookings(existingBackups)

      // Remove from main list
      deleteBookingByRef(ref)
      const updated = bookings.filter((x) => x.reference !== ref)
      setBookings(updated)

      // Trigger re-render of other listeners
      window.dispatchEvent(new Event("bookings:changed"))
    }
  }

  // ✅ Undo delete (restore most recently deleted)
  const handleUndo = () => {
    const backups = JSON.parse(localStorage.getItem("deletedBookings") || "[]")
    if (backups.length === 0) {
      alert("No deleted bookings to restore.")
      return
    }

    const lastDeleted = backups.pop()
    localStorage.setItem("deletedBookings", JSON.stringify(backups))
    setDeletedBookings(backups)

    if (!lastDeleted) return

    // Restore booking to main list
    const current = listBookings()
    const updated = [...current, lastDeleted]
    localStorage.setItem("bookings", JSON.stringify(updated))
    setBookings(updated)

    window.dispatchEvent(new Event("bookings:changed"))

    // ✅ Optional feedback
    alert(`Booking Ref ${lastDeleted.reference} restored successfully!`)
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Your bookings, {username}</h1>
          <nav className="flex items-center gap-2">
            <Link
              href="/home"
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-3 hover:opacity-90"
            >
              Home
            </Link>
            {deletedBookings.length > 0 && (
              <button
                onClick={handleUndo}
                className="inline-flex h-9 items-center justify-center rounded-md bg-muted text-foreground px-3 hover:opacity-90"
              >
                Undo Delete
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ===== BOOKINGS SECTION ===== */}
      <section className="max-w-5xl mx-auto p-4 grid gap-6">
        <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
          <h2 className="text-lg font-semibold">Bookings</h2>
          <p className="text-muted-foreground text-sm">
            Newly confirmed bookings appear here automatically.
          </p>

          {bookings.length === 0 ? (
            <div className="mt-4 text-sm text-muted-foreground">No bookings yet.</div>
          ) : (
            <ul className="mt-4 grid gap-4">
              {bookings.map((b) => (
                <li key={b.reference} className="rounded-lg border border-input p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{b.destination}</div>
                    <span className="text-xs rounded bg-secondary text-secondary-foreground px-2 py-1">
                      Ref {b.reference}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {b.hotel} • {b.travellers} travellers • {b.checkIn} → {b.checkOut}
                  </div>
                  <div className="mt-1 text-sm">
                    Total paid: ${b.price} via {b.paymentMethod}
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => handleDelete(b.reference)}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-destructive text-white font-medium px-4 hover:opacity-90"
                      aria-label={`Delete booking ${b.reference}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

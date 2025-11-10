"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { addBooking, deleteBookingByRef } from "@/lib/bookings"

type Message = { role: "user" | "assistant"; content: string }
type BookingState =
  | { step: "idle" }
  | { step: "awaiting-details" }
  | {
      step: "proposing-package"
      destination: string
      checkIn: string
      checkOut: string
      travellers: number
      hotel: string
      price: number
    }
  | {
      step: "awaiting-payment"
      reference: string
      price: number
      proposal: {
        destination: string
        checkIn: string
        checkOut: string
        travellers: number
        hotel: string
      }
    }
  | { step: "confirmed"; reference: string }

function parseIntent(input: string) {
  const text = input.toLowerCase()

  const destMatch = text.match(/to ([a-z\s]+?)(?: from|\s|$)/i)
  const dateRange = text.match(
    /(from|check[-\s]?in)\s(\d{4}-\d{2}-\d{2}).*(to|until|check[-\s]?out)\s(\d{4}-\d{2}-\d{2})/i,
  )
  const travellersMatch = text.match(/(\d+)\s+(travellers|travelers|people|persons)/i)
  const wantsDelete = /(delete|cancel)\s*(my\s*)?(booking|reservation)?/.test(text)
  const refMatch = text.match(/ref[-\s:]?([a-z0-9]{4,})/i)
  const payDigits = text.match(/pay(?:\s+([0-9\s]+))?/i)
  const payNumber = payDigits?.[1]?.replace(/\s+/g, "") || undefined

  const destination = destMatch?.[1]?.trim()
  const checkIn = dateRange?.[2]
  const checkOut = dateRange?.[4]
  const travellers = travellersMatch ? Number.parseInt(travellersMatch[1], 10) : undefined
  const wantsBooking = /(book|reserve|ticket|hotel)/.test(text)
  const wantsPay = /(pay|payment|confirm payment|checkout|check out)/.test(text)
  const asksHotels = /(hotel|stay|accommodation)/.test(text)
  const asksPackages = /(package|deal|bundle)/.test(text)

  return {
    destination,
    checkIn,
    checkOut,
    travellers,
    wantsBooking,
    wantsPay,
    asksHotels,
    asksPackages,
    wantsDelete,
    ref: refMatch?.[1]?.toUpperCase(),
    payNumber,
  }
}

function randomRef() {
  return "REF-" + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function Chatbot() {
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I’m your travel assistant. Tell me where and when you’d like to go." },
  ])
  const [state, setState] = useState<BookingState>({ step: "idle" })
  const scrollerRef = useRef<HTMLDivElement>(null)

  const send = (content: string) => {
    setMessages((m) => [...m, { role: "user", content }])
    handleAssistant(content)
    setInput("")
  }

  function pushAssistant(content: string) {
    setMessages((m) => [...m, { role: "assistant", content }])
  }

  function handleAssistant(userText: string) {
    const intent = parseIntent(userText)

    // deletion can happen anytime if a ref is provided or if we have a confirmed state
    if (intent.wantsDelete) {
      const targetRef = intent.ref || (state.step === "confirmed" ? state.reference : undefined)
      if (!targetRef) {
        pushAssistant('Please specify a reference, e.g. "delete booking REF-ABCD".')
        return
      }
      const ok = deleteBookingByRef(targetRef.startsWith("REF-") ? targetRef : `REF-${targetRef}`)
      pushAssistant(ok ? `Booking ${targetRef} deleted.` : `I couldn't find booking ${targetRef}.`)
      return
    }

    // Payment flow
    if (state.step === "awaiting-payment") {
      if (intent.wantsPay) {
        const ref = state.reference
        // accept dummy payment if "pay" (any) or "pay 4242..."
        const method = intent.payNumber?.includes("4242") ? "DummyCard ****4242" : "DummyCard ****4242"
        // persist booking
        addBooking({
          reference: ref,
          destination: state.proposal.destination,
          checkIn: state.proposal.checkIn,
          checkOut: state.proposal.checkOut,
          travellers: state.proposal.travellers,
          hotel: state.proposal.hotel,
          price: state.price,
          paymentMethod: method,
          createdAt: new Date().toISOString(),
        })
        pushAssistant(
          `Payment of $${state.price} confirmed ✅ using ${method}. Your booking reference is ${ref}.\nView it anytime on the Bookings page.`,
        )
        setState({ step: "confirmed", reference: ref })
      } else {
        pushAssistant(`To complete your booking, type "pay 4242". Use dummy test card 4242 4242 4242 4242.`)
      }
      return
    }

    // Already confirmed
    if (state.step === "confirmed") {
      pushAssistant(
        `Your booking is confirmed. Share reference ${state.reference} with support if needed, or say "delete booking ${state.reference}" to cancel.`,
      )
      return
    }

    // Proposing package
    if (state.step === "proposing-package") {
      if (/(yes|confirm|book)/i.test(userText)) {
        const ref = randomRef()
        setState({
          step: "awaiting-payment",
          reference: ref,
          price: state.price,
          proposal: {
            destination: state.destination,
            checkIn: state.checkIn,
            checkOut: state.checkOut,
            travellers: state.travellers,
            hotel: state.hotel,
          },
        })
        pushAssistant(
          `Great! I’ve reserved ${state.hotel} in ${state.destination} from ${state.checkIn} to ${state.checkOut} for ${state.travellers} travellers.\nTotal due: $${state.price}.\nType "pay 4242" to complete with the dummy test card.`,
        )
        return
      } else if (/(no|change|different)/i.test(userText)) {
        pushAssistant("No problem. What destination and dates would you like instead?")
        setState({ step: "awaiting-details" })
        return
      }
      pushAssistant('Please reply "yes" to confirm or "no" to change details.')
      return
    }

    const destination = intent.destination ?? "a great destination"
    const checkIn = intent.checkIn ?? "2025-12-01"
    const checkOut = intent.checkOut ?? "2025-12-06"
    const travellers = intent.travellers ?? 2

    if (
      intent.asksHotels ||
      intent.asksPackages ||
      intent.wantsBooking ||
      intent.destination ||
      intent.checkIn ||
      intent.checkOut
    ) {
      const hotels = [
        "Seaside Breeze Resort",
        "Grand City Hotel",
        "Sunset Plaza",
        "Old Town Boutique Inn",
        "Skyline Suites",
      ]
      const hotel = hotels[Math.floor(Math.random() * hotels.length)]
      const nights = Math.max(
        1,
        Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)),
      )
      const price = 200 * nights * travellers
      setState({ step: "proposing-package", destination, checkIn, checkOut, travellers, hotel, price })
      pushAssistant(
        `I found a package: ${hotel} in ${destination} from ${checkIn} to ${checkOut} for ${travellers} travellers.\nEstimated total: $${price}.\nWould you like to book it?`,
      )
      return
    }

    pushAssistant(
      "I can help with destinations, dates, hotels, and booking. For example: “Book 2 travellers to Paris from 2025-11-15 to 2025-11-20”.",
    )
    setState({ step: "awaiting-details" })
  }

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  const toggleLabel = useMemo(() => (open ? "Hide assistant" : "Chat with assistant"), [open])

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-lg">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="font-medium">Travel Assistant</div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs rounded bg-secondary text-secondary-foreground px-2 py-1 hover:opacity-90"
          >
            {toggleLabel}
          </button>
        </div>

        {open && (
          <>
            <div
              ref={scrollerRef}
              className="max-h-72 overflow-y-auto p-3 space-y-2"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "assistant"
                      ? "rounded-md bg-accent text-accent-foreground px-3 py-2 w-fit max-w-[90%]"
                      : "rounded-md bg-primary text-primary-foreground px-3 py-2 w-fit ml-auto max-w-[90%]"
                  }
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (input.trim().length === 0) return
                send(input.trim())
              }}
              className="p-3 flex items-center gap-2 border-t border-border"
            >
              <input
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-foreground"
                placeholder="Ask about destinations, hotels, or booking..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-3 hover:opacity-90"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

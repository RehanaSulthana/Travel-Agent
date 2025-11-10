import Link from "next/link"

export default function CoverPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-background text-foreground">
      <section className="w-full max-w-4xl mx-auto p-6">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-semibold text-balance">
              Plan your next adventure with Travel Agent
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Register, get personalized destination suggestions, and chat with a smart, local, offline assistant that
              can simulate bookings and payments.
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/coastal-travel-destination-with-airplane-and-lugga.jpg"
              alt="Beautiful travel destination with airplane and luggage"
              className="w-full h-auto rounded-lg border border-border"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

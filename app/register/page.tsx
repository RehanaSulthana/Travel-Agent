import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  )
}

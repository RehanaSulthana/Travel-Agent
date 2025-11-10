import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}

type RegisterInput = { username: string; email: string; password: string }
type LoginInput = { email: string; password: string }

const LS_KEY_USER = "travel_demo_user"
const LS_KEY_SESSION = "travel_demo_session"

export function validatePasswordStrength(password: string): { valid: boolean; reasons: string[] } {
  const reasons: string[] = []
  if (password.length < 8) reasons.push("Password must be at least 8 characters.")
  if (!/[a-z]/.test(password)) reasons.push("Password must include a lowercase letter.")
  if (!/[A-Z]/.test(password)) reasons.push("Password must include an uppercase letter.")
  if (!/[0-9]/.test(password)) reasons.push("Password must include a number.")
  if (!/[^A-Za-z0-9]/.test(password)) reasons.push("Password must include a special character.")
  return { valid: reasons.length === 0, reasons }
}

async function sha256(input: string): Promise<string> {
  if (typeof window === "undefined" || !("crypto" in window) || !window.crypto.subtle) {
    // fallback: not ideal, but acceptable for demo
    return Promise.resolve(btoa(input))
  }
  const enc = new TextEncoder().encode(input)
  const hash = await window.crypto.subtle.digest("SHA-256", enc)
  const arr = Array.from(new Uint8Array(hash))
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function registerUser(data: RegisterInput): Promise<{ ok: boolean; message?: string }> {
  const user = {
    username: data.username.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash: await sha256(data.password),
  }
  // save single user demo
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY_USER, JSON.stringify(user))
  }
  return { ok: true }
}

export function getSavedUser(): { username: string; email: string; passwordHash: string } | null {
  if (typeof window === "undefined") return null
  const s = localStorage.getItem(LS_KEY_USER)
  if (!s) return null
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

export async function loginUser(data: LoginInput): Promise<{ ok: boolean; message?: string }> {
  const saved = getSavedUser()
  if (!saved) return { ok: false, message: "Invalid credentials" }
  const incomingHash = await sha256(data.password)
  if (saved.email !== data.email.trim().toLowerCase() || saved.passwordHash !== incomingHash) {
    return { ok: false, message: "Invalid credentials" }
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY_SESSION, JSON.stringify({ email: saved.email, username: saved.username }))
  }
  return { ok: true }
}

export function getSession(): { email: string; username: string } | null {
  if (typeof window === "undefined") return null
  const s = localStorage.getItem(LS_KEY_SESSION)
  if (!s) return null
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

export function logoutUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(LS_KEY_SESSION)
}

import { useState } from "react"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import { X } from "lucide-react"

export function AuthPage({ onClose }) {
  const [view, setView] = useState("login") // "login" | "signup"

  return (
    <div className="relative h-auto flex items-center justify-center px-4">
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="
        absolute top-5 right-5
        rounded-full p-2
        bg-zinc-900 hover:bg-zinc-800
        transition cursor-pointer
      "
      >
        <X className="h-5 w-5 text-white" />
      </button>
      {view === "login"
        ? <LoginForm onSwitchToSignup={() => setView("signup")} />
        : <SignupForm onSwitchToLogin={() => setView("login")} />
      }
    </div>
  )
}
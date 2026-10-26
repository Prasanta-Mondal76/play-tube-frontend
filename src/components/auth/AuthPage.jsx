import { useState } from "react"
import { LoginForm } from "./LoginForm.jsx"
import { SignupForm } from "./SignupForm.jsx"
import { X } from "lucide-react"

export function AuthPage({ onClose }) {
  const [view, setView] = useState("login") // "login" | "signup"

  return (
    <div className="relative h-auto w-full flex items-center justify-center">
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="
        absolute top-5 right-5
        rounded-full p-2
        bg-night-700 hover:ember-gradient
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
import { useState, useContext } from "react"
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { loginUser } from "../../services/authApi.js";
import { LoginContext } from "../../context/LoginContextProvider.jsx"
import { BoxContext } from "../../context/BoxContextProvider.jsx"
import logo from "../../assets/Logo.svg"
import toast from "react-hot-toast";
import { Tids } from "../../utils/index.js";

export function LoginForm({ onSwitchToSignup }) {
  const [fields, setFields] = useState({ email: "", password: "" })
  const { setUser, setIsLogIn } = useContext(LoginContext)
  const { setIsLoginBoxOpen } = useContext(BoxContext)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setFields(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await loginUser({
        email: fields.email,
        password: fields.password,
      });

      setUser(response.data.data.user.userData);
      setIsLogIn(true);
      setIsLoginBoxOpen(false);
      toast.success(`Welcome back, ${response.data.data.user.userData.fullName}.`, { id: Tids.auth })
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", { id: Tids.error })
    } finally {
      setLoading(false)
    }

  }

  const inp = (name, type, placeholder) => (
    <div className="relative">
      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={fields[name]}
        onChange={handleChange}
        required
        className="w-full bg-night-850 border border-line rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 focus:bg-night-800 transition"
      />
    </div>
  )

  return (
    <div className="relative overflow-hidden bg-night-900 border border-white/5 rounded-3xl p-6 sm:p-8 w-full max-w-md mx-auto shadow-2xl shadow-black/60 animate-scale-in">
      {/* Ambient ember glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-ember/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-40 w-56 rounded-full bg-ember-orange/10 blur-3xl" />

      <div className="relative">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-7 animate-fade-up">
          <div className="h-14 w-14 flex items-center justify-center rounded-full ring-2 ring-ember/40 shadow-[0_0_28px_rgba(229,9,20,0.35)] mb-3">
            <img src={logo} alt="Logo" className="rounded-full" />
          </div>
          <span className="text-white font-black tracking-tight text-xl">Play<span className="ember-text">Tube</span></span>
          <h1 className="text-white text-2xl font-extrabold tracking-tight mt-4">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-1">Login to continue watching</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="animate-fade-up" style={{ animationDelay: "70ms" }}>
            <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">Email</label>
            {inp("email", "email", "Enter email")}
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
            <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">Password</label>
            {/* Password field + bahar side me attach eye button (approved design) */}
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1 min-w-0">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={fields.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-night-850 border border-line rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 focus:bg-night-800 transition"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 flex items-center justify-center px-3.5 rounded-xl bg-night-800 border border-line text-zinc-300 transition cursor-pointer hover:ember-gradient hover:text-white hover:border-transparent active:scale-95"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "210ms" }}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 ember-gradient shadow-lg shadow-ember/30 hover:shadow-xl hover:shadow-ember/40 hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm py-3 rounded-full transition mt-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="animate-fade-up" style={{ animationDelay: "280ms" }}>
          <hr className="border-white/5 my-5" />
          <p className="text-center text-zinc-500 text-sm">
            Don't have an account?{" "}
            <button onClick={onSwitchToSignup} className="text-ember-soft hover:text-orange-300 underline cursor-pointer">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from "react"
import { Upload, Image, Eye, EyeOff, Mail, Lock, User, AtSign } from "lucide-react"
import {
  initiateRegistration,
  verifyRegistrationOtp,
} from "../../services/authApi.js"
import { OtpVerifyForm } from "./OtpVerifyForm.jsx"
import logo from "../../assets/Logo.svg"
import toast from "react-hot-toast"
import { Tids } from "../../utils/index.js"

const pwRules = [
  { id: "len", label: "At least 6 characters", test: v => v.length >= 6 },
  { id: "up", label: "Contains uppercase letter", test: v => /[A-Z]/.test(v) },
  { id: "lo", label: "Contains lowercase letter", test: v => /[a-z]/.test(v) },
  { id: "sp", label: "Contains special character", test: v => /[^A-Za-z0-9]/.test(v) },
]

export function SignupForm({ onSwitchToLogin }) {
  const [fields, setFields] = useState({ name: "", username: "", email: "", password: "", avatar: null, cover: null })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const pwValid = pwRules.every(r => r.test(fields.password))

  function validate() {
    const e = {}
    if (!fields.name.trim()) e.name = true
    if (!fields.username.trim()) e.username = true
    if (!fields.email.trim()) e.email = true
    if (!fields.password || !pwValid) e.password = true
    if (!fields.avatar) e.avatar = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", fields.name);
      formData.append("username", fields.username);
      formData.append("email", fields.email);
      formData.append("password", fields.password);
      formData.append("avatar", fields.avatar);

      if (fields.cover) {
        formData.append(
          "coverImage",
          fields.cover
        );
      }

      await initiateRegistration(formData);

      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {id: Tids.error })
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    try {
      setLoading(true);
      await verifyRegistrationOtp({
        email: fields.email,
        otp,
      });

      toast.success("Registration completed successfully. Please log in to continue.", {id: Tids.success})

      onSwitchToLogin();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP", {id: Tids.error })
    } finally {
      setLoading(false);
    }
  }

  const inp = (name, type, placeholder, Icon) => (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={fields[name]}
        onChange={e => {
          setFields(p => ({ ...p, [name]: e.target.value }))
        }}
        className={`w-full bg-night-850 border rounded-xl py-3 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 focus:bg-night-800 transition
          ${Icon ? "pl-11" : "pl-4"}
          ${errors[name] ? "border-red-500" : "border-line"}`}
      />
    </div>
  )

  const fileField = (name, label, icon, required) => (
    <div>
      <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">
        {label}{" "}
        {required
          ? <span className="text-red-500">*</span>
          : <span className="text-zinc-600">(optional)</span>}
      </label>
      <label className={`flex items-center gap-2 bg-night-850 border rounded-xl px-4 py-3 cursor-pointer transition hover:border-ember-soft hover:bg-night-800
        ${errors[name] ? "border-red-500" : "border-line"}`}>
        {icon}
        <span className="text-xs text-zinc-500 truncate">
          {fields[name] ? fields[name].name : "Choose file..."}
        </span>
        <input
          type="file" accept="image/*" className="hidden"
          onChange={e => {
            setFields(p => ({ ...p, [name]: e.target.files[0] || null }))
          }}
        />
      </label>
      {errors[name] && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
    </div>
  )


  async function resendOtp() {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", fields.name);
      formData.append("username", fields.username);
      formData.append("email", fields.email);
      formData.append("password", fields.password);
      formData.append("avatar", fields.avatar);

      if (fields.cover) {
        formData.append(
          "coverImage",
          fields.cover
        );
      }

      await initiateRegistration(formData);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP", {id: Tids.error })
    } finally {
      setLoading(false);
    }
  }

  return (
    step === 1 ?
      (
        <div className="relative bg-night-900 border border-white/5 rounded-3xl p-6 sm:p-8 w-full max-w-md mx-auto max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/60 animate-scale-in">
          {/* Ambient ember glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-ember/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-40 w-56 rounded-full bg-ember-orange/10 blur-3xl" />

          <div className="relative">
            <button onClick={onSwitchToLogin} className="text-ember-soft hover:text-orange-300 text-sm mb-5 flex items-center gap-1 cursor-pointer">
              ← Back to login
            </button>

            {/* HEADER */}
            <div className="flex flex-col items-center text-center mb-7 animate-fade-up">
              <div className="h-14 w-14 flex items-center justify-center rounded-full ring-2 ring-ember/40 shadow-[0_0_28px_rgba(229,9,20,0.35)] mb-3">
                <img src={logo} alt="Logo" className="rounded-full" />
              </div>
              <span className="text-white font-black tracking-tight text-xl">Play<span className="ember-text">Tube</span></span>
              <h1 className="text-white text-2xl font-extrabold tracking-tight mt-4">Create account</h1>
              <p className="text-zinc-500 text-sm mt-1">Join PlayTube — it's free</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
                  <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
                  {inp("name", "text", "Your Name", User)}
                  {errors.name && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
                </div>

                <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
                  <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">Username <span className="text-red-500">*</span></label>
                  {inp("username", "text", "you_@12", AtSign)}
                  {errors.username && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
                </div>
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
                <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">Email <span className="text-red-500">*</span></label>
                {inp("email", "email", "you@email.com", Mail)}
                {errors.email && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
                <label className="text-zinc-400 text-xs font-semibold tracking-wide mb-1.5 block">Password <span className="text-red-500">*</span></label>
                {/* Password field + bahar side me attach eye button (approved design) */}
                <div className="flex items-stretch gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={fields.password}
                      onChange={e => {
                        setFields(p => ({ ...p, password: e.target.value }))
                      }}
                      className={`w-full bg-night-850 border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 focus:bg-night-800 transition
                        ${errors.password ? "border-red-500" : "border-line"}`}
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
                {errors.password && <span className="text-red-500 text-xs mt-1 block">Password does not meet requirements</span>}
                {fields.password.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2 animate-fade-in">
                    {pwRules.map(r => (
                      <span key={r.id} className={`text-xs flex items-center gap-1.5 ${r.test(fields.password) ? "text-green-400" : "text-zinc-500"}`}>
                        ● {r.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
                {fileField("avatar", "Profile Picture", <Upload className="h-4 w-4 text-zinc-400" />, true)}
                {fileField("cover", "Cover Picture", <Image className="h-4 w-4 text-zinc-400" />, false)}
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "360ms" }}>
                <button
                  onClick={handleSubmit}
                  className="w-full ember-gradient shadow-lg shadow-ember/30 hover:shadow-xl hover:shadow-ember/40 hover:brightness-110 active:scale-[0.98] text-white font-semibold
                  text-sm py-3 rounded-full transition mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled = {loading}
                >
                  {
                    loading
                      ? "Sending OTP..."
                      : "Create Account"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )
      :
      (
        <OtpVerifyForm
          otp={otp}
          setOtp={setOtp}
          loading={loading}
          verifyOtp={verifyOtp}
          setStep={setStep}
          resendOtp={resendOtp}

        />
      )
  )
}

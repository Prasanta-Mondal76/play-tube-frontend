import { useState } from "react"
import { Upload, Image } from "lucide-react"
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

  const inp = (name, type, placeholder) => (
    <input
      type={type}
      placeholder={placeholder}
      value={fields[name]}
      onChange={e => {
        setFields(p => ({ ...p, [name]: e.target.value }))
      }}
      className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition-colors
        ${errors[name] ? "border-red-500" : "border-zinc-700"}`}
    />
  )

  const fileField = (name, label, icon, required) => (
    <div>
      <label className="text-zinc-400 text-xs mb-1.5 block">
        {label}{" "}
        {required
          ? <span className="text-red-500">*</span>
          : <span className="text-zinc-600">(optional)</span>}
      </label>
      <label className={`flex items-center gap-2 bg-zinc-900 border rounded-xl px-4 py-2.5 cursor-pointer transition-colors hover:border-blue-500
        ${errors[name] ? "border-red-500" : "border-zinc-700"}`}>
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
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full min-w-sm mx-auto max-h-[80vh] overflow-y-auto">
          <button onClick={onSwitchToLogin} className="text-blue-400 hover:text-blue-300 text-sm mb-5 flex items-center gap-1 cursor-pointer">
            ← Back to login
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 flex items-center justify-center">
              <img src={logo} alt="Logo" className="rounded-full" />
            </div>
            <span className="text-white font-bold text-lg">PlayTube</span>
          </div>

          <h1 className="text-white text-xl font-bold mb-6">Create account</h1>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
              {inp("name", "text", "Your Name")}
              {errors.name && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
            </div>

            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Username <span className="text-red-500">*</span></label>
              {inp("username", "text", "you_@12")}
              {errors.username && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
            </div>

            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Email <span className="text-red-500">*</span></label>
              {inp("email", "email", "you@email.com")}
              {errors.email && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
            </div>

            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Password <span className="text-red-500">*</span></label>
              {inp("password", "password", "Create a strong password")}
              {errors.password && <span className="text-red-500 text-xs mt-1 block">Password does not meet requirements</span>}
              {fields.password.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {pwRules.map(r => (
                    <span key={r.id} className={`text-xs flex items-center gap-1.5 ${r.test(fields.password) ? "text-green-400" : "text-zinc-500"}`}>
                      ● {r.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {fileField("avatar", "Profile Picture", <Upload className="h-4 w-4 text-zinc-400" />, true)}
            {fileField("cover", "Cover Picture", <Image className="h-4 w-4 text-zinc-400" />, false)}

            
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold 
              text-sm py-2.5 rounded-xl transition-colors mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
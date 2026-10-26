import logo from "../../assets/Logo.svg"
import toast from "react-hot-toast"
import { Tids } from "../../utils/index.js"

export function OtpVerifyForm({
  otp,
  setOtp,
  loading,
  verifyOtp,
  setStep,
  resendOtp,

}) {


  return (
    <div className="relative overflow-hidden bg-night-900 border border-white/5 rounded-3xl p-6 sm:p-8 w-full max-w-md mx-auto shadow-2xl shadow-black/60 animate-scale-in">
      {/* Ambient ember glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-ember/20 blur-3xl" />

      <div className="relative">
      {/* LOGO + HEADING */}
      <div className="flex flex-col items-center text-center mb-6 animate-fade-up">
        <div className="h-14 w-14 flex items-center justify-center rounded-full ring-2 ring-ember/40 shadow-[0_0_28px_rgba(229,9,20,0.35)] mb-3">
          <img src={logo} alt="Logo" className="rounded-full"/>
        </div>

        <span className="text-white font-black tracking-tight text-xl">
          Play<span className="ember-text">Tube</span>
        </span>

        <h1 className="text-white text-2xl font-extrabold tracking-tight mt-4">
          Verify OTP
        </h1>

        <p className="text-zinc-500 text-sm mt-1">
          We sent a verification code to your email.
        </p>
      </div>

      {/* OTP INPUT */}
      <div className="flex flex-col gap-4">

        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">
            Enter OTP
          </label>

          <input
            type="text"
            value={otp}
            onChange={(e) => {
              // toast.error("", {id: Tids})
              setOtp(e.target.value)
            }}
            placeholder="Enter 6 digit OTP"
            className="
          w-full
          bg-night-850
          border border-line
          rounded-xl
          px-4 py-3
          text-center
          text-base font-bold tracking-[0.35em] text-white
          placeholder:text-zinc-600 placeholder:font-normal placeholder:tracking-normal placeholder:text-sm
          outline-none
          focus:border-ember
          focus:ring-2
          focus:ring-ember/20
          transition
        "
          />
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={loading}
          className="
        w-full
        ember-gradient
        shadow-lg shadow-ember/30
        hover:brightness-110
        disabled:opacity-60
        disabled:cursor-not-allowed
        text-white
        font-semibold
        text-sm
        py-2.5
        rounded-full
        transition
        cursor-pointer
      "
        >

          {
            loading
              ? "Verifying..."
              : "Verify OTP"
          }

        </button>

        <button
          onClick={resendOtp}
          disabled={loading}
          className="
            text-sm
            text-ember-soft
            hover:text-orange-300
            transition-colors
            cursor-pointer
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >

          Resend OTP
        </button>

      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => setStep(1)}
        className="
      w-full
      mt-4
      text-sm
      text-zinc-400
      hover:text-white
      transition-colors
      cursor-pointer
    "
      >
        ← Back to Signup
      </button>

      </div>
    </div>
  )
}
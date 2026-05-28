

export function OtpVerifyForm({
  otp,
  setOtp,
  loading,
  serverError,
  setServerError,
  verifyOtp,
  setStep,
  resendOtp,

}) {


  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm mx-auto">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-sm">
          ▶
        </div>

        <span className="text-white font-bold text-lg">
          PlayTube
        </span>
      </div>

      {/* HEADING */}
      <h1 className="text-white text-2xl font-bold mb-2">
        Verify OTP
      </h1>

      <p className="text-zinc-400 text-sm mb-6">
        We sent a verification code to your email.
      </p>

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
              setServerError("")
              setOtp(e.target.value)
            }}
            placeholder="Enter 6 digit OTP"
            className="
          w-full
          bg-zinc-900
          border border-zinc-700
          rounded-xl
          px-4 py-2.5
          text-sm text-white
          placeholder:text-zinc-600
          outline-none
          focus:border-blue-500
          transition-colors
        "
          />
        </div>

        {/* SERVER ERROR */}
        {
          serverError && (
            <div className="
          rounded-lg
          border border-red-500/40
          bg-red-500/10
          px-3 py-2
          text-sm text-red-400
        ">
              {serverError}
            </div>
          )
        }

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={loading}
          className="
        w-full
        bg-blue-700 hover:bg-blue-600
        disabled:opacity-60
        disabled:cursor-not-allowed
        text-white
        font-semibold
        text-sm
        py-2.5
        rounded-xl
        transition-colors
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
            text-blue-400
            hover:text-blue-300
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
  )
}
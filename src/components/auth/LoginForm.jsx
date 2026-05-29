import { useState, useContext } from "react"
import { LogIn } from "lucide-react"
import { loginUser } from "../../services/authApi";
import { LoginContext } from "../../context/LoginContextProvider"
import { AuthContext } from "../../context/AuthContextProvider"
import logo from "../../assets/Logo.svg"

export function LoginForm({ onSwitchToSignup }) {
  const [fields, setFields] = useState({ email: "", pass: "" })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const { setUser, setIsLogIn } = useContext(LoginContext)
  const { setIsAuthOpen } = useContext(AuthContext)

  function validate() {
    const e = {}
    if (!fields.email.trim()) e.email = true
    if (!fields.pass) e.pass = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return;
    
    try {
      const response = await loginUser({
        email: fields.email,
        password: fields.pass,
      });

      setUser(response.data.data.user.userData);
      setIsLogIn(true);
      setIsAuthOpen(false);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Something went wrong"
      );
    }

  }

  const inp = (name, type, placeholder) => (
    <input
      type={type}
      placeholder={placeholder}
      value={fields[name]}
      onChange={e => {
        setServerError("")
        setFields(p => ({ ...p, [name]: e.target.value }))

      }}
      className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition-colors
        ${errors[name] ? "border-red-500" : "border-zinc-700"}`}
    />
  )

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full min-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 flex items-center justify-center">
          <img src={logo} alt="Logo" className="rounded-full" />
        </div>
        <span className="text-white font-bold text-lg">PlayTube</span>
      </div>

      <h1 className="text-white text-2xl font-bold mb-6">Login</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">Email</label>
          {inp("email", "text", "Enter email")}
          {errors.email && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
        </div>

        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">Password</label>
          {inp("pass", "password", "Enter password")}
          {errors.pass && <span className="text-red-500 text-xs mt-1 block">Required*</span>}
        </div>

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

        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors mt-1 cursor-pointer"
        >
          <LogIn className="h-4 w-4" /> Login
        </button>
      </div>

      <hr className="border-zinc-800 my-5" />
      <p className="text-center text-zinc-500 text-sm">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignup} className="text-blue-400 hover:text-blue-300 underline cursor-pointer">
          Sign Up
        </button>
      </p>
    </div>
  )
}
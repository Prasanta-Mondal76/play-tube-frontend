import { useState, useContext } from "react"
import { LogIn } from "lucide-react"
import { loginUser } from "../../services/authApi";
import { LoginContext } from "../../context/LoginContextProvider"
import { BoxContext } from "../../context/BoxContextProvider"
import logo from "../../assets/Logo.svg"
import toast from "react-hot-toast";
import { Tids } from "../../utils";

export function LoginForm({ onSwitchToSignup }) {
  const [fields, setFields] = useState({ email: "", password: "" })
  const { setUser, setIsLogIn } = useContext(LoginContext)
  const { setIsLoginBoxOpen } = useContext(BoxContext)
  const [loading, setLoading] = useState(false)

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
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={fields[name]}
      onChange={handleChange}
      required
      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition-colors"
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">Email</label>
          {inp("email", "email", "Enter email")}
        </div>

        <div>
          <label className="text-zinc-400 text-xs mb-1.5 block">Password</label>
          {inp("password", "password", "Enter password")}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors mt-1 cursor-pointer"
          disabled={loading}
        >
          <LogIn className="h-4 w-4" /> 
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

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
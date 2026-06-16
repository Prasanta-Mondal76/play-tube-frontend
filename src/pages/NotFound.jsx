import { Home } from "lucide-react"
import { useNavigate } from "react-router-dom";
export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-800 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold shadow-2xl">404</h1>

        <p className="mt-4 text-xl shadow-2xl">
          Page Not Found
        </p>

        <button
        className="bg-blue-600 text-white hover:bg-blue-900 mt-4 p-2 text-2xl border-2 border-zinc-400 rounded-2xl cursor-pointer font-bold"
        onClick={()=> navigate("/")}
        >Bact To Home</button>
      </div>
    </div>
  );
}
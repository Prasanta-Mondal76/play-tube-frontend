import { Home } from "lucide-react"
import { useNavigate } from "react-router-dom";
export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-night-950 text-white px-4">
      <div className="text-center">
        <h1 className="text-7xl sm:text-8xl font-black ember-text animate-fade-up">404</h1>

        <p className="mt-4 text-xl text-zinc-400">
          Page Not Found
        </p>

        <button
        className="ember-gradient shadow-lg shadow-ember/30 text-white hover:brightness-110 mt-6 px-8 py-3 text-lg rounded-full cursor-pointer font-bold transition active:scale-[0.98]"
        onClick={()=> navigate("/")}
        >Bact To Home</button>
      </div>
    </div>
  );
}
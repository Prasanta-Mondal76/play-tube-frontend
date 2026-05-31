import { Bell, Menu, Sun, Search, UserCircle2Icon } from "lucide-react";
import logo from "../../assets/Logo.svg"
import { useNavigate } from "react-router-dom";

export function Navbar({ toggleSidebar, toggleProfile }) {
  const navigate = useNavigate()

  return (
    <header
      className="
        fixed top-0 left-0 z-50
        h-16 w-full
        border-b border-zinc-800
        bg-black
      "
    >
      <div className="flex h-full items-center justify-between px-3 md:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MENU BUTTON */}
          <button
            onClick={toggleSidebar}
            className="rounded-full p-2 hover:bg-zinc-800 transition cursor-pointer"
          >
            <Menu className="h-6 w-6 text-white " />
          </button>

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <img src={logo} alt="Logo" className="rounded-full" />
            </div>
            <h1 className="hidden sm:block text-2xl font-bold text-white">
              PlayTube
            </h1>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mx-4 hidden max-w-2xl flex-1 md:flex">
          <div className="flex h-11 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-950">
            <input
              type="text"
              placeholder="Search creators, topics, categories..."
              className="flex-1 bg-transparent px-5 text-white outline-none placeholder:text-zinc-500"
            />
            <button className="flex w-20 items-center justify-center border-l border-zinc-800 bg-zinc-900 hover:bg-zinc-800 cursor-pointer">
              <Search className="h-5 w-5 text-zinc-300" />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* MOBILE SEARCH */}
          <button className="rounded-full p-2 hover:bg-zinc-800 md:hidden cursor-pointer">
            <Search className="h-5 w-5 text-white " />
          </button>

          {/* THEME — Sun icon */}
          <button className="rounded-full p-2 hover:bg-zinc-800 cursor-pointer">
            <Sun className="h-5 w-5 text-white " />
          </button>

          {/* NOTIFICATION */}
          <button className="relative rounded-full p-2 hover:bg-zinc-800 cursor-pointer">
            <Bell className="h-5 w-5 text-white " />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500" />
          </button>

          {/* PROFILE */}
          <button className="cursor-pointer"
            onClick={toggleProfile}
          >
            <UserCircle2Icon 
              className="h-10 w-10 rounded-full text-blue-300 object-cover " 
              strokeWidth={0.9}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

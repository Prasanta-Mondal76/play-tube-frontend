import { Bell, Menu, Sun, Search, UserCircle2Icon } from "lucide-react";
import logo from "../../assets/Logo.svg"
import { useNavigate } from "react-router-dom";
import { BoxContext } from "../../context/BoxContextProvider.jsx"
import { LoginContext } from "../../context//LoginContextProvider.jsx"
import { useContext, useState } from "react";

export function Navbar() {
  const navigate = useNavigate()
  const {
    isSidebarOpen, setIsSidebarOpen,
    isProfileOpen, setIsProfileOpen
  } = useContext(BoxContext)

  const { isLogIn, user } = useContext(LoginContext)
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header
      className="
        fixed top-0 left-0 z-50
        h-16 w-full
        border-b border-white/5
        glass-bar
      "
      onClick={() => {
        isProfileOpen ? setIsProfileOpen(false) : null
        isSidebarOpen ? setIsSidebarOpen(false) : null
      }}
    >
      <div className="flex h-full items-center justify-between px-3 md:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MENU BUTTON */}
          <button
            onClick={() => {
              setIsProfileOpen(false)
              setIsSidebarOpen(!isSidebarOpen)
            }}
            className="rounded-full p-2 hover:bg-night-700 transition cursor-pointer"
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
            <h1 className="hidden sm:block text-2xl font-black tracking-tight text-white">
              Play<span className="ember-text">Tube</span>
            </h1>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mx-4 hidden max-w-2xl flex-1 md:flex">
          <div
            className="
              flex h-12 w-full overflow-hidden
              rounded-full
              border border-line
              bg-night-850
              shadow-lg shadow-black/20
              transition-all duration-200
              focus-within:border-ember
              focus-within:ring-2
              focus-within:ring-ember/25
            " >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search creators, topics, categories..."
              className="flex-1 bg-transparent px-5 text-white outline-none placeholder:text-zinc-500"
            />
            <button onClick={handleSearch} className="flex items-center justify-center w-14 bg-night-700 hover:ember-gradient transition-all duration-200 cursor-pointer">
              <Search className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* MOBILE SEARCH */}
          <button className="rounded-full p-2 hover:bg-night-700 md:hidden cursor-pointer">
            <Search className="h-5 w-5 text-white " />
          </button>

          {/* THEME — Sun icon 
          <button className="rounded-full p-2 hover:bg-zinc-800 cursor-pointer hover:cursor-not-allowed">
            <Sun className="h-5 w-5 text-white " />
          </button>

           NOTIFICATION 
          <button className="relative rounded-full p-2 hover:bg-zinc-800 cursor-pointer">
            <Bell className="h-5 w-5 text-white " />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ember" />
          </button> */}

          {/* PROFILE */}
          <button className="cursor-pointer rounded-full"
            onClick={() => {
              setIsSidebarOpen(false)
              setIsProfileOpen(!isProfileOpen)
            }}
          >
            {
              isLogIn ?
                <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-ember/60 ring-offset-2 ring-offset-black transition hover:ring-ember shrink-0">
                  <img src={user?.avatar} alt="Profile Image" className="rounded-full w-10 h-10 object-cover" />
                </div>
                :
                <UserCircle2Icon
                  className="h-10 w-10 rounded-full text-ember-soft object-cover "
                  strokeWidth={0.9}
                />
            }
          </button>
        </div>
      </div>
    </header>
  );
}

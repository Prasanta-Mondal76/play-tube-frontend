import { Home, History, Users, ListVideo, X, Zap } from "lucide-react";
import { useState, useContext  } from "react"
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContextProvider";
import { BoxContext } from "../../context/BoxContextProvider";
import logo from "../../assets/Logo.svg"

const navItems = [
  { icon: Home, label: "Home", isProtected: false },
  { icon: History, label: "History", isProtected: true },
  { icon: Users, label: "Subscriptions", isProtected: true },
  { icon: ListVideo, label: "Playlists", isProtected: true },
];

// Subscribed Channel lists of user. 
const favoriteChannels = [
  { name: "CodeCraft Studios", avatar: "https://i.pravatar.cc/100?img=11" },
  { name: "Wandering Soul", avatar: "https://i.pravatar.cc/100?img=5" },
  { name: "SoundWave Beats", avatar: "https://i.pravatar.cc/100?img=33" },
];

export function Sidebar() {
  const navigate = useNavigate()

  const [activeLabel, setActiveLabel] = useState("Home");
  const { isLogIn } = useContext(LoginContext);
  const { setIsLoginBoxOpen, isSidebarOpen, setIsSidebarOpen } = useContext(BoxContext)

  function handleNavClick(label, isProtected) {
    // if protected and not logged in
    if (isProtected && !isLogIn) {
      setIsSidebarOpen(false)          // sidebar close
      setIsLoginBoxOpen(true)   // open auth popup
      return;
    }

    // user logged in OR route public
    setActiveLabel(label);
    navigate("/")
  }

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false) }
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-full w-72
          bg-zinc-950
          border-r border-zinc-800
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center ">
              <img src={logo} alt="Logo" className="rounded-full" />
            </div>
            <h1 className="text-xl font-bold text-white">PlayTube</h1>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false) }
            className="rounded-full p-2 hover:bg-zinc-800 transition"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>

        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">

          {/* Nav Items */}
          {navItems.map(({ icon: Icon, label, active, isProtected }) => (
            <button
              key={label}
              className={`
                flex items-center gap-4 w-full px-4 py-3 rounded-xl
                text-sm font-medium transition-all duration-200 cursor-pointer
                ${activeLabel === label
                  ? "bg-violet-600/20 text-white border-l-4 border-violet-500 pl-3"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              `}
              onClick={() => handleNavClick(label, isProtected)}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active ? "text-violet-400" : ""}`} />
              {label}
            </button>
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-zinc-800" />

          {/* Favorites Channels */}
          <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Favorites Channels
          </p>

          {favoriteChannels.map(({ name, avatar }) => (
            <button
              key={name}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-200"
            >
              <img
                src={avatar}
                alt={name}
                className="h-8 w-8 rounded-full object-cover border border-zinc-700"
              />
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>

        {/* Premium Access Card */}
        <div className="m-3 mt-0 shrink-0">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-violet-400" />
              <p className="text-sm font-semibold text-white">Premium Access</p>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Unlock offline viewing and more perks.
            </p>
            <button className="w-full rounded-xl bg-white text-black text-sm font-semibold py-2 hover:bg-zinc-200 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

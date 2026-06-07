import { Home, VideoIcon, UserRoundCog, ListVideo, X, LucideUsers2, ClipboardList } from "lucide-react";
import { useState, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../../context/LoginContextProvider";
import { BoxContext } from "../../context/BoxContextProvider";
import logo from "../../assets/Logo.svg"

const navItems = [
  { icon: ClipboardList, label: "Overview", path: "/creator/dashboard/overview" },
  { icon: UserRoundCog, label: "Channel", path: "/creator/dashboard/channel" },
  { icon: LucideUsers2, label: "Subscribers", path: "/creator/dashboard/subscribers" },
];


export function DashSidebar() {
  const navigate = useNavigate()
  const location = useLocation();

  const { isLogIn } = useContext(LoginContext);
  const { isDashSidebarOpen, setIsDashSidebarOpen } = useContext(BoxContext)


  function handleNavClick(path) {
    setIsDashSidebarOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* Backdrop */}
      {isDashSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDashSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-72
          bg-zinc-950
          border-r border-zinc-800
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isDashSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 hover:text-white hover:rounded-md"
            onClick={() => navigate("/")}
          >
            <div className="flex h-9 w-9 items-center justify-center ">
              <Home className="h-5 w-5 text-zinc-400" />
            </div>
            <h2 className="text-xl font-bold text-white p-2"> Back To Home </h2>
          </div>

          <button
            onClick={() => setIsDashSidebarOpen(false)}
            className="rounded-full p-2 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>

        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">

          {/* Nav Items */}
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-violet-600/20 text-white border-l-4 border-violet-500 pl-3"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }
                `}
                onClick={() => handleNavClick(path)}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-violet-400" : ""}`} />
                {label}
              </button>
            );
          })}

        </div>
      </aside>
    </>
  );
}

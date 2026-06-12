import {
  Home,
  X,
  UserCog,
  ImageIcon,
  ShieldCheck,
  History,
  TriangleAlert,
} from "lucide-react";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BoxContext } from "../../context/BoxContextProvider";

const navItems = [
  { icon: UserCog,       label: "Account",          path: "/settings/account" },
  { icon: ImageIcon,     label: "Profile",           path: "/settings/profile" },
  { icon: ShieldCheck,   label: "Security",          path: "/settings/security" },
  { icon: History,       label: "History & Activity",path: "/settings/history" },
  { icon: TriangleAlert, label: "Danger Zone",       path: "/settings/danger-zone", danger: true },
];

export function SettingsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSettingsSidebarOpen, setIsSettingsSidebarOpen } = useContext(BoxContext);

  function handleNavClick(path) {
    setIsSettingsSidebarOpen(false);
    navigate(path);
  }

  return (
    <>
      {/* Backdrop */}
      {isSettingsSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSettingsSidebarOpen(false)}
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
          ${isSettingsSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800 shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 hover:text-white hover:rounded-md"
            onClick={() => { setIsSettingsSidebarOpen(false); navigate("/"); }}
          >
            <div className="flex h-9 w-9 items-center justify-center">
              <Home className="h-5 w-5 text-zinc-400" />
            </div>
            <h2 className="text-xl font-bold text-white p-2">Back To Home</h2>
          </div>

          <button
            onClick={() => setIsSettingsSidebarOpen(false)}
            className="rounded-full p-2 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Settings
          </p>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, path, danger }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => handleNavClick(path)}
                className={`
                  flex items-center gap-4 w-full px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${danger
                    ? isActive
                      ? "bg-red-600/20 text-red-400 border-l-4 border-red-500 pl-3"
                      : "text-red-500/70 hover:bg-red-600/10 hover:text-red-400"
                    : isActive
                      ? "bg-violet-600/20 text-white border-l-4 border-violet-500 pl-3"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    danger
                      ? isActive ? "text-red-400" : "text-red-500/70"
                      : isActive ? "text-violet-400" : ""
                  }`}
                />
                {label}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
import { useState, useEffect, useContext } from "react"
import { LogIn, LogOut, User, Settings, HelpCircle, LayoutDashboardIcon, MessageCircleMore } from "lucide-react"
import { LoginContext } from "../../context/LoginContextProvider"
import { BoxContext } from "../../context/BoxContextProvider"
import { logoutUser } from "../../services/authApi"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Tids } from "../../utils/toastId"

export function ProfileBox() {
  const navigate = useNavigate()
  const { user, setUser, isLogIn, setIsLogIn } = useContext(LoginContext)
  const { 
    isProfileOpen, setIsProfileOpen, 
    setIsLoginBoxOpen,
    setIsSidebarOpen
   } = useContext(BoxContext)

  function openSignIn() {
    setIsLoginBoxOpen(true)
  }

  async function handleLogout() {
    try {
      await logoutUser();

      // Local state clear
      setUser(null);
      setIsLogIn(false);

      // Profile dropdown close
      setIsProfileOpen(false);

      toast.success("See you again soon!", {id: Tids.auth})
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data || error.message
      );
      toast.error("Logout failed. Try again.", { id: Tids.error });
    }
  }

  // Profile - Onclick 
  function handelProfileClick(){
    navigate(`/profile/${user.username}`) 
    setIsProfileOpen(false)
  }
  // Dashboard - Onclick
  function handelDashboard(){
    setIsProfileOpen(false)
    setIsSidebarOpen(false)
    navigate("/creator/dashboard/overview")
  }
  // Messenger - Onclick
  function handelMessenger(){
    setIsProfileOpen(false)
    setIsSidebarOpen(false)
    navigate("/messenger")
  }
  // Settings - onClick
  function handelSettingsClick(){
    setIsProfileOpen(false)
    setIsSidebarOpen(false)
    navigate("/settings")
  }
  // Help & Support - onClick 
  function handelSupportClick(){
    setIsProfileOpen(false)
    setIsSidebarOpen(false)
    navigate("/support")
  }

  return (
    <>
      {/* Blur backdrop */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Dropdown Panel */}
      <div
        className={`
          fixed top-16 right-4 z-50
          w-72
          bg-zinc-950
          border-2 border-blue-300
          rounded-2xl
          shadow-xl shadow-black/50
          flex flex-col overflow-hidden
          transform transition-all duration-300 ease-out
          origin-top-right
          ${isProfileOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {isLogIn ? (
          /* ── LOGGED IN STATE ── */
          <>
            {/* User Info Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-full to-blue-500 shrink-0">
                <img src={user.avatar} alt="Profile Image" className="rounded-full w-10 h-10 object-cover" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user?.fullName ?? "User"}
                </p>
                <p className="text-zinc-400 text-xs truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col py-2 px-2 gap-1">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-blue-400 hover:text-white transition-all duration-150 text-left cursor-pointer"
              onClick={ handelProfileClick}
              >
                <User className="h-4 w-4 shrink-0 text-zinc-300 " />
                View Profile
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-blue-400 hover:text-white transition-all duration-150 text-left cursor-pointer"
              onClick={ handelDashboard}
              >
                <LayoutDashboardIcon className="h-4 w-4 shrink-0 text-zinc-300 " />
                Dashboard
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-blue-400 hover:text-white transition-all duration-150 text-left cursor-pointer"
              onClick={ handelMessenger }
              >
                <MessageCircleMore className="h-4 w-4 shrink-0 text-zinc-300 " />
                Messenger
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-blue-400 hover:text-white transition-all duration-150 text-left cursor-pointer"
              onClick={ handelSettingsClick }
              >
                <Settings className="h-4 w-4 shrink-0 text-zinc-300 " />
                Settings
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-blue-400 hover:text-white transition-all duration-150 text-left cursor-pointer"
              onClick={ handelSupportClick }
              >
                <HelpCircle className="h-4 w-4 shrink-0 text-zinc-300 " />
                Help & Support
              </button>
            </div>

            {/* Logout */}
            <div className="px-2 pb-2 border-t border-zinc-800 pt-2">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Log Out
              </button>
            </div>
          </>
        ) : (
          /* ── LOGGED OUT STATE ── */
          <>
            <div className="flex flex-col items-center gap-3 px-5 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
                <User className="h-7 w-7 text-zinc-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Welcome to PlayTube</p>
                <p className="text-zinc-400 text-xs mt-1">Sign in to access your profile, history, and playlists.</p>
              </div>
              <button className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 transition-all duration-150 cursor-pointer"
                onClick={() => {
                  setIsProfileOpen(false)
                  openSignIn()
                }}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
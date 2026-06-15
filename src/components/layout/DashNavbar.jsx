import { Menu, Sun, UserCircle2Icon, Bell } from "lucide-react";
import logo from "../../assets/Logo.svg"
import { useNavigate, useLocation } from "react-router-dom";
import { BoxContext } from "../../context/BoxContextProvider.jsx"
import { LoginContext } from "../../context/LoginContextProvider.jsx"
import { useContext, useState } from "react";

export function DashNavbar() {
  const navigate = useNavigate()

  const { isLogIn, user } = useContext(LoginContext)
  const {
    isDashSidebarOpen, setIsDashSidebarOpen,
    isProfileOpen, setIsProfileOpen
  } = useContext(BoxContext)

  // Page Title 
  const routeTitles = {
    "/creator/dashboard": "Overview",
    "/creator/dashboard/overview": "Overview",
    "/creator/dashboard/channel": "Channel",
    "/creator/dashboard/videos": "Videos",
    "/creator/dashboard/playlist": "Playlist",
    "/creator/dashboard/subscribers": "Subscribers",
  };
  const pageTitle = routeTitles[useLocation().pathname] || "Dashboard";

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
            onClick={() => {
              setIsProfileOpen(false)
              setIsDashSidebarOpen(!isDashSidebarOpen)
            }}
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

        {/* PAGE TITLE */}
        <div className="absolute left-1/2 -translate-x-1/2 ">
          <h1 className="md:text-2xl font-bold shadow-2xl 
          ">
            {pageTitle}
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* THEME — Sun icon
          <button className="rounded-full p-2 hover:bg-zinc-800 cursor-pointer">
            <Sun className="h-5 w-5 text-white " />
          </button>

           NOTIFICATION 
          <button className="relative rounded-full p-2 hover:bg-zinc-800 cursor-pointer">
            <Bell className="h-5 w-5 text-white " />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500" />
          </button> */}

          {/* PROFILE */}
          <button className="cursor-pointer"
            onClick={() => {
              setIsDashSidebarOpen(false)
              setIsProfileOpen(!isProfileOpen)
            }}
          >
            {
              isLogIn ?
                <div className="flex h-10 w-10 items-center justify-center rounded-full to-blue-500 shrink-0">
                  <img src={user?.avatar} alt="Profile Image" className="rounded-full w-10 h-10 object-cover" />
                </div>
                :
                <UserCircle2Icon
                  className="h-10 w-10 rounded-full text-blue-300 object-cover "
                  strokeWidth={0.9}
                />
            }
          </button>
        </div>
      </div>
    </header>
  );
}

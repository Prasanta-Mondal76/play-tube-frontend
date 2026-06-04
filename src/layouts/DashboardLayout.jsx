import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { DashNavbar } from "../components/layout/DashNavbar";
import { DashSidebar } from "../components/layout/DashSidebar";
import { ProfileBox } from "../components/user/ProfileBox";

import { BoxContext } from "../context/BoxContextProvider";
import { LoginContext } from "../context/LoginContextProvider";

export function DashboardLayout() {
  const navigate = useNavigate()
  const { setIsSidebarOpen } = useContext(BoxContext)
  const { isLogIn } = useContext(LoginContext)

  // In Dashboard, we never show or open MainLayout Sidebar
  setIsSidebarOpen(false)

  return (
    !isLogIn ?
      <div className="flex flex-col gap-8 bg-zinc-800 justify-center items-center w-full min-h-screen">
        <h2 className="font-bold text-white text-3xl text-center">
          Login Required
        </h2>

        <button
          className="bg-blue-600 text-2xl cursor-pointer px-6 py-3 rounded-xl text-white hover:bg-blue-700 transition-all"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
      :
      <div className="h-screen bg-black text-white flex flex-col">

        <DashNavbar />

        <div className="flex flex-1 overflow-hidden">

          <DashSidebar />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">

            <Outlet />

          </main>

          {/* Profile Box Content */}
          <ProfileBox />


        </div>

      </div>
  );
}
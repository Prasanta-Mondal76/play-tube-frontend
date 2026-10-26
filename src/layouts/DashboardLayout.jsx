import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { DashNavbar } from "../components/layout/DashNavbar.jsx";
import { DashSidebar } from "../components/layout/DashSidebar.jsx";
import { ProfileBox } from "../components/user/ProfileBox.jsx";

import { BoxContext } from "../context/BoxContextProvider.jsx";
import { LoginContext } from "../context/LoginContextProvider.jsx";

export function DashboardLayout() {
  const navigate = useNavigate()
  const { setIsSidebarOpen } = useContext(BoxContext)
  const { isLogIn, authLoading } = useContext(LoginContext)

  // In Dashboard, we never show or open MainLayout Sidebar
  setIsSidebarOpen(false)

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ember/25 border-t-ember" />
      </div>
    );
  }

  return (
    !isLogIn ?
      <div className="flex flex-col gap-8 bg-night-900 justify-center items-center w-full min-h-screen">
        <h2 className="font-bold text-white text-3xl text-center">
          Login Required
        </h2>

        <button
          className="ember-gradient shadow-lg shadow-ember/30 text-2xl cursor-pointer px-8 py-3 rounded-full text-white hover:brightness-110 transition-all"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
      :
      <div className="h-screen bg-night-950 text-white flex flex-col">

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
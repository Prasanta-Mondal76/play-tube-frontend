import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContextProvider.jsx";
import { BoxContext } from "../context/BoxContextProvider.jsx";
import { SettingsNavbar } from "../components/layout/SettingsNavbar.jsx";
import { SettingsSidebar } from "../components/layout/SettingsSidebar.jsx";
import { ProfileBox } from "../components/user/ProfileBox.jsx"


export function SettingsLayout() {
  const { isLogIn, authLoading } = useContext(LoginContext);
  const { setIsSidebarOpen, setIsDashSidebarOpen } = useContext(BoxContext)
  const navigate = useNavigate()

  // Close Other sidebar 
  setIsDashSidebarOpen(false)
  setIsSidebarOpen(false)

  if (authLoading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}

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
      <div className="min-h-screen bg-zinc-950 text-white">
        <SettingsNavbar />
        <SettingsSidebar />

        {/* Page content — pushed down by navbar height */}
        <main className="pt-16">
          <Outlet />
        </main>

        {/* Profile Box Content */}
        <ProfileBox />

      </div>
  );
}
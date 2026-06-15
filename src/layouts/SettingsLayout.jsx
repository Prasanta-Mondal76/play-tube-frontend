import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContextProvider";
import { SettingsNavbar } from "../components/layout/SettingsNavbar";
import { SettingsSidebar } from "../components/layout/SettingsSidebar";
import { ProfileBox } from "../components/user/ProfileBox"


export function SettingsLayout() {
  const { isLogIn } = useContext(LoginContext);

  // Redirect unauthenticated users
  if (!isLogIn) return <Navigate to="/login" replace />;

  return (
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
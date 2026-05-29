import { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { Profile } from "../components/user/Profile"
import { AuthPage } from "../components/auth/AuthPage"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

export function MainLayout({ children }) {

  // Sidebar Toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }
  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  // Profile Toggle
  const [isProfileOpen, seIsProfileOpen] = useState(false)
  function toggleProfile() {
    seIsProfileOpen((prev) => !prev)
  }
  function closeProfile() {
    seIsProfileOpen(false)
  }

  // Auth Page Toggle
  const {isAuthOpen, setIsAuthOpen} = useContext(AuthContext);

  return (
    <div className="bg-black min-h-screen">

      {/* NAVBAR */}
      <Navbar
        toggleSidebar={toggleSidebar}
        toggleProfile={toggleProfile}
      />

      {/* SIDEBAR — overlay, controlled by isOpen */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* MAIN CONTENT */}
      <main className="pt-16">
        {children}
      </main>

      {/* Profile Toggle Content */}
      <Profile isProfileOpen={isProfileOpen} closeProfile={closeProfile} />

      {/* AUTH MODAL */}
      {
        isAuthOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setIsAuthOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <AuthPage onClose={() => setIsAuthOpen(false)} />
            </div>
          </div>
        )
      }
    </div>
  );
}

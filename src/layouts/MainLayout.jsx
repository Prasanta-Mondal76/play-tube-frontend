import { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { Profile } from "../components/layout/Profile"

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
  const[isProfileOpen, seIsProfileOpen] = useState(false)
  function toggleProfile (){
    seIsProfileOpen((prev) => !prev)
  }
  function closeProfile(){
    seIsProfileOpen(false)
  }

  return (
    <div className="bg-black min-h-screen">

      {/* NAVBAR */}
      <Navbar 
        toggleSidebar={toggleSidebar} 
        toggleProfile = {toggleProfile}
      />

      {/* SIDEBAR — overlay, controlled by isOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* MAIN CONTENT */}
      <main className="pt-16">
        {children}
      </main>

      {/* Profile Toggle Content */}
      <Profile isProfileOpen = {isProfileOpen} closeProfile = {closeProfile} />
    </div>
  );
}

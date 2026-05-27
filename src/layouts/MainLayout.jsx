import { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";

export function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="bg-black min-h-screen">

      {/* NAVBAR */}
      <Navbar 
        toggleSidebar={toggleSidebar} 

      />

      {/* SIDEBAR — overlay, controlled by isOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* MAIN CONTENT */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

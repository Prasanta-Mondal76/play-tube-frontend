import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { ProfileBox } from "../components/user/ProfileBox"
import { AuthPage } from "../components/auth/AuthPage"
import { useContext } from "react";
import { BoxContext } from "../context/BoxContextProvider";

export function MainLayout() {

  const {
    isLoginBoxOpen,setIsLoginBoxOpen
  } = useContext(BoxContext)

  return (
    <div className="bg-black min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* SIDEBAR — overlay, controlled by isOpen */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Profile Box Content */}
      <ProfileBox />

      {/* AUTH MODAL */}
      {
        isLoginBoxOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setIsLoginBoxOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <AuthPage onClose={() => setIsLoginBoxOpen(false)} />
            </div>
          </div>
        )
      }
    </div>
  );
}

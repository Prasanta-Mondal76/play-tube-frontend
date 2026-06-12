import { createContext, useState } from "react"


// Auth means : Login Page and SignUp page is open or not. 
export const BoxContext = createContext()

export function BoxProvider({ children }) {

  // Login Box Open / Close
  const [isLoginBoxOpen, setIsLoginBoxOpen] = useState(false)

  // Peofile Box Open / Close
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Sidebar Open / Close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Dashboard Sidebar Open / Close
  const [isDashSidebarOpen, setIsDashSidebarOpen] = useState(false)

  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false);

  return (

    <BoxContext.Provider
      value={{
        isLoginBoxOpen,
        setIsLoginBoxOpen,
        isProfileOpen,
        setIsProfileOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        isDashSidebarOpen,
        setIsDashSidebarOpen,
        isSettingsSidebarOpen,
        setIsSettingsSidebarOpen
      }}
    >

      {children}

    </BoxContext.Provider>

  )
}
import { createContext, useState } from "react"


// Auth means : Login Page and SignUp page is open or not. 
export const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (

    <AuthContext.Provider
      value={{
        isAuthOpen,
        setIsAuthOpen
      }}
    >

      {children}

    </AuthContext.Provider>

  )
}
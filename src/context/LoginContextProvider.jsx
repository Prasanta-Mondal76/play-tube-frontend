import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Tids } from "../utils/toastId"

import { createContext } from "react"
import { getLoginStats } from "../services/userApi"

export const LoginContext = createContext()

export function LoginProvider({ children }) {
  const [isLogIn, setIsLogIn] = useState(false)
  const [user, setUser] = useState(null)

  async function checkLogin() {
    try {
      const response = await getLoginStats()
      const loggedUser = response.data.data?.user
      setIsLogIn(response.data.data.loggedIn)
      setUser(loggedUser)
    } catch (error) {
      console.error("Request failed:", error)
      toast.error("Login failed. Please try again.", { id: Tids.error })
    }
  }
  useEffect(() => {
    if (!isLogIn) checkLogin()
  }, [])

  return (
    <LoginContext.Provider
      value={{
        user,
        setUser,
        isLogIn,
        setIsLogIn
      }}

    >
      {children}
    </LoginContext.Provider>
  )
}
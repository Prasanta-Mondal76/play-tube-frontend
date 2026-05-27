import { LoginContext } from "./LoginContext"
import { useEffect, useState } from "react"
import axios from "axios"

export function LoginProvider({children}){
  const [isLogIn, setIsLogIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get("/api/v1/users/login-stats")
      .then((res) => {
        setIsLogIn(res.data.data.loggedIn)
        setUser(res.data.data?.user)

        // setUser({ username: "pm123", fullName: "Prasanta Mondal", email: "abc@gmail.com", avatar: "https://i.pravatar.cc/100?img=11s" })
        // setIsLogIn(true)
      })
      .catch((error) => {
        console.error("Request failed:", error)
      })
  }, [])

  return (
    <LoginContext.Provider 
      value={{
        user,
        isLogIn
      }}
    
    >
      {children}
    </LoginContext.Provider>
  )
}
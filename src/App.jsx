import { useState } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { VideoGrid } from "./components/video/VideoGrid"
import { LoginProvider } from "./context/LoginContextProvider"
import { AuthProvider } from './context/AuthContextProvider'
function App() {
  return (
    <LoginProvider>
      <AuthProvider>

        <MainLayout children={<VideoGrid />} />

      </AuthProvider>
    </LoginProvider>
  )
}

export default App
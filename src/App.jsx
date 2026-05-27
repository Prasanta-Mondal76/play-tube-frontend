import { useState } from 'react'
import { MainLayout } from './layouts/MainLayout'
import {VideoGrid} from "./components/VideoGrid"
import { LoginProvider } from "./context/LoginProvider"

function App() {
  return (
    <>
      <LoginProvider>

        <MainLayout children={<VideoGrid />}/>
        
      </LoginProvider>
    </>
  )
}

export default App
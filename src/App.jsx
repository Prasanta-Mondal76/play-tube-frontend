import { useState } from 'react'
import { MainLayout } from './layouts/MainLayout'
import {VideoGrid} from "./components/VideoGrid"
function App() {
  return (
    <>
      <MainLayout children={<VideoGrid />}/>
    </>
  )
}

export default App
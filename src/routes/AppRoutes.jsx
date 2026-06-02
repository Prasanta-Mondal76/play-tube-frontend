import { Route, Routes } from "react-router-dom"
import { Home, VideoPlay, Profile } from "../pages/index"
import { MainLayout } from "../layouts/MainLayout"

export function AppRoutes() {

  return (
    <Routes>

      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/watch/:videoId"
        element={
          <MainLayout>
            <VideoPlay />
          </MainLayout>
        }
      />

      {/* PROFILE PAGE */}
      <Route
        path="/profile/:username"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />

    </Routes>
  );
}

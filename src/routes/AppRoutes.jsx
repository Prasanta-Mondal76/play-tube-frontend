import { Route, Routes } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { DashboardLayout } from "../layouts/DashboardLayout";
import {
  Home, 
  VideoPlay, 
  Profile,
  DashOverview,
  DashChannel,
  DashVideos,
  DashPlaylists,
  DashSubscribers,
  History,
  Subscriptions,


  NotFound
} from "../pages/index";


export function AppRoutes() {

  return (
    <Routes>

      {/* Website  */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/watch/:videoId" element={<VideoPlay />} />

        {/* PROFILE PAGE */}
        <Route path="/profile/:username" element={<Profile />} />

        <Route path="/history" element = {<History />} />

        <Route path="/subscriptions" element = {<Subscriptions />} />

      </Route>


      {/* Dashboard */}
      <Route path="/creator/dashboard" element={<DashboardLayout />}>

        <Route path="overview" element={<DashOverview />} />

        <Route path="channel" element={<DashChannel />} />

        <Route path="videos" element={<DashVideos />} />

        <Route path="playlists" element={<DashPlaylists />} />

        <Route path="subscribers" element={<DashSubscribers />} />

      </Route>


      {/* Any Wrong Path */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

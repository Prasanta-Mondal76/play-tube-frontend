import { Route, Routes } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { DashboardLayout } from "../layouts/DashboardLayout";
import {
  Home, 
  VideoPlay, 
  Profile,
  DashOverview,
  DashChannel,
  DashSubscribers,
  History,
  Subscriptions,
  UpdateProfile,
  Playlist,


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

        <Route path="/playlists" element={<Playlist />} />


        <Route path="/settings/update" element = {<UpdateProfile />} />

      </Route>


      {/* Dashboard */}
      <Route path="/creator/dashboard" element={<DashboardLayout />}>

        <Route path="overview" element={<DashOverview />} />

        <Route path="channel" element={<DashChannel />} />

        <Route path="subscribers" element={<DashSubscribers />} />

      </Route>


      {/* Any Wrong Path */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Route, Routes, Navigate } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { DashboardLayout } from "../layouts/DashboardLayout";
import { SettingsLayout } from "../layouts/SettingsLayout"
import {
  Home,
  VideoPlay,
  Profile,
  DashOverview,
  DashChannel,
  DashSubscribers,
  History,
  Subscriptions,
  Playlist,
  SettingsAccount,
  SettingsDangerZone,
  SettingsHistory,
  SettingsProfile,
  SettingsSecurity,
  ConfirmDeleteAccount,
  CancelDeleteAccount,

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

        <Route path="/history" element={<History />} />

        <Route path="/subscriptions" element={<Subscriptions />} />

        <Route path="/playlists" element={<Playlist />} />

      </Route>

      <Route path="/settings" element={<SettingsLayout />}>
        {/* Default redirect: /settings → /settings/account */}
        <Route index element={<Navigate to="account" replace />} />
        <Route path="account" element={<SettingsAccount />} />
        <Route path="profile" element={<SettingsProfile />} />
        <Route path="security" element={<SettingsSecurity />} />
        <Route path="history" element={<SettingsHistory />} />
        <Route path="danger-zone" element={<SettingsDangerZone />} />
      </Route>

      {/* Dashboard */}
      <Route path="/creator/dashboard" element={<DashboardLayout />}>

        <Route path="overview" element={<DashOverview />} />

        <Route path="channel" element={<DashChannel />} />

        <Route path="subscribers" element={<DashSubscribers />} />

      </Route>


      <Route path="/delete-account/confirm/:token" element={<ConfirmDeleteAccount />} />
      <Route path="/delete-account/cancel/:token" element={<CancelDeleteAccount />} />

      {/* Any Wrong Path */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Route, Routes, Navigate } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout.jsx"
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { SettingsLayout } from "../layouts/SettingsLayout.jsx"
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
  HelpAndSupport,
  SearchResults,
  Messenger,

  NotFound
} from "../pages/index.jsx";


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

        <Route path="/search" element={<SearchResults />} />

        <Route path="/messenger" element={<Messenger />} />
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

      <Route path="/support" element={<HelpAndSupport />} />

      <Route path="/delete-account/confirm/:token" element={<ConfirmDeleteAccount />} />
      <Route path="/delete-account/cancel/:token" element={<CancelDeleteAccount />} />

      {/* Any Wrong Path */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Route } from "react-router-dom"

import ProfileSettings from "./pages.jsx/Profile_Setting"
import SecuritySettings from "./pages.jsx/Security_Settings"
import SettingsHome from "./pages.jsx/settingsHome";
import SettingsLayout from "./pages.jsx/layout";
import Notification_Settings from "./pages.jsx/Notification_Settings";
import IntegrationsSettings from "./pages.jsx/Integrationsetting";


export const settingsRoutes = (
  <Route element={<SettingsLayout />}>
    <Route index element={<SettingsHome />} />
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="security" element={<SecuritySettings />} />
    <Route path="notifications" element={<Notification_Settings />} />
    <Route path="integrations" element={<IntegrationsSettings />} />
  </Route>
);
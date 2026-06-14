import PlatformDashboard from "./dashboard/Dashboard";
import { Route } from "react-router-dom";

export const platformRoutes = (
  <>
    <Route path="dashboard" element={<PlatformDashboard />} />
  </>
);
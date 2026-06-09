  import TenantLayout from "../../layouts/Tanent_layout";
  import WorkspacesPage from "./company/pages/WorkSpacePage";
  import TenantDashboard from "./dashboard/Dashboard";
  import { Route } from "react-router-dom";
  import { employeeRoutes } from "./emplyees/router";
  import { departmentRoutes } from "./deaprtment/router";
  import { roleRoutes } from "./Roles/pages/router";
  import { settingsRoutes } from "../settings/routes";
  import ChatPage from "./chat/pages/chatPage";
import { meetingRoutes } from "./meetings/routes";
import {attendanceRoutes} from "./attendance/router"
import { attendanceSetupRoutes } from "./attendance-setup/routes";


 export const tenantRoutes = (
  <>
    <Route path="dashboard" element={<TenantDashboard />} />
    <Route path="workspace" element={<WorkspacesPage />} />
    
    <Route path="chat">
      <Route index element={<ChatPage />} />
      <Route path=":conversationId" element={<ChatPage />} />
    </Route>

    {meetingRoutes}
    
    {/* 🆕 ATTENDANCE — Phase 1 Navigation Foundation */}
    {attendanceRoutes}
    {attendanceSetupRoutes}


    {settingsRoutes}
    {employeeRoutes}
    {departmentRoutes}
    {roleRoutes}
  </>
);
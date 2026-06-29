import React from "react";
import { Route } from "react-router-dom";

import AttendanceLayout from "./layouts/AttendanceLayout";

import AttendanceDashboardPage from "./pages/AttendanceDashboardPage";
import CalendarPage from "./pages/CalendarPage";
import MyAttendancePage from "./pages/MyAttendancePage";
import TeamAttendancePage from "./pages/TeamAttendancePage";
import RequestsPage from "./pages/RequestsPage";
import LeavesPage from "./pages/LeavesPage";
import ReportsPage from "./pages/ReportsPage";

// Core Flat Biometric Pages
import FaceEnrollmentPage from "./pages/FaceEnrollmentPage";
import FaceEnrollmentManagementPage from "./pages/FaceEnrollmentManagementPage";

// Security Framework Components
import PermissionGuard from "../../auth/AuthGuard/permissionGuard"; // Adjust based on your absolute core layout path

export const attendanceRoutes = (
  <Route path="attendance" element={<AttendanceLayout />}>
    <Route index element={<AttendanceDashboardPage />} />
    <Route path="my-attendance" element={<MyAttendancePage />} />
    <Route path="team" element={<TeamAttendancePage />} />
    <Route path="requests" element={<RequestsPage />} />
    <Route path="leaves" element={<LeavesPage />} />
    <Route path="reports" element={<ReportsPage />} />
    
    {/* Employee Self-Service Biometric Face Registration */}
    <Route path="face-enrolment" element={<FaceEnrollmentPage />} />

    {/* 🆕 HR Admin Corporate Biometric Profile Management Console */}
    <Route
      path="face-management"
      element={
        <PermissionGuard permission="tenant.attendance.manage">
          <FaceEnrollmentManagementPage />
        </PermissionGuard>
      }
    />
  </Route>
);
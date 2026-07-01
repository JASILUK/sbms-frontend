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

// 🆕 Refactored Enterprise HR Attendance Management Page Layers
import HRDashboardPage from "./pages/hrManagement/HRDashboardPage";
import HRAttendanceRecordDetailPage from "./pages/HRAttendanceRecordDetailPage";

// Security Framework Components
import PermissionGuard from "../../auth/AuthGuard/permissionGuard"; 
import HREmployeeDirectoryPage from "./pages/hrManagement/HREmployeeDirectoryPage";
import HREmployeeProfilePage from "./pages/hrManagement/HREmployeeProfilePage";

export const attendanceRoutes = (
  <Route path="attendance" element={<AttendanceLayout />}>
    {/* ========================================================
        1. EMPLOYEE SELF-SERVICE ATTENDANCE PATHWAYS (PUBLIC/AUTHENTICATED)
        ======================================================== */}
    <Route index element={<AttendanceDashboardPage />} />
    <Route path="my-attendance" element={<MyAttendancePage />} />
    <Route path="team" element={<TeamAttendancePage />} />
    <Route path="requests" element={<RequestsPage />} />
    <Route path="leaves" element={<LeavesPage />} />
    <Route path="reports" element={<ReportsPage />} />

    {/* Employee Self-Service Biometric Face Registration */}
    <Route path="face-enrolment" element={<FaceEnrollmentPage />} />


    {/* ========================================================
        2. ENTERPRISE HR ADMINISTRATIVE WORKSPACE CONSOLES
        ======================================================== */}
        
    {/* HR Corporate Biometric Profile Management Console */}
    <Route
      path="face-management"
      element = {
        <PermissionGuard permission="tenant.attendance.manage">
          <FaceEnrollmentManagementPage />
        </PermissionGuard>
      }
    />

    {/* HR Admin Attendance Dashboard (Accessible by any user with a view or manage role) */}
    <Route
      path="hr/dashboard"
      element = {
        <PermissionGuard permission="tenant.attendance.manage">
          <HRDashboardPage />
        </PermissionGuard>
      }
    />

    {/* Shared Deep-Link Timeline Audit Detail Graph Page */}
    <Route
      path="hr/records/:record_id"
      element = {
        <PermissionGuard permission="tenant.attendance.manage">
          <HRAttendanceRecordDetailPage />
        </PermissionGuard>
      }
    />


    <Route
      path="hr/directory"
      element={
        <PermissionGuard permission="tenant.attendance.manage">
          <HREmployeeDirectoryPage />
        </PermissionGuard>
      }
    />

    <Route
    path="hr/profile/:membership_id"
    element={
      <PermissionGuard permission="tenant.attendance.manage">
        <HREmployeeProfilePage />
      </PermissionGuard>
    }
    />
    
  </Route>
);
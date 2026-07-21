// """
// Attendance Routes — Updated with Reports Page

// Registers the attendance module routes including the new
// Reports page under the employee portal section.
// """

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

// Refactored Enterprise HR Attendance Management Page Layers
import HRDashboardPage from "./pages/hrManagement/HRDashboardPage";
import HREmployeeDirectoryPage from "./pages/hrManagement/HREmployeeDirectoryPage";
import HREmployeeProfilePage from "./pages/hrManagement/HREmployeeProfilePage";
import HREmployeeAttendanceRecordDetailPage from "./pages/hrManagement/HRAttendanceRecordDetailPage";

// Review Queue Page
import HRReviewQueuePage from "./pages/hrManagement/HRReviewQueuePage";

// Security Framework Components
import PermissionGuard from "../../auth/AuthGuard/permissionGuard";

export const attendanceRoutes = (
  <Route path="attendance" element={<AttendanceLayout />}>
    {/* ========================================================
        1. EMPLOYEE PORTAL SELF-SERVICE CONSOLES
        ======================================================== */}
    <Route index element={<AttendanceDashboardPage />} />
    <Route path="my-attendance" element={<MyAttendancePage />} />
    <Route path="leaves" element={<LeavesPage />} />
    <Route path="face-enrolment" element={<FaceEnrollmentPage />} />

    {/* ========================================================
        2. ENTERPRISE HR ADMINISTRATIVE WORKSPACE WORKBOOKS CONSOLES
        ======================================================== */}
    <Route
      path="face-management"
      element={
        <PermissionGuard permission="tenant.attendance.manage">
          <FaceEnrollmentManagementPage />
        </PermissionGuard>
      }
    />

      <Route
      path="reports"
      element={
        <PermissionGuard permission="tenant.attendance.manage">
          <ReportsPage />
        </PermissionGuard>
      }
    />

    <Route
      path="hr/dashboard"
      element={
        <PermissionGuard permission="tenant.attendance.manage">
          <HRDashboardPage />
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

    <Route
      path="hr/records/:record_id"
      element={
        <PermissionGuard permission="tenant.attendance.view">
          <HREmployeeAttendanceRecordDetailPage />
        </PermissionGuard>
      }
    />

    <Route
      path="hr/review-queue"
      element={
        <PermissionGuard permission="tenant.attendance.manage">
          <HRReviewQueuePage />
        </PermissionGuard>
      }
    />
  </Route>
);
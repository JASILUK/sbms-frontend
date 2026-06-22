import React from 'react';
import { Route } from 'react-router-dom';

import PermissionGuard from '../../auth/AuthGuard/permissionGuard';  // Adjust path to match your structure
import AttendanceSetupLayout from './components/attendance_layout_setup';
import AttendanceSetupOverviewPage from './pages/AttendanceSetupOverviewPage';
import WorkingSchedulePage from './pages/WorkingSchedulePage';
import HolidaysPage from './pages/HolidaysPage';
import AttendancePolicyPage from './pages/AttendancePolicyPage';
import FaceEnrollmentPolicyPage from './pages/FaceEnrollmentPolicyPage'; 
import AttendanceMethodsAccessPage from './pages/AttendanceMethodsAccessPage';
import ShiftTemplatesPage from './pages/ShiftTemplatesPage';
import ShiftAssignmentsPage from './pages/ShiftAssignmentsPage';

/**
 * Finalized Route Map Matrix for the Tenant Attendance Module Setup.
 * ✅ CRITICAL REFACTOR: Entire setup layer is restricted exclusively to managers.
 */
export const attendanceSetupRoutes = (
  <Route 
    path="setup-attendance" 
    element={
      <PermissionGuard permission="tenant.attendance.manage">
        <AttendanceSetupLayout />
      </PermissionGuard>
    }
  >
    <Route index element={<AttendanceSetupOverviewPage />} />
    <Route path="working-schedules" element={<WorkingSchedulePage />} />
    <Route path="holidays" element={<HolidaysPage />} />
    
    <Route path="policies" element={<AttendancePolicyPage />} />
    <Route path="face-enrollment" element={<FaceEnrollmentPolicyPage />} />
    
    <Route path="methods" element={<AttendanceMethodsAccessPage />} />
    
    <Route path="shift-templates" element={<ShiftTemplatesPage />} />
    <Route path="shift-assignments" element={<ShiftAssignmentsPage />} />
  </Route>
);
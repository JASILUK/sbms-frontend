import { useMemo } from 'react';
import { usePermission } from '../../../../auth/usePermission'; // Adjusted relative path to your existing hook location
import { HR_PERMISSIONS } from '../../constants/hrAttendance';

export function useAttendancePermissions() {
  const { hasPermission } = usePermission();

  const permissions = useMemo(() => {
    // 1. Evaluate core infrastructure indicators
    const canManage = hasPermission(HR_PERMISSIONS.MANAGE);
    const canView = hasPermission(HR_PERMISSIONS.VIEW) || canManage; // Manage automatically inherits view capabilities

    return {
      // Basic accessibility switches
      canView,
      canManage,
      
      // Module visibility routing configurations mapping directly to the core view indicator
      canViewDashboard: canView,
      canViewDirectory: canView,
      canViewProfile: canView,
      canViewRecords: canView,
      canViewReviewQueue: canView,
      canViewReports: canView,
      
      // Destructive updates/state manipulation capabilities are locked entirely to manage clearance
      canExecuteActions: canManage,
      canExportFiles: canManage,
    };
  }, [hasPermission]);

  return permissions;
}
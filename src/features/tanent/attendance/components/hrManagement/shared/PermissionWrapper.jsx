import React from 'react';
import PropTypes from 'prop-types';
import { useAttendancePermissions } from '../../../hooks/hrAttendance/useAttendancePermissions';

export default function PermissionWrapper({ requiredPermission, fallback = null, children }) {
  const perms = useAttendancePermissions();
  
  const hasAccess = perms.isAdmin || perms.canManage || perms[requiredPermission];

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}

PermissionWrapper.propTypes = {
  requiredPermission: PropTypes.string.isRequired,
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};
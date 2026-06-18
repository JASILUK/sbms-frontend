import {
  usePermission,
} from "../../../../features/auth/usePermission";

import {
  PERMISSIONS,
} from "../../../../shared/constants/permissions";

export const useMeetingPermissions = (
  meeting = null
) => {

  const {
    hasPermission,
  } = usePermission();

  // =====================================================
  // APP LEVEL
  // =====================================================

  const canCreate =
    hasPermission(
      PERMISSIONS.MEETING.CREATE
    );

  const canView =
    hasPermission(
      PERMISSIONS.MEETING.VIEW
    );

  // =====================================================
  // MEETING LEVEL
  // =====================================================

  const canManage =
    Boolean(
      meeting?.can_manage
    );

  const canEdit =
    Boolean(
      meeting?.can_edit
    );

  const canCancel =
    Boolean(
      meeting?.can_cancel
    );

  const canStart =
    Boolean(
      meeting?.can_start_session
    );

  const canEnd =
    Boolean(
      meeting?.can_end_session
    );

  const canJoin =
    Boolean(
      meeting?.can_join
    );

  const canInvite =
    Boolean(
      meeting?.can_invite
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {

    // APP LEVEL
    canCreate,

    canView,

    // MEETING LEVEL
    canManage,

    canEdit,

    canCancel,

    canStart,

    canEnd,

    canJoin,

    canInvite,
  };
};
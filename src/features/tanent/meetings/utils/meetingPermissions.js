import { MEETING_STATUS } from "./meetingStatus";

export const canManageMeeting = (permissions, meeting) => {
  if (!permissions?.canUpdate) return false;
  if (!meeting) return false;
  if (meeting.status === MEETING_STATUS.CANCELLED) return false;
  if (meeting.status === MEETING_STATUS.COMPLETED) return false;
  return true;
};

export const canCancelMeeting = (permissions, meeting) => {
  if (!permissions?.canUpdate) return false;
  if (!meeting) return false;
  if (meeting.status === MEETING_STATUS.CANCELLED) return false;
  if (meeting.status === MEETING_STATUS.COMPLETED) return false;
  return true;
};

export const canStartSession = (permissions, meeting) => {
  if (!permissions?.canUpdate) return false;
  if (!meeting) return false;
  return [MEETING_STATUS.SCHEDULED, MEETING_STATUS.LIVE].includes(meeting.status);
};

export const canJoinSession = (meeting) => {
  if (!meeting) return false;
  return meeting.status === MEETING_STATUS.LIVE;
};

export const canEditMeeting = (permissions, meeting) => {
  if (!permissions?.canUpdate) return false;
  if (!meeting) return false;
  if (meeting.status === MEETING_STATUS.CANCELLED) return false;
  if (meeting.status === MEETING_STATUS.COMPLETED) return false;
  return true;
};

// Aliases for backward compatibility with detail page components
export const canStartMeeting = canStartSession;
export const canJoinMeeting = canJoinSession;
export const canManageParticipants = (canUpdate) => canUpdate;
export const canManageTargets = (canUpdate) => canUpdate;

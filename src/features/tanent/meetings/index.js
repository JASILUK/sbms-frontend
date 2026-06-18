// =========================================================
// FEATURE: MEETINGS — Unified Barrel Export
// Matches actual folder structure (flat detail/ components)
// =========================================================

// --- API ---
export {
  meetingsApi,
  useGetMeetingsQuery,
  useGetMeetingDetailQuery,
  useUpdateMeetingMutation,
  useCancelMeetingMutation,
  useGetMeetingParticipantsQuery,
  useAddParticipantsMutation,
  useUpdateParticipantRoleMutation,
  useRemoveParticipantMutation,
  useGetMeetingTargetsQuery,
  useAddTargetMutation,
  useUpdateTargetMutation,
  useRemoveTargetMutation,
} from "./api/meetingsApi";

// --- Pages ---
export { default as MeetingsDashboardPage } from "./pages/MeetingsDashboardPage";
export { default as MeetingDetailPage } from "./pages/MeetingDetailPage";

// --- Routes ---
export { meetingRoutes } from "./routes";

// --- Dashboard Components ---
export { default as MeetingStatusBadge } from "./components/MeetingStatusBadge";
export { default as MeetingCard } from "./components/cards/MeetingCard";
export { default as LiveMeetingCard } from "./components/cards/LiveMeetingCard";
export { default as MeetingPageHeader } from "./components/MeetingPageHeader";
export { default as MeetingFilters } from "./components/filters/MeetingFilters";
export { default as MeetingsTable } from "./components/tables/MeetingsTable";
export { default as EmptyMeetingsState } from "./components/EmptyMeetingsState";
export { default as LiveMeetingsSection } from "./components/sections/LiveMeetingsSection";
export { default as TodayMeetingsSection } from "./components/sections/TodayMeetingsSection";

// --- Detail Components (flat structure) ---
export { default as MeetingHero } from "./components/detail/MeetingHero";
export { default as MeetingStats } from "./components/detail/MeetingStats";
export { default as MeetingTabs } from "./components/detail/MeetingTabs";
export { default as OverviewTab } from "./components/detail/OverviewTab";
export { default as ParticipantsTab } from "./components/detail/ParticipantsTab";
export { default as TargetsTab } from "./components/detail/TargetsTab";
export { default as SessionTab } from "./components/detail/SessionTab";
export { default as ParticipantTable } from "./components/detail/ParticipantTable";
export { default as TargetTable } from "./components/detail/TargetTable";
export { default as SessionPanel } from "./components/detail/SessionPanel";
export { default as ParticipantStatusBadge } from "./components/detail/ParticipantStatusBadge";
export { default as RoleBadge } from "./components/detail/RoleBadge";
export { default as PresenceIndicator } from "./components/detail/PresenceIndicator";

// --- Modals ---
export { default as EditMeetingModal } from "./modals/EditMeetingModal";
export { default as AddParticipantsModal } from "./modals/AddParticipantsModal";
export { default as ManageTargetsModal } from "./modals/ManageTargetsModal";
export { default as CancelMeetingModal } from "./modals/CancelMeetingModal";
export { default as StartSessionModal } from "./modals/StartSessionModal";

// --- Hooks ---
export { useMeetingFilters } from "./hooks/useMeetingFilters";
export { useMeetingPermissions } from "./hooks/useMeetingPermissions";
export { useMeetingActions } from "./hooks/useMeetingActions";
export { useMeetingTabs, TABS, TAB_CONFIG } from "./hooks/useMeetingTabs";

// --- Utils ---
export * from "./utils/meetingUtils";
export {
  MEETING_STATUS,
  STATUS_CONFIG,
  PARTICIPANT_STATUS,
  PARTICIPANT_STATUS_CONFIG,
  PARTICIPANT_ROLE,
  ROLE_CONFIG,
} from "./utils/meetingStatus";
export {
  formatDateTime,
  formatDate,
  formatTime,
  formatRelativeTime,
  getDuration,
  formatDurationShort,
  capitalize,
  formatParticipantRole,
  formatParticipantStatus,
} from "./utils/meetingFormatters";
export {
  canManageMeeting,
  canCancelMeeting,
  canStartSession,
  canJoinSession,
  canEditMeeting,
  canStartMeeting,
  canJoinMeeting,
  canManageParticipants,
  canManageTargets,
} from "./utils/meetingPermissions";

// --- Constants ---
export * from "./constants/meetingConstants";

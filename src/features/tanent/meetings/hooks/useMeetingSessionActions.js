import { useCallback } from "react";

import {
  useStartMeetingSessionMutation,
  useJoinMeetingSessionMutation,
  useLeaveMeetingSessionMutation,
  useEndMeetingSessionMutation,
} from "../api/meetingSessionApi";

export const useMeetingSessionActions = (
  meetingId
) => {

  // =====================================================
  // MUTATIONS
  // =====================================================

  const [
    startMeetingSession,
    {
      isLoading:
        isStartingSession,
    },
  ] =
    useStartMeetingSessionMutation();

  const [
    joinMeetingSession,
    {
      isLoading:
        isJoiningSession,
    },
  ] =
    useJoinMeetingSessionMutation();

  const [
    leaveMeetingSession,
    {
      isLoading:
        isLeavingSession,
    },
  ] =
    useLeaveMeetingSessionMutation();

  const [
    endMeetingSession,
    {
      isLoading:
        isEndingSession,
    },
  ] =
    useEndMeetingSessionMutation();

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleStartSession =
    useCallback(
      async (
        body = {}
      ) => {

        return await startMeetingSession(
          {
            meetingId,
            body,
          }
        ).unwrap();

      },
      [
        startMeetingSession,
        meetingId,
      ]
    );

  const handleJoinSession =
    useCallback(
      async () => {

        return await joinMeetingSession(
          {
            meetingId,
          }
        ).unwrap();

      },
      [
        joinMeetingSession,
        meetingId,
      ]
    );

  const handleLeaveSession =
    useCallback(
      async () => {

        return await leaveMeetingSession(
          {
            meetingId,
          }
        ).unwrap();

      },
      [
        leaveMeetingSession,
        meetingId,
      ]
    );

  const handleEndSession =
    useCallback(
      async (
        body = {}
      ) => {

        return await endMeetingSession(
          {
            meetingId,
            body,
          }
        ).unwrap();

      },
      [
        endMeetingSession,
        meetingId,
      ]
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {

    handleStartSession,

    handleJoinSession,

    handleLeaveSession,

    handleEndSession,

    isStartingSession,

    isJoiningSession,

    isLeavingSession,

    isEndingSession,

    isMutating:

      isStartingSession ||

      isJoiningSession ||

      isLeavingSession ||

      isEndingSession,
  };
};
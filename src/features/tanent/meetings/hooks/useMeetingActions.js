import { useCallback } from "react";

import {
  useUpdateMeetingMutation,
  useCancelMeetingMutation,
  useAddParticipantsMutation,
  useUpdateParticipantRoleMutation,
  useRemoveParticipantMutation,
  useAddTargetMutation,
  useUpdateTargetMutation,
  useRemoveTargetMutation,
} from "../api/meetingsApi";

export const useMeetingActions = (
  meetingId
) => {
  // =====================================================
  // MUTATIONS
  // =====================================================

  const [
    updateMeeting,
    {
      isLoading: isUpdating,
    },
  ] =
    useUpdateMeetingMutation();

  const [
    cancelMeeting,
    {
      isLoading: isCancelling,
    },
  ] =
    useCancelMeetingMutation();

  const [
    addParticipants,
    {
      isLoading:
        isAddingParticipants,
    },
  ] =
    useAddParticipantsMutation();

  const [
    updateParticipantRole,
    {
      isLoading:
        isUpdatingRole,
    },
  ] =
    useUpdateParticipantRoleMutation();

  const [
    removeParticipant,
    {
      isLoading:
        isRemovingParticipant,
    },
  ] =
    useRemoveParticipantMutation();

  const [
    addTarget,
    {
      isLoading: isAddingTarget,
    },
  ] =
    useAddTargetMutation();

  const [
    updateTarget,
    {
      isLoading:
        isUpdatingTarget,
    },
  ] =
    useUpdateTargetMutation();

  const [
    removeTarget,
    {
      isLoading:
        isRemovingTarget,
    },
  ] =
    useRemoveTargetMutation();

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleUpdateMeeting =
    useCallback(
      async (data) => {
        return await updateMeeting({
          meetingId,
          data,
        }).unwrap();
      },
      [updateMeeting, meetingId]
    );

  const handleCancelMeeting =
    useCallback(
      async (reason = "") => {
        return await cancelMeeting({
          meetingId,
          reason,
        }).unwrap();
      },
      [cancelMeeting, meetingId]
    );

  const handleAddParticipants =
    useCallback(
      async (membershipIds) => {
        return await addParticipants({
          meetingId,
          membershipIds,
        }).unwrap();
      },
      [addParticipants, meetingId]
    );

  const handleUpdateParticipantRole =
    useCallback(
      async (
        participantId,
        role
      ) => {
        return await updateParticipantRole(
          {
            meetingId,
            participantId,
            role,
          }
        ).unwrap();
      },
      [
        updateParticipantRole,
        meetingId,
      ]
    );

  const handleRemoveParticipant =
    useCallback(
      async (participantId) => {
        return await removeParticipant(
          {
            meetingId,
            participantId,
          }
        ).unwrap();
      },
      [
        removeParticipant,
        meetingId,
      ]
    );

  const handleAddTarget =
    useCallback(
      async (
        targetType,
        targetId
      ) => {
        return await addTarget({
          meetingId,
          targetType,
          targetId,
        }).unwrap();
      },
      [addTarget, meetingId]
    );

  const handleUpdateTarget =
    useCallback(
      async (targetId, data) => {
        return await updateTarget({
          meetingId,
          targetId,
          data,
        }).unwrap();
      },
      [updateTarget, meetingId]
    );

  const handleRemoveTarget =
    useCallback(
      async (targetId) => {
        return await removeTarget({
          meetingId,
          targetId,
        }).unwrap();
      },
      [removeTarget, meetingId]
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {
    handleUpdateMeeting,

    handleCancelMeeting,

    handleAddParticipants,

    handleUpdateParticipantRole,

    handleRemoveParticipant,

    handleAddTarget,

    handleUpdateTarget,

    handleRemoveTarget,

    isUpdating,

    isCancelling,

    isAddingParticipants,

    isUpdatingRole,

    isRemovingParticipant,

    isAddingTarget,

    isUpdatingTarget,

    isRemovingTarget,

    isMutating:
      isUpdating ||
      isCancelling ||
      isAddingParticipants ||
      isUpdatingRole ||
      isRemovingParticipant ||
      isAddingTarget ||
      isUpdatingTarget ||
      isRemovingTarget,
  };
};
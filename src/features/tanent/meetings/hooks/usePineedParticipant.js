import {
  useCallback,
  useMemo,
  useState,
} from "react";

export const usePinnedParticipant = (
  participants = []
) => {

  // =====================================================
  // STATE
  // =====================================================

  const [
    pinnedParticipantSid,
    setPinnedParticipantSid,
  ] = useState(null);

  // =====================================================
  // PINNED PARTICIPANT
  // =====================================================

  const pinnedParticipant =
    useMemo(() => {

      if (
        !pinnedParticipantSid
      ) {
        return null;
      }

      return (
        participants.find(
          (participant) =>
            participant.sid ===
            pinnedParticipantSid
        ) || null
      );

    }, [
      participants,
      pinnedParticipantSid,
    ]);

  // =====================================================
  // PIN PARTICIPANT
  // =====================================================

  const pinParticipant =
    useCallback(
      (participantSid) => {

        if (!participantSid) {
          return;
        }

        setPinnedParticipantSid(
          participantSid
        );

      },
      []
    );

  // =====================================================
  // UNPIN PARTICIPANT
  // =====================================================

  const unpinParticipant =
    useCallback(
      () => {

        setPinnedParticipantSid(
          null
        );

      },
      []
    );

  // =====================================================
  // TOGGLE PIN
  // =====================================================

  const togglePinParticipant =
    useCallback(
      (participantSid) => {

        if (!participantSid) {
          return;
        }

        setPinnedParticipantSid(
          (prev) => {

            if (
              prev ===
              participantSid
            ) {

              return null;
            }

            return participantSid;
          }
        );

      },
      []
    );

  // =====================================================
  // IS PINNED
  // =====================================================

  const isPinned =
    useCallback(
      (participantSid) => {

        return (
          pinnedParticipantSid ===
          participantSid
        );

      },
      [pinnedParticipantSid]
    );

  // =====================================================
  // HAS PINNED
  // =====================================================

  const hasPinnedParticipant =
    Boolean(
      pinnedParticipant
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {

    pinnedParticipant,

    pinnedParticipantSid,

    hasPinnedParticipant,

    pinParticipant,

    unpinParticipant,

    togglePinParticipant,

    isPinned,
  };
};
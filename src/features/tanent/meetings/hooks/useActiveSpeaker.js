import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  RoomEvent,
} from "livekit-client";

export const useActiveSpeaker = (
  room,
  pinnedParticipant = null
) => {

  // =====================================================
  // REFS
  // =====================================================

  const lastSpeakerRef =
    useRef(null);

  const speakerTimeoutRef =
    useRef(null);

  // =====================================================
  // STATE
  // =====================================================

  const [
    activeSpeaker,
    setActiveSpeaker,
  ] = useState(null);

  // =====================================================
  // ACTIVE SPEAKER EVENTS
  // =====================================================

  useEffect(() => {

    if (!room) {

      setActiveSpeaker(
        null
      );

      return;
    }

    // ===================================================
    // HANDLE SPEAKERS
    // ===================================================

    const handleSpeakersChanged =
      (speakers = []) => {

        // ===============================================
        // MANUAL PIN OVERRIDES EVERYTHING
        // ===============================================

        if (
          pinnedParticipant
        ) {

          return;
        }

        // ===============================================
        // NO SPEAKERS
        // ===============================================

        if (
        speakers.length === 0
        ) {

        speakerTimeoutRef.current =
            setTimeout(() => {

            setActiveSpeaker(null);

            lastSpeakerRef.current =
                null;

            }, 600);

        return;
        }

        // ===============================================
        // PREFER REMOTE SPEAKERS
        // ===============================================

        const remoteSpeaker =
          speakers.find(
            (speaker) =>
              !speaker.isLocal
          );

        const dominantSpeaker =

          remoteSpeaker ||

          speakers[0];

        if (
          !dominantSpeaker
        ) {

          return;
        }

        // ===============================================
        // PREVENT USELESS RERENDERS
        // ===============================================

        if (
          lastSpeakerRef.current
            ?.sid ===
          dominantSpeaker.sid
        ) {

          return;
        }

        // ===============================================
        // SAVE LAST SPEAKER
        // ===============================================

        lastSpeakerRef.current =
          dominantSpeaker;

        // ===============================================
        // CLEAR OLD TIMER
        // ===============================================

        if (
            speakerTimeoutRef.current
            ) {

            clearTimeout(
                speakerTimeoutRef.current
            );
            }

            speakerTimeoutRef.current =
            setTimeout(() => {

                lastSpeakerRef.current =
                dominantSpeaker;

                setActiveSpeaker(
                dominantSpeaker
                );

            }, 300);
      };

    // ===================================================
    // INITIAL
    // ===================================================

    handleSpeakersChanged(
      room.activeSpeakers ||
      []
    );

    // ===================================================
    // EVENTS
    // ===================================================

    room.on(
      RoomEvent.ActiveSpeakersChanged,
      handleSpeakersChanged
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {

      if (
        speakerTimeoutRef.current
      ) {

        clearTimeout(
          speakerTimeoutRef.current
        );
      }

      room.off(
        RoomEvent.ActiveSpeakersChanged,
        handleSpeakersChanged
      );
    };

  }, [
    room,
    pinnedParticipant,
  ]);

  // =====================================================
  // REMOTE PARTICIPANTS
  // =====================================================

  const remoteParticipants =
    useMemo(() => {

      if (!room) {
        return [];
      }

      return Array.from(
        room.remoteParticipants.values()
      );

    }, [room]);

  // =====================================================
  // PRIORITY PARTICIPANT
  // =====================================================

  const priorityParticipant =
    useMemo(() => {

      // ===============================================
      // PINNED PARTICIPANT
      // ===============================================

      if (
        pinnedParticipant
      ) {

        return (
          pinnedParticipant
        );
      }

      // ===============================================
      // ACTIVE SPEAKER
      // ===============================================

      if (
        activeSpeaker
      ) {

        return (
          activeSpeaker
        );
      }

      // ===============================================
      // REMOTE PARTICIPANT FALLBACK
      // ===============================================

      if (
        remoteParticipants.length >
        0
      ) {

        return (
          remoteParticipants[0]
        );
      }

      // ===============================================
      // LOCAL FALLBACK
      // ===============================================

      return (
        room?.localParticipant ||
        null
      );

    }, [

      pinnedParticipant,

      activeSpeaker,

      remoteParticipants,

      room,
    ]);

  // =====================================================
  // RETURN
  // =====================================================

  return {

    activeSpeaker,

    priorityParticipant,
  };
};
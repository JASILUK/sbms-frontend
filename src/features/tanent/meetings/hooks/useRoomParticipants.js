// =====================================================
// FILE: hooks/useRoomParticipants.js
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import {
  RoomEvent,
} from "livekit-client";

export const useRoomParticipants = (
  room
) => {

  // =====================================================
  // STATE
  // =====================================================

  const [
    participants,
    setParticipants,
  ] = useState([]);

  // =====================================================
  // BUILD PARTICIPANTS
  // =====================================================

  useEffect(() => {

    if (!room) {

      setParticipants([]);

      return;
    }

    // ===================================================
    // UPDATE PARTICIPANTS
    // ===================================================

    const updateParticipants =
      () => {

        const remoteParticipants =
          Array.from(
            room.remoteParticipants.values()
          );

        const localParticipant =
          room.localParticipant;

        const allParticipants =
          localParticipant
            ? [
                localParticipant,
                ...remoteParticipants,
              ]
            : remoteParticipants;

        setParticipants(
          allParticipants
        );

        console.log(
          "[ROOM PARTICIPANTS]",
          allParticipants
        );
      };

    // ===================================================
    // INITIAL
    // ===================================================

    updateParticipants();

    // ===================================================
    // EVENTS
    // ===================================================

    room.on(
      RoomEvent.ParticipantConnected,
      updateParticipants
    );

    room.on(
      RoomEvent.ParticipantDisconnected,
      updateParticipants
    );

    room.on(
      RoomEvent.TrackPublished,
      updateParticipants
    );

    room.on(
      RoomEvent.TrackUnpublished,
      updateParticipants
    );

    room.on(
      RoomEvent.LocalTrackPublished,
      updateParticipants
    );

    room.on(
      RoomEvent.LocalTrackUnpublished,
      updateParticipants
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {

      room.off(
        RoomEvent.ParticipantConnected,
        updateParticipants
      );

      room.off(
        RoomEvent.ParticipantDisconnected,
        updateParticipants
      );

      room.off(
        RoomEvent.TrackPublished,
        updateParticipants
      );

      room.off(
        RoomEvent.TrackUnpublished,
        updateParticipants
      );

      room.off(
        RoomEvent.LocalTrackPublished,
        updateParticipants
      );

      room.off(
        RoomEvent.LocalTrackUnpublished,
        updateParticipants
      );
    };

  }, [room]);

  // =====================================================
  // RETURN
  // =====================================================

  return participants;
};
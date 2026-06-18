import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RoomEvent,
  Track,
} from "livekit-client";

export const useScreenShareTrack = (
  room,
  participants = []
) => {

  // =====================================================
  // STATE
  // =====================================================

  const [
    screenShareParticipant,
    setScreenShareParticipant,
  ] = useState(null);

  // =====================================================
  // FIND SCREEN SHARE
  // =====================================================

  const findScreenShare =
    useMemo(
      () => {

        return () => {

          for (
            const participant of participants
          ) {

            const publications =
              Array.from(
                participant.videoTrackPublications.values()
              );

            const hasScreenShare =
              publications.some(
                (publication) => {

                  return (
                    publication.track &&
                    publication.isSubscribed &&
                    publication.track.source ===
                      Track.Source.ScreenShare
                  );
                }
              );

            if (
              hasScreenShare
            ) {

              return participant;
            }
          }

          return null;
        };

      },
      [participants]
    );

  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {

    if (!room) {

      setScreenShareParticipant(
        null
      );

      return;
    }

    // ===================================================
    // SYNC SCREEN SHARE
    // ===================================================

    const syncScreenShare =
      () => {

        const sharingParticipant =
          findScreenShare();

        setScreenShareParticipant(
          (prev) => {

            // ===========================================
            // PREVENT USELESS RERENDERS
            // ===========================================

            if (
              prev?.sid ===
              sharingParticipant?.sid
            ) {

              return prev;
            }

            console.log(
              "[SCREEN SHARE]",
              sharingParticipant
                ?.identity ||
                "NONE"
            );

            return (
              sharingParticipant
            );
          }
        );
      };

    // ===================================================
    // INITIAL
    // ===================================================

    syncScreenShare();

    // ===================================================
    // EVENTS
    // ===================================================

    room.on(
      RoomEvent.TrackPublished,
      syncScreenShare
    );

    room.on(
      RoomEvent.TrackUnpublished,
      syncScreenShare
    );

    room.on(
      RoomEvent.TrackSubscribed,
      syncScreenShare
    );

    room.on(
      RoomEvent.TrackUnsubscribed,
      syncScreenShare
    );

    room.on(
      RoomEvent.LocalTrackPublished,
      syncScreenShare
    );

    room.on(
      RoomEvent.LocalTrackUnpublished,
      syncScreenShare
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {

      room.off(
        RoomEvent.TrackPublished,
        syncScreenShare
      );

      room.off(
        RoomEvent.TrackUnpublished,
        syncScreenShare
      );

      room.off(
        RoomEvent.TrackSubscribed,
        syncScreenShare
      );

      room.off(
        RoomEvent.TrackUnsubscribed,
        syncScreenShare
      );

      room.off(
        RoomEvent.LocalTrackPublished,
        syncScreenShare
      );

      room.off(
        RoomEvent.LocalTrackUnpublished,
        syncScreenShare
      );
    };

  }, [
    room,
    findScreenShare,
  ]);

  // =====================================================
  // HAS SCREEN SHARE
  // =====================================================

  const hasScreenShare =
    Boolean(
      screenShareParticipant
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {

    screenShareParticipant,

    hasScreenShare,
  };
};
import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  RoomEvent,
  ParticipantEvent,
  Track,
} from "livekit-client";

export const useParticipantTracks = (
  participant
) => {

  // =====================================================
  // REFS
  // =====================================================

  const speakingTimeoutRef =
    useRef(null);

  // =====================================================
  // STATE
  // =====================================================

  const [
    state,
    setState,
  ] = useState({

    videoTrack: null,

    cameraTrack: null,

    audioTrack: null,

    screenShareTrack: null,

    isMicEnabled: false,

    isCameraEnabled: false,

    isScreenSharing: false,

    isSpeaking: false,
  });

  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {

    if (!participant) {
      return;
    }

    // ===================================================
    // SYNC TRACKS
    // ===================================================

    const syncTracks = () => {

      // ===============================================
      // CAMERA PUBLICATION
      // ===============================================

      const cameraPublication =
        Array.from(
          participant.videoTrackPublications.values()
        ).find(
          (pub) =>
            pub.track &&
            pub.isSubscribed &&
            pub.source ===
              Track.Source.Camera
        );

      // ===============================================
      // SCREEN SHARE PUBLICATION
      // ===============================================

      const screenSharePublication =
        Array.from(
          participant.videoTrackPublications.values()
        ).find(
          (pub) =>
            pub.track &&
            pub.isSubscribed &&
            pub.source ===
              Track.Source.ScreenShare
        );

      // ===============================================
      // AUDIO PUBLICATION
      // ===============================================

      const audioPublication =
        Array.from(
          participant.audioTrackPublications.values()
        ).find(
          (pub) =>
            pub.track &&
            pub.isSubscribed
        );

      // ===============================================
      // PRIORITY VIDEO TRACK
      // ===============================================

      const activeVideoTrack =

        // SCREEN SHARE FIRST
        screenSharePublication?.track ||

        // CAMERA FALLBACK
        cameraPublication?.track ||

        null;

      // ===============================================
      // SPEAKING
      // ===============================================

      const speaking =
        participant.isSpeaking ===
        true;

      // ===============================================
      // THROTTLE SPEAKING
      // ===============================================

      if (
        speakingTimeoutRef.current
      ) {

        clearTimeout(
          speakingTimeoutRef.current
        );
      }

      speakingTimeoutRef.current =
        setTimeout(() => {

          setState(
            (prev) => {

              const next = {

                // ===============================
                // ACTIVE VIDEO TRACK
                // ===============================

                videoTrack:
                  activeVideoTrack,

                // ===============================
                // CAMERA TRACK
                // ===============================

                cameraTrack:
                  cameraPublication?.track ||
                  null,

                // ===============================
                // AUDIO TRACK
                // ===============================

                audioTrack:
                  audioPublication?.track ||
                  null,

                // ===============================
                // SCREEN SHARE TRACK
                // ===============================

                screenShareTrack:
                  screenSharePublication?.track ||
                  null,

                // ===============================
                // STATES
                // ===============================

                isCameraEnabled:
                  !!cameraPublication?.track &&
                  !cameraPublication?.isMuted,

                isMicEnabled:
                  !!audioPublication?.track &&
                  !audioPublication?.isMuted,

                isScreenSharing:
                  !!screenSharePublication?.track,

                isSpeaking:
                  speaking,
              };

              // ===============================
              // PREVENT USELESS RERENDERS
              // ===============================

              const unchanged =

                prev.videoTrack ===
                  next.videoTrack &&

                prev.cameraTrack ===
                  next.cameraTrack &&

                prev.audioTrack ===
                  next.audioTrack &&

                prev.screenShareTrack ===
                  next.screenShareTrack &&

                prev.isCameraEnabled ===
                  next.isCameraEnabled &&

                prev.isMicEnabled ===
                  next.isMicEnabled &&

                prev.isScreenSharing ===
                  next.isScreenSharing &&

                prev.isSpeaking ===
                  next.isSpeaking;

              return unchanged
                ? prev
                : next;
            }
          );

        }, 40);

      
    };

    // ===================================================
    // INITIAL
    // ===================================================

    syncTracks();

    // ===================================================
    // EVENTS
    // ===================================================

    participant.on(
      RoomEvent.TrackPublished,
      syncTracks
    );

    participant.on(
      RoomEvent.TrackUnpublished,
      syncTracks
    );

    participant.on(
      RoomEvent.TrackSubscribed,
      syncTracks
    );

    participant.on(
      RoomEvent.TrackUnsubscribed,
      syncTracks
    );

    participant.on(
      RoomEvent.TrackMuted,
      syncTracks
    );

    participant.on(
      RoomEvent.TrackUnmuted,
      syncTracks
    );

    participant.on(
    ParticipantEvent.IsSpeakingChanged,
    syncTracks
    );

    participant.on(
      RoomEvent.ConnectionQualityChanged,
      syncTracks
    );

    participant.on(
      RoomEvent.LocalTrackPublished,
      syncTracks
    );

    participant.on(
      RoomEvent.LocalTrackUnpublished,
      syncTracks
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {

      if (
        speakingTimeoutRef.current
      ) {

        clearTimeout(
          speakingTimeoutRef.current
        );
      }

      participant.off(
        RoomEvent.TrackPublished,
        syncTracks
      );

      participant.off(
        RoomEvent.TrackUnpublished,
        syncTracks
      );

      participant.off(
        RoomEvent.TrackSubscribed,
        syncTracks
      );

      participant.off(
        RoomEvent.TrackUnsubscribed,
        syncTracks
      );

      participant.off(
        RoomEvent.TrackMuted,
        syncTracks
      );

      participant.off(
        RoomEvent.TrackUnmuted,
        syncTracks
      );

      participant.off(
        ParticipantEvent.IsSpeakingChanged,
        syncTracks
        );

      participant.off(
        RoomEvent.ConnectionQualityChanged,
        syncTracks
      );

      participant.off(
        RoomEvent.LocalTrackPublished,
        syncTracks
      );

      participant.off(
        RoomEvent.LocalTrackUnpublished,
        syncTracks
      );
    };

  }, [participant]);

  // =====================================================
  // RETURN
  // =====================================================

  return {

    ...state,

    isLocal:
      participant?.isLocal ||
      false,
  };
};
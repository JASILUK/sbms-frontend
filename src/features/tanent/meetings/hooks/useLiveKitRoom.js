import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  Room,
  RoomEvent,
} from "livekit-client";

export const useLiveKitRoom = ({
  wsUrl,
  token,
}) => {

  // =====================================================
  // REFS
  // =====================================================

  const roomRef =
    useRef(null);

  const hasConnectedRef =
    useRef(false);

  // =====================================================
  // STATES
  // =====================================================

  const [
    isConnected,
    setIsConnected,
  ] = useState(false);

  const [
    isConnecting,
    setIsConnecting,
  ] = useState(false);

  const [
    participants,
    setParticipants,
  ] = useState([]);

  const [
    localParticipant,
    setLocalParticipant,
  ] = useState(null);

  // =====================================================
  // UPDATE PARTICIPANTS
  // =====================================================

  const updateParticipants =
    useCallback(
      (liveRoom) => {

        if (!liveRoom) {
          return;
        }

        const remoteParticipants =
          Array.from(
            liveRoom.remoteParticipants.values()
          );

        const allParticipants = [

          liveRoom.localParticipant,

          ...remoteParticipants,
        ];

        // ===============================================
        // PREVENT UNNECESSARY RERENDERS
        // ===============================================

        setParticipants(
          (prev) => {

            const prevIds =
              prev.map(
                (p) => p.sid
              ).join(",");

            const nextIds =
              allParticipants.map(
                (p) => p.sid
              ).join(",");

            if (
              prevIds === nextIds
            ) {
              return prev;
            }

            return allParticipants;
          }
        );

        setLocalParticipant(
          liveRoom.localParticipant
        );
      },
      []
    );

  // =====================================================
  // CONNECT ROOM
  // =====================================================

  const connectRoom =
    useCallback(
      async () => {

        // ===============================================
        // GUARDS
        // ===============================================

        if (
          !wsUrl ||
          !token
        ) {
          return;
        }

        if (
          hasConnectedRef.current
        ) {
          return;
        }

        try {

          hasConnectedRef.current =
            true;

          setIsConnecting(
            true
          );

          // =============================================
          // ROOM
          // =============================================

          const liveRoom =
            new Room({

              // =========================================
              // PERFORMANCE
              // =========================================

              adaptiveStream: true,

              dynacast: true,

              // =========================================
              // VIDEO QUALITY
              // =========================================

              videoCaptureDefaults: {
                resolution: {
                  width: 1280,
                  height: 720,
                },

                frameRate: 24,
              },

              // =========================================
              // PUBLISH DEFAULTS
              // =========================================

              publishDefaults: {

                simulcast: true,

                videoCodec: "vp8",
              },
            });

          roomRef.current =
            liveRoom;

          console.log(
            "[LIVEKIT] CONNECTING..."
          );

          // =============================================
          // CONNECT
          // =============================================

          await liveRoom.connect(
            wsUrl,
            token
          );

          console.log(
            "[LIVEKIT] CONNECTED"
          );

          // =============================================
          // PARTICIPANT EVENTS
          // =============================================

          const handleParticipants =
            () => {

              updateParticipants(
                liveRoom
              );
            };

          liveRoom.on(
            RoomEvent.ParticipantConnected,
            handleParticipants
          );

          liveRoom.on(
            RoomEvent.ParticipantDisconnected,
            handleParticipants
          );

          liveRoom.on(
            RoomEvent.TrackSubscribed,
            handleParticipants
          );

          liveRoom.on(
            RoomEvent.TrackUnsubscribed,
            handleParticipants
          );

          liveRoom.on(
            RoomEvent.LocalTrackPublished,
            handleParticipants
          );

          liveRoom.on(
            RoomEvent.LocalTrackUnpublished,
            handleParticipants
          );

          // =============================================
          // CONNECTION EVENTS
          // =============================================

          liveRoom.on(
            RoomEvent.Reconnecting,
            () => {

              console.log(
                "[LIVEKIT] RECONNECTING..."
              );
            }
          );

          liveRoom.on(
            RoomEvent.Reconnected,
            () => {

              console.log(
                "[LIVEKIT] RECONNECTED"
              );
            }
          );

          liveRoom.on(
            RoomEvent.Disconnected,
            () => {

              console.log(
                "[LIVEKIT] DISCONNECTED"
              );

              setIsConnected(
                false
              );
            }
          );

          // =============================================
          // INITIAL STATE
          // =============================================

          updateParticipants(
            liveRoom
          );

          setLocalParticipant(
            liveRoom.localParticipant
          );

          setIsConnected(
            true
          );

        } catch (error) {

          console.error(
            "[LIVEKIT ERROR]",
            error
          );

          hasConnectedRef.current =
            false;

        } finally {

          setIsConnecting(
            false
          );
        }
      },
      [
        wsUrl,
        token,
        updateParticipants,
      ]
    );

  // =====================================================
  // DISCONNECT
  // =====================================================

  const disconnectRoom =
    useCallback(
      async () => {

        try {

          const room =
            roomRef.current;

          if (!room) {
            return;
          }

          console.log(
            "[LIVEKIT] CLEANUP"
          );

          // =============================================
          // STOP LOCAL TRACKS
          // =============================================

          room.localParticipant
            ?.videoTrackPublications
            ?.forEach(
              (publication) => {

                publication.track?.stop();
              }
            );

          room.localParticipant
            ?.audioTrackPublications
            ?.forEach(
              (publication) => {

                publication.track?.stop();
              }
            );

          // =============================================
          // DISCONNECT
          // =============================================

          await room.disconnect();

          roomRef.current =
            null;

        } catch (error) {

          console.error(
            "[LIVEKIT DISCONNECT ERROR]",
            error
          );

        } finally {

          hasConnectedRef.current =
            false;

          setParticipants([]);

          setLocalParticipant(
            null
          );

          setIsConnected(
            false
          );
        }
      },
      []
    );

  // =====================================================
  // EFFECT
  // =====================================================

  useEffect(() => {

    connectRoom();

    return () => {

      disconnectRoom();
    };

  }, [
    connectRoom,
    disconnectRoom,
  ]);

  // =====================================================
  // RETURN
  // =====================================================

  return {

    room:
      roomRef.current,

    participants,

    localParticipant,

    isConnected,

    isConnecting,

    disconnectRoom,
  };
};
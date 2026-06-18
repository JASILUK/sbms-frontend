import {
  useEffect,
  useRef,
} from "react";

import {
  useWebSocket,
} from "../../../../contexts/websocket_context";

import {
  useMeetingRealtime,
} from "./useMeetingRealtime";

const MeetingSocketListener = ({
  meetingId,
}) => {

  const socketRef =
    useWebSocket();

  const {
    setOnlineParticipantIds,
    setMessages,
    setTypingUsers,
  } =
    useMeetingRealtime();

  const joinedRef =
    useRef(false);

  // =====================================================
  // SOCKET MESSAGE HANDLER
  // =====================================================

  useEffect(() => {

    const socket =
      socketRef?.current;

    if (!socket) {

      console.error(
        "[MEETING] SOCKET NOT FOUND"
      );

      return;
    }

    // =================================================
    // HANDLE SOCKET MESSAGE
    // =================================================

    const handleMessage =
      (event) => {

        try {

          const data =
            JSON.parse(
              event.data
            );

          // ===========================================
          // FILTER OTHER MEETINGS
          // ===========================================

          if (
            data.meeting_id &&
            String(
              data.meeting_id
            ) !==
              String(meetingId)
          ) {

            return;
          }

          // ===========================================
          // MEETING PRESENCE SNAPSHOT
          // ===========================================

          if (
            data.type ===
            "meeting_presence_snapshot"
          ) {

            setOnlineParticipantIds(
              data.online_members || []
            );

            return;
          }

          // ===========================================
          // CHAT SNAPSHOT
          // ===========================================

          if (
            data.type ===
            "meeting_chat_snapshot"
          ) {

            setMessages(
              data.messages || []
            );

            return;
          }

          // ===========================================
          // NEW CHAT MESSAGE
          // ===========================================

          if (
            data.type ===
            "meeting_message"
          ) {

            setMessages(
              (prev) => {

                const exists =
                  prev.some(
                    (message) =>
                      String(
                        message.id
                      ) ===
                      String(
                        data.id
                      )
                  );

                if (exists) {
                  return prev;
                }

                return [
                  ...prev,
                  data,
                ];
              }
            );

            return;
          }

          // ===========================================
          // TYPING EVENTS
          // ===========================================

          if (
            data.type ===
            "meeting_typing"
          ) {

            setTypingUsers(
              (prev) => {

                const updated = {
                  ...prev,
                };

                const membershipId =
                  data.user
                    ?.membership_id;

                if (
                  !membershipId
                ) {

                  return prev;
                }

                if (
                  data.is_typing
                ) {

                  updated[
                    membershipId
                  ] = data.user;

                } else {

                  delete updated[
                    membershipId
                  ];
                }

                return updated;
              }
            );

            return;
          }

        } catch (error) {

          console.error(
            "[MEETING SOCKET ERROR]",
            error
          );
        }
      };

    // =================================================
    // ATTACH LISTENER
    // =================================================

    socket.addEventListener(
      "message",
      handleMessage
    );

    // =================================================
    // CLEANUP LISTENER
    // =================================================

    return () => {

      socket.removeEventListener(
        "message",
        handleMessage
      );
    };

  }, [
    meetingId,
    socketRef,
    setOnlineParticipantIds,
    setMessages,
    setTypingUsers,
  ]);

  // =====================================================
  // JOIN / LEAVE MEETING
  // =====================================================

  useEffect(() => {

    const socket =
      socketRef?.current;

    if (!socket) {
      return;
    }

    const joinMeeting =
      () => {

        if (
          joinedRef.current
        ) {
          return;
        }

        if (
          socket.readyState !==
          WebSocket.OPEN
        ) {
          return;
        }

        joinedRef.current =
          true;

        // =============================================
        // JOIN MEETING
        // =============================================

        socket.send(
          JSON.stringify({
            type:
              "join_meeting",

            meeting_id:
              meetingId,
          })
        );

        // =============================================
        // REQUEST CHAT SNAPSHOT
        // =============================================

        socket.send(
          JSON.stringify({
            type:
              "meeting_chat_snapshot",

            meeting_id:
              meetingId,
          })
        );

        console.log(
          "[MEETING] JOINED:",
          meetingId
        );
      };

    // ===============================================
    // SOCKET READY
    // ===============================================

    if (
      socket.readyState ===
      WebSocket.OPEN
    ) {

      joinMeeting();

    } else {

      socket.addEventListener(
        "open",
        joinMeeting
      );
    }

    // ===============================================
    // TAB CLOSE / REFRESH
    // ===============================================

    const handleBeforeUnload =
      () => {

        if (
          socket.readyState ===
            WebSocket.OPEN &&
          joinedRef.current
        ) {

          socket.send(
            JSON.stringify({
              type:
                "leave_meeting",

              meeting_id:
                meetingId,
            })
          );
        }
      };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    // ===============================================
    // CLEANUP
    // ===============================================

    return () => {

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

      socket.removeEventListener(
        "open",
        joinMeeting
      );

      if (
        socket.readyState ===
          WebSocket.OPEN &&
        joinedRef.current
      ) {

        socket.send(
          JSON.stringify({
            type:
              "leave_meeting",

            meeting_id:
              meetingId,
          })
        );
      }

      joinedRef.current =
        false;

      console.log(
        "[MEETING] LEFT:",
        meetingId
      );
    };

  }, [
    meetingId,
    socketRef,
  ]);

  return null;
};

export default MeetingSocketListener;
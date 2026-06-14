        import { useEffect } from "react";
        import { useDispatch } from "react-redux";

        import { useWebSocket } from "../../../contexts/websocket_context";
        import { chatApi } from "./chatApi";

        export default function ChatSocketListener() {

          const socketRef = useWebSocket();
          const dispatch = useDispatch();

          useEffect(() => {

            const socket = socketRef.current;

            if (!socket) return;

            const handler = (e) => {

              let data;

              try {
                data = JSON.parse(e.data);
              } catch {
                return;
              }

              switch (data.type) {

                // =================================================
                // SIDEBAR REALTIME UPDATE
                // =================================================
                case "sidebar_update": {

                  dispatch(
                    chatApi.util.updateQueryData(
                      "getConversations",
                      undefined,
                      (draft) => {

                        if (!draft?.data) {
                          return;
                        }

                        const conversation =
                          draft.data.find(
                            (c) =>
                              String(c.id) ===
                              String(data.conversation_id)
                          );

                        if (!conversation) {
                          return;
                        }

                        // =========================================
                        // LAST MESSAGE
                        // =========================================
                        if (
                          data.last_message !== undefined
                        ) {
                          conversation.last_message =
                            data.last_message;
                        }

                        // =========================================
                        // UPDATED TIME
                        // =========================================
                        if (data.updated_at) {
                          conversation.updated_at =
                            data.updated_at;
                        }

                        // =========================================
                        // UNREAD COUNT
                        // =========================================
                        if (
                          typeof data.unread_count ===
                          "number"
                        ) {
                          conversation.unread_count =
                            data.unread_count;
                        }

                        // =========================================
                        // SORT LATEST FIRST
                        // =========================================
                        draft.data = [...draft.data].sort(
                          (a, b) =>
                            new Date(b.updated_at) -
                            new Date(a.updated_at)
                        );

                      }
                    )
                  );

                  break;
                }

              case "conversation_created": {

                dispatch(
                  chatApi.util.updateQueryData(
                    "getConversations",
                    undefined,
                    (draft) => {

                      if (!draft?.data) {
                        draft.data = [];
                      }

                      const exists = draft.data.find(
                        (c) =>
                          String(c.id) ===
                          String(data.conversation.id)
                      );

                      // ==============================
                      // PREVENT DUPLICATES
                      // ==============================
                      if (exists) {
                        return;
                      }

                      // ==============================
                      // INSERT TOP
                      // ==============================
                      draft.data.unshift(
                        data.conversation
                      );

                      // ==============================
                      // SORT
                      // ==============================
                      draft.data = [...draft.data].sort(
                        (a, b) =>
                          new Date(b.updated_at) -
                          new Date(a.updated_at)
                      );

                    }
                  )
                );

                break;
              }


              default:
                  break;
              }

            };

            socket.addEventListener(
              "message",
              handler
            );

            return () => {
              socket.removeEventListener(
                "message",
                handler
              );
            };

          }, [socketRef, dispatch]);

          return null;
        }
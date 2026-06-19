import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
} from "lucide-react";

import {
  useWebSocket,
} from "../../../../../contexts/websocket_context";

import {
  useMeetingRealtime,
} from "../../realtime/useMeetingRealtime";

const ChatPanel = ({
  meetingId,
  currentUserId,
}) => {

  const socketRef =
    useWebSocket();

  const {
    messages,
    typingUsers,
  } =
    useMeetingRealtime();

  const [
    message,
    setMessage,
  ] = useState("");

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [
    messages,
  ]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage =
    () => {

      const trimmed =
        message.trim();

      if (!trimmed) {
        return;
      }

      const socket =
        socketRef?.current;

      if (
        !socket ||
        socket.readyState !==
          WebSocket.OPEN
      ) {

        return;
      }

      socket.send(
        JSON.stringify({
          type:
            "meeting_message",

          meeting_id:
            meetingId,

          message:
            trimmed,
        })
      );

      setMessage("");
    };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange =
    (e) => {

      const value =
        e.target.value;

      setMessage(value);

      const socket =
        socketRef?.current;

      if (
        !socket ||
        socket.readyState !==
          WebSocket.OPEN
      ) {

        return;
      }

      // ===============================================
      // START TYPING
      // ===============================================

      socket.send(
        JSON.stringify({
          type:
            "meeting_typing",

          meeting_id:
            meetingId,

          is_typing:
            true,
        })
      );

      // ===============================================
      // STOP TYPING
      // ===============================================

      clearTimeout(
        typingTimeoutRef.current
      );

      typingTimeoutRef.current =
        setTimeout(() => {

          socket.send(
            JSON.stringify({
              type:
                "meeting_typing",

              meeting_id:
                meetingId,

              is_typing:
                false,
            })
          );

        }, 1200);
    };

  // =====================================================
  // ENTER SEND
  // =====================================================

  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter"
      ) {

        e.preventDefault();

        sendMessage();
      }
    };

  // =====================================================
  // TYPING USERS
  // =====================================================

  const activeTypingUsers =
    Object.values(
      typingUsers || {}
    ).filter(
      (user) =>
        String(
          user.membership_id
        ) !==
        String(
          currentUserId
        )
    );


  return (

    <div className="h-full flex flex-col bg-slate-900">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="h-14 px-4 border-b border-slate-800 flex items-center">

        <h2 className="text-sm font-semibold text-white">
          Meeting Chat
        </h2>

      </div>

      {/* ========================================= */}
      {/* MESSAGES */}
      {/* ========================================= */}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {messages.length === 0 && (

          <div className="h-full flex items-center justify-center">

            <div className="text-center">

              <p className="text-sm text-slate-400">
                No messages yet
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Start the conversation
              </p>

            </div>

          </div>
        )}

        {messages.map(
          (msg) => {

            const isOwn =
              String(
                msg.sender
                  ?.membership_id
              ) ===
              String(
                currentUserId
              );

            return (

              <div
                key={msg.id}
                className={`flex ${
                  isOwn
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                    isOwn
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-white"
                  }`}
                >

                  {!isOwn && (

                    <p className="text-[11px] font-medium text-slate-300 mb-1">
                      {
                        msg.sender
                          ?.username
                      }
                    </p>
                  )}

                  <p className="text-sm break-words whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  <p className="text-[10px] opacity-70 mt-2">
                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",

                        minute:
                          "2-digit",
                      }
                    )}
                  </p>

                </div>

              </div>
            );
          }
        )}

        {/* ======================================= */}
        {/* TYPING */}
        {/* ======================================= */}

        {activeTypingUsers.length >
          0 && (

          <div className="px-1">

            <p className="text-xs text-slate-400 italic">

              {
                activeTypingUsers[0]
                  ?.username
              }{" "}

              typing...

            </p>

          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* ========================================= */}
      {/* INPUT */}
      {/* ========================================= */}

      <div className="border-t border-slate-800 p-3">

        <div className="flex items-center gap-2">

          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Send message..."
            className="
              flex-1
              h-11
              px-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              text-sm
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:border-indigo-500
            "
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="
              w-11
              h-11
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-500
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex
              items-center
              justify-center
              transition-colors
            "
          >

            <Send className="w-4 h-4 text-white" />

          </button>

        </div>

      </div>

    </div>
  );
};

export default ChatPanel;
// components/ChatWindow.jsx
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
} from "../chatApi";
import { useTenantContext } from "../../tanatContextHook";
import { useWebSocket } from "../../../../contexts/websocket_context";
import { ArrowDown, X, CornerUpRight } from "lucide-react";

import MessageItem from "./messageItems";
import MessageInput from "./messageInput";
import ChatHeader from "./ChatHeader";

// ============================================
// DATE FORMATTER — WhatsApp-style grouping
// ============================================
const formatDateGroup = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (d) => {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return isSameDay(d, y);
  };

  if (isSameDay(date, now)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return days[date.getDay()];

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============================================
// DATE DIVIDER COMPONENT
// ============================================
const DateDivider = memo(({ date }) => (
  <div className="flex items-center justify-center my-4">
    <div className="bg-slate-200/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
      <span className="text-[11px] font-semibold text-slate-600 tracking-wide uppercase">
        {formatDateGroup(date)}
      </span>
    </div>
  </div>
));
DateDivider.displayName = "DateDivider";

// ============================================
// REPLY PREVIEW BAR (above input)
// ============================================
const ReplyBar = memo(({ replyTo, onCancel, getUserName }) => {
  if (!replyTo) return null;

  const senderName = replyTo.isMe ? "You" : (getUserName?.(replyTo.sender) || "User");
  const previewText = replyTo.message
    ? replyTo.message.slice(0, 80) + (replyTo.message.length > 80 ? "..." : "")
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex items-center gap-3"
    >
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <CornerUpRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-600">
            Replying to {senderName}
          </p>
          <p className="text-[12px] text-slate-400 truncate">
            {previewText}
          </p>
        </div>
      </div>
      <button
        onClick={onCancel}
        className="p-1.5 rounded-full hover:bg-slate-200 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </motion.div>
  );
});
ReplyBar.displayName = "ReplyBar";

// ============================================
// TYPING INDICATOR
// ============================================
const TypingIndicator = memo(({ typingUsers, getUserName }) => {
  const userIds = Object.keys(typingUsers);
  if (userIds.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-end gap-2.5 max-w-[75%] mb-1"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[10px] font-bold">
          {getUserName(userIds[0]).charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-[3px]">
            <span className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce [animation-delay:-0.32s]" />
            <span className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce [animation-delay:-0.16s]" />
            <span className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce" />
          </div>
          <span className="text-[13px] text-gray-500 font-medium leading-none">
            {userIds.length === 1
              ? `${getUserName(userIds[0])} is typing`
              : `${userIds.length} people are typing`}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
TypingIndicator.displayName = "TypingIndicator";

// ============================================
// SCROLL TO BOTTOM BUTTON
// ============================================
const ScrollToBottomButton = memo(({ onClick }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 10 }}
    transition={{ duration: 0.15, ease: "easeOut" }}
    onClick={onClick}
    className="absolute bottom-28 right-6 w-10 h-10 bg-white shadow-lg shadow-gray-200/60 rounded-full flex items-center justify-center border border-gray-100 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 z-10"
  >
    <ArrowDown className="w-[18px] h-[18px] text-gray-600" strokeWidth={2.2} />
  </motion.button>
));
ScrollToBottomButton.displayName = "ScrollToBottomButton";

// ============================================
// MAIN CHAT WINDOW
// ============================================
export default function ChatWindow({ conversationId, conversation, onBack }) {
  const { membership_id } = useTenantContext();
  const socketRef = useWebSocket();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const joinedRef = useRef(false);
  const loadingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});

  // 🔥 REPLY STATE
  const [replyTo, setReplyTo] = useState(null);

  const { data: convData } = useGetConversationsQuery();

  const fallbackConversation = convData?.data?.find(
    (c) => String(c.id) === String(conversationId)
  );
  const finalConversation = conversation || fallbackConversation;

  const { data, isLoading } = useGetMessagesQuery(
    { conversationId, cursor },
    { skip: !conversationId, refetchOnMountOrArgChange: true }
  );

  const nextCursor = data?.data?.next_cursor;
  const hasMore = data?.data?.has_more;

  // =========================
  // SAFE SEND
  // =========================
  const safeSend = useCallback(
    (payload) => {
      const socket = socketRef.current;
      if (!socket) return;

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      } else {
        const onOpen = () => {
          socket.send(JSON.stringify(payload));
          socket.removeEventListener("open", onOpen);
        };
        socket.addEventListener("open", onOpen);
      }
    },
    [socketRef]
  );

  // =========================
  // RESET ON ROOM CHANGE
  // =========================
  useEffect(() => {
    setMessages([]);
    setCursor(null);
    joinedRef.current = false;
    setTypingUsers({});
    setReplyTo(null);
  }, [conversationId]);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (!data?.data?.results || cursor !== null) return;

    // ✅ FIX: normalize message_type
    setMessages(
      data.data.results.map((m) => ({
        ...m,
        message_type: m.message_type || "text",
      }))
    );

    requestAnimationFrame(() => bottomRef.current?.scrollIntoView());
  }, [data, cursor]);

  // =========================
  // PAGINATION
  // =========================
  useEffect(() => {
    if (!data?.data?.results || cursor === null) return;

    const el = containerRef.current;
    const prevHeight = el?.scrollHeight || 0;

    setMessages((prev) => {
      const existing = new Set(prev.map((m) => m.id));

      // ✅ FIX: normalize + dedupe
      const incoming = data.data.results
        .map((m) => ({
          ...m,
          message_type: m.message_type || "text",
        }))
        .filter((m) => !existing.has(m.id));

      return [...incoming, ...prev];
    });

    setLoadingMore(false);
    loadingRef.current = false;

    requestAnimationFrame(() => {
      if (!el) return;
      el.scrollTop = el.scrollHeight - prevHeight;
    });
  }, [data, cursor]);

  // =========================
  // JOIN ROOM
  // =========================
  useEffect(() => {
    if (!conversationId) return;

    if (!joinedRef.current) {
      safeSend({ type: "join_room", room_id: conversationId });
      joinedRef.current = true;
    }

    return () => {
      safeSend({ type: "leave_room", room_id: conversationId });
      joinedRef.current = false;
    };
  }, [conversationId, safeSend]);

  // =========================
  // SOCKET LISTENER
  // =========================
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

      // NEW MESSAGE
      if (
        data.type === "chat_message" &&
        String(data.room_id) === String(conversationId)
      ) {
        setMessages((prev) => {
          if (prev.find((m) => String(m.id) === String(data.id))) return prev;

          const updated = prev.map((m) => {
            if (m.tempId && m.tempId === data.tempId) {
              return {
                id: data.id,
                message: data.message,
                message_type: data.message_type || "text",
                file_url: data.file_url || null,
                file_name: data.file_name || null,
                duration: data.duration || null,
                sender: data.sender,
                created_at: data.created_at,
                status: data.status ?? null,
                deleted: false,
                edited: false,
                reply: data.reply || null,
              };
            }
            return m;
          });

          if (updated.some((m) => String(m.id) === String(data.id))) {
            return updated;
          }

          return [
            ...prev,
            {
              id: data.id,
              message: data.message,
              message_type: data.message_type || "text",
              file_url: data.file_url || null,
              file_name: data.file_name || null,
              duration: data.duration || null,
              sender: data.sender,
              created_at: data.created_at,
              status: data.status ?? null,
              deleted: false,
              edited: false,
              reply: data.reply || null,
            },
          ];
        });

        // ✅ WEBSOCKET-DRIVEN STATUS: If message is from another user, send delivery + read acks
        if (String(data.sender) !== String(membership_id)) {
          safeSend({ type: "message_received", message_id: data.id });
          safeSend({ type: "mark_read", room_id: conversationId });
        }

        if (isAtBottom) {
          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          });
        }
      }

      // MESSAGE EDITED
      if (
        data.type === "message_edited" &&
        String(data.room_id) === String(conversationId)
      ) {
        setMessages((prev) =>
          prev.map((m) =>
            String(m.id) === String(data.message_id)
              ? { ...m, message: data.content, edited: true }
              : m
          )
        );
      }

      // MESSAGE DELETED
      if (
        data.type === "message_deleted" &&
        String(data.room_id) === String(conversationId)
      ) {
        setMessages((prev) =>
          prev.map((m) =>
            String(m.id) === String(data.message_id)
              ? { ...m, deleted: true, message: "This message was deleted" }
              : m
          )
        );
      }

      // ✅ STATUS UPDATE — aggregate status from backend (delivered/read)
      if (data.type === "status_update") {
        setMessages((prev) =>
          prev.map((m) =>
            String(m.id) === String(data.message_id)
              ? { ...m, status: data.status }
              : m
          )
        );
      }

      // TYPING
      if (
        data.type === "typing_event" &&
        String(data.room_id) === String(conversationId)
      ) {
        if (String(data.user_id) === String(membership_id)) return;

        setTypingUsers((prev) => {
          const copy = { ...prev };

          if (data.is_typing) {
            copy[data.user_id] = true;
            setTimeout(() => {
              setTypingUsers((p) => {
                const c = { ...p };
                delete c[data.user_id];
                return c;
              });
            }, 2500);
          } else {
            delete copy[data.user_id];
          }

          return copy;
        });
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [conversationId, membership_id, isAtBottom, safeSend]);

  // =========================
  // SCROLL
  // =========================
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const bottomGap = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsAtBottom(bottomGap < 60);

    if (el.scrollTop < 120 && hasMore && nextCursor && !loadingRef.current) {
      loadingRef.current = true;
      setLoadingMore(true);
      setCursor((prev) => (prev === nextCursor ? prev : nextCursor));
    }
  }, [hasMore, nextCursor]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // =========================
  // GET USER NAME
  // =========================
  const getUserName = useCallback(
    (id) => {
      if (!finalConversation) return "User";

      if (finalConversation.type === "direct") {
        return finalConversation.display_name;
      }

      if (finalConversation.members) {
        const user = finalConversation.members.find(
          (m) => String(m.id) === String(id)
        );
        return user?.name || "User";
      }

      return "User";
    },
    [finalConversation]
  );

  // =========================
  // UI
  // =========================
  if (!conversationId) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f8f7f5] relative">
      <ChatHeader conversation={finalConversation} onBack={onBack} />

      {/* MESSAGES */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-[2px]"
      >
        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        )}

        {/* DATE-GROUPED MESSAGES */}
        {messages.map((msg, index) => {
          const showDateDivider =
            index === 0 ||
            formatDateGroup(msg.created_at) !==
              formatDateGroup(messages[index - 1]?.created_at);

          return (
            <div key={msg.id || msg.tempId || `msg-${index}`}>
              {showDateDivider && <DateDivider date={msg.created_at} />}
              <MessageItem
                message={msg}
                isMe={String(msg.sender) === String(membership_id)}
                currentUserId={membership_id}
                onReply={setReplyTo}
              />
            </div>
          );
        })}

        {/* TYPING INDICATOR */}
        <AnimatePresence>
          {Object.keys(typingUsers).length > 0 && (
            <TypingIndicator
              typingUsers={typingUsers}
              getUserName={getUserName}
            />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* SCROLL TO BOTTOM BUTTON */}
      <AnimatePresence>
        {!isAtBottom && (
          <ScrollToBottomButton onClick={scrollToBottom} />
        )}
      </AnimatePresence>

      {/* REPLY BAR */}
      <AnimatePresence>
        {replyTo && (
          <ReplyBar
            replyTo={replyTo}
            onCancel={() => setReplyTo(null)}
            getUserName={getUserName}
          />
        )}
      </AnimatePresence>

      {/* INPUT */}
      <div className="bg-white border-t border-gray-100/80 px-5 py-3.5 relative z-10">
        <MessageInput
          conversationId={conversationId}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}
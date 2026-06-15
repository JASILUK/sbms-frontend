import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Info,
  Pin,
  Bell,
  BellOff,
  Archive,
 Trash2,
  Users,
  Search,
} from "lucide-react";

import { usePresence } from "../presenceContext";
import ChatDetailsPanel from "./ChatDetailsPanel";

export default function ChatHeader({ conversation, onBack }) {

  const [showMenu, setShowMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { onlineUsers, lastSeenMap } = usePresence();

  // =========================================================
  // CONVERSATION TYPE
  // =========================================================
  const isGroupConversation = [
    "group",
    "department",
    "project",
  ].includes(conversation?.type);

  // =========================================================
  // DIRECT CHAT TARGET USER
  // =========================================================
  const otherMembershipId = useMemo(() => {
    if (isGroupConversation) return null;

    return conversation?.other_membership_id ?? null;
  }, [conversation, isGroupConversation]);

  // =========================================================
  // DIRECT ONLINE STATUS
  // =========================================================
  const isOnline = useMemo(() => {

    if (isGroupConversation) return false;

    if (!otherMembershipId) return false;

    return onlineUsers?.[otherMembershipId] === true;

  }, [
    isGroupConversation,
    otherMembershipId,
    onlineUsers,
  ]);

  // =========================================================
  // LAST SEEN
  // =========================================================
  const lastSeen = useMemo(() => {

    if (isGroupConversation) return null;

    if (!otherMembershipId) return null;

    // realtime override
    if (lastSeenMap?.[otherMembershipId]) {
      return lastSeenMap[otherMembershipId];
    }

    // api fallback
    return conversation?.last_seen || null;

  }, [
    isGroupConversation,
    otherMembershipId,
    lastSeenMap,
    conversation,
  ]);

  // =========================================================
  // GROUP ONLINE COUNT (REALTIME)
  // =========================================================
  const onlineGroupCount = useMemo(() => {

    if (!isGroupConversation) {
      return 0;
    }

    const members = conversation?.members || [];

    if (!members.length) {
      return 0;
    }

    return members.filter((member) => {
      return onlineUsers?.[member.membership_id] === true;
    }).length;

  }, [
    isGroupConversation,
    conversation?.members,
    onlineUsers,
  ]);

  // =========================================================
  // MEMBER COUNT
  // =========================================================
  const memberCount = useMemo(() => {
    return conversation?.member_count || 0;
  }, [conversation]);

  // =========================================================
  // LAST SEEN FORMAT
  // =========================================================
  const formatLastSeen = (date) => {

    if (!date) {
      return "Offline";
    }

    const d = new Date(date);
    const now = new Date();

    const diff = (now - d) / 1000;

    if (diff < 60) {
      return "last seen just now";
    }

    if (diff < 3600) {
      return `last seen ${Math.floor(diff / 60)} min ago`;
    }

    if (diff < 86400) {
      return `last seen ${Math.floor(diff / 3600)} hr ago`;
    }

    return "last seen " + d.toLocaleDateString();
  };

  // =========================================================
  // INITIALS
  // =========================================================
  const getInitials = (name) => {

    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    ) || "?";
  };

  // =========================================================
  // AVATAR COLORS
  // =========================================================
  const getAvatarColor = (id) => {

    const colors = [
      "from-slate-500 to-slate-600",
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-sky-600",
    ];

    if (!id) {
      return colors[0];
    }

    return colors[
      id.toString().charCodeAt(0) % colors.length
    ];
  };

  // =========================================================
  // GUARD
  // =========================================================
  if (!conversation) {
    return null;
  }

  return (
    <div className="h-[68px] shrink-0 flex items-center gap-3 px-5 bg-white border-b border-gray-100/80 select-none">

      {/* BACK */}
      <AnimatePresence>
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            onClick={onBack}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl md:hidden"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* HEADER BODY */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-xl transition-colors select-none"
        onClick={() => setShowDetails(true)}
      >

        {/* AVATAR */}
        <div className="relative flex-shrink-0">

          <div className="w-10 h-10 rounded-[14px] overflow-hidden shadow-sm ring-1 ring-gray-100">

            {conversation.avatar_url ? (

              <img
                src={conversation.avatar_url}
                alt={conversation.display_name}
                className="w-full h-full object-cover"
              />

            ) : (

              <div
                className={`w-full h-full bg-gradient-to-br ${getAvatarColor(
                  conversation.id
                )} flex items-center justify-center text-white font-semibold text-[13px]`}
              >

                {isGroupConversation ? (
                  <Users className="w-[18px] h-[18px]" />
                ) : (
                  getInitials(conversation.display_name)
                )}

              </div>
            )}

          </div>

          {/* DIRECT ONLINE DOT */}
          {!isGroupConversation && isOnline && (
            <span className="absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] bg-emerald-500 border-[2.5px] border-white rounded-full" />
          )}
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0 flex flex-col">

          <div className="flex items-center gap-2">

            <h2 className="font-semibold text-[15px] text-gray-900 truncate">
              {conversation.display_name || "Chat"}
            </h2>

            {isPinned && (
              <Pin className="w-3 h-3 text-amber-500 fill-amber-500 rotate-45" />
            )}

          </div>

          <div className="text-[12px] mt-[2px]">

            {/* GROUP */}
            {isGroupConversation ? (

              <div className="flex items-center gap-2 text-gray-400">

                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {memberCount} members
                </span>

                {onlineGroupCount > 0 && (
                  <>
                    <span>•</span>

                    <span className="text-emerald-600 font-medium flex items-center gap-[5px]">

                      <span className="relative flex h-[7px] w-[7px]">

                        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" />

                        <span className="relative h-[7px] w-[7px] bg-emerald-500 rounded-full" />

                      </span>

                      {onlineGroupCount} online

                    </span>
                  </>
                )}

              </div>

            ) : isOnline ? (

              // DIRECT ONLINE
              <span className="text-emerald-600 font-medium flex items-center gap-[5px]">

                <span className="relative flex h-[7px] w-[7px]">

                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative h-[7px] w-[7px] bg-emerald-500 rounded-full" />

                </span>

                Online

              </span>

            ) : (

              // LAST SEEN
              <span className="text-gray-400">
                {formatLastSeen(lastSeen)}
              </span>

            )}

          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-[2px]">

        <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl">
          <Search className="w-[18px] h-[18px]" />
        </button>

        <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl">
          <Phone className="w-[18px] h-[18px]" />
        </button>

        <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl">
          <Video className="w-[18px] h-[18px]" />
        </button>

        <div className="relative">

          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </button>

          <AnimatePresence>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 py-2 z-50 overflow-hidden"
                >

                  {/* PIN */}
                  <button
                    onClick={() => {
                      setIsPinned(!isPinned);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Pin
                      className={`w-4 h-4 ${
                        isPinned
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-400"
                      }`}
                    />

                    {isPinned
                      ? "Unpin conversation"
                      : "Pin conversation"}
                  </button>

                  {/* MUTE */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >

                    {isMuted ? (
                      <BellOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Bell className="w-4 h-4 text-gray-400" />
                    )}

                    {isMuted
                      ? "Unmute notifications"
                      : "Mute notifications"}

                  </button>

                  {/* ARCHIVE */}
                  <button className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <Archive className="w-4 h-4 text-gray-400" />
                    Archive conversation
                  </button>

                  <div className="my-1.5 border-t border-gray-100" />

                  {/* INFO */}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDetails(true);
                    }}
                    className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Info className="w-4 h-4 text-gray-400" />
                    Conversation info
                  </button>

                  {/* DELETE */}
                  <button className="w-full px-4 py-2.5 text-[13px] text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete conversation
                  </button>

                </motion.div>
              </>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* DETAILS PANEL */}
      {showDetails && (
        <ChatDetailsPanel
          conversation={conversation}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}

    </div>
  );
}
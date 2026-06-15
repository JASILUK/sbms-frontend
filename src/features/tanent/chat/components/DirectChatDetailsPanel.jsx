import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Bell,
  BellOff,
  Search,
  MessageSquare,
  Shield,
  Clock,
} from "lucide-react";
import { usePresence } from "../presenceContext";

const DirectChatDetailsPanel = memo(function DirectChatDetailsPanel({ conversation, onClose }) {
  const { onlineUsers, lastSeenMap } = usePresence();

  const otherMembershipId = conversation?.other_membership_id;
  
  const isOnline = otherMembershipId && onlineUsers?.[otherMembershipId] === true;
  
  const lastSeen = useMemo(() => {
    if (!otherMembershipId) return null;
    if (lastSeenMap?.[otherMembershipId]) return lastSeenMap[otherMembershipId];
    return conversation?.last_seen || null;
  }, [otherMembershipId, lastSeenMap, conversation]);

  const formatLastSeen = (date) => {
    if (!date) return "Offline";
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return "Active now";
    if (diff < 3600) return `Last seen ${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `Last seen ${Math.floor(diff / 3600)} hr ago`;
    return "Last seen " + d.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  };

  const getAvatarColor = (id) => {
    const colors = [
      "from-slate-500 to-slate-600",
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
    ];
    return colors[(id?.toString().charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="flex flex-col">
      {/* User Header */}
      <div className="px-5 pt-8 pb-6 flex flex-col items-center text-center border-b border-gray-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative mb-4"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl ring-4 ring-gray-50">
            {conversation?.avatar_url ? (
              <img src={conversation.avatar_url} alt={conversation.display_name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(conversation?.id)} flex items-center justify-center text-white font-bold text-3xl`}>
                {getInitials(conversation?.display_name)}
              </div>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full" />
          )}
        </motion.div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {conversation?.display_name || "User"}
        </h2>
        
        <div className="flex items-center gap-2 text-sm mb-4">
          {isOnline ? (
            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </span>
          ) : (
            <span className="text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatLastSeen(lastSeen)}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-all">
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition-all">
            <Bell className="w-4 h-4" />
            Mute
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-5 py-4 space-y-1 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Information</h3>
        
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Mail className="w-4 h-4 text-gray-400" />
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs text-gray-400">Email</div>
            <div className="text-sm text-gray-900 truncate">{conversation?.email || "Not available"}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Shield className="w-4 h-4 text-gray-400" />
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs text-gray-400">Type</div>
            <div className="text-sm text-gray-900 capitalize">Direct Message</div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="px-5 py-4 space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</h3>
        
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">Search in conversation</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <BellOff className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">Mute notifications</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 transition-colors text-left">
          <Shield className="w-4 h-4 text-rose-500" />
          <span className="text-sm text-rose-600">Block user</span>
        </button>
      </div>
    </div>
  );
});

export default DirectChatDetailsPanel;
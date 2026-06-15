import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Shield, User, MoreVertical, Loader2 } from "lucide-react";
import ParticipantActionsMenu from "./ParticipantActionsMenu";

const GroupParticipantsList = memo(function GroupParticipantsList({
  participants,
  myMembershipId,
  myRole,
  conversationId,
  getInitials,
  getAvatarColor,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleToggleMenu = useCallback((id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  const sortedParticipants = [...participants].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, member: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  const getRoleIcon = (role) => {
    if (role === "owner") return <Crown className="w-3 h-3 text-amber-500" fill="currentColor" />;
    if (role === "admin") return <Shield className="w-3 h-3 text-blue-500" fill="currentColor" />;
    return null;
  };

  const getRoleBadgeClass = (role) => {
    if (role === "owner") return "bg-amber-50 text-amber-700 border-amber-200";
    if (role === "admin") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-gray-50 text-gray-500 border-gray-200";
  };

  return (
    <div className="py-1">
      {sortedParticipants.map((participant, index) => {
        const isMe = String(participant.membership_id) === String(myMembershipId);
        const canManage = (myRole === "owner" || myRole === "admin") && !isMe && participant.role !== "owner";
        const showMenu = openMenuId === participant.membership_id;

        return (
          <motion.div
            key={participant.membership_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="relative"
          >
            <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors group">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm">
                  {participant.avatar ? (
                    <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(participant.user_id || participant.membership_id)} flex items-center justify-center text-white font-semibold text-xs`}>
                      {getInitials(participant.name)}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {participant.name}
                  </span>
                  {isMe && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium flex items-center gap-1 ${getRoleBadgeClass(participant.role)}`}>
                    {getRoleIcon(participant.role)}
                    {participant.role}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate">{participant.email}</span>
                </div>
              </div>

              {/* Actions */}
              {canManage && (
                <div className="relative">
                  <button
                    onClick={() => handleToggleMenu(participant.membership_id)}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <ParticipantActionsMenu
                        participant={participant}
                        conversationId={conversationId}
                        myRole={myRole}
                        onClose={closeMenu}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

export default GroupParticipantsList;
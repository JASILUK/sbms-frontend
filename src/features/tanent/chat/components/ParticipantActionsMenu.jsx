import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldOff, UserMinus, Loader2 } from "lucide-react";
import {
  useUpdateGroupRoleMutation,
  useRemoveGroupMemberMutation,
} from "../chatApi";

const ParticipantActionsMenu = memo(function ParticipantActionsMenu({
  participant,
  conversationId,
  myRole,
  onClose,
}) {
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateGroupRoleMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveGroupMemberMutation();

  const handlePromote = useCallback(async () => {
    try {
      await updateRole({
        conversationId,
        membership_id: participant.membership_id,
        role: "admin",
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Promote failed:", err);
    }
  }, [updateRole, conversationId, participant.membership_id, onClose]);

  const handleDemote = useCallback(async () => {
    try {
      await updateRole({
        conversationId,
        membership_id: participant.membership_id,
        role: "member",
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Demote failed:", err);
    }
  }, [updateRole, conversationId, participant.membership_id, onClose]);

  const handleRemove = useCallback(async () => {
    try {
      await removeMember({
        conversationId,
        membership_id: participant.membership_id,
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  }, [removeMember, conversationId, participant.membership_id, onClose]);

  const isLoading = isUpdatingRole || isRemoving;

  // Owner can promote/demote anyone except other owners
  // Admin can only remove members (not admins)
  const canPromote = myRole === "owner" && participant.role === "member";
  const canDemote = myRole === "owner" && participant.role === "admin";
  const canRemove = (myRole === "owner" && participant.role !== "owner") ||
                    (myRole === "admin" && participant.role === "member");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/40 py-1.5 z-30 overflow-hidden"
    >
      {canPromote && (
        <button
          onClick={handlePromote}
          disabled={isLoading}
          className="w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
        >
          <Shield className="w-4 h-4 text-blue-500" />
          Make admin
        </button>
      )}

      {canDemote && (
        <button
          onClick={handleDemote}
          disabled={isLoading}
          className="w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
        >
          <ShieldOff className="w-4 h-4 text-amber-500" />
          Remove admin
        </button>
      )}

      {(canPromote || canDemote) && canRemove && (
        <div className="my-1 border-t border-gray-100" />
      )}

      {canRemove && (
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="w-full px-4 py-2 text-left text-[13px] text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
        >
          {isRemoving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserMinus className="w-4 h-4" />
          )}
          Remove member
        </button>
      )}
    </motion.div>
  );
});

export default ParticipantActionsMenu;
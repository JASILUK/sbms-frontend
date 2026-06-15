import { memo, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  LogOut,
  UserPlus,
  Crown,
  Pencil,
  Loader2,
} from "lucide-react";

import { useTenantContext } from "../../tanatContextHook";

import {
  useGetGroupDetailsQuery,
  useLeaveGroupMutation,
} from "../chatApi";

import GroupParticipantsList from "./GroupParticipantsList";
import EditGroupModal from "./EditGroupModal";
import AddMembersModal from "./AddMembersModal";
import LeaveConfirmModal from "./LeaveConfirmModal";

const GroupDetailsPanel = memo(function GroupDetailsPanel({
  conversation,
  onClose,
}) {

  const { membership_id } = useTenantContext();

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showAddMembers, setShowAddMembers] =
    useState(false);

  const [showLeaveConfirm, setShowLeaveConfirm] =
    useState(false);

  const {
    data,
    isLoading,
    error,
  } = useGetGroupDetailsQuery(
    conversation?.id,
    {
      skip: !conversation?.id,
    }
  );

  const [
    leaveGroup,
    {
      isLoading: isLeaving,
    },
  ] = useLeaveGroupMutation();

  const group = data?.data || {};

  const participants =
    group.participants || [];

  const isDepartmentConversation =
    group.type === "department";

  const myRole = useMemo(() => {

    const me = participants.find(
      (p) =>
        String(p.membership_id) ===
        String(membership_id)
    );

    return me?.role || "member";

  }, [participants, membership_id]);

  const isOwner =
    myRole === "owner";

  const isAdmin =
    myRole === "admin" || isOwner;

  const memberCount =
    participants.length;

  const handleLeave = useCallback(async () => {

    try {

      await leaveGroup(
        conversation.id
      ).unwrap();

      setShowLeaveConfirm(false);

      onClose();

    } catch (err) {

      console.error(
        "Leave group failed:",
        err
      );
    }

  }, [
    leaveGroup,
    conversation.id,
    onClose,
  ]);

  const getInitials = useCallback((name) => {

    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      || "?"
    );

  }, []);

  const getAvatarColor = useCallback((id) => {

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

    return (
      colors[
        id.toString().charCodeAt(0)
        % colors.length
      ]
    );

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />

        <span className="text-sm text-gray-500">
          Loading group details...
        </span>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 px-4">

        <span className="text-sm text-gray-500 text-center">
          Failed to load group details
        </span>

        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Close
        </button>

      </div>
    );
  }

  return (

    <div className="flex flex-col">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center border-b border-gray-100">

        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            damping: 20,
          }}
          className="relative mb-3"
        >

          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg ring-4 ring-gray-50">

            {group.avatar ? (

              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />

            ) : (

              <div
                className={`w-full h-full bg-gradient-to-br ${getAvatarColor(group.id)} flex items-center justify-center text-white font-bold text-2xl`}
              >
                <Users className="w-8 h-8" />
              </div>
            )}

          </div>

          {isOwner && !isDepartmentConversation && (

            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-sm">

              <Crown
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
              />

            </div>
          )}

        </motion.div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {group.name
            || conversation?.display_name
            || "Group"}
        </h2>

        {group.description && (

          <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-2">
            {group.description}
          </p>

        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">

          <Users className="w-3.5 h-3.5" />

          <span>
            {memberCount} member
            {memberCount !== 1 ? "s" : ""}
          </span>

          <span className="mx-1">·</span>

          <span className="capitalize">
            {group.type || "group"}
          </span>

          {isDepartmentConversation && (
            <>
              <span className="mx-1">·</span>

              <span className="text-emerald-600 font-medium">
                System Managed
              </span>
            </>
          )}

        </div>

        {/* ================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================= */}

        <div className="flex items-center gap-2 w-full">

          {!isDepartmentConversation && isAdmin && (

            <button
              onClick={() =>
                setShowEditModal(true)
              }
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition-all active:scale-95"
            >

              <Pencil className="w-4 h-4" />

              Edit

            </button>
          )}

          {!isDepartmentConversation && isAdmin && (

            <button
              onClick={() =>
                setShowAddMembers(true)
              }
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-all active:scale-95"
            >

              <UserPlus className="w-4 h-4" />

              Add

            </button>
          )}

          {!isDepartmentConversation && (

            <button
              onClick={() =>
                setShowLeaveConfirm(true)
              }
              disabled={isLeaving}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
            >

              <LogOut className="w-4 h-4" />

              {isLeaving
                ? "Leaving..."
                : "Leave"}

            </button>
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* PARTICIPANTS */}
      {/* ================================================= */}

      <div className="flex-1 min-h-0">

        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-5 py-3 border-b border-gray-100 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Users className="w-4 h-4 text-gray-400" />

            <span className="text-sm font-semibold text-gray-900">
              Members
            </span>

            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              {memberCount}
            </span>

          </div>

          {!isDepartmentConversation && isAdmin && (

            <button
              onClick={() =>
                setShowAddMembers(true)
              }
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >

              <UserPlus className="w-3.5 h-3.5" />

              Add

            </button>
          )}

        </div>

        <GroupParticipantsList
          participants={participants}
          myMembershipId={membership_id}
          myRole={myRole}
          conversationId={conversation?.id}
          conversationType={group.type}
          getInitials={getInitials}
          getAvatarColor={getAvatarColor}
        />

      </div>

      {/* ================================================= */}
      {/* MODALS */}
      {/* ================================================= */}

      <AnimatePresence>

        {!isDepartmentConversation
          && showEditModal && (

          <EditGroupModal
            group={group}
            conversationId={conversation?.id}
            onClose={() =>
              setShowEditModal(false)
            }
            getAvatarColor={getAvatarColor}
            getInitials={getInitials}
          />
        )}

      </AnimatePresence>

      <AnimatePresence>

        {!isDepartmentConversation
          && showAddMembers && (

          <AddMembersModal
            conversationId={conversation?.id}
            existingMemberIds={participants.map(
              (p) => p.membership_id
            )}
            onClose={() =>
              setShowAddMembers(false)
            }
            getAvatarColor={getAvatarColor}
          />
        )}

      </AnimatePresence>

      <AnimatePresence>

        {!isDepartmentConversation
          && showLeaveConfirm && (

          <LeaveConfirmModal
            groupName={group.name}
            onConfirm={handleLeave}
            onCancel={() =>
              setShowLeaveConfirm(false)
            }
            isLeaving={isLeaving}
          />
        )}

      </AnimatePresence>

    </div>
  );
});

export default GroupDetailsPanel;
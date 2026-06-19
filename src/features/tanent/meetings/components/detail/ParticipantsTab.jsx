import React from "react";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";
import ParticipantTable from "./ParticipantTable";

// =====================================================
// COMPONENT
// =====================================================

const ParticipantsTab = ({
  meeting,
  permissions,
  actions,
  onAddParticipants,
}) => {
  // ===================================================
  // DATA
  // ===================================================

  const participants = meeting?.participants || [];

  // ===================================================
  // PERMISSIONS
  // ===================================================

  const canManage = permissions.canManage;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      {/* ============================================= */}
      {/* HEADER — Compact, command-bar style */}
      {/* ============================================= */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Participants
          </h2>
          <span className="text-[11px] text-slate-400 font-medium tabular-nums">
            {participants.length}
          </span>
        </div>

        {canManage && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddParticipants}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-indigo-500/15 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </motion.button>
        )}
      </div>

      {/* ============================================= */}
      {/* TABLE */}
      {/* ============================================= */}

      <ParticipantTable
        participants={participants}
        canManage={canManage}
        onUpdateRole={actions.handleUpdateParticipantRole}
        onRemove={actions.handleRemoveParticipant}
        isUpdatingRole={actions.isUpdatingRole}
        isRemoving={actions.isRemovingParticipant}
      />
    </motion.div>
  );
};

export default ParticipantsTab;
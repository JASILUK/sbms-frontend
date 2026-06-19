import React from "react";

import { motion } from "framer-motion";

import {
  Plus,
  Target,
} from "lucide-react";

import TargetTable from "./TargetTable";

// =====================================================
// COMPONENT
// =====================================================

const TargetsTab = ({
  meeting,
  permissions,
  actions,
  onAddTarget,
  onEditTarget,
}) => {

  // ===================================================
  // DATA
  // ===================================================

  const targets =
    meeting?.targets || [];

  // ===================================================
  // PERMISSIONS
  // ===================================================

  const canManage =
    permissions.canManage;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -12,
      }}
      transition={{
        duration: 0.25,
      }}
      className="space-y-4"
    >

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Target className="w-5 h-5 text-slate-500" />

          <h2 className="text-base font-semibold text-slate-900">
            Targets
          </h2>

          <span className="text-xs text-slate-400 font-medium">
            ({targets.length})
          </span>

        </div>

        {canManage && (
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={onAddTarget}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >

            <Plus className="w-4 h-4" />

            Add Target

          </motion.button>
        )}

      </div>

      {/* ============================================= */}
      {/* TABLE */}
      {/* ============================================= */}

      <TargetTable
        targets={targets}
        canManage={canManage}
        onEdit={onEditTarget}
        onRemove={
          actions.handleRemoveTarget
        }
        isLoading={
          actions.isRemovingTarget
        }
      />

    </motion.div>
  );
};

export default TargetsTab;
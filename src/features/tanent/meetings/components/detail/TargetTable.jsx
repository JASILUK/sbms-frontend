import React from "react";
import { motion } from "framer-motion";
import { Building2, User, Trash2, Pencil } from "lucide-react";

const targetTypeIcons = { department: Building2, employee: User };

const TargetTable = ({ targets = [], canManage, onEdit, onRemove, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="w-40 h-4 bg-slate-100 rounded" />
              <div className="w-24 h-3 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {targets.map((target, idx) => {
          const TypeIcon = targetTypeIcons[target.target_type] || Building2;
          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{target.target_name}</p>
                    <p className="text-xs text-slate-500 capitalize">{target.target_type}</p>
                  </div>
                </div>
                {canManage && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit?.(target.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onRemove?.(target.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-mono">ID: {target.target_id}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {targets.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No targets assigned</p>
          <p className="text-xs text-slate-400 mt-1">This meeting is not restricted to any targets</p>
        </div>
      )}
    </div>
  );
};

export default TargetTable;

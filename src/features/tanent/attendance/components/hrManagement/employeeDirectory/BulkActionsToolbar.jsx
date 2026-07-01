import React from "react";
import PropTypes from "prop-types";

export default function BulkActionsToolbar({ selectedCount, onClearSelection }) {
  if (selectedCount === 0) return null;

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-200 flex items-center gap-6 animate-scale-up"
      role="toolbar" 
      aria-label="Bulk operational tools panel"
    >
      <div className="flex items-center gap-2 text-sm font-medium font-mono border-r border-slate-700 dark:border-slate-300 pr-4">
        <span>{selectedCount} rows selected</span>
        <button 
          type="button" 
          onClick={onClearSelection}
          className="text-xs text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 underline underline-offset-2 ml-1"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => alert("Bulk finalization payload reserved for execution.")}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          Bulk Finalize
        </button>
        <button
          type="button"
          onClick={() => alert("Bulk recalculation tasks stacked into the execution pipeline.")}
          className="bg-slate-800 text-slate-200 hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          Bulk Reprocess
        </button>
      </div>
    </div>
  );
}

BulkActionsToolbar.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onClearSelection: PropTypes.func.isRequired,
};
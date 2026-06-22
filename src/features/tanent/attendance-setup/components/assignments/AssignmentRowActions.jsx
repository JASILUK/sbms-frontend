import React, { useState, useRef, useEffect } from "react";
// FIXED: Using standard ArrowLeftRight cross-version icon component matching local bundles
import { MoreHorizontal, Eye, Edit, ArrowLeftRight, CalendarX, PowerOff } from "lucide-react";

export const AssignmentRowActions = ({ record, onView, onEdit, onTransfer, onEnd, onDeactivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer focus:outline-hidden"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 origin-top-right rounded-lg bg-white shadow-lg border border-slate-200 focus:outline-hidden z-40 py-1 text-slate-700">
          
          <button
            type="button"
            onClick={() => { setIsOpen(false); onView(record.id); }}
            className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" /> View Architecture
          </button>

          {record.is_active && (
            <>
              <button
                type="button"
                onClick={() => { setIsOpen(false); onEdit(record); }}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 text-slate-400" /> Edit Operational Notes
              </button>

              <button
                type="button"
                onClick={() => { setIsOpen(false); onTransfer(record); }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" /> Transfer Shift Target
              </button>

              <button
                type="button"
                onClick={() => { setIsOpen(false); onEnd(record.id); }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
              >
                <CalendarX className="h-3.5 w-3.5" /> Terminate Lifecycle
              </button>

              <button
                type="button"
                onClick={() => { setIsOpen(false); onDeactivate(record.id); }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
              >
                <PowerOff className="h-3.5 w-3.5" /> Deactivate Link
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
};
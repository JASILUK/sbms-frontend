import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit, Star, ShieldAlert, CheckCircle } from "lucide-react";

export const ShiftRowActions = ({ shift, onView, onEdit, onSetDefault, onDeactivate, onActivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer focus:outline-hidden"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 origin-top-right rounded-lg bg-white shadow-lg border border-slate-200 focus:outline-none z-40 py-1">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onView(shift);
            }}
            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" /> View Architecture
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit(shift);
            }}
            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Edit className="h-3.5 w-3.5 text-slate-400" /> Edit Metadata
          </button>

          {/* FIXED: Swapped shift.id with shift.public_id */}
          {shift.is_active && !shift.is_default && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSetDefault(shift.public_id);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50/50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Set Workspace Default
            </button>
          )}

          {shift.is_active ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDeactivate(shift.public_id);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" /> Deactivate Shift
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onActivate(shift.public_id);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Restore Template
            </button>
          )}
        </div>
      )}
    </div>
  );
};
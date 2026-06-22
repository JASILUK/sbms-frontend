import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";

export const HolidayRowActions = ({ onEdit, onDelete, onView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 z-30 w-36 rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none py-1">
          <button
            type="button"
            onClick={() => { onView(); setIsOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            View Meta
          </button>
          <button
            type="button"
            onClick={() => { onEdit(); setIsOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Edit className="h-3.5 w-3.5 text-slate-400" />
            Edit Rule
          </button>
          <button
            type="button"
            onClick={() => { onDelete(); setIsOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer border-t border-slate-50"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
            Remove Record
          </button>
        </div>
      )}
    </div>
  );
};
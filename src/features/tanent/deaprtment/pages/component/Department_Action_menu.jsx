// components/DepartmentActionsMenu.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function DepartmentActionsMenu({ isOpen, onClose, onView, onEdit, onDelete }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.92 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-xl shadow-black/5 py-1.5 z-50 overflow-hidden"
        >
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-60" />

          <button
            onClick={() => { onView(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.8rem] font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50/60 transition-all duration-150 text-left"
          >
            <Eye className="w-4 h-4 text-gray-400" strokeWidth={2} />
            View Department
          </button>

          <button
            onClick={() => { onEdit(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.8rem] font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-150 text-left"
          >
            <Pencil className="w-4 h-4 text-gray-400" strokeWidth={2} />
            Edit Department
          </button>

          <div className="border-t border-gray-100 my-1 mx-3" />

          <button
            onClick={() => { onDelete(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.8rem] font-medium text-red-500 hover:text-red-600 hover:bg-red-50/60 transition-all duration-150 text-left"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            Delete Department
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
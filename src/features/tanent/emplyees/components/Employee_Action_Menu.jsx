// components/EmployeeActionsMenu.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, Pencil, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function EmployeeActionsMenu({ 
  isOpen, 
  onClose, 
  employee, 
  canUpdate, 
  canDelete, 
  canBlock, 
  onBlockToggle, 
  onDelete, 
  isLoading,
  onEdit // Add this prop
}) {
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
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 py-1.5 z-50"
        >
          <Link
            to={`/app/employees/${employee.id}`}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-500" />
            View profile
          </Link>
          
          {canUpdate && onEdit && (
            <button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
              Edit member
            </button>
          )}
          
          {canBlock && (
            <button
              onClick={onBlockToggle}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : employee.is_active ? (
                <>
                  <Ban className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600">Block member</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600">Unblock member</span>
                </>
              )}
            </button>
          )}
          
          {canDelete && (
            <>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={onDelete}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 text-left"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Remove member
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
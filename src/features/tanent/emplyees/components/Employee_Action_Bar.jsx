// components/employees/EmployeeActionsBar.jsx
import { motion } from "framer-motion";
import { Pencil, Ban, CheckCircle, Trash2 } from "lucide-react";

export default function EmployeeActionsBar({
  canUpdate,
  canBlock,
  canDelete,
  isActive,
  onEdit,
  onBlockToggle,
  onDelete
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Actions
        </h3>
      </div>
      
      <div className="p-2 space-y-1">
        {canUpdate && (
          <button
            onClick={onEdit}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            <div className="p-1.5 bg-gray-100 rounded-md">
              <Pencil className="w-4 h-4 text-gray-600" />
            </div>
            Edit member
          </button>
        )}
        
        {canBlock && (
          <button
            onClick={onBlockToggle}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${
              isActive 
                ? "text-rose-600 hover:bg-rose-50" 
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <div className={`p-1.5 rounded-md ${isActive ? "bg-rose-100" : "bg-emerald-100"}`}>
              {isActive ? (
                <Ban className="w-4 h-4 text-rose-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            {isActive ? "Block member" : "Unblock member"}
          </button>
        )}
        
        {canDelete && (
          <>
            <div className="border-t border-gray-100 my-2 mx-2" />
            <button
              onClick={onDelete}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
            >
              <div className="p-1.5 bg-rose-100 rounded-md">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              Remove member
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
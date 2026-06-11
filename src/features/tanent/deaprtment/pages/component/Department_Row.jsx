// components/DepartmentRow.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, GitBranch, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import DepartmentActionsMenu from "./Department_Action_menu";

function getDepartmentIcon(level) {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-amber-500 to-amber-600"
  ];
  return colors[level % colors.length] || colors[0];
}

export default function DepartmentRow({ department, index, onEdit, onView, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const hasParent = department.parent_id !== null && department.parent_id !== undefined;
  const level = hasParent ? 1 : 0;
  const iconGradient = getDepartmentIcon(level);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowMenu(false);
      }}
      className="group hover:bg-violet-50/40 transition-colors duration-200 cursor-pointer"
      onClick={() => onView(department.id)}
    >
      {/* Department Name */}
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3.5">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center text-white shadow-sm`}>
            <Building2 className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {hasParent && (
                <span className="text-gray-400 text-sm">↳</span>
              )}
              <p className="text-[0.85rem] font-semibold text-gray-800 group-hover:text-violet-700 transition-colors duration-200">
                {department.name}
              </p>
            </div>
            {department.description && (
              <p className="text-[0.75rem] text-gray-400 mt-0.5 line-clamp-1 max-w-[220px]">
                {department.description}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Parent */}
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        {department.parent_name ? (
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" strokeWidth={2} />
            <span className="text-[0.8rem] text-gray-600 font-medium truncate">
              {department.parent_name}
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold text-gray-500 bg-gray-100/80 border border-gray-200/60">
            Root
          </span>
        )}
      </td>

      {/* Members */}
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-white group-hover:border-blue-200 transition-all duration-200">
          <Users className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
          <span className="text-[0.8rem] font-semibold text-blue-700 tabular-nums">
            {department.member_count || 0}
          </span>
        </div>
      </td>

      {/* Sub-departments */}
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-all duration-200">
          <GitBranch className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
          <span className="text-[0.8rem] font-semibold text-gray-700 tabular-nums">
            {department.children_count || 0}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          {/* Inline action buttons on hover */}
          <motion.div
            initial={false}
            animate={{ 
              opacity: showActions ? 1 : 0, 
              x: showActions ? 0 : 10,
              pointerEvents: showActions ? "auto" : "none"
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-0.5"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onView(department.id)}
              className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200"
              title="View department"
            >
              <Eye className="w-4 h-4" strokeWidth={2} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(department)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="Edit department"
            >
              <Pencil className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* More menu button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                showMenu 
                  ? 'bg-violet-100 text-violet-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>

            <DepartmentActionsMenu
              isOpen={showMenu}
              onClose={() => setShowMenu(false)}
              department={department}
              onView={() => onView(department.id)}
              onEdit={() => onEdit(department)}
              onDelete={() => onDelete(department.id)}
            />
          </div>
        </div>
      </td>
    </motion.tr>
  );
}
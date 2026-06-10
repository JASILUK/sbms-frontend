// features/roles/components/RoleRow.jsx
import { motion } from "framer-motion";
import { 
  Shield, 
  UserCog, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2, 
  Lock,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function RoleRow({ role, index, onView, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isSystem = role.is_system_role;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      className="group border-b border-gray-100 hover:bg-gray-50/80 transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center shadow-sm
            ${isSystem 
              ? "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600" 
              : "bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600"
            }
          `}>
            {isSystem ? <Lock className="w-5 h-5" /> : <UserCog className="w-5 h-5" />}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{role.name}</h3>
              {isSystem && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                  <Lock className="w-3 h-3" />
                  System
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {role.permissions?.length || 0} permissions
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          ${isSystem 
            ? "bg-amber-50 text-amber-700 border border-amber-100" 
            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          }
        `}>
          {isSystem ? (
            <>
              <Lock className="w-3 h-3" />
              System Role
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Custom Role
            </>
          )}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2">
            {[...Array(Math.min(3, role.permissions?.length || 0))].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white flex items-center justify-center"
              >
                <Shield className="w-3 h-3 text-white" />
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {role.permissions?.length || 0} permissions
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <motion.div
            initial={false}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              x: isHovered ? 0 : 10,
              pointerEvents: isHovered ? "auto" : "none"
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={() => onView(role)}
              className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all duration-200"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {!isSystem && (
              <button
                onClick={() => onEdit(role)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Edit role"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
              >
                <button
                  onClick={() => {
                    onView(role);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                
                {!isSystem && (
                  <>
                    <button
                      onClick={() => {
                        onEdit(role);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Role
                    </button>
                    
                    <div className="border-t border-gray-100 my-1" />
                    
                    <button
                      onClick={() => {
                        onDelete(role);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Role
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </td>
    </motion.tr>
  );
}
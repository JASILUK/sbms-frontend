// features/roles/components/RoleDetailModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Lock, CheckCircle2, UserCog } from "lucide-react";
import { useMemo } from "react";

export default function RoleDetailModal({ role, isOpen, onClose }) {
  const groupedPermissions = useMemo(() => {
    if (!role?.permissions) return {};
    
    return role.permissions.reduce((acc, perm) => {
      const category = perm.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(perm);
      return acc;
    }, {});
  }, [role?.permissions]);

  if (!role) return null;

  const isSystem = role.is_system_role;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${isSystem 
                    ? "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600" 
                    : "bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600"
                  }
                `}>
                  {isSystem ? <Lock className="w-6 h-6" /> : <UserCog className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{role.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
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
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Permissions
                  </h3>
                  <span className="text-sm text-gray-500">
                    {role.permissions?.length || 0} total
                  </span>
                </div>

                {Object.entries(groupedPermissions).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No permissions assigned to this role</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-900">{category}</span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            {perms.length}
                          </span>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {perms.map((perm) => (
                            <div
                              key={perm.id}
                              className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50"
                            >
                              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {perm.name}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">
                                  {perm.code}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
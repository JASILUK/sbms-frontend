// features/roles/components/RoleFormModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Loader2, AlertCircle } from "lucide-react";
import { usePermissions } from "../UsePermissions";
import PermissionSelector from "./Permission_Selector";
import { useCreateRoleMutation, useUpdateRoleMutation } from "../rolesApi"; 

export default function RoleFormModal({ role, isOpen, onClose, onSuccess }) {
  const isEditing = !!role;
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({});

  const { groupedPermissions, isLoading: isLoadingPermissions } = usePermissions();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const isLoading = isCreating || isUpdating || isLoadingPermissions;

  useEffect(() => {
    if (isOpen && role) {
      setName(role.name);
      setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
    } else if (isOpen) {
      setName("");
      setSelectedPermissions([]);
    }
    setErrors({});
  }, [isOpen, role]);

  const handleTogglePermission = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleGroup = (category, select) => {
    const categoryPerms = groupedPermissions.find((g) => g.category === category)?.permissions || [];
    const categoryIds = categoryPerms.map((p) => p.id);

    if (select) {
      setSelectedPermissions((prev) => [...new Set([...prev, ...categoryIds])]);
    } else {
      setSelectedPermissions((prev) => prev.filter((id) => !categoryIds.includes(id)));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Role name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = "Select at least one permission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      permission_ids: selectedPermissions,
    };

    try {
      if (isEditing && role) {
        await updateRole({ id: role.id, data: payload }).unwrap();
      } else {
        await createRole(payload).unwrap();
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else if (err.data?.message) {
        setErrors({ submit: err.data.message });
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    }
  };

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
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? "Edit Role" : "Create Role"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isEditing 
                      ? "Update role permissions and settings" 
                      : "Define a new role with specific permissions"}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Project Manager"
                    disabled={isLoading}
                    className={`
                      w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200
                      ${errors.name 
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                        : "border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Permissions Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Permissions <span className="text-red-500">*</span>
                    </label>
                    <span className="text-sm text-gray-500">
                      {selectedPermissions.length} selected
                    </span>
                  </div>

                  {errors.permissions && (
                    <p className="mb-3 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.permissions}
                    </p>
                  )}

                  {isLoadingPermissions ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <PermissionSelector
                      groups={groupedPermissions}
                      selectedIds={selectedPermissions}
                      onToggle={handleTogglePermission}
                      onToggleGroup={handleToggleGroup}
                      disabled={isLoading}
                    />
                  )}
                </div>

                {errors.submit && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{errors.submit}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-200"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEditing ? "Save Changes" : "Create Role"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
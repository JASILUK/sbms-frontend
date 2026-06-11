// components/DepartmentFormModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Loader2, ChevronDown, AlertCircle } from "lucide-react";
import { 
  useCreateDepartmentMutation, 
  useUpdateDepartmentMutation,
  useGetDepartmentsQuery 
} from "../../departmentApi";

export default function DepartmentFormModal({ 
  isOpen, 
  onClose, 
  department = null,
  onSuccess 
}) {
  const isEditing = !!department;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: null,
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const { data: departmentsData } = useGetDepartmentsQuery(undefined, {
    skip: !isOpen,
  });

  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen && department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
        parent_id: department.parent_id,
      });
    } else if (isOpen) {
      setFormData({ name: "", description: "", parent_id: null });
    }
    setErrors({});
    setFocusedField(null);
  }, [isOpen, department]);

  const availableParents = (departmentsData?.data || []).filter(
    d => d.id !== department?.id
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: formData.name,
      description: formData.description || null,
      parent_id: formData.parent_id,
    };

    try {
      if (isEditing) {
        await updateDepartment({
          id: department.id,
          data: payload,
        }).unwrap();
      } else {
        await createDepartment(payload).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
      } else if (error.data?.message) {
        setErrors({ submit: error.data.message });
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-none flex flex-col"
          >
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {isEditing ? "Edit Department" : "New Department"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {isEditing ? "Update department details and hierarchy" : "Create a new department in your organization"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </motion.button>
            </div>

            {/* Form body - scrollable on mobile */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Department Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-900 placeholder:text-gray-400
                        transition-all duration-200 ease-out
                        ${errors.name 
                          ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                          : 'border-gray-200 bg-gray-50/30 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                        }
                        ${focusedField === 'name' ? 'shadow-sm' : ''}
                      `}
                      placeholder="e.g., Engineering"
                    />
                    {focusedField === 'name' && !errors.name && (
                      <motion.div
                        layoutId="focus-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="text-xs text-red-500 font-medium flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-900 placeholder:text-gray-400
                      transition-all duration-200 ease-out resize-none
                      border-gray-200 bg-gray-50/30 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10
                      ${focusedField === 'description' ? 'shadow-sm' : ''}
                    `}
                    placeholder="Describe the department's purpose and responsibilities..."
                  />
                </div>

                {/* Parent Department */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Parent Department
                  </label>
                  <div className="relative">
                    <select
                      value={formData.parent_id ?? ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        parent_id: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      onFocus={() => setFocusedField('parent')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-900
                        transition-all duration-200 ease-out appearance-none cursor-pointer
                        ${errors.parent_id 
                          ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                          : 'border-gray-200 bg-gray-50/30 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
                        }
                        ${focusedField === 'parent' ? 'shadow-sm' : ''}
                      `}
                    >
                      <option value="">No parent (Root department)</option>
                      {availableParents.map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                  </div>
                  <AnimatePresence>
                    {errors.parent_id && (
                      <motion.p
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="text-xs text-red-500 font-medium flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.parent_id}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Error */}
                <AnimatePresence>
                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 
                  bg-white hover:bg-gray-50 border border-gray-200 rounded-xl 
                  transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white 
                  bg-gradient-to-r from-violet-600 to-indigo-600 
                  hover:from-violet-700 hover:to-indigo-700
                  disabled:opacity-60 disabled:cursor-not-allowed 
                  rounded-xl transition-all duration-200 
                  shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
                  flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isEditing ? "Save Changes" : "Create Department"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, User, Briefcase, Shield, Building2, Laptop } from "lucide-react";
import { useEmployees } from "../useEmployee";

export default function EditEmployeeModal({ employee, close, departments, roles, onSuccess, onError }) {
  const { updateEmployee, isUpdating } = useEmployees();
  
  const [formData, setFormData] = useState({
    role_id: employee.role || "",
    department_id: employee.department || "",
    // FIXED: Changed from 'name' to 'username' to align with Django model architecture requirements
    username: employee.username || "",
    title: employee.job_title || "",
    work_mode: employee.work_mode || "office"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "" && v !== null)
    );

    try {
      await updateEmployee({
        id: employee.id,
        data: payload
      }).unwrap();
      
      onSuccess?.();
      close();
    } catch (err) {
      onError?.(err?.data?.message || "Update failed");
    }
  };

  const inputClasses = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit member</h2>
            <p className="text-sm text-gray-500 mt-0.5">Update employee information</p>
          </div>
          <button
            onClick={close}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClasses}>Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  // FIXED: Targets 'username' matching backend validation structures
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClasses}>Job title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className={`${inputClasses} pl-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10`}
                >
                  <option value="">Select role</option>
                  {roles?.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={`${inputClasses} pl-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10`}
                >
                  <option value="">Select department</option>
                  {departments?.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClasses}>Operational Work Mode</label>
              <div className="relative">
                {formData.work_mode === "remote" ? (
                  <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                ) : (
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className={`${inputClasses} pl-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10`}
                >
                  <option value="office">Office Base</option>
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid Mix</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
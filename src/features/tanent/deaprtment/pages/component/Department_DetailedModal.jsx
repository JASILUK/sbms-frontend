// components/DepartmentDetailModal.jsx
import { motion } from "framer-motion";
import { X, Building2, Users, GitBranch, Calendar, ArrowLeft } from "lucide-react";
import { useGetDepartmentDetailQuery } from "../../departmentApi";

export default function DepartmentDetailModal({ id, close }) {
  const { data, isLoading } = useGetDepartmentDetailQuery(id);
  const department = data?.data;

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
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : !department ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Department not found</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <button
                onClick={close}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to departments
              </button>
              <button
                onClick={close}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Building2 className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{department.name}</h2>
                  {department.description && (
                    <p className="text-sm text-gray-500 mt-1">{department.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Members</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{department.member_count || 0}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <GitBranch className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Sub-departments</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{department.children_count || 0}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Department Details</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-sm text-gray-500">Parent Department</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {department.parent_name || <span className="text-gray-400 italic">None</span>}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-sm text-gray-500">Created</dt>
                      <dd className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {department.created_at 
                          ? new Date(department.created_at).toLocaleDateString()
                          : "-"
                        }
                      </dd>
                    </div>
                  </dl>
                </div>

                {department.children && department.children.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Sub-departments</h3>
                    <ul className="space-y-2">
                      {department.children.map((child) => (
                        <li 
                          key={child.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{child.name}</p>
                            <p className="text-xs text-gray-500">{child.member_count || 0} members</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
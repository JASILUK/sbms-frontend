// components/DepartmentTable.jsx
import { motion } from "framer-motion";
import { Building2, Plus, Users, GitBranch, Eye, Pencil, Trash2 } from "lucide-react";
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from "../../departmentApi";
import DepartmentRow from "./Department_Row";

const COL_HEADERS = [
  { label: "Department", width: "min-w-[220px]" },
  { label: "Parent", width: "min-w-[160px]" },
  { label: "Members", width: "min-w-[100px]" },
  { label: "Sub-Departments", width: "min-w-[130px]" },
  { label: "", width: "min-w-[80px]" }
];

// Skeleton loader component
function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex gap-4">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-8" />
      </div>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-gray-50 flex items-center gap-4 animate-pulse">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gray-100" />
            <div className="space-y-2">
              <div className="w-32 h-3.5 bg-gray-100 rounded" />
              <div className="w-20 h-2.5 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="w-24 h-3 bg-gray-100 rounded" />
          <div className="w-12 h-3 bg-gray-100 rounded" />
          <div className="w-16 h-3 bg-gray-100 rounded" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// Mobile card skeleton
function MobileCardSkeleton() {
  return (
    <div className="md:hidden space-y-3">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100/80 p-4 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100" />
            <div className="space-y-2 flex-1">
              <div className="w-28 h-4 bg-gray-100 rounded" />
              <div className="w-20 h-2.5 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <div className="w-16 h-6 bg-gray-100 rounded-lg" />
            <div className="w-16 h-6 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Premium Empty State
function EmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-2xl border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/20" />

      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-12 w-16 h-16 rounded-2xl bg-violet-100/40 border border-violet-200/30"
      />
      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-16 left-16 w-12 h-12 rounded-xl bg-blue-100/40 border border-blue-200/30"
      />

      <div className="relative flex flex-col items-center justify-center py-20 sm:py-24 px-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-violet-500/20 rounded-3xl blur-2xl scale-150" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 shadow-xl shadow-violet-500/20 flex items-center justify-center">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight"
        >
          No departments yet
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm sm:text-[0.9rem] text-gray-500 max-w-sm mb-8 leading-relaxed"
        >
          Build your organizational structure by creating departments to manage teams, hierarchies, and workflows efficiently.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreate}
          className="group inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 transition-all duration-300"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Create your first department
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function DepartmentTable({ onEdit, onView, onCreate }) {
  const { data, isLoading } = useGetDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const departments = data?.data || [];

  if (isLoading) {
    return (
      <>
        <div className="hidden md:block">
          <TableSkeleton />
        </div>
        <MobileCardSkeleton />
      </>
    );
  }

  if (departments.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Desktop Table - with horizontal scroll when overflow */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div 
          className="overflow-x-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent'
          }}
        >
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #d1d5db;
              border-radius: 9999px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #9ca3af;
            }
          `}</style>
          <table className="w-full min-w-[700px] custom-scrollbar">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                {COL_HEADERS.map((header, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-left text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.08em] ${header.width}`}
                    style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departments.map((department, i) => (
                <DepartmentRow
                  key={department.id}
                  department={department}
                  index={i}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={(id) => deleteDepartment(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Stack - ALWAYS visible on small screens */}
      <div className="md:hidden space-y-3">
        <div className="px-1 pb-2">
          <p className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.08em]">
            {departments.length} Department{departments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {departments.map((dep, i) => (
          <motion.div
            key={dep.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.995 }}
            className="group bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden"
          >
            {/* Clickable card body - navigates to detail */}
            <div 
              className="p-4 cursor-pointer active:bg-gray-50/50 transition-colors"
              onClick={() => onView(dep.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100/60 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-500" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9rem] font-semibold text-gray-800 truncate">
                      {dep.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {dep.parent_name ? (
                        <>
                          <GitBranch className="w-3 h-3 text-gray-300" strokeWidth={2} />
                          <span className="text-[0.75rem] text-gray-400 truncate">
                            {dep.parent_name}
                          </span>
                        </>
                      ) : (
                        <span className="text-[0.75rem] text-gray-400">Root department</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-3 ml-[52px]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100">
                  <Users className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                  <span className="text-[0.75rem] text-blue-700 font-semibold">
                    {dep.member_count ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100">
                  <GitBranch className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                  <span className="text-[0.75rem] text-gray-600 font-semibold">
                    {dep.children_count ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons bar - always visible on mobile */}
            <div className="flex items-center border-t border-gray-50 divide-x divide-gray-50">
              <button
                onClick={() => onView(dep.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[0.8rem] font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50/50 active:bg-violet-100/30 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                View
              </button>
              <button
                onClick={() => onEdit(dep)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[0.8rem] font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 active:bg-blue-100/30 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this department?')) {
                    deleteDepartment(dep.id);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[0.8rem] font-medium text-red-500 hover:text-red-600 hover:bg-red-50/50 active:bg-red-100/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
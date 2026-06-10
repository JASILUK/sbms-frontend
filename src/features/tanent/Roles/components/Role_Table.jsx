// features/roles/components/RoleTable.jsx
import { motion } from "framer-motion";
import { Shield, Plus } from "lucide-react";
import RoleRow from "./Role_Row";
import RoleHeader from "./Role_Header";

export default function RoleTable({
  roles,
  isLoading,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  onCreateClick,
  onView,
  onEdit,
  onDelete,
  onRefresh,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="space-y-6">
        <RoleHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filter={filter}
          onFilterChange={onFilterChange}
          onCreateClick={onCreateClick}
          onRefresh={onRefresh}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? "No roles found" : "No roles yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            {searchQuery 
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by creating your first custom role for your team."
            }
          </p>
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Role
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoleHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={onFilterChange}
        onCreateClick={onCreateClick}
        onRefresh={onRefresh}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  index={index}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
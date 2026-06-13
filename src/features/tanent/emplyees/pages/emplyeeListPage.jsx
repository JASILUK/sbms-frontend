// pages/EmployeeListPage.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEmployees } from "../useEmployee";
import { useDepartments } from "../../deaprtment/useDepartment";
import { useRoles } from "../../Roles/useRole";
import { usePermission } from "../../../auth/usePermission";
import { PERMISSIONS } from "../../../../shared/constants/permissions";

import EmployeeHeader from "../components/Employee_Header";
import EmployeeStats from "../components/Employee_States";
import EmployeeFilters from "../components/Employee_Filter";
import EmployeeTable from "../components/Employee_Table";
import EmptyState from "../components/Empty_states";
import InviteEmployeeModal from "../components/CreateEmplyee";

export default function EmployeeListPage() {
  const { employees, isLoadingList, listError, stats } = useEmployees();
  const { departments, isLoading: isLoadingDepts } = useDepartments();
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const { hasPermission } = usePermission();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "all",
    role: "all",
    status: "all"
  });
  const [showInviteModal, setShowInviteModal] = useState(false);

  const canCreate = hasPermission(PERMISSIONS.EMPLOYEE.CREATE);
  const canUpdate = hasPermission(PERMISSIONS.EMPLOYEE.UPDATE);
  const canDelete = hasPermission(PERMISSIONS.EMPLOYEE.DELETE);
  const canBlock = hasPermission(PERMISSIONS.EMPLOYEE.BLOCK);

  const isLoading = isLoadingList || isLoadingDepts || isLoadingRoles;

  // Filter logic
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    
    return employees.filter(emp => {
      const matchesSearch = 
        emp.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = filters.department === "all" || emp.department === filters.department;
      const matchesRole = filters.role === "all" || emp.role === filters.role;
      const matchesStatus = filters.status === "all" || 
        (filters.status === "active" ? emp.is_active : !emp.is_active);
      
      return matchesSearch && matchesDept && matchesRole && matchesStatus;
    });
  }, [employees, searchQuery, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ department: "all", role: "all", status: "all" });
    setSearchQuery("");
  };

  const hasActiveFilters = filters.department !== "all" || 
    filters.role !== "all" || 
    filters.status !== "all" ||
    searchQuery !== "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (listError) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load team data</h3>
          <p className="text-gray-500 mb-4">
            {listError?.data?.message || listError?.message || "Please try again later"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <EmployeeHeader 
          onInvite={() => setShowInviteModal(true)}
          canCreate={canCreate}
        />

        <EmployeeStats 
          stats={stats}
          employees={employees}
          departments={departments}
        />

        <EmployeeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          roles={roles}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {filteredEmployees.length === 0 ? (
          <EmptyState 
            onInvite={() => setShowInviteModal(true)}
            canCreate={canCreate}
            hasSearch={searchQuery !== ""}
          />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            departments={departments}
            roles={roles}
            canUpdate={canUpdate}
            canDelete={canDelete}
            canBlock={canBlock}
          />
        )}

      </div>

      <AnimatePresence>
        {showInviteModal && (
          <InviteEmployeeModal
            close={() => setShowInviteModal(false)}
            departments={departments}
            roles={roles}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
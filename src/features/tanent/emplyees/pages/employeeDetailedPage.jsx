// components/employees/EmployeeDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Pencil, Ban, Trash2, Mail, Building2, Shield, User, Briefcase } from "lucide-react";

import { useEmployees } from "../useEmployee";
import { useDepartments } from "../../deaprtment/useDepartment";
import { useRoles } from "../../Roles/useRole";
import { usePermission } from "../../../auth/usePermission";
import { PERMISSIONS } from "../../../../shared/constants/permissions";

import EmployeeProfileHeader from "../components/Employee_Profile_header";
import EmployeeProfileCard from "../components/Employee_Profile_card";
import EmployeeInfoSection from "../components/Employee_Info_section";
import EmployeeActionsBar from "../components/Employee_Action_Bar";
import EditEmployeeModal from "../components/edit_emplyee_form";

export default function EmployeeDetail() {
  const { id } = useParams();
  const { employeeDetail, isLoadingDetail, blockEmployee, unblockEmployee, deleteEmployee } = useEmployees(id);
  const { departments } = useDepartments();
  const { roles } = useRoles();
  const { hasPermission } = usePermission();

  const [openEdit, setOpenEdit] = useState(false);
  const [toast, setToast] = useState(null);

  const canUpdate = hasPermission(PERMISSIONS.EMPLOYEE.UPDATE);
  const canBlock = hasPermission(PERMISSIONS.EMPLOYEE.BLOCK);
  const canDelete = hasPermission(PERMISSIONS.EMPLOYEE.DELETE);

  if (isLoadingDetail) {
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

  if (!employeeDetail) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee not found</h3>
          <Link to="/app/employees" className="text-blue-600 hover:text-blue-700 font-medium">
            Return to team members
          </Link>
        </div>
      </div>
    );
  }

  const dept = departments?.find(d => d.id === employeeDetail.department);
  const role = roles?.find(r => r.id === employeeDetail.role);

  const handleBlockToggle = async () => {
    try {
      if (employeeDetail.is_active) {
        await blockEmployee(employeeDetail.id);
      } else {
        await unblockEmployee(employeeDetail.id);
      }
    } catch (err) {
      setToast({ type: "error", message: err?.data?.message || "Action failed" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove this employee? This action cannot be undone.")) {
      try {
        await deleteEmployee(employeeDetail.id);
      } catch (err) {
        setToast({ type: "error", message: err?.data?.message || "Delete failed" });
      }
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              toast.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmployeeProfileHeader
          employee={employeeDetail}
          department={dept}
          onBack={() => window.history.back()}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EmployeeProfileCard
              employee={employeeDetail}
              department={dept}
              role={role}
            />
            
            <EmployeeInfoSection
              employee={employeeDetail}
              department={dept}
              role={role}
            />
          </div>

          <div className="space-y-6">
            <EmployeeActionsBar
              canUpdate={canUpdate}
              canBlock={canBlock}
              canDelete={canDelete}
              isActive={employeeDetail.is_active}
              onEdit={() => setOpenEdit(true)}
              onBlockToggle={handleBlockToggle}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openEdit && (
          <EditEmployeeModal
            employee={employeeDetail}
            close={() => setOpenEdit(false)}
            departments={departments}
            roles={roles}
            onSuccess={() => showToast("Employee updated successfully")}
            onError={(msg) => showToast(msg, "error")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
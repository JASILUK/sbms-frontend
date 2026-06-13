// components/EmployeeRow.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoreHorizontal, Eye, Pencil, Ban, CheckCircle, Trash2, Mail } from "lucide-react";
import { useEmployees } from "../useEmployee";
import EmployeeActionsMenu from "./Employee_Action_Menu";
import EditEmployeeModal from "./edit_emplyee_form";

function getInitials(name, email) {
  if (name) {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

function getAvatarGradient(id) {
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600"
  ];
  
  if (!id) {
    return gradients[0];
  }
  
  const idString = String(id);
  const index = idString.charCodeAt(0) || 0;
  
  return gradients[index % gradients.length];
}

export default function EmployeeRow({ 
  employee, 
  index, 
  departments, 
  roles, 
  canUpdate, 
  canDelete, 
  canBlock 
}) {
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Add modal state
  
  const { blockEmployee, unblockEmployee, deleteEmployee, isBlocking, isUnblocking, isDeleting } = useEmployees();

  if (!employee) {
    return null;
  }

  const department = departments?.find(d => d.id === employee.department);
  const role = roles?.find(r => r.id === employee.role);
  
  const initials = getInitials(employee.username, employee.user_email);
  const avatarGradient = getAvatarGradient(employee.id);

  const handleBlockToggle = async () => {
    if (employee.is_active) {
      await blockEmployee(employee.id);
    } else {
      await unblockEmployee(employee.id);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove this employee? This action cannot be undone.")) {
      await deleteEmployee(employee.id);
    }
  };

  const isLoading = isBlocking || isUnblocking || isDeleting;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {
          setShowActions(false);
          setShowMenu(false);
        }}
        className="group hover:bg-gray-50/80 transition-colors duration-200"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white`}>
              {initials}
            </div>
            <div>
              <p className="font-medium text-gray-900">{employee.username || "Unnamed"}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {employee.user_email || employee.email || "-"}
              </p>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {role?.name || employee.role_name || "No Role"}
          </span>
        </td>
        
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {department?.name || employee.department_name || "-"}
          </span>
        </td>
        
        <td className="px-6 py-4">
          {employee.is_active ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
              Blocked
            </span>
          )}
        </td>
        
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <motion.div 
              initial={false}
              animate={{ 
                opacity: showActions ? 1 : 0, 
                x: showActions ? 0 : 10,
                pointerEvents: showActions ? "auto" : "none"
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              <Link
                to={`/app/employees/${employee.id}`}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="View profile"
              >
                <Eye className="w-4 h-4" />
              </Link>
              
              {canUpdate && (
                <button
                  onClick={() => setShowEditModal(true)} // Open modal instead of Link
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Edit member"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </motion.div>

            <div className="relative static">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <EmployeeActionsMenu
                isOpen={showMenu}
                onClose={() => setShowMenu(false)}
                employee={employee}
                canUpdate={canUpdate}
                canDelete={canDelete}
                canBlock={canBlock}
                onBlockToggle={handleBlockToggle}
                onDelete={handleDelete}
                isLoading={isLoading}
                onEdit={() => setShowEditModal(true)} // Also add to dropdown menu
              />
            </div>
          </div>
        </td>
      </motion.tr>

      {/* Edit Modal */}
      {showEditModal && (
        <EditEmployeeModal
          employee={employee}
          close={() => setShowEditModal(false)}
          departments={departments}
          roles={roles}
        />
      )}
    </>
  );
}
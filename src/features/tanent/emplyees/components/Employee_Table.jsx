// components/EmployeeTable.jsx
import { motion } from "framer-motion";
import EmployeeRow from "./Employee_row";
import { useState } from "react";

function SafeEmployeeRow({ employee, index, ...props }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <tr className="border-b border-gray-100">
        <td colSpan="5" className="px-6 py-4 text-sm text-red-600 bg-red-50/50">
          Error displaying employee data. Please refresh the page.
        </td>
      </tr>
    );
  }

  try {
    if (!employee || typeof employee !== 'object') {
      console.warn('Invalid employee data:', employee);
      return null;
    }

    return (
      <EmployeeRow 
        employee={employee} 
        index={index} 
        {...props} 
      />
    );
  } catch (error) {
    console.error('Error rendering employee row:', error);
    setHasError(true);
    return null;
  }
}

export default function EmployeeTable({ 
  employees, 
  departments, 
  roles, 
  canUpdate, 
  canDelete, 
  canBlock 
}) {
  const validEmployees = employees?.filter(emp => 
    emp && typeof emp === 'object' && emp.id !== undefined
  ) || [];

  if (validEmployees.length === 0 && employees?.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center"
      >
        <p className="text-gray-500">Some employee data could not be loaded.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="overflow-x-auto overflow-visible">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">
                Member
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {validEmployees.map((employee, index) => (
              <SafeEmployeeRow
                key={employee.id || index}
                employee={employee}
                index={index}
                departments={departments}
                roles={roles}
                canUpdate={canUpdate}
                canDelete={canDelete}
                canBlock={canBlock}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
        <span>Showing {validEmployees.length} members</span>
        <span className="text-xs text-gray-400">Sorted by name</span>
      </div>
    </motion.div>
  );
}
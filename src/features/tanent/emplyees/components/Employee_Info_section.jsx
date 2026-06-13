// components/employees/EmployeeInfoSection.jsx
import { motion } from "framer-motion";
import { Mail, User, Briefcase, Building2, Shield, Laptop } from "lucide-react";

export default function EmployeeInfoSection({ employee, department, role }) {
  const fields = [
    { label: "Email", value: employee.user_email || employee.email || "-", icon: Mail },
    { label: "Username", value: employee.username || "-", icon: User },
    { label: "Job Title", value: employee.job_title || "-", icon: Briefcase },
    { label: "Department", value: department?.name || employee.department_name || "-", icon: Building2 },
    { label: "Role", value: role?.name || employee.role_name || "-", icon: Shield },
    // FIXED: Added read-only work mode data visualization row
    { 
      label: "Work Mode", 
      value: employee.work_mode_display || employee.work_mode || "-", 
      icon: employee.work_mode === "remote" ? Laptop : Building2 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Employee Information
        </h3>
      </div>
      
      <div className="p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="group"
              >
                <dt className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {field.label}
                </dt>
                <dd className="text-sm font-medium text-gray-900 pl-5.5 capitalize">
                  {field.value}
                </dd>
              </motion.div>
            );
          })}
        </dl>
      </div>
    </motion.div>
  );
}
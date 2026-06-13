// components/employees/EmployeeProfileHeader.jsx
import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeProfileHeader({ employee, department, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-4"
    >
      <Link
        to="/app/employees"
        className="mt-1 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          {employee.username || "Unnamed"}
        </h1>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <Building2 className="w-4 h-4" />
          <span>{department?.name || employee.department_name || "No department"}</span>
        </div>
      </div>
    </motion.div>
  );
}
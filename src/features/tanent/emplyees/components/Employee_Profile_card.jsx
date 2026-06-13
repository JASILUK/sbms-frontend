// components/employees/EmployeeProfileCard.jsx
import { motion } from "framer-motion";
import { Mail, Shield, Building2 } from "lucide-react";

function getInitials(name, email) {
  if (name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }
  return email?.[0].toUpperCase() || "?";
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
  if (!id) return gradients[0];
  return gradients[String(id).charCodeAt(0) % gradients.length];
}

export default function EmployeeProfileCard({ employee, department, role }) {
  const initials = getInitials(employee.username, employee.user_email);
  const gradient = getAvatarGradient(employee.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
    >
      <div className="flex items-start gap-4">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
          {initials}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {employee.username || "Unnamed"}
          </h2>
          <a 
            href={`mailto:${employee.user_email}`}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1.5 mt-1"
          >
            <Mail className="w-3.5 h-3.5" />
            {employee.user_email || employee.email || "-"}
          </a>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <Shield className="w-3.5 h-3.5" />
              {role?.name || employee.role_name || "No Role"}
            </span>
            
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              employee.is_active 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                : "bg-rose-50 text-rose-700 border-rose-100"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${employee.is_active ? "bg-emerald-500" : "bg-rose-500"}`} />
              {employee.is_active ? "Active" : "Blocked"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
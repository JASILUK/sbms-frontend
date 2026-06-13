import React from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Building2 } from "lucide-react";

const statConfig = [
  { 
    key: "total", 
    label: "Total Members", 
    icon: Users, 
    activeColor: "text-blue-600", 
    bgColor: "bg-blue-50" 
  },
  { 
    key: "active", 
    label: "Active Members", 
    icon: UserCheck, 
    activeColor: "text-emerald-600", 
    bgColor: "bg-emerald-50" 
  },
  { 
    key: "blocked", 
    label: "Blocked Members", 
    icon: UserX, 
    activeColor: "text-rose-600", 
    bgColor: "bg-rose-50" 
  },
  { 
    key: "departments", 
    label: "Departments", 
    icon: Building2, 
    activeColor: "text-violet-600", 
    bgColor: "bg-violet-50" 
  }
];

export default function EmployeeStats({ stats, employees, departments }) {
  const computedStats = {
    total: stats?.total || employees?.length || 0,
    active: stats?.active || employees?.filter(e => e.is_active).length || 0,
    blocked: stats?.blocked || employees?.filter(e => !e.is_active).length || 0,
    departments: departments?.length || 0
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const value = computedStats[stat.key];
        
        return (
          <motion.div
            key={stat.key}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="group relative flex flex-col justify-between p-5 md:p-6 bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Minimal logic-less accent bar */}
            <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.activeColor.replace('text', 'bg')}`} />

            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg border border-transparent ${stat.bgColor} ${stat.activeColor} transition-colors duration-300`}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[13px] font-medium text-slate-500 tracking-tight">
                {stat.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tighter">
                {value.toLocaleString()}
              </h3>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total
              </span>
            </div>

            {/* Subtle background flair typical of Vercel/Linear dashboards */}
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
              <Icon size={80} strokeWidth={1} />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
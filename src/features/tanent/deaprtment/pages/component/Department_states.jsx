// components/DepartmentStats.jsx
import { motion } from "framer-motion";
import { Building2, Users, Network, GitBranch, TrendingUp } from "lucide-react";
import { useGetDepartmentsQuery } from "../../departmentApi";

export default function DepartmentStats() {
  const { data } = useGetDepartmentsQuery();
  const departments = data?.data || [];

  const stats = {
    total: departments.length,
    members: departments.reduce((acc, d) => acc + (d.member_count || 0), 0),
    root: departments.filter(d => !d.parent_id).length,
    children: departments.filter(d => d.parent_id).length
  };

  const statConfig = [
    { 
      key: "total", 
      label: "Total Departments", 
      shortLabel: "Total",
      icon: Building2, 
      gradient: "from-slate-500 to-slate-600",
      bgGradient: "from-slate-50 to-slate-100/50",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      borderColor: "border-slate-200/60",
      shadowColor: "shadow-slate-500/10",
      ringColor: "ring-slate-500/10"
    },
    { 
      key: "members", 
      label: "Total Members", 
      shortLabel: "Members",
      icon: Users, 
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/30",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200/60",
      shadowColor: "shadow-blue-500/10",
      ringColor: "ring-blue-500/10"
    },
    { 
      key: "root", 
      label: "Root Departments", 
      shortLabel: "Root",
      icon: Network, 
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100/30",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200/60",
      shadowColor: "shadow-emerald-500/10",
      ringColor: "ring-emerald-500/10"
    },
    { 
      key: "children", 
      label: "Sub-Departments", 
      shortLabel: "Sub-depts",
      icon: GitBranch, 
      gradient: "from-violet-500 to-violet-600",
      bgGradient: "from-violet-50 to-violet-100/30",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      borderColor: "border-violet-200/60",
      shadowColor: "shadow-violet-500/10",
      ringColor: "ring-violet-500/10"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {statConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.2 + index * 0.08, 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            whileHover={{ 
              y: -3, 
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className={`group relative bg-white rounded-2xl border ${stat.borderColor} 
              p-4 sm:p-5 
              shadow-sm hover:shadow-lg ${stat.shadowColor}
              transition-all duration-300 ease-out
              cursor-default overflow-hidden`}
          >
            {/* Subtle gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Animated top accent line */}
            <motion.div 
              className={`absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r ${stat.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
            />

            <div className="relative flex items-center gap-3 sm:gap-4">
              {/* Icon container with premium styling */}
              <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.iconBg} 
                flex items-center justify-center 
                group-hover:scale-110 group-hover:rotate-3
                transition-transform duration-300 ease-out`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={1.75} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:block">
                  {stat.label}
                </p>
                <p className="text-[0.7rem] text-gray-400 font-semibold uppercase tracking-wider sm:hidden">
                  {stat.shortLabel}
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <motion.p 
                    className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums tracking-tight"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {stats[stat.key].toLocaleString()}
                  </motion.p>
                  {stat.key === 'members' && stats.total > 0 && (
                    <span className="text-[0.65rem] text-gray-400 font-medium hidden sm:inline">
                      avg {(stats.members / stats.total).toFixed(1)} per dept
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom subtle glow on hover */}
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-t ${stat.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full`} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
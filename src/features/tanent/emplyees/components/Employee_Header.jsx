// components/EmployeeHeader.jsx
import { motion } from "framer-motion";
import { Users, Plus, Upload, UserPlus } from "lucide-react";

export default function EmployeeHeader({ onInvite, canCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Team Members
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your workspace members and permissions.
        </p>
      </div>

      <div className="flex items-center gap-3">
        

        {canCreate && (
          <motion.button
            whileHover={{ scale: 1.025, boxShadow: "0 4px 20px rgba(59,130,246,0.28)" }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={onInvite}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8rem] font-medium text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-600/30 shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-150"
            style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
          >
            <UserPlus
              className="w-3.5 h-3.5 opacity-90 transition-transform duration-150 group-hover:-translate-y-px"
              strokeWidth={2}
            />
            Invite Member
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
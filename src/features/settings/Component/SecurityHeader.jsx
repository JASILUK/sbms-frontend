// features/settings/security/components/SecurityHeader.jsx
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function SecurityHeader({ title, subtitle }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
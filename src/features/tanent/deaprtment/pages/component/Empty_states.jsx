// components/EmptyState.jsx
import { motion } from "framer-motion";
import { Building2, Plus } from "lucide-react";

export default function EmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Building2 className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No departments created yet
      </h3>
      
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        Get started by creating your first department to organize your team structure.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create your first department
      </motion.button>
    </motion.div>
  );
}
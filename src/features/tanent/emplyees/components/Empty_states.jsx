// components/EmptyState.jsx
import { motion } from "framer-motion";
import { Users, Plus, Search } from "lucide-react";

export default function EmptyState({ onInvite, canCreate, hasSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {hasSearch ? (
          <Search className="w-10 h-10 text-gray-400" />
        ) : (
          <Users className="w-10 h-10 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasSearch ? "No members found" : "No team members yet"}
      </h3>
      
      <p className="text-gray-500 max-w-sm mx-auto mb-8">
        {hasSearch 
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by inviting your first team member to collaborate on your workspace."
        }
      </p>
      
      {!hasSearch && canCreate && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onInvite}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Invite your first employee
        </motion.button>
      )}
    </motion.div>
  );
}
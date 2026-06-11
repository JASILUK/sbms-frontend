// components/TransferMemberModal.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, Check, Loader2, X, Building2, Users } from "lucide-react";
import { useGetDepartmentsQuery } from "../../departmentApi";

export default function TransferMemberModal({
  open,
  onClose,
  member,
  currentDepartmentId,
  onTransfer,
  isSubmitting = false,
}) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const { data, isLoading } = useGetDepartmentsQuery();
  const departments = data?.data || [];

  useEffect(() => {
    if (open) {
      setSelectedDepartmentId(null);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, isSubmitting, onClose]);

  const availableDepartments = useMemo(() => {
    return departments.filter((department) => department.id !== currentDepartmentId);
  }, [departments, currentDepartmentId]);

  const handleTransfer = () => {
    if (!selectedDepartmentId) return;
    onTransfer({
      membershipId: member.membership_id,
      toDepartmentId: selectedDepartmentId,
    });
  };

  if (!open || !member) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-xl bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Transfer Member</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Move to another department</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Selected Member Card */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/30 border border-blue-100/60">
                <p className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">Selected Member</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {member.name
                      ? member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : "?"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </div>
              </div>

              {/* Department List */}
              <p className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Select Target Department
              </p>

              <div className="space-y-2">
                {isLoading && (
                  <div className="py-10 flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 border-blue-200 border-t-blue-600"
                    />
                    <p className="text-sm text-gray-400">Loading departments...</p>
                  </div>
                )}

                {!isLoading && availableDepartments.length === 0 && (
                  <div className="py-10 text-center">
                    <div className="relative mx-auto mb-4 w-14 h-14">
                      <div className="absolute inset-0 bg-gray-500/10 rounded-2xl blur-xl scale-150" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No departments available</h3>
                    <p className="text-sm text-gray-500">Create more departments to enable transfers</p>
                  </div>
                )}

                {availableDepartments.map((department) => {
                  const active = selectedDepartmentId === department.id;
                  return (
                    <motion.button
                      key={department.id}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setSelectedDepartmentId(department.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        active
                          ? "border-blue-400 bg-gradient-to-r from-blue-50/80 to-blue-100/30 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Building2 className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-gray-900">{department.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Users className="w-3 h-3 text-gray-400" strokeWidth={2} />
                            <span className="text-[0.8rem] text-gray-500">{department.member_count} members</span>
                          </div>
                        </div>
                      </div>

                      {active && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTransfer}
                disabled={!selectedDepartmentId || isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Member
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
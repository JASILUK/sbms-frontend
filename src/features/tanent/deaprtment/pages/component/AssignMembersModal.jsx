// components/AssignMembersModal.jsx
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, X, Check, UserPlus, Loader2 } from "lucide-react";
import { useGetEmployeesQuery } from "../../../emplyees/emplyeeApi";
import { useAssignDepartmentMembersMutation } from "../../departmentApi";

export default function AssignMembersModal({ open, onClose, department }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const { data, isLoading } = useGetEmployeesQuery();
  const [assignMembers, { isLoading: assigning }] = useAssignDepartmentMembersMutation();

  const employees = data?.data || [];

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setSearch("");
      setSelected([]);
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
      if (e.key === 'Escape' && open && !assigning) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, assigning, onClose]);

  const existingIds = useMemo(() => {
    return department?.members?.map((member) => member.membership_id) || [];
  }, [department]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const alreadyAssigned = existingIds.includes(employee.id);
      if (alreadyAssigned) return false;
      const query = search.toLowerCase();
      const employeeName = (employee.username || "").toLowerCase();
      const employeeEmail = (employee.user_email || "").toLowerCase();
      return employeeName.includes(query) || employeeEmail.includes(query);
    });
  }, [employees, existingIds, search]);

  const toggleMember = (membershipId) => {
    setSelected((prev) => {
      if (prev.includes(membershipId)) {
        return prev.filter((id) => id !== membershipId);
      }
      return [...prev, membershipId];
    });
  };

  const handleAssign = async () => {
    if (selected.length === 0) return;
    try {
      await assignMembers({
        departmentId: department.id,
        membershipIds: selected,
      }).unwrap();
      setSelected([]);
      setSearch("");
      onClose();
    } catch (error) {
      console.error("Failed to assign members", error);
    }
  };

  if (!open) return null;

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
            onClick={!assigning ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-2xl bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Assign Members</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Add employees to {department?.name}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={assigning}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search employees by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/30 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Selected count */}
              <AnimatePresence>
                {selected.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 border border-violet-100"
                  >
                    <Users className="w-4 h-4 text-violet-500" strokeWidth={2} />
                    <span className="text-sm font-semibold text-violet-700">{selected.length} selected</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* List */}
              <div className="space-y-2">
                {isLoading && (
                  <div className="py-12 flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 border-violet-200 border-t-violet-600"
                    />
                    <p className="text-sm text-gray-400">Loading employees...</p>
                  </div>
                )}

                {!isLoading && filteredEmployees.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="relative mx-auto mb-4 w-14 h-14">
                      <div className="absolute inset-0 bg-gray-500/10 rounded-2xl blur-xl scale-150" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No employees found</h3>
                    <p className="text-sm text-gray-500">
                      {search ? "Try adjusting your search terms" : "All employees are already assigned"}
                    </p>
                  </div>
                )}

                {filteredEmployees.map((employee) => {
                  const checked = selected.includes(employee.id);
                  const initials = employee.username
                    ? employee.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "?";

                  return (
                    <motion.button
                      key={employee.id}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => toggleMember(employee.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        checked
                          ? "border-violet-400 bg-gradient-to-r from-violet-50/80 to-violet-100/30 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                          checked
                            ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {checked ? <Check className="w-4 h-4" strokeWidth={3} /> : initials}
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-gray-900">{employee.username}</h3>
                          <p className="text-[0.8rem] text-gray-400">{employee.user_email}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        checked
                          ? "bg-violet-600 border-violet-600"
                          : "border-gray-300"
                      }`}>
                        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
              <p className="text-sm text-gray-500 font-medium">
                {selected.length} of {filteredEmployees.length} selected
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={assigning}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAssign}
                  disabled={assigning || selected.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20"
                >
                  {assigning && <Loader2 className="w-4 h-4 animate-spin" />}
                  {assigning ? "Assigning..." : "Assign Members"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
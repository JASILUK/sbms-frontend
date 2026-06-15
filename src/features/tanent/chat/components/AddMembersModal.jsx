import { memo, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, UserPlus, Loader2, Users } from "lucide-react";
import { useGetEmployeesQuery } from "../../emplyees/emplyeeApi";
import { useTenantContext } from "../../tanatContextHook";
import { useAddGroupMembersMutation } from "../chatApi";

const AddMembersModal = memo(function AddMembersModal({
  conversationId,
  existingMemberIds,
  onClose,
  getAvatarColor,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useGetEmployeesQuery();
  const { membership_id } = useTenantContext();
  const [addMembers] = useAddGroupMembersMutation();

  const existingSet = useMemo(() => new Set(existingMemberIds.map(String)), [existingMemberIds]);

  const availableEmployees = useMemo(() => {
    const list = (data?.data || []).filter((emp) => {
      const id = String(emp.id);
      return id !== String(membership_id) && !existingSet.has(id);
    });
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (emp) =>
        emp.username?.toLowerCase().includes(q) ||
        emp.user_email?.toLowerCase().includes(q)
    );
  }, [data, membership_id, existingSet, searchQuery]);

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedIds.size === 0) return;

    setIsSubmitting(true);
    try {
      await addMembers({
        conversationId,
        member_ids: Array.from(selectedIds).map(Number),
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Add members failed:", err);
      setIsSubmitting(false);
    }
  }, [addMembers, conversationId, selectedIds, onClose]);

  const getInitials = useCallback((name) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">Add Members</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select teammates to add"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Chips */}
        {selectedIds.size > 0 && (
          <div className="px-5 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0">
            {Array.from(selectedIds).map((id) => {
              const emp = data?.data?.find((e) => String(e.id) === String(id));
              if (!emp) return null;
              return (
                <motion.button
                  key={id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => toggleSelection(id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 hover:bg-blue-100 transition-colors flex-shrink-0"
                >
                  <span>{emp.username}</span>
                  <X className="w-3 h-3" />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teammates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-xs text-gray-500">Loading...</span>
            </div>
          ) : availableEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <p className="text-xs text-gray-500">
                {searchQuery ? "No matches found" : "No available teammates"}
              </p>
            </div>
          ) : (
            <div className="py-1">
              {availableEmployees.map((emp) => {
                const isSelected = selectedIds.has(emp.id);
                return (
                  <button
                    key={emp.id}
                    onClick={() => toggleSelection(emp.id)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                      isSelected ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-9 h-9 rounded-xl ${getAvatarColor(emp.username)} text-white flex items-center justify-center text-xs font-semibold`}
                      >
                        {getInitials(emp.username)}
                      </div>
                      {isSelected && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{emp.username}</div>
                      <div className="text-xs text-gray-500 truncate">{emp.user_email}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={selectedIds.size === 0 || isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add {selectedIds.size > 0 && `${selectedIds.size} member${selectedIds.size !== 1 ? "s" : ""}`}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
});

export default AddMembersModal;
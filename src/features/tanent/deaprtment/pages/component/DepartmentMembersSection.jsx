// components/DepartmentMembersSection.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  ArrowRightLeft,
  Trash2,
  UserPlus,
  Mail,
  Briefcase,
  Loader2,
  Users,
  MoreHorizontal,
  X,
  AlertTriangle,
} from "lucide-react";

export default function DepartmentMembersSection({
  members = [],
  onAssign,
  onRemove,
  onMakeHead,
  onTransfer,
  loading = false,
}) {
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, member: null });

  const handleDeleteConfirm = () => {
    if (deleteModal.member) {
      onRemove(deleteModal.member);
      setDeleteModal({ open: false, member: null });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100/60 flex items-center justify-center">
              <Users className="w-4 h-4 text-violet-500" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Department Members
              </h2>
              <p className="text-[0.75rem] text-gray-400 mt-0.5">
                Manage team members, leadership, and transfers
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAssign}
            disabled={loading}
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          >
            <UserPlus className="w-4 h-4" strokeWidth={2} />
            Add Members
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 flex flex-col items-center justify-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 rounded-full border-2 border-violet-200 border-t-violet-600"
            />
            <p className="text-sm text-gray-400 font-medium">Updating members...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && members.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative py-16 sm:py-20 px-8 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-white to-blue-50/10" />
          <div className="relative">
            <div className="relative mx-auto mb-5 w-16 h-16">
              <div className="absolute inset-0 bg-violet-500/10 rounded-2xl blur-xl scale-150" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200/50 border border-violet-200/60 flex items-center justify-center">
                <UserPlus className="w-7 h-7 text-violet-500" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No members assigned
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
              Add employees to start building this department's team structure and assign leadership roles.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAssign}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Add Members
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Members List */}
      {!loading && members.length > 0 && (
        <div className="divide-y divide-gray-50">
          {members.map((member, index) => (
            <MemberCard
              key={member.membership_id}
              member={member}
              index={index}
              onRemove={(m) => setDeleteModal({ open: true, member: m })}
              onMakeHead={onMakeHead}
              onTransfer={onTransfer}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        member={deleteModal.member}
        onClose={() => setDeleteModal({ open: false, member: null })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

// =====================================================
// MEMBER CARD
// =====================================================
function MemberCard({ member, index, onRemove, onMakeHead, onTransfer }) {
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const initials = member.name
    ? member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="group px-4 sm:px-6 py-4 sm:py-5 hover:bg-violet-50/30 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left Side - Member Info */}
          <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm ${
                member.is_head
                  ? "bg-gradient-to-br from-amber-400 to-orange-500"
                  : "bg-gradient-to-br from-slate-400 to-slate-500"
              }`}>
                {initials}
              </div>
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[0.9rem] sm:text-base font-semibold text-gray-900 truncate">
                  {member.name || "Unknown"}
                </h3>
                {member.is_head && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.7rem] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Crown className="w-3 h-3" strokeWidth={2} />
                    Head
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                <div className="flex items-center gap-1.5 text-[0.8rem] text-gray-500">
                  <Mail className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" strokeWidth={2} />
                  <span className="truncate">{member.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.8rem] text-gray-400">
                  <Briefcase className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" strokeWidth={2} />
                  <span>{member.job_title || "No job title"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Actions - inline icon buttons */}
          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            {!member.is_head && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMakeHead(member)}
                className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                title="Make Department Head"
              >
                <Crown className="w-4 h-4" strokeWidth={2} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTransfer(member)}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              title="Transfer to another department"
            >
              <ArrowRightLeft className="w-4 h-4" strokeWidth={2} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRemove(member)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              title="Remove from department"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </div>

          {/* Mobile: 3-dots menu button opens bottom sheet */}
          <div className="sm:hidden flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowMobileSheet(true)}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <MoreHorizontal className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Action Bottom Sheet */}
      <MobileActionSheet
        isOpen={showMobileSheet}
        onClose={() => setShowMobileSheet(false)}
        member={member}
        onMakeHead={() => { onMakeHead(member); setShowMobileSheet(false); }}
        onTransfer={() => { onTransfer(member); setShowMobileSheet(false); }}
        onRemove={() => { onRemove(member); setShowMobileSheet(false); }}
      />
    </>
  );
}

// =====================================================
// MOBILE ACTION BOTTOM SHEET
// =====================================================
function MobileActionSheet({ isOpen, onClose, member, onMakeHead, onTransfer, onRemove }) {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Member preview */}
            <div className="px-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  member?.is_head
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-slate-400 to-slate-500"
                }`}>
                  {member?.name
                    ? member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{member?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-400 truncate">{member?.email || "No email"}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 space-y-1">
              {!member?.is_head && (
                <button
                  onClick={onMakeHead}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.9rem] font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 active:bg-amber-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-amber-600" strokeWidth={2} />
                  </div>
                  Make Department Head
                </button>
              )}

              <button
                onClick={onTransfer}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.9rem] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-blue-600" strokeWidth={2} />
                </div>
                Transfer to Another Department
              </button>

              <button
                onClick={onRemove}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.9rem] font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-600" strokeWidth={2} />
                </div>
                Remove from Department
              </button>
            </div>

            {/* Cancel button */}
            <div className="p-3 pt-1 pb-6">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// =====================================================
// DELETE CONFIRMATION MODAL
// =====================================================
function DeleteConfirmModal({ isOpen, member, onClose, onConfirm }) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Icon header */}
            <div className="pt-8 pb-4 px-6 text-center">
              <div className="relative mx-auto mb-4 w-16 h-16">
                <div className="absolute inset-0 bg-red-500/15 rounded-2xl blur-xl scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Remove Member
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-gray-700">{member.name}</span> from this department? This action cannot be undone.
              </p>
            </div>

            {/* Member preview */}
            <div className="mx-6 mb-6 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-xs">
                  {member.name
                    ? member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-400 truncate">{member.email || "No email"}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all shadow-lg shadow-red-500/20"
              >
                Remove Member
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
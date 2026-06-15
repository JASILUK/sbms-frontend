import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Users, ArrowLeft, ArrowRight, Check, Loader2, Search } from "lucide-react";
import { useGetEmployeesQuery } from "../../emplyees/emplyeeApi";
import { useTenantContext } from "../../tanatContextHook";
import { useCreateDirectConversationMutation, useCreateGroupMutation } from "../chatApi";
import GroupMemberSelector from "./GroupMemberSelector";
import GroupDetailsForm from "./GroupDetailsForm";

const STEPS = {
  HOME: "home",
  GROUP_MEMBERS: "group-members",
  GROUP_DETAILS: "group-details",
};

export default function NewChatModal({ onClose, onSelectConversation, containerRef }) {
  const [step, setStep] = useState(STEPS.HOME);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [groupForm, setGroupForm] = useState({ name: "", avatarFile: null, avatarPreview: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useGetEmployeesQuery();
  const { membership_id } = useTenantContext();
  const [createDirectConversation, { isLoading: isCreatingDirect }] = useCreateDirectConversationMutation();
  const [createGroup, { isLoading: isCreatingGroup }] = useCreateGroupMutation();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Click outside to close
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const employees = useMemo(() => {
    const list = (data?.data || []).filter((emp) => emp.id !== membership_id);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (emp) =>
        emp.username?.toLowerCase().includes(q) ||
        emp.user_email?.toLowerCase().includes(q)
    );
  }, [data, membership_id, searchQuery]);

  const handleStartDirectChat = useCallback(async (emp) => {
    try {
      const res = await createDirectConversation({
        target_membership_id: emp.id,
      }).unwrap();
      onSelectConversation({ id: res.data.conversation_id });
      onClose();
    } catch (err) {
      console.error("Direct chat create error:", err);
    }
  }, [createDirectConversation, onSelectConversation, onClose]);

  const toggleMember = useCallback((empId) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(empId)) next.delete(empId);
      else next.add(empId);
      return next;
    });
  }, []);

  const handleCreateGroup = useCallback(async () => {
    if (!groupForm.name.trim() || selectedMembers.size === 0) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", groupForm.name.trim());
      selectedMembers.forEach((id) => formData.append("member_ids", id));
      if (groupForm.description.trim()) {
        formData.append("description", groupForm.description.trim());
      }
      if (groupForm.avatarFile) {
        formData.append("avatar", groupForm.avatarFile);
      }

      const res = await createGroup(formData).unwrap();

      onSelectConversation({ id: res.data.conversation_id });
      onClose();
    } catch (err) {
      console.error("Group create error:", err);
      setIsSubmitting(false);
    }
  }, [createGroup, groupForm, selectedMembers, onSelectConversation, onClose]);

  const goToGroupMembers = useCallback(() => {
    setStep(STEPS.GROUP_MEMBERS);
    setSearchQuery("");
  }, []);

  const goToGroupDetails = useCallback(() => {
    setStep(STEPS.GROUP_DETAILS);
  }, []);

  const goBack = useCallback(() => {
    if (step === STEPS.GROUP_DETAILS) {
      setStep(STEPS.GROUP_MEMBERS);
      setGroupForm({ name: "", avatarFile: null, avatarPreview: "", description: "" });
    } else if (step === STEPS.GROUP_MEMBERS) {
      setStep(STEPS.HOME);
      setSelectedMembers(new Set());
      setSearchQuery("");
    }
  }, [step]);

  const getAvatarColor = useCallback((name) => {
    const colors = [
      "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
      "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, []);

  const isCreating = isCreatingDirect || isCreatingGroup || isSubmitting;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={handleBackdropClick}
      />

      {/* Modal — EXACT same width as before (320px), height auto with max-height for scroll */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col max-h-[min(520px,calc(100vh-100px))]">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step !== STEPS.HOME && (
              <button
                onClick={goBack}
                className="w-7 h-7 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              {step === STEPS.HOME && "New Chat"}
              {step === STEPS.GROUP_MEMBERS && "Select Members"}
              {step === STEPS.GROUP_DETAILS && "Group Details"}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="w-7 h-7 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {step === STEPS.HOME && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-h-0"
              >
                {/* Create Group CTA */}
                <button
                  onClick={goToGroupMembers}
                  className="mx-4 mt-3 mb-2 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 hover:border-violet-200 hover:from-violet-100 hover:to-indigo-100 transition-all group flex-shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Create Group</div>
                    <div className="text-xs text-gray-500">Start a team conversation</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-violet-500 transition-colors" />
                </button>

                {/* Divider */}
                <div className="px-4 py-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Or direct message</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                </div>

                {/* Search */}
                <div className="px-4 pb-2 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search teammates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Employee List — scrolls when many employees */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      <span className="text-xs text-gray-500">Loading teammates...</span>
                    </div>
                  ) : employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {searchQuery ? "No matches found" : "No teammates available"}
                      </p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {employees.map((emp) => (
                        <button
                          key={emp.id}
                          onClick={() => handleStartDirectChat(emp)}
                          disabled={isCreatingDirect}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group text-left disabled:opacity-50"
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${getAvatarColor(emp.username)} text-white flex items-center justify-center text-xs font-semibold flex-shrink-0`}
                          >
                            {emp.username?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {emp.username}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {emp.user_email}
                            </div>
                          </div>
                          <MessageCircle className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/30 text-center flex-shrink-0">
                  <span className="text-[11px] text-gray-400">
                    {employees.length} teammate{employees.length !== 1 ? "s" : ""} available
                  </span>
                </div>
              </motion.div>
            )}

            {step === STEPS.GROUP_MEMBERS && (
              <motion.div
                key="group-members"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-h-0"
              >
                <GroupMemberSelector
                  employees={employees}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedMembers={selectedMembers}
                  onToggleMember={toggleMember}
                  getAvatarColor={getAvatarColor}
                />

                {/* Bottom Action Bar */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-3 flex-shrink-0">
                  <button
                    onClick={goToGroupDetails}
                    disabled={selectedMembers.size === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                    {selectedMembers.size > 0 && (
                      <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {selectedMembers.size}
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === STEPS.GROUP_DETAILS && (
              <motion.div
                key="group-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-h-0"
              >
                <GroupDetailsForm
                  form={groupForm}
                  onChange={setGroupForm}
                  selectedCount={selectedMembers.size}
                  isSubmitting={isSubmitting}
                  onSubmit={handleCreateGroup}
                  onBack={goBack}
                  getAvatarColor={getAvatarColor}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
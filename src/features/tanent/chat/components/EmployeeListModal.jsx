import { useState, useMemo } from "react";
import { useGetEmployeesQuery } from "../../emplyees/emplyeeApi";
import { useTenantContext } from "../../tanatContextHook";
import { useCreateDirectConversationMutation } from "../chatApi";
import { X, Search, User, Loader2, MessageCircle } from "lucide-react";

export default function EmployeeListModal({ onClose, onSelectConversation, containerRef }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGetEmployeesQuery();
  const [createConversation, { isLoading: isCreating }] = useCreateDirectConversationMutation();
  const { membership_id } = useTenantContext();

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

  const handleStartChat = async (emp) => {
    try {
      const res = await createConversation({
        target_membership_id: emp.id,
      }).unwrap();
      onSelectConversation({ id: res.data.conversation_id });
      onClose();
    } catch (err) {
      console.error("Chat create error:", err);
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
      "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <>
      {/* Backdrop — covers full page but click closes */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal — positioned absolute within sidebar, centered */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">New Chat</h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-gray-100">
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

        {/* List */}
        <div className="max-h-[280px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-xs text-gray-500">Loading...</span>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <p className="text-xs text-gray-500">
                {searchQuery ? "No matches" : "No teammates found"}
              </p>
            </div>
          ) : (
            <div className="py-1">
              {employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleStartChat(emp)}
                  disabled={isCreating}
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/30 text-center">
          <span className="text-[11px] text-gray-400">
            {employees.length} available
          </span>
        </div>
      </div>
    </>
  );
}
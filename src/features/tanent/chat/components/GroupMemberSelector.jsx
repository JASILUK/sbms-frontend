import { memo } from "react";
import { Search, Check, Users, Loader2 } from "lucide-react";

const GroupMemberSelector = memo(function GroupMemberSelector({
  employees,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedMembers,
  onToggleMember,
  getAvatarColor,
}) {
  return (
    <>
      {/* Search */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teammates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            autoFocus
          />
        </div>
      </div>

      {/* Selected count badge */}
      {selectedMembers.size > 0 && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {selectedMembers.size} selected
            </span>
            {selectedMembers.size === 1 && (
              <span className="text-[11px] text-gray-400">Select at least 1 member</span>
            )}
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
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
            {employees.map((emp) => {
              const isSelected = selectedMembers.has(emp.id);
              return (
                <button
                  key={emp.id}
                  onClick={() => onToggleMember(emp.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors group text-left ${
                    isSelected ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full ${getAvatarColor(emp.username)} text-white flex items-center justify-center text-xs font-semibold`}
                    >
                      {emp.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    {isSelected && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {emp.username}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {emp.user_email}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 group-hover:border-gray-400"
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
    </>
  );
});

export default GroupMemberSelector;
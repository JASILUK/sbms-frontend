import React, { useState, useMemo } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Crown,
  MoreVertical,
} from "lucide-react";
import { useProjectMembers } from "../hooks/useProjectMembers";
import { useTenantContext } from "../../tanatContextHook"; // Adjust import path as needed
import { AddMemberDialog } from "../components/dialogs/AddMemberDialog";
import { MemberDetailModal } from "../components/dialogs/MemberDetailModal";
import { TransferOwnershipModal } from "../components/dialogs/TransferOwnershipModal";
import {
  ROLE_BADGE_STYLES,
  PROJECT_MEMBER_ROLES,
} from "../constants/projectMemberConstants";

export default function ProjectMembersPage() {
  const { projectId } = useParams();
  const { project } = useOutletContext(); 

  // Get current active membership ID from tenant context
  const { membership_id } = useTenantContext();

  const {
    members,
    summary,
    currentFilters,
    isLoading,
    isAdding,
    isUpdating,
    isRemoving,
    isTransferring,
    updateFilter,
    addMember,
    updateMember,
    removeMember,
    transferOwnership,
  } = useProjectMembers(projectId);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Role options filter
  const roleFilters = [
    { label: "All Members", value: "" },
    { label: "Owners", value: PROJECT_MEMBER_ROLES.OWNER },
    { label: "Managers", value: PROJECT_MEMBER_ROLES.MANAGER },
    { label: "Members", value: PROJECT_MEMBER_ROLES.MEMBER },
  ];

  // Match the currently logged-in tenant member in the project team list
  const currentUserRecord = useMemo(() => {
    if (!membership_id || !members.length) return null;
    return members.find((m) => m.membership?.id === membership_id);
  }, [members, membership_id]);

  // True if the user's role on THIS project allows member management (Owner or Manager)
  const canManageProject = currentUserRecord?.can_manage_members || false;

  // True ONLY if the current user is the Project Owner
  const isProjectOwner = currentUserRecord?.role === PROJECT_MEMBER_ROLES.OWNER;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Project Members
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Manage employee team assignments, project roles, and access rights.
          </p>
        </div>

        {/* Action buttons are visible only if current member can manage members */}
        {canManageProject && (
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Transfer Ownership is ONLY available to the project Owner */}
            {isProjectOwner && (
              <button
                onClick={() => setIsTransferOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-200/80 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Transfer Ownership</span>
              </button>
            )}

            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Quick Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Team</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{summary.total_members}</h3>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Owners</p>
          <h3 className="text-2xl font-extrabold text-purple-700 mt-1">{summary.owners}</h3>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Managers</p>
          <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{summary.managers}</h3>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Members</p>
          <h3 className="text-2xl font-extrabold text-slate-700 mt-1">{summary.members}</h3>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search member by name or email..."
            value={currentFilters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 sm:pt-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden lg:block" />
          {roleFilters.map((opt) => {
            const isActive = (currentFilters.role || "") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateFilter("role", opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Members Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 animate-pulse space-y-4 shadow-sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Members Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No project team members match your current filter selection.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Member</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {members.map((member) => {
                  const user = member.membership;
                  const roleStyle = ROLE_BADGE_STYLES[member.role] || ROLE_BADGE_STYLES.member;
                  
                  // Check if this row is the current logged-in membership
                  const isMe = user?.id === membership_id;

                  return (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "MB"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                              {user?.full_name || "Employee"}
                              {isMe && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`}>
                          {roleStyle.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {user?.department || "General"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddMemberDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addMember}
        isLoading={isAdding}
        existingMembers={members}
      />

      <MemberDetailModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onUpdateRole={updateMember}
        onRemove={removeMember}
        isUpdating={isUpdating}
        isRemoving={isRemoving}
        canManage={canManageProject}
        currentMembershipId={membership_id}
      />

      <TransferOwnershipModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        members={members}
        onTransfer={transferOwnership}
        isLoading={isTransferring}
      />
    </div>
  );
}
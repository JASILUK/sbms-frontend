import React, { useState, useEffect } from "react";
import { X, Shield, Calendar, Mail, Briefcase, Trash2, Edit3, Check, Loader2 } from "lucide-react";
import { ROLE_BADGE_STYLES, PROJECT_MEMBER_ROLES } from "../../constants/projectMemberConstants";

export const MemberDetailModal = ({
  member,
  isOpen,
  onClose,
  onUpdateRole,
  onRemove,
  isUpdating,
  isRemoving,
  canManage,
  currentMembershipId,
}) => {
  const [selectedRole, setSelectedRole] = useState(member?.role || "member");
  const [notes, setNotes] = useState(member?.notes || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
      setNotes(member.notes || "");
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const roleStyle = ROLE_BADGE_STYLES[member.role] || ROLE_BADGE_STYLES.member;
  const user = member.membership;

  // Check if this modal displays the current user's profile
  const isMe = user?.id === currentMembershipId;

  const handleSaveUpdate = async () => {
    try {
      await onUpdateRole({
        memberId: member.id,
        role: selectedRole,
        notes: notes,
      });
      setIsEditing(false);
    } catch {
      // Error handled by hook toast
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove ${user?.full_name || "this member"} from the project?`)) {
      try {
        await onRemove(member.id);
        onClose();
      } catch {
        // Error handled by hook toast
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-lg my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/70 flex items-center justify-between bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "MB"}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {user?.full_name || "Project Member"}
                {isMe && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                    (You)
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">{user?.job_title || user?.department || "Team Member"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Status & Role Pill */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Role</p>
              <div className="flex items-center gap-2 pt-1">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`}>
                  {roleStyle.label}
                </span>
              </div>
            </div>

            {/* Editing own role is disabled to prevent accidental self-demotion */}
            {canManage && !isEditing && !isMe && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Role</span>
              </button>
            )}
          </div>

          {/* Edit Form Mode */}
          {isEditing && !isMe ? (
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Update Role & Scope</h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={PROJECT_MEMBER_ROLES.MEMBER}>Member</option>
                  <option value={PROJECT_MEMBER_ROLES.MANAGER}>Manager</option>
                  <option value={PROJECT_MEMBER_ROLES.OWNER}>Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notes / Key Role</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUpdate}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* User Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px] uppercase">Email</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{user?.email || "N/A"}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px] uppercase">Department</span>
              </div>
              <p className="font-bold text-slate-800">{user?.department || "General"}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px] uppercase">Joined Project</span>
              </div>
              <p className="font-bold text-slate-800">
                {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "N/A"}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px] uppercase">Work Mode</span>
              </div>
              <p className="font-bold text-slate-800 capitalize">{user?.work_mode || "Office"}</p>
            </div>
          </div>

          {/* Notes display */}
          {member.notes && !isEditing && (
            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Member Notes</p>
              <p className="text-xs text-slate-700 leading-relaxed">{member.notes}</p>
            </div>
          )}

          {/* Danger Zone: Remove Member */}
          {canManage && !member.is_owner && !isMe && (
            <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-600">Remove from Project</p>
                <p className="text-[11px] text-slate-400">Revoke workspace access for this member.</p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isRemoving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
/**
 * Project Member Role Options & Metadata Matrix
 */
export const PROJECT_MEMBER_ROLES = {
  OWNER: "owner",
  MANAGER: "manager",
  MEMBER: "member",
};

export const PROJECT_MEMBER_ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
];

export const PROJECT_MEMBER_ORDERING_OPTIONS = [
  { value: "", label: "Role Hierarchy (Default)" },
  { value: "-joined_at", label: "Newest First" },
  { value: "joined_at", label: "Oldest First" },
  { value: "membership__user__first_name", label: "Name (A-Z)" },
];

export const ROLE_BADGE_STYLES = {
  owner: {
    bg: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-700",
    label: "Owner",
  },
  manager: {
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    text: "text-indigo-700",
    label: "Manager",
  },
  member: {
    bg: "bg-slate-100",
    border: "border-slate-200/60",
    text: "text-slate-700",
    label: "Member",
  },
};
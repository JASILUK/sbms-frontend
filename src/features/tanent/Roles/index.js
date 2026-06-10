// features/roles/index.js
export { default as RolePage } from "./pages/RolesListPage";
export { default as RoleTable } from "./components/Role_Table";
export { default as RoleFormModal } from "./components/Role_Form_Modal";
export { default as RoleDetailModal } from "./components/Role_Detailed_Modal";
export { default as PermissionSelector } from "./components/Permission_Selector";
export { default as RoleHeader } from "./components/Role_Header";
export { default as RoleRow } from "./components/Role_Row";

export {
  roleApi,
  useGetRolesQuery,
  useGetRoleDetailQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
} from "./rolesApi";

export { useRoles } from "./useRole";
export { usePermissions } from "./UsePermissions"
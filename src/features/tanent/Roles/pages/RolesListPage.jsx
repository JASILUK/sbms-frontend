// features/roles/pages/RolePage.jsx
import { useState } from "react";
import { useRoles } from "../useRole";
import { useDeleteRoleMutation } from "../rolesApi"
import RoleTable from "../components/Role_Table";
import RoleFormModal from "../components/Role_Form_Modal";
import RoleDetailModal from "../components/Role_Detailed_Modal";

// Simple toast function - replace with your actual toast library
const toast = {
  success: (msg) => alert(msg),
  error: (msg) => alert(msg),
};

export default function RolePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    roles,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
  } = useRoles();

  const [deleteRole] = useDeleteRoleMutation();

  const handleCreate = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleView = (role) => {
    setViewingRole(role);
    setIsDetailOpen(true);
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Are you sure you want to delete "${role.name}"?`)) return;

    try {
      await deleteRole(role.id).unwrap();
      toast.success(`Role "${role.name}" deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete role");
    }
  };

  const handleFormSuccess = () => {
    toast.success(editingRole ? "Role updated successfully" : "Role created successfully");
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <RoleTable
          roles={roles}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          onCreateClick={handleCreate}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={refetch}
        />
      </div>

      <RoleFormModal
        role={editingRole}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRole(null);
        }}
        onSuccess={handleFormSuccess}
      />

      <RoleDetailModal
        role={viewingRole}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingRole(null);
        }}
      />
    </div>
  );
}
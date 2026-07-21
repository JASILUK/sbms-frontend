import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useUpdateProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useTransferProjectOwnershipMutation,
} from "../api/projectMemberApi";

export const useProjectMembers = (projectId) => {
  // 1. Search & Filter State
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    ordering: "",
    limit: 20,
    offset: 0,
  });

  // 2. Query Members List
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetProjectMembersQuery(
      {
        projectId,
        ...filters,
      },
      { skip: !projectId }
    );

  // 3. Mutation Hooks
  const [addMemberMutation, { isLoading: isAdding }] =
    useAddProjectMemberMutation();
  const [updateMemberMutation, { isLoading: isUpdating }] =
    useUpdateProjectMemberMutation();
  const [removeMemberMutation, { isLoading: isRemoving }] =
    useRemoveProjectMemberMutation();
  const [transferOwnershipMutation, { isLoading: isTransferring }] =
    useTransferProjectOwnershipMutation();

  // 4. State Update Handlers
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      offset: key === "search" || key === "role" ? 0 : prev.offset,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      role: "",
      ordering: "",
      limit: 20,
      offset: 0,
    });
  }, []);

  // 5. Actions with Toasts
  const addMember = useCallback(
    async (payload) => {
      try {
        const res = await addMemberMutation({
          projectId,
          ...payload,
        }).unwrap();
        toast.success("Member added to project successfully!");
        return res;
      } catch (err) {
        toast.error(
          err?.data?.message || err?.data?.detail || "Failed to add member"
        );
        throw err;
      }
    },
    [addMemberMutation, projectId]
  );

  const updateMember = useCallback(
    async ({ memberId, role, notes }) => {
      try {
        const res = await updateMemberMutation({
          projectId,
          memberId,
          role,
          notes,
        }).unwrap();
        toast.success("Member role updated successfully!");
        return res;
      } catch (err) {
        toast.error(
          err?.data?.message || err?.data?.detail || "Failed to update member"
        );
        throw err;
      }
    },
    [updateMemberMutation, projectId]
  );

  const removeMember = useCallback(
    async (memberId) => {
      try {
        const res = await removeMemberMutation({
          projectId,
          memberId,
        }).unwrap();
        toast.success("Member removed from project.");
        return res;
      } catch (err) {
        toast.error(
          err?.data?.message || err?.data?.detail || "Failed to remove member"
        );
        throw err;
      }
    },
    [removeMemberMutation, projectId]
  );

  const transferOwnership = useCallback(
    async (newOwnerMembershipId) => {
      try {
        const res = await transferOwnershipMutation({
          projectId,
          new_owner_membership_id: newOwnerMembershipId,
        }).unwrap();
        toast.success("Project ownership transferred successfully!");
        return res;
      } catch (err) {
        toast.error(
          err?.data?.message ||
            err?.data?.detail ||
            "Failed to transfer ownership"
        );
        throw err;
      }
    },
    [transferOwnershipMutation, projectId]
  );

  // Memoized Return Package
  const members = useMemo(() => data?.data?.results || [], [data]);
  const pagination = useMemo(() => data?.data?.pagination || {}, [data]);
  const summary = useMemo(
    () =>
      data?.data?.summary || {
        total_members: 0,
        owners: 0,
        managers: 0,
        members: 0,
      },
    [data]
  );
  const filterOptions = useMemo(() => data?.data?.filters || {}, [data]);

  return {
    // Data
    members,
    pagination,
    summary,
    filterOptions,
    // Statuses
    isLoading,
    isFetching,
    isError,
    error,
    isAdding,
    isUpdating,
    isRemoving,
    isTransferring,
    // Filters & Actions
    currentFilters: filters,
    updateFilter,
    resetFilters,
    refetch,
    addMember,
    updateMember,
    removeMember,
    transferOwnership,
  };
};
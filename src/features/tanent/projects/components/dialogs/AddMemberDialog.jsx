import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, UserPlus, Loader2 } from "lucide-react";
import { PROJECT_MEMBER_ROLES } from "../../constants/projectMemberConstants";
import { useGetEmployeesQuery } from "../../../emplyees/emplyeeApi";

const addMemberSchema = z.object({
  membership_id: z.coerce.number().min(1, "Please select an employee"),
  role: z.enum([
    PROJECT_MEMBER_ROLES.OWNER,
    PROJECT_MEMBER_ROLES.MANAGER,
    PROJECT_MEMBER_ROLES.MEMBER,
  ]),
  notes: z.string().max(255, "Notes cannot exceed 255 characters").optional(),
});

export const AddMemberDialog = ({
  isOpen,
  onClose,
  onAdd,
  isLoading,
  existingMembers = [],
}) => {
  // Fetch company employees
  const { data: employeesResponse, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery(undefined, { skip: !isOpen });

  // Handle standard or wrapped response structure
  const rawEmployees =
    employeesResponse?.data?.results ||
    employeesResponse?.results ||
    employeesResponse?.data ||
    (Array.isArray(employeesResponse) ? employeesResponse : []);

  // Filter out employees who are already members of this project
  const existingMembershipIds = new Set(
    existingMembers.map((m) => m.membership?.id || m.membership)
  );

  const availableEmployees = rawEmployees.filter(
    (emp) => emp.is_active && !existingMembershipIds.has(emp.id)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      membership_id: "",
      role: PROJECT_MEMBER_ROLES.MEMBER,
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await onAdd({
        membership_id: Number(data.membership_id),
        role: data.role,
        notes: data.notes?.trim() || "",
      });
      reset();
      onClose();
    } catch {
      // Error toast handled by custom hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-md my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/70 flex items-center justify-between bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Add Project Member
              </h2>
              <p className="text-xs text-slate-500">
                Grant an employee access to this workspace.
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Employee <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("membership_id")}
              disabled={isLoadingEmployees}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="">
                {isLoadingEmployees
                  ? "Loading employees..."
                  : "Choose an employee..."}
              </option>
              {availableEmployees.map((emp) => {
                const displayName =
                  emp.username || emp.user_email || `Employee #${emp.id}`;
                const detail = emp.job_title || emp.department_name;
                return (
                  <option key={emp.id} value={emp.id}>
                    {displayName} {detail ? `(${detail})` : ""}
                  </option>
                );
              })}
            </select>
            {errors.membership_id && (
              <p className="text-xs text-rose-500 font-medium mt-1">
                {errors.membership_id.message}
              </p>
            )}
            {!isLoadingEmployees && availableEmployees.length === 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                All active company employees are already added to this project.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Role <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("role")}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="member">Member (Read & Execute)</option>
              <option value="manager">Manager (Manage Tasks & Members)</option>
              <option value="owner">Owner (Full Control)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assignment Notes
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="e.g. Lead Frontend Developer for Sprint 1..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingEmployees}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isLoading ? "Adding..." : "Add Member"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
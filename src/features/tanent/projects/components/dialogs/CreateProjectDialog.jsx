import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  X,
  Calendar,
  Briefcase,
  Info,
  Loader2,
  ShieldCheck,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { useCreateProjectMutation } from "../../api/projectApi";
import { useGetEmployeesQuery } from "../../../emplyees/emplyeeApi";
import { useTenantContext } from "../../../tanatContextHook";// Adjust import path if needed

// Nested validation schema for individual member selection
const memberInputSchema = z.object({
  membership_id: z.number().min(1, "Select an employee"),
  role: z.enum(["manager", "member"]),
});

// Validation schema matching Django ProjectCreateSerializer
const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(2, "Project name must be at least 2 characters")
      .max(255, "Name is too long"),
    code: z
      .string()
      .min(2, "Code required (e.g., PRJ-01)")
      .max(50, "Code max length is 50 characters")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Code can only contain letters, numbers, hyphens, and underscores"
      ),
    description: z
      .string()
      .max(5000, "Description maximum length is 5000 characters")
      .optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid 6-digit HEX code (e.g., #6366F1)"),
    visibility: z.enum(["public", "private"]),
    status: z.enum(["planning", "active", "on_hold", "completed"]),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    client_name: z.string().max(255).optional(),
    client_company: z.string().max(255).optional(),
    client_email: z.string().email("Invalid email format").or(z.literal("")).optional(),
    client_phone: z.string().max(30).optional(),
    members: z.array(memberInputSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    }
  );

export const CreateProjectDialog = ({ isOpen, onClose }) => {
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const { membership_id: currentMembershipId } = useTenantContext();

  // Fetch employees for member assignment
  const { data: employeesResponse, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery(undefined, { skip: !isOpen });

  // Unify employees array format
  const rawEmployees =
    employeesResponse?.data?.results ||
    employeesResponse?.results ||
    employeesResponse?.data ||
    (Array.isArray(employeesResponse) ? employeesResponse : []);

  // Internal state for selected initial members
  const [initialMembers, setInitialMembers] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      color: "#6366F1",
      visibility: "private",
      status: "planning",
      start_date: "",
      end_date: "",
      client_name: "",
      client_company: "",
      client_email: "",
      client_phone: "",
      members: [],
    },
  });

  const selectedColor = watch("color");

  // Filter out creator (owner) and already selected employees from dropdown
  const availableEmployees = rawEmployees.filter((emp) => {
    const isCurrentCreator = Number(emp.id) === Number(currentMembershipId);
    const isAlreadySelected = initialMembers.some(
      (m) => Number(m.membership_id) === Number(emp.id)
    );
    return emp.is_active && !isCurrentCreator && !isAlreadySelected;
  });

  // Handler: Add member to preview list
  const handleAddMember = () => {
    if (!selectedEmpId) return;

    const emp = rawEmployees.find((e) => Number(e.id) === Number(selectedEmpId));
    if (!emp) return;

    const newMemberEntry = {
      membership_id: Number(selectedEmpId),
      role: selectedRole,
      // Attached for rendering preview details
      displayName: emp.username || emp.user_email || `Employee #${emp.id}`,
      email: emp.user_email,
      department: emp.department_name,
    };

    const updatedMembers = [...initialMembers, newMemberEntry];
    setInitialMembers(updatedMembers);
    setValue(
      "members",
      updatedMembers.map((m) => ({
        membership_id: m.membership_id,
        role: m.role,
      }))
    );

    // Reset member selection fields
    setSelectedEmpId("");
    setSelectedRole("member");
  };

  // Handler: Remove member from preview list
  const handleRemoveMember = (membershipId) => {
    const updatedMembers = initialMembers.filter(
      (m) => Number(m.membership_id) !== Number(membershipId)
    );
    setInitialMembers(updatedMembers);
    setValue(
      "members",
      updatedMembers.map((m) => ({
        membership_id: m.membership_id,
        role: m.role,
      }))
    );
  };

  const handleModalClose = () => {
    reset();
    setInitialMembers([]);
    setSelectedEmpId("");
    setSelectedRole("member");
    onClose();
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.toUpperCase().trim(),
        description: formData.description?.trim() || "",
        color: formData.color,
        visibility: formData.visibility,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        client_name: formData.client_name?.trim() || "",
        client_company: formData.client_company?.trim() || "",
        client_email: formData.client_email?.trim() || "",
        client_phone: formData.client_phone?.trim() || "",
        members: initialMembers.map((m) => ({
          membership_id: m.membership_id,
          role: m.role,
        })),
      };

      await createProject(payload).unwrap();
      toast.success("Project created successfully!");
      handleModalClose();
    } catch (err) {
      if (err?.data && typeof err.data === "object") {
        Object.entries(err.data).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          setError(field, { type: "server", message });
        });
      }
      toast.error(err?.data?.message || err?.data?.detail || "Failed to create project");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-2xl max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/70 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set up a new workspace initiative. You will automatically be assigned as Owner.
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: General Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span>General Details</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("name")}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g., Mobile App Redesign"
              />
              {errors.name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Code <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("code")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g., APP-2026"
                />
                {errors.code && <p className="text-xs text-rose-500 font-medium mt-1">{errors.code.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branding Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setValue("color", e.target.value)}
                    className="w-9 h-9 p-0.5 rounded-xl border border-slate-200 bg-white cursor-pointer shrink-0"
                  />
                  <input
                    {...register("color")}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="#6366F1"
                  />
                </div>
                {errors.color && <p className="text-xs text-rose-500 font-medium mt-1">{errors.color.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                placeholder="Briefly describe deliverables, objectives, and scope..."
              />
            </div>
          </div>

          {/* Section 2: Initial Team Assignment */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>Initial Team Members (Optional)</span>
            </div>

            {/* Selection Form */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Select Employee
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  disabled={isLoadingEmployees}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingEmployees ? "Loading employees..." : "Choose employee..."}
                  </option>
                  {availableEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.username || emp.user_email} {emp.job_title ? `(${emp.job_title})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Project Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!selectedEmpId}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all disabled:opacity-40 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Selected Members Preview List */}
            {initialMembers.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 overflow-hidden mt-3 shadow-sm">
                {initialMembers.map((m) => (
                  <div
                    key={m.membership_id}
                    className="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{m.displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{m.email}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                          m.role === "manager"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                            : "bg-slate-100 text-slate-700 border-slate-200/60"
                        }`}
                      >
                        {m.role}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.membership_id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Visibility & Initial Status */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Governance & Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Visibility</label>
                <select
                  {...register("visibility")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="private">Private (Explicit members only)</option>
                  <option value="public">Public (Entire company)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  {...register("status")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Scheduling */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Timeline (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  {...register("start_date")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target End Date</label>
                <input
                  type="date"
                  {...register("end_date")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                {errors.end_date && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{errors.end_date.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Client Information */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Briefcase className="w-3.5 h-3.5" />
              <span>External Client Details (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Contact Name
                </label>
                <input
                  {...register("client_name")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Organization
                </label>
                <input
                  {...register("client_company")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Email</label>
                <input
                  type="email"
                  {...register("client_email")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="client@acme.com"
                />
                {errors.client_email && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{errors.client_email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Phone</label>
                <input
                  {...register("client_phone")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200/70 shrink-0">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isCreating ? "Creating..." : "Create Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
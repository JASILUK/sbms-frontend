import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema } from "../schemas/assignmentSchema";
import { useCreateAssignmentMutation, useUpdateAssignmentMutation } from "../api/attendanceSetupApi";
import { toast } from "sonner";

export const useAssignmentForm = (activeRecord, onClose) => {
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation();

  const methods = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      membership_id: "",
      shift_id: "",
      effective_from: "",
      effective_to: "",
      notes: "",
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  useEffect(() => {
    if (activeRecord) {
      reset({
        membership_id: String(activeRecord.membership_id || activeRecord.employee?.id || ""),
        shift_id: String(activeRecord.shift_id || activeRecord.shift?.public_id || ""),
        effective_from: activeRecord.effective_from || "",
        effective_to: activeRecord.effective_to || "",
        notes: activeRecord.notes || "",
      });
    } else {
      reset({ 
        membership_id: "", 
        shift_id: "", 
        effective_from: "", 
        effective_to: "", 
        notes: "" 
      });
    }
  }, [activeRecord, reset]);

  const handleFormSubmission = async (values) => {
    try {
      // FIXED: Remap form fields to match the exact keys expected by the Django Serializer
      // Converting string IDs into raw integers prevents backend model validation rejection.
      const payload = {
        membership: parseInt(values.membership_id, 10), 
        shift: parseInt(values.shift_id, 10),           
        effective_from: values.effective_from,
        effective_to: values.effective_to || null,
        notes: values.notes || "",
      };

      if (activeRecord?.id) {
        await updateAssignment({ id: activeRecord.id, ...payload }).unwrap();
        toast.success("Employee allocation rules realigned successfully.");
      } else {
        await createAssignment(payload).unwrap();
        toast.success("New assignment rule published successfully.");
      }
      reset();
      onClose();
    } catch (err) {
      if (err?.data && typeof err.data === "object") {
        Object.keys(err.data).forEach((field) => {
          // Fallback map checks if backend returns errors as 'membership' or 'shift' 
          // and links them smoothly back to the matching frontend input fields
          const fieldMapping = field === "membership" ? "membership_id" : field === "shift" ? "shift_id" : field;
          
          setError(fieldMapping, {
            type: "server",
            message: Array.isArray(err.data[field]) ? err.data[field][0] : "Invalid specification constraint.",
          });
        });
      } else {
        toast.error("Global transactional commit validation failure encountered.");
      }
    }
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(handleFormSubmission),
    isSaving: isCreating || isUpdating,
  };
};
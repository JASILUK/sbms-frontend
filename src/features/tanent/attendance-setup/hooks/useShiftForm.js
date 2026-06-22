import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shiftSchema } from "../schemas/shiftSchema";
import { useCreateShiftMutation, useUpdateShiftMutation } from "../api/attendanceSetupApi";
import { toast } from "sonner";

export const useShiftForm = (activeShift, onClose) => {
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();
  const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();

  const methods = useForm({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      name: "",
      description: "",
      shift_type: "regular",
      start_time: "09:00",
      end_time: "18:00",
      break_duration_minutes: 60,
      is_active: true,
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  useEffect(() => {
    if (activeShift) {
      reset({
        name: activeShift.name || "",
        description: activeShift.description || "",
        shift_type: activeShift.shift_type || "regular",
        start_time: activeShift.start_time ? activeShift.start_time.substring(0, 5) : "09:00",
        end_time: activeShift.end_time ? activeShift.end_time.substring(0, 5) : "18:00",
        // Handle break configuration defaults gracefully if dropped from read layouts
        break_duration_minutes: Number(activeShift.break_duration_minutes) ?? 0,
        is_active: Boolean(activeShift.is_active),
      });
    } else {
      reset({
        name: "",
        description: "",
        shift_type: "regular",
        start_time: "09:00",
        end_time: "18:00",
        break_duration_minutes: 60,
        is_active: true,
      });
    }
  }, [activeShift, reset]);

  const handleFormSubmission = async (values) => {
    try {
      // FIXED: Swapped activeShift.id with activeShift.public_id to match backend format fields
      if (activeShift?.public_id) {
        await updateShift({ id: activeShift.public_id, ...values }).unwrap();
        toast.success("Shift template criteria modified successfully.");
      } else {
        await createShift(values).unwrap();
        toast.success("New reusable shift configuration assigned successfully.");
      }
      reset();
      onClose();
    } catch (error) {
      if (error?.data && typeof error.data === "object") {
        Object.keys(error.data).forEach((field) => {
          setError(field, {
            type: "server",
            message: Array.isArray(error.data[field]) ? error.data[field][0] : "Invalid criteria metric assignment.",
          });
        });
      } else {
        toast.error("Failed to compile transactional workspace modifications.");
      }
    }
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(handleFormSubmission),
    isSaving: isCreating || isUpdating,
  };
};
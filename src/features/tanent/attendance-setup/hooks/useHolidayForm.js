import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { holidaySchema } from "../schemas/holidaySchema";
import { useCreateHolidayMutation, useUpdateHolidayMutation } from "../api/attendanceSetupApi";
import { toast } from "sonner";

export const useHolidayForm = (activeHoliday, onClose) => {
  const [createHoliday, { isLoading: isCreating }] = useCreateHolidayMutation();
  const [updateHoliday, { isLoading: isUpdating }] = useUpdateHolidayMutation();

  const methods = useForm({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      holiday_type: "public",
      holiday_date: "",
      description: "",
      is_paid: true,
      is_half_day: false,
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  useEffect(() => {
    if (activeHoliday) {
      reset({
        name: activeHoliday.name || "",
        holiday_type: activeHoliday.holiday_type || "public",
        holiday_date: activeHoliday.holiday_date || "",
        description: activeHoliday.description || "",
        is_paid: !!activeHoliday.is_paid,
        is_half_day: !!activeHoliday.is_half_day,
      });
    } else {
      reset({
        name: "",
        holiday_type: "public",
        holiday_date: "",
        description: "",
        is_paid: true,
        is_half_day: false,
      });
    }
  }, [activeHoliday, reset]);

  // Locate the executeSubmit method inside your hook and change it to this:

const executeSubmit = async (values) => {
  try {
    if (activeHoliday?.id) {
      // FIXED: Spread the form fields directly at the root level of the payload object
      // so that request.data matches what your serializer expects!
      await updateHoliday({ id: activeHoliday.id, ...values }).unwrap();
      toast.success("Holiday criteria modified successfully.");
    } else {
      await createHoliday(values).unwrap();
      toast.success("New structural holiday assigned successfully.");
    }
    reset();
    onClose();
  } catch (error) {
    if (error?.data && typeof error.data === "object") {
      Object.keys(error.data).forEach((field) => {
        setError(field, {
          type: "server",
          message: Array.isArray(error.data[field]) ? error.data[field][0] : "Invalid entity structural assignment.",
        });
      });
    } else {
      toast.error("Failed to commit holiday changes to workspace.");
    }
  }
};

  return {
    methods,
    onSubmit: methods.handleSubmit(executeSubmit),
    isSaving: isCreating || isUpdating,
  };
};
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attendancePolicySchema } from "../schemas/attendancePolicySchema";
import { useUpdateAttendancePolicyMutation } from "../api/attendanceSetupApi";
import { toast } from "sonner";

export const useAttendancePolicyForm = (policyData, refetchPolicy) => {
  const [updateAttendancePolicy, { isLoading: isUpdating }] = useUpdateAttendancePolicyMutation();

  const methods = useForm({
    resolver: zodResolver(attendancePolicySchema),
    defaultValues: {
      required_work_minutes: 480,
      half_day_below_minutes: 240,
      late_after_minutes: 15,
      early_exit_before_minutes: 15,
      overtime_enabled: true,
      overtime_after_minutes: 480,
      count_weekend_as_overtime: false,
      auto_absent_if_no_checkin: true,
      attendance_regularization_enabled: true,
      is_active: true,
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  // Hardened structural synchronization logic
  useEffect(() => {
    if (policyData && Object.keys(policyData).length > 0) {
      reset({
        required_work_minutes: Number(policyData.required_work_minutes),
        half_day_below_minutes: Number(policyData.half_day_below_minutes),
        late_after_minutes: Number(policyData.late_after_minutes),
        early_exit_before_minutes: Number(policyData.early_exit_before_minutes),
        overtime_enabled: !!policyData.overtime_enabled,
        overtime_after_minutes: Number(policyData.overtime_after_minutes),
        count_weekend_as_overtime: !!policyData.count_weekend_as_overtime,
        auto_absent_if_no_checkin: !!policyData.auto_absent_if_no_checkin,
        attendance_regularization_enabled: !!policyData.attendance_regularization_enabled,
        is_active: !!policyData.is_active,
      });
    }
  }, [policyData, reset]);

  const handleFormSubmit = async (values) => {
    try {
      await updateAttendancePolicy(values).unwrap();
      toast.success("Attendance policy rules successfully updated.");
      refetchPolicy();
    } catch (error) {
      if (error?.data && typeof error.data === "object") {
        Object.keys(error.data).forEach((field) => {
          setError(field, {
            type: "server",
            message: Array.isArray(error.data[field]) ? error.data[field][0] : "Invalid field value",
          });
        });
      } else {
        toast.error("Failed to commit organizational runtime policies.");
      }
    }
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(handleFormSubmit),
    isSaving: isUpdating,
  };
};
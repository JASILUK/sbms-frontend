import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workingScheduleSchema } from "../schemas/workingScheduleSchema";
import {
  useCreateCompanyScheduleMutation,
  useUpdateCompanyScheduleMutation,
} from "../api/attendanceSetupApi";

const ALL_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const useWorkingScheduleForm = (existingSchedule, onSaveSuccess) => {
  const [createSchedule, { isLoading: isCreating }] = useCreateCompanyScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateCompanyScheduleMutation();

  // 1. Core State Initialization with Defensive Guards
  const defaultValues = existingSchedule && Object.keys(existingSchedule).length > 0
    ? {
        working_days: existingSchedule.working_days || [],
        weekend_days: existingSchedule.weekend_days || [],
        work_start_time: existingSchedule.work_start_time ? existingSchedule.work_start_time.slice(0, 5) : "09:00",
        work_end_time: existingSchedule.work_end_time ? existingSchedule.work_end_time.slice(0, 5) : "18:00",
        break_minutes: typeof existingSchedule.break_minutes === "number" ? existingSchedule.break_minutes : 60,
        timezone: existingSchedule.timezone || "Asia/Kolkata",
        country: existingSchedule.country || "IN",
        state: existingSchedule.state || "",
        holiday_sync_enabled: !!existingSchedule.holiday_sync_enabled,
        holiday_provider: existingSchedule.holiday_provider || "public_holidays",
      }
    : {
        working_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        weekend_days: ["saturday", "sunday"],
        work_start_time: "09:00",
        work_end_time: "18:00",
        break_minutes: 60,
        timezone: "Asia/Kolkata",
        country: "IN",
        state: "Kerala",
        holiday_sync_enabled: true,
        holiday_provider: "public_holidays",
      };

  const methods = useForm({
    resolver: zodResolver(workingScheduleSchema),
    defaultValues,
    mode: "onChange",
  });

  const { reset, setValue } = methods;

  // 2. Optimized Functional Handler for User Interactivity (Call this from WorkingDaysSelector)
  const handleToggleWorkingDay = (currentDays, targetedDay) => {
    let nextDays;
    if (currentDays.includes(targetedDay)) {
      if (currentDays.length === 1) return; // Enforce minimum 1 working day constraint
      nextDays = currentDays.filter((d) => d !== targetedDay);
    } else {
      nextDays = [...currentDays, targetedDay];
    }

    const nextWeekends = ALL_DAYS.filter((day) => !nextDays.includes(day));
    
    // Update both states simultaneously with precise user dirty telemetry flags
    setValue("working_days", nextDays, { shouldValidate: true, shouldDirty: true });
    setValue("weekend_days", nextWeekends, { shouldValidate: true, shouldDirty: true });
  };

  // 3. Hardened Reactive Reset when RTK Cache updates or settles
  useEffect(() => {
    if (existingSchedule && Object.keys(existingSchedule).length > 0) {
      reset({
        working_days: existingSchedule.working_days || [],
        weekend_days: existingSchedule.weekend_days || [],
        work_start_time: existingSchedule.work_start_time ? existingSchedule.work_start_time.slice(0, 5) : "09:00",
        work_end_time: existingSchedule.work_end_time ? existingSchedule.work_end_time.slice(0, 5) : "18:00",
        break_minutes: typeof existingSchedule.break_minutes === "number" ? existingSchedule.break_minutes : 60,
        timezone: existingSchedule.timezone || "Asia/Kolkata",
        country: existingSchedule.country || "IN",
        state: existingSchedule.state || "",
        holiday_sync_enabled: !!existingSchedule.holiday_sync_enabled,
        holiday_provider: existingSchedule.holiday_provider || "public_holidays",
      });
    }
  }, [existingSchedule, reset]);

  // 4. Submission Pipeline
  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        work_start_time: data.work_start_time.length === 5 ? `${data.work_start_time}:00` : data.work_start_time,
        work_end_time: data.work_end_time.length === 5 ? `${data.work_end_time}:00` : data.work_end_time,
      };

      if (existingSchedule?.id) {
        await updateSchedule(payload).unwrap();
      } else {
        await createSchedule(payload).unwrap();
      }
      
      reset(data);
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      if (error?.data) {
        Object.keys(error.data).forEach((key) => {
          methods.setError(key, { 
            type: "server", 
            message: error.data[key]?.[0] || "Server validation failed" 
          });
        });
      }
    }
  };

  return {
    methods,
    handleToggleWorkingDay, // Operational action exposed cleanly to the view component
    onSubmit: methods.handleSubmit(handleFormSubmit),
    isSaving: isCreating || isUpdating,
  };
};
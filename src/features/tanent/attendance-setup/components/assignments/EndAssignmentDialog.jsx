import React from "react";
import { useForm } from "react-hook-form";
import { useEndAssignmentMutation } from "../../api/attendanceSetupApi";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarX, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const EndAssignmentDialog = ({ isOpen, onClose, targetId }) => {
  const [endAssignment, { isLoading }] = useEndAssignmentMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ 
    defaultValues: { effective_to: "" } 
  });

  const handleCommitAction = async (values) => {
    // Defensive check to avoid making requests if targetId evaluates to an invalid state object
    if (!targetId || typeof targetId === "object") {
      toast.error("Unable to process request: Invalid unique allocation tracker identifier.");
      return;
    }

    try {
      // FIXED: Pass targetId explicitly as 'id', and map form values to 'end_date' as expected by Django's InlineEndDateSerializer
      await endAssignment({ 
        id: targetId, 
        end_date: values.effective_to 
      }).unwrap();
      
      toast.success("Allocation lifecycle limited successfully.");
      reset();
      onClose();
    } catch {
      toast.error("Operation transaction failed.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.97 }} 
            className="relative z-10 w-full max-w-sm bg-white rounded-xl p-5 border border-slate-200 shadow-2xl space-y-4 text-slate-700"
          >
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shrink-0">
                <CalendarX className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Terminate Target Assignment Lifecycle</h4>
                <p className="text-xs text-slate-500 mt-1">
                  This sets an analytical bounds limit to the active assignment. Staff parameters fall back safely onto systemic defaults past this coordinate.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(handleCommitAction)} className="space-y-3 pt-1">
              <div>
                <label htmlFor="end-date-picker" className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Designate Cutoff Date
                </label>
                <input 
                  id="end-date-picker" 
                  type="date" 
                  {...register("effective_to", { required: "A cancellation cutoff date is required." })} 
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-hidden" 
                />
                {errors.effective_to && (
                  <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.effective_to.message}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={isLoading}
                  className="px-3 py-1.5 border border-slate-200 bg-white rounded-md hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Abort
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 text-white hover:bg-amber-500 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="h-3 w-3 animate-spin" />} Terminate Layer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
import React from "react";
import { FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useHolidayForm } from "../../hooks/useHolidayForm";
import { X, Loader2, Calendar } from "lucide-react";

export const HolidayFormModal = ({ isOpen, onClose, activeHoliday, isReadOnly = false }) => {
  const { methods, onSubmit, isSaving } = useHolidayForm(activeHoliday, onClose);
  const { register, formState: { errors } } = methods;

  React.useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">
                  {isReadOnly ? "View Holiday Criteria" : activeHoliday ? "Modify Calendar Rule" : "Create Global Corporate Holiday"}
                </h3>
              </div>
              <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <fieldset disabled={isReadOnly} className="space-y-5 w-full">
                  <div>
                    <label htmlFor="holiday-name-input" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Holiday Label Title</label>
                    <input
                      id="holiday-name-input"
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Independence Day, Annual Corporate Break"
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="holiday-type-select" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Classification</label>
                      <select
                        id="holiday-type-select"
                        {...register("holiday_type")}
                        className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="public">Public statutory</option>
                        <option value="company">Company Custom</option>
                        <option value="religious">Religious Event</option>
                        <option value="government">Government Ordered</option>
                        <option value="regional">Regional / Local</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="holiday-date-input" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Calendar Date Target</label>
                      <input
                        id="holiday-date-input"
                        type="date"
                        {...register("holiday_date")}
                        className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                      {errors.holiday_date && <p className="mt-1 text-xs text-red-600">{errors.holiday_date.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="holiday-desc-input" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Operational Guidelines Summary (Optional)</label>
                    <textarea
                      id="holiday-desc-input"
                      rows={3}
                      {...register("description")}
                      placeholder="Specify optional cross-regional parameters or contextual parameters..."
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                      <input id="is_paid_toggle" type="checkbox" {...register("is_paid")} className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="is_paid_toggle" className="ml-2.5 text-sm font-semibold text-slate-800">
                        Paid Holiday
                        <span className="block font-normal text-xs text-slate-400 mt-0.5">Contributes directly to payroll metrics.</span>
                      </label>
                    </div>

                    <div className="flex items-start rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                      <input id="is_half_day_toggle" type="checkbox" {...register("is_half_day")} className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="is_half_day_toggle" className="ml-2.5 text-sm font-semibold text-slate-800">
                        Half-Day Block
                        <span className="block font-normal text-xs text-slate-400 mt-0.5">Enforces partial operational runtime shifts.</span>
                      </label>
                    </div>
                  </div>
                </fieldset>

                <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50">
                    {isReadOnly ? "Close View" : "Cancel"}
                  </button>
                  {!isReadOnly && (
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {activeHoliday ? "Update Criteria" : "Publish Holiday"}
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
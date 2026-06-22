import React, { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useWorkingScheduleForm } from "../../hooks/useWorkingScheduleForm";
import { WorkingDaysSelector } from "./WorkingDaysSelector";
import { WorkHoursCard } from "./WorkHoursCard";
import { LocalizationCard } from "./LocalizationCard";
import { HolidayIntegrationCard } from "./HolidayIntegrationCard";
import { SaveActions } from "./SaveActions";
import { AnimatePresence, motion } from "framer-motion";

const NAVIGATION_ITEMS = [
  { id: "sec-days", label: "Working Days" },
  { id: "sec-hours", label: "Work Hours & Breaks" },
  { id: "sec-locale", label: "Localization" },
  { id: "sec-holiday", label: "Holiday Integration" },
];

export const WorkingScheduleForm = ({ existingSchedule, onSaveSuccess, onCancelEdit }) => {
  const { methods, onSubmit, isSaving } = useWorkingScheduleForm(
    existingSchedule,
    onSaveSuccess
  );
  
  const { formState: { isDirty }, reset } = methods;
  const [activeSection, setActiveSection] = useState("sec-days");

  // Rock-solid browser intersection observer to track active section highlights securely
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    NAVIGATION_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="font-sans selection:bg-gray-900 selection:text-white"
      >
        {/* Back Link Component Navigation Anchor */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group py-1 focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to policy overview</span>
          </button>
        </div>

        {/* Two-Column Grid Shell Layout */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-10">
          
          {/* Left Side: Sticky Section Navigation Anchor Panel */}
          <aside className="hidden lg:block">
            <nav className="sticky top-16 space-y-1" aria-label="Form Sections Layout">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left text-sm font-medium py-2 px-3 rounded-md transition-colors duration-150 focus:outline-none ${
                    activeSection === item.id
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Side: Primary Content Canvas Block */}
          <main className="space-y-12 lg:col-span-3">
            <FormSection
              title="Working Days"
              description="Configure which days employees are expected to work."
              id="sec-days"
            >
              <WorkingDaysSelector />
            </FormSection>

            <FormSection
              title="Work Hours & Breaks"
              description="Define operational hours and break deductions."
              id="sec-hours"
            >
              <WorkHoursCard />
            </FormSection>

            <FormSection
              title="Localization"
              description="Configure timezone and regional attendance settings."
              id="sec-locale"
            >
              <LocalizationCard />
            </FormSection>

            <FormSection
              title="Holiday Integration"
              description="Control how public holidays affect attendance calculations."
              id="sec-holiday"
            >
              <HolidayIntegrationCard />
            </FormSection>
          </main>
        </div>

        {/* Global Operational Sticky Actions Bar */}
        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-4 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)] sm:px-8"
              role="region"
              aria-label="Unsaved configuration actions"
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      You have unsaved configuration changes
                    </p>
                    <p className="hidden text-xs text-gray-500 sm:block">
                      Changes will update operational processing rules and apply directly to runtime attendance evaluations.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <SaveActions
                    isDirty={isDirty}
                    isSaving={isSaving}
                    onCancel={() => reset()}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </FormProvider>
  );
};

/* ── FormSection Context Container Layout ── */
function FormSection({ title, description, id, children }) {
  return (
    <section 
      id={id} 
      className="scroll-mt-16 space-y-4 focus:outline-none" 
      aria-labelledby={`${id}-heading`}
    >
      <div className="border-b border-gray-200/80 pb-3">
        <h2
          id={`${id}-heading`}
          className="text-base font-semibold text-gray-900 tracking-tight"
        >
          {title}
        </h2>
        <p className="mt-1 text-xs text-gray-500 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Flat operational container canvas card wrapper */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        {children}
      </div>
    </section>
  );
}
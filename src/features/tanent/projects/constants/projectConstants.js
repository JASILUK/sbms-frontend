export const PROJECT_STATUS_CONFIG = {
  planning: {
    label: "Planning",
    variant: "secondary",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
  active: {
    label: "Active",
    variant: "default",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  on_hold: {
    label: "On Hold",
    variant: "warning",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  completed: {
    label: "Completed",
    variant: "success",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  archived: {
    label: "Archived",
    variant: "outline",
    badgeClass: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 line-through",
  },
};

export const PROJECT_VISIBILITY_CONFIG = {
  public: {
    label: "Public",
    description: "Visible to all employees with view permission.",
  },
  private: {
    label: "Private",
    description: "Restricted strictly to assigned project members.",
  },
};
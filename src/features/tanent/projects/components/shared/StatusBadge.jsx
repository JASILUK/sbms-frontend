import React from "react";
import { PROJECT_STATUS_CONFIG } from "../../constants/projectConstants";

export const StatusBadge = ({ status }) => {
  const config = PROJECT_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badgeClass}`}>
      {config.label}
    </span>
  );
};
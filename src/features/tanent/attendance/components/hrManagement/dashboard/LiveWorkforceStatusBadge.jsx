// # attendance/components/hrManagement/dashboard/LiveWorkforceStatusBadge.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { getStatusConfig } from '../../../utils/hrAttendance/statusUtils';

export const LiveWorkforceStatusBadge = React.memo(({ status, needsReview }) => {
  const config = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.chip}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
      {needsReview && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-rose-700 border border-rose-300 ring-1 ring-rose-200">
          Review
        </span>
      )}
    </div>
  );
});

LiveWorkforceStatusBadge.displayName = 'LiveWorkforceStatusBadge';
LiveWorkforceStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  needsReview: PropTypes.bool,
};
import React from 'react';
import { ENROLLMENT_STATUS } from '../../constants/faceManagementConstants';

export function FaceStatusBadge({ status }) {
  const badgeMap = {
    [ENROLLMENT_STATUS.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200/60',
    [ENROLLMENT_STATUS.APPROVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    [ENROLLMENT_STATUS.REJECTED]: 'bg-rose-50 text-rose-700 border-rose-200/60',
    [ENROLLMENT_STATUS.REVOKED]: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <span className={`px-2.5 py-0.5 font-mono text-[10px] font-bold rounded-full border tracking-wide uppercase ${badgeMap[status] || badgeMap.REVOKED}`}>
      {status}
    </span>
  );
}
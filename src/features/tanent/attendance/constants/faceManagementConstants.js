export const ENROLLMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVOKED: 'REVOKED'
};

export const ENROLLMENT_SOURCE = {
  EMPLOYEE: 'EMPLOYEE',
  HR: 'HR'
};

export const STATUS_FILTER_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: ENROLLMENT_STATUS.PENDING },
  { label: 'Approved', value: ENROLLMENT_STATUS.APPROVED },
  { label: 'Rejected', value: ENROLLMENT_STATUS.REJECTED },
  { label: 'Revoked', value: ENROLLMENT_STATUS.REVOKED }
];

export const SOURCE_FILTER_OPTIONS = [
  { label: 'All Sources', value: '' },
  { label: 'Employee', value: ENROLLMENT_SOURCE.EMPLOYEE },
  { label: 'HR Directed', value: ENROLLMENT_SOURCE.HR }
];
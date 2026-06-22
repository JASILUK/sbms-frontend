export const FACE_POLICY_TAGS = {
  FACE_POLICY: 'FACE_ENROLLMENT_POLICY',
  ATTENDANCE_METHODS: 'ATTENDANCE_METHODS',
};

export const POLICY_TYPES = {
  SELF_ONLY: 'SELF_ONLY',
  SELF_WITH_APPROVAL: 'SELF_WITH_APPROVAL',
  HR_ONLY: 'HR_ONLY',
};

export const POLICY_STRATEGY_REGISTRY = [
  {
    value: POLICY_TYPES.SELF_ONLY,
    icon: 'User',
    title: 'Employee Self Enrollment',
    description: 'Employees enroll themselves via self-service terminals and gain immediate authentication clearance.',
    steps: ['Employee Initiate', 'Capture Face Matrix', 'Auto-Approved', 'Sign-In Clearance'],
  },
  {
    value: POLICY_TYPES.SELF_WITH_APPROVAL,
    icon: 'ShieldCheck',
    title: 'Employee Enrollment with HR Approval',
    description: 'Employees submit biometric snapshots that require manual operational review and verification by an HR Administrator.',
    steps: ['Employee Submit', 'Biometric Queue Ingest', 'HR Manual Audit Review', 'Active Sign-In'],
  },
  {
    value: POLICY_TYPES.HR_ONLY,
    icon: 'Building2',
    title: 'HR Managed Enrollment Only',
    description: 'Biometric registration is strictly restricted. Only HR administrators can execute face scans via backend consoles.',
    steps: ['HR Selects Target User', 'Console Camera Scan', 'Immediate Force Activation'],
  },
];
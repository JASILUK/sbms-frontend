/**
 * @file attendanceAccessConstants.js
 * @description Domain configuration constraints and validation registry values for the Access Control subsystem.
 */

import { Navigation, ShieldCheck, Fingerprint, QrCode, ClipboardEdit } from 'lucide-react';

export const ACCESS_CACHE_TAGS = {
  COMPANY_DEFAULTS: 'ATTENDANCE_ACCESS_DEFAULTS',
  ACCESS_RULES: 'ATTENDANCE_ACCESS_RULES',
  EMPLOYEE_OVERRIDES: 'ATTENDANCE_ACCESS_OVERRIDES'
};

export const NAVIGATION_SECTION_KEYS = {
  METHODS: 'methods',
  LOCATIONS: 'locations',
  ACCESS: 'access'
};

export const SCOPE_TREATMENT_MODES = {
  DEPARTMENT: 'DEPARTMENT',
  WORK_MODE: 'WORK_MODE'
};

// ✅ FIXED: Stripped out PRIMARY completely. Pure mapping to your precise database choices
export const ANCHOR_VALIDATION_MODES = {
  ANY: 'ANY',
  ALL: 'ALL'
};

export const PRESET_WORK_MODES = {
  OFFICE: 'office',
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  FIELD: 'field'
};

export const COMPLIANCE_METHODS = {
  GPS: 'GPS',
  FACE: 'FACE',
  BIOMETRIC: 'BIOMETRIC',
  QR: 'QR',
  MANUAL: 'MANUAL'
};

export const WORK_MODE_REGISTRY = [
  { value: PRESET_WORK_MODES.OFFICE, label: 'Office' },
  { value: PRESET_WORK_MODES.REMOTE, label: 'Remote' },
  { value: PRESET_WORK_MODES.HYBRID, label: 'Hybrid' },
  { value: PRESET_WORK_MODES.FIELD, label: 'Field' }
];

// ✅ FIXED: UI dropdown options now match the backend database key options perfectly
export const VALIDATION_MODE_REGISTRY = [
  { value: ANCHOR_VALIDATION_MODES.ANY, label: 'Any Configured Method Allowed (Flexible Choice)' },
  { value: ANCHOR_VALIDATION_MODES.ALL, label: 'All Configured Methods Required (Multi-Layer Enforcement)' }
];

export const METHODS_META = {
  [COMPLIANCE_METHODS.GPS]: {
    label: 'Geofenced Coordinate Boundary',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
    icon: Navigation
  },
  [COMPLIANCE_METHODS.FACE]: {
    label: 'Biometric Facial Recognition',
    bg: 'bg-sky-50',
    color: 'text-sky-600',
    icon: ShieldCheck
  },
  [COMPLIANCE_METHODS.BIOMETRIC]: {
    label: 'Hardware Fingerprint Terminal',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    icon: Fingerprint
  },
  [COMPLIANCE_METHODS.QR]: {
    label: 'QR Code Scanning Framework',
    bg: 'bg-purple-50',
    color: 'text-purple-600',
    icon: QrCode
  },
  [COMPLIANCE_METHODS.MANUAL]: {
    label: 'Administrative Manual Overwrite',
    bg: 'bg-slate-50',
    color: 'text-slate-600',
    icon: ClipboardEdit
  }
};
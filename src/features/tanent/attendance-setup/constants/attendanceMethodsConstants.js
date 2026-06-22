import { MapPin, ScanFace, Fingerprint, QrCode, ClipboardCheck } from 'lucide-react';

export const ATTENDANCE_METHODS_TAG = 'ATTENDANCE_METHODS';

export const METHOD_TYPES = {
  GPS: 'GPS',
  FACE: 'FACE',
  BIOMETRIC: 'BIOMETRIC',
  QR: 'QR',
  MANUAL: 'MANUAL'
};

export const METHOD_META_REGISTRY = {
  [METHOD_TYPES.GPS]: {
    label: 'GPS Geofencing',
    icon: MapPin,
    description: 'Employees verify attendance within approved workplace locations.',
    requirements: ['Attendance Locations registration required.', 'Device GPS location access authentication.'],
    nextStepLink: 'locations',
    nextStepLabel: 'Configure Locations Setup'
  },
  [METHOD_TYPES.FACE]: {
    label: 'Face Recognition',
    icon: ScanFace,
    description: 'Employees authenticate using face verification before check-in.',
    requirements: ['Employee Face Model Enrollment registration required.', 'Camera infrastructure hardware permissions.'],
    nextStepLink: 'access',
    nextStepLabel: 'Configure Face Enrollment'
  },
  [METHOD_TYPES.BIOMETRIC]: {
    label: 'Biometric Device',
    icon: Fingerprint,
    description: 'Integrate external biometric devices for attendance tracking.',
    requirements: ['Biometric Device API integration registration setup required.', 'Hardware terminal pairing keys mapping.'],
    nextStepLink: 'access',
    nextStepLabel: 'Configure Biometric Devices'
  },
  [METHOD_TYPES.QR]: {
    label: 'QR Code Scanning',
    icon: QrCode,
    description: 'Employees scan workplace QR codes to register attendance.',
    requirements: ['QR dynamic token generation script setup initialization.', 'Mobile device viewport camera alignment.'],
    nextStepLink: 'access',
    nextStepLabel: 'Configure Dynamic QR Codes'
  },
  [METHOD_TYPES.MANUAL]: {
    label: 'Manual Adjustment',
    icon: ClipboardCheck,
    description: 'HR administrators can manually adjust attendance records.',
    requirements: ['HR explicit elevated system context capabilities role permissions.', 'Audit trail justification telemetry logging overhead.'],
    nextStepLink: 'access',
    nextStepLabel: 'Configure Permissions Matrix'
  }
};
import { z } from 'zod';
import { SCOPE_TREATMENT_MODES, ANCHOR_VALIDATION_MODES, COMPLIANCE_METHODS } from '../constants/attendanceAccessConstants';

/**
 * Defensive configuration check ensuring location perimeters accompany GPS authentication methods.
 * Note: Now checks array constraints against primary key integer IDs.
 */
const enforceGeofenceDependence = (methods, locations, ctx) => {
  // Check if GPS primary key representation is active inside selection list array
  // (Using loose comparison or numeric check depending on configuration values mapping setup)
  if (methods?.includes(1) || methods?.includes('1') || methods?.includes(COMPLIANCE_METHODS.GPS)) {
    if (!locations || locations.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Active geofence selection parameters are required when the GPS method is enabled.',
        path: ['allowed_locations']
      });
    }
  }
};

export const companyDefaultsValidationSchema = z.object({
  validation_mode: z.nativeEnum(ANCHOR_VALIDATION_MODES, {
    errorMap: () => ({ message: 'Provide a valid organizational Validation Mode configuration.' })
  }),
  // ✅ FIXED: Shifted array items from z.string() to z.number() to allow database PK integers
  allowed_methods: z.array(z.number()).min(1, {
    message: 'Global tenant defaults profile requires at least one tracking authentication channel.'
  }),
  allowed_locations: z.array(z.number()).default([])
}).superRefine((data, ctx) => {
  enforceGeofenceDependence(data.allowed_methods, data.allowed_locations, ctx);
});

export const accessRuleValidationSchema = z.object({
  name: z.string().min(3, { message: 'Rule title text must consist of at least 3 descriptive characters.' }).max(120),
  scope_type: z.nativeEnum(SCOPE_TREATMENT_MODES),
  department: z.preprocess((val) => (val === '' || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  work_mode: z.string().nullable().optional(),
  validation_mode: z.nativeEnum(ANCHOR_VALIDATION_MODES),
  // ✅ FIXED: Shifted array items from z.string() to z.number() to allow database PK integers
  allowed_methods: z.array(z.number()).min(1, { message: 'Assign at least one active checking method channel for the rule scope.' }),
  allowed_locations: z.array(z.number()).default([]),
  priority: z.preprocess((val) => parseInt(val, 10), z.number().min(1, { message: 'Rule prioritization floor scale is 1.' }).max(1000)),
  is_active: z.boolean().default(true)
}).superRefine((data, ctx) => {
  // Enforce structural boundary conditions based on target dimensions scope
  if (data.scope_type === SCOPE_TREATMENT_MODES.DEPARTMENT && !data.department) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Explicit target corporate department node key reference required.',
      path: ['department']
    });
  }
  if (data.scope_type === SCOPE_TREATMENT_MODES.WORK_MODE && !data.work_mode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Explicit enterprise employee work mode classification string configuration required.',
      path: ['work_mode']
    });
  }
  enforceGeofenceDependence(data.allowed_methods, data.allowed_locations, ctx);
});

export const employeeOverrideValidationSchema = z.object({
  membership_id: z.preprocess((val) => parseInt(val, 10), z.number({
    required_error: 'Explicit target employee link index parameter record key identifier required.'
  })),
  validation_mode: z.nativeEnum(ANCHOR_VALIDATION_MODES),
  // ✅ FIXED: Shifted array items from z.string() to z.number() to allow database PK integers
  allowed_methods: z.array(z.number()).min(1, { message: 'Select at least one override target execution checking channel.' }),
  allowed_locations: z.array(z.number()).default([]),
  reason: z.string().min(6, { message: 'Corporate variance audit justification string trailing reason length requires at least 6 characters.' }).max(600),
  is_active: z.boolean().default(true)
}).superRefine((data, ctx) => {
  enforceGeofenceDependence(data.allowed_methods, data.allowed_locations, ctx);
});
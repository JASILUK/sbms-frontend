import { z } from 'zod';
import { METHOD_TYPES } from '../constants/attendanceMethodsConstants';

export const attendanceMethodsFormSchema = z.object({
  methods: z.array(z.string()).min(1, {
    message: 'Tenant verification structures require at least one active ingestion method.'
  })
}).refine((data) => {
  const selected = data.methods;
  // Rule 2 Check: MANUAL method cannot exist entirely isolated alone
  if (selected.length === 1 && selected[0] === METHOD_TYPES.MANUAL) {
    return false;
  }
  return true;
}, {
  message: "The 'Manual Adjustment' strategy cannot be deployed alone. Provide an employee-facing validation vector.",
  path: ['methods']
});
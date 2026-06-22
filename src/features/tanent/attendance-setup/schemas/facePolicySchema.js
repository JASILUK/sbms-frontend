import { z } from 'zod';
import { POLICY_TYPES } from '../constants/facePolicyConstants';

export const facePolicyValidationSchema = z.object({
  policy_type: z.enum([POLICY_TYPES.SELF_ONLY, POLICY_TYPES.SELF_WITH_APPROVAL, POLICY_TYPES.HR_ONLY], {
    errorMap: () => ({ message: 'Please isolate and select a valid authorization enrollment strategy framework.' }),
  }),
  is_active: z.boolean().default(true),
});
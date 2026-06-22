import { z } from "zod";

const currentYear = new Date().getFullYear();

export const holidayImportSchema = z.object({
  country_code: z
    .string()
    .trim()
    .toUpperCase()
    .length(2, "Country reference must be exactly a 2-letter ISO country code."),
  year: z
    .number({ invalid_type_error: "Year parameter must be structural integer numerical values." })
    .min(2000, "Import processing thresholds start from the year 2000.")
    .max(currentYear + 2, `Import parameters limited up to year ${currentYear + 2}.`),
  subdivision: z
    .string()
    .trim()
    .toUpperCase()
    .max(10, "Subdivision target labels must not cross 10 alphanumeric characters.")
    .optional()
    .or(z.literal("")),
  overwrite_existing: z.boolean().default(false),
});
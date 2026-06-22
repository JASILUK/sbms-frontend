import React from "react";
import { useFormContext } from "react-hook-form";
import { Globe2 } from "lucide-react";

// Preserved exact array structure to protect underlying data-binding logic
const TIMEZONES = [
  { value: "Asia/Kolkata", label: "India Standard Time (GMT+05:30) • Asia/Kolkata" },
  { value: "UTC", label: "Coordinated Universal Time (GMT+00:00) • UTC" },
  { value: "America/New_York", label: "Eastern Time (GMT-05:00) • America/New_York" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT+00:00) • Europe/London" },
  { value: "Asia/Singapore", label: "Singapore Standard Time (GMT+08:00) • Asia/Singapore" },
];

export const LocalizationCard = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 font-sans bg-white">
      {/* Labeled Structural Header Frame */}
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 text-gray-400 shrink-0">
          <Globe2 className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Regional Settings
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 max-w-2xl leading-relaxed">
            Define the country, region, and timezone used for attendance calculations.
          </p>
        </div>
      </div>

      {/* Field Input Grid Layout Wrapper */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Country Field Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </label>
            <span className="text-[11px] text-gray-400 font-normal">ISO 2-letter code</span>
          </div>
          <input
            id="country"
            type="text"
            maxLength={2}
            placeholder="IN"
            {...register("country")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm uppercase transition-colors duration-100 placeholder-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.country ? (
            <p className="text-xs font-medium text-red-600 transition-opacity duration-150" role="alert">
              {errors.country.message}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400">Use the two-letter country code (for example, IN).</p>
          )}
        </div>

        {/* State or Region Field Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="state" className="text-sm font-medium text-gray-700">
              State or Region
            </label>
            <span className="text-[11px] text-gray-400 font-normal">Optional</span>
          </div>
          <input
            id="state"
            type="text"
            placeholder="Kerala"
            {...register("state")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-100 placeholder-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.state ? (
            <p className="text-xs font-medium text-red-600 transition-opacity duration-150" role="alert">
              {errors.state.message}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400">Specify subdivision if attendance rules vary locally.</p>
          )}
        </div>

        {/* Timezone Native Select Input */}
        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            id="timezone"
            {...register("timezone")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-100 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          {errors.timezone && (
            <p className="text-xs font-medium text-red-600 transition-opacity duration-150" role="alert">
              {errors.timezone.message}
            </p>
          )}
        </div>
      </div>

      {/* Structural System Context Guidance Footnote */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400 leading-normal">
          Regional settings influence attendance calculations, reporting rules, and public holiday interpretation.
        </p>
      </div>
    </div>
  );
};
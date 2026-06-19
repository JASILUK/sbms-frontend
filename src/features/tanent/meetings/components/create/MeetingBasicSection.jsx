import { useFormContext } from "react-hook-form";

export default function MeetingBasicSection() {
  const { register } = useFormContext();

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold">
          Basic Information
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Meeting title and details
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">
          Title
        </label>

        <input
          {...register("title")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Enter meeting title"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={4}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Meeting description"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Agenda
        </label>

        <textarea
          {...register("agenda")}
          rows={4}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Meeting agenda"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Category
        </label>

        <select
          {...register("category")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="general">
            General
          </option>

          <option value="interview">
            Interview
          </option>

          <option value="training">
            Training
          </option>

          <option value="project">
            Project
          </option>

        </select>
      </div>
    </div>
  );
}
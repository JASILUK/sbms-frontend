import { useMemo, useState } from "react";
import { Search, X, Building2 } from "lucide-react";

import { useGetDepartmentsQuery } from "../../../../deaprtment/departmentApi";

export default function TargetSelectorModal({
  open,
  onClose,
  selectedTargets = [],
  onChange,
}) {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
  } = useGetDepartmentsQuery();

  const departments = data?.data || [];

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) {
      return departments;
    }

    const q = search.toLowerCase();

    return departments.filter(
      (department) =>
        department.name
          ?.toLowerCase()
          .includes(q)
    );
  }, [departments, search]);

  const selectedIds = selectedTargets.map(
    (t) => t.target_id
  );

  const toggleDepartment = (department) => {
    const exists = selectedIds.includes(
      department.id
    );

    if (exists) {
      onChange(
        selectedTargets.filter(
          (t) =>
            t.target_id !== department.id
        )
      );
    } else {
      onChange([
        ...selectedTargets,
        {
          target_type: "department",
          target_id: department.id,
          name: department.name,
        },
      ]);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl border shadow-xl overflow-hidden">

          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />

              <h2 className="text-sm font-semibold">
                Select Departments
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search departments..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-sm">
                Loading...
              </div>
            ) : (
              filteredDepartments.map(
                (department) => {
                  const selected =
                    selectedIds.includes(
                      department.id
                    );

                  return (
                    <button
                      key={department.id}
                      type="button"
                      onClick={() =>
                        toggleDepartment(
                          department
                        )
                      }
                      className={`w-full p-4 border-b text-left ${
                        selected
                          ? "bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {department.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {
                              department.member_count
                            }{" "}
                            members
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={selected}
                          readOnly
                        />
                      </div>
                    </button>
                  );
                }
              )
            )}
          </div>

          <div className="p-4 border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {selectedTargets.length} selected
            </p>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
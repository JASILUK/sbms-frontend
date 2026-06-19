import { useMemo, useState } from "react";
import { Search, X, Loader2, Users } from "lucide-react";
import { useGetEmployeesQuery } from "../../../../emplyees/emplyeeApi";

export default function ParticipantSelectorModal({
  open,
  onClose,
  selectedParticipants = [],
  onChange,
}) {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
  } = useGetEmployeesQuery();

  const employees = data?.data || [];

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) {
      return employees;
    }

    const q = search.toLowerCase();

    return employees.filter(
      (emp) =>
        emp.username?.toLowerCase().includes(q) ||
        emp.user_email?.toLowerCase().includes(q) ||
        emp.department_name?.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const selectedIds = selectedParticipants.map(
    (p) => p.id
  );

  const toggleParticipant = (employee) => {
    const exists = selectedIds.includes(
      employee.id
    );

    if (exists) {
      onChange(
        selectedParticipants.filter(
          (p) => p.id !== employee.id
        )
      );
    } else {
      onChange([
        ...selectedParticipants,
        employee,
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

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />

              <h2 className="text-sm font-semibold">
                Select Participants
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                No employees found
              </div>
            ) : (
              filteredEmployees.map((employee) => {
                const selected =
                  selectedIds.includes(employee.id);

                return (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() =>
                      toggleParticipant(employee)
                    }
                    className={`w-full p-4 border-b text-left transition ${
                      selected
                        ? "bg-indigo-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {employee.username}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {employee.user_email}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {employee.department_name}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={selected}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {selectedParticipants.length} selected
            </p>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
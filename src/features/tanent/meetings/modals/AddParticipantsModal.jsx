import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  UserPlus,
  Loader2,
  X,
} from "lucide-react";

import { useGetEmployeesQuery } from "../../emplyees/emplyeeApi";

export default function AddParticipantsModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  existingParticipants = [],
}) {
  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [
    selectedIds,
    setSelectedIds,
  ] = useState([]);

  // =====================================================
  // API
  // =====================================================

  const {
    data,
    isLoading: isEmployeesLoading,
  } = useGetEmployeesQuery();

  const employees =
    data?.data || [];

  // =====================================================
  // EXISTING IDS
  // =====================================================

  const existingIds =
    useMemo(() => {
      return existingParticipants.map(
        (participant) =>
          participant.membership_id
      );
    }, [existingParticipants]);

  // =====================================================
  // FILTERED EMPLOYEES
  // =====================================================

  const filteredEmployees =
    useMemo(() => {
      const query =
        search.toLowerCase();

      return employees.filter(
        (employee) => {
          const alreadyExists =
            existingIds.includes(
              employee.id
            );

          if (alreadyExists) {
            return false;
          }

          return (
            employee.username
              ?.toLowerCase()
              .includes(query) ||
            employee.user_email
              ?.toLowerCase()
              .includes(query)
          );
        }
      );
    }, [
      employees,
      search,
      existingIds,
    ]);

  // =====================================================
  // TOGGLE
  // =====================================================

  const toggleSelection = (
    membershipId
  ) => {
    setSelectedIds((prev) => {
      const exists =
        prev.includes(
          membershipId
        );

      if (exists) {
        return prev.filter(
          (id) =>
            id !== membershipId
        );
      }

      return [
        ...prev,
        membershipId,
      ];
    });
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async () => {
      try {
        await onSubmit?.(
          selectedIds
        );

        setSelectedIds([]);
      } catch (error) {
        console.error(error);
      }
    };

  // =====================================================
  // HIDE
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={
          isLoading
            ? undefined
            : onClose
        }
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Participants
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Select employees to add
                into this meeting
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">

            {isEmployeesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              </div>
            ) : filteredEmployees.length ===
              0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                No employees available
              </div>
            ) : (
              filteredEmployees.map(
                (employee) => {
                  const selected =
                    selectedIds.includes(
                      employee.id
                    );

                  return (
                    <button
                      key={
                        employee.id
                      }
                      type="button"
                      onClick={() =>
                        toggleSelection(
                          employee.id
                        )
                      }
                      className={`w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 transition-colors ${
                        selected
                          ? "bg-indigo-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-slate-500" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {
                              employee.username
                            }
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {
                              employee.user_email
                            }
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selected
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  );
                }
              )
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">

            <p className="text-sm text-slate-500">
              {
                selectedIds.length
              }{" "}
              selected
            </p>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  selectedIds.length ===
                    0 || isLoading
                }
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50"
              >
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                Add Participants
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
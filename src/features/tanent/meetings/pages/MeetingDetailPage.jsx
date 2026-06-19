import React, {
  useState,
  useCallback,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  AnimatePresence,
} from "framer-motion";

import {
  useGetMeetingDetailQuery,
} from "../api/meetingsApi";

import {
  useMeetingPermissions,
} from "../hooks/useMeetingPermissions";

import {
  useMeetingActions,
} from "../hooks/useMeetingActions";

import {
  useMeetingSessionActions,
} from "../hooks/useMeetingSessionActions";

import {
  useMeetingTabs,
} from "../hooks/useMeetingTabs";

// =====================================================
// DETAIL COMPONENTS
// =====================================================

import MeetingHero from "../components/detail/MeetingHero";

import MeetingStats from "../components/detail/MeetingStats";

import MeetingTabs from "../components/detail/MeetingTabs";

import OverviewTab from "../components/detail/OverviewTab";

import ParticipantsTab from "../components/detail/ParticipantsTab";

import TargetsTab from "../components/detail/TargetsTab";

import SessionTab from "../components/detail/SessionTab";

// =====================================================
// MODALS
// =====================================================

import EditMeetingModal from "../modals/EditMeetingModal";

import AddParticipantsModal from "../modals/AddParticipantsModal";

import ManageTargetsModal from "../modals/ManageTargetsModal";

import CancelMeetingModal from "../modals/CancelMeetingModal";

import EditTargetModal from "../components/detail/EditTargetModal";

const MeetingDetailPage = () => {

  // =====================================================
  // PARAMS
  // =====================================================

  const { meetingId } =
    useParams();

  const navigate =
    useNavigate();

  // =====================================================
  // DATA
  // =====================================================

  const {
    data: meeting,
    isLoading,
    error,
  } =
    useGetMeetingDetailQuery(
      meetingId
    );

  // =====================================================
  // HOOKS
  // =====================================================

  const permissions =
    useMeetingPermissions(
      meeting
    );

  const actions =
    useMeetingActions(
      meetingId
    );

  const sessionActions =
    useMeetingSessionActions(
      meetingId
    );

  const {
    activeTab,
    setActiveTab,
    tabs,
  } =
    useMeetingTabs();

  // =====================================================
  // MODALS
  // =====================================================

  const [modals, setModals] =
    useState({

      edit: false,

      addParticipants: false,

      manageTargets: false,

      editTarget: false,

      cancel: false,
    });

  // =====================================================
  // TARGET STATE
  // =====================================================

  const [
    selectedTarget,
    setSelectedTarget,
  ] = useState(null);

  // =====================================================
  // MODAL HELPERS
  // =====================================================

  const openModal =
    useCallback((key) => {

      setModals((prev) => ({
        ...prev,
        [key]: true,
      }));

    }, []);

  const closeModal =
    useCallback((key) => {

      setModals((prev) => ({
        ...prev,
        [key]: false,
      }));

    }, []);

  // =====================================================
  // TARGET EDIT
  // =====================================================

  const handleEditTarget =
    useCallback((target) => {

      setSelectedTarget(
        target
      );

      openModal(
        "editTarget"
      );

    }, [openModal]);

  // =====================================================
  // START SESSION
  // =====================================================

  const handleStartSession =
    useCallback(async () => {

      try {

        await sessionActions
          .handleStartSession();

        navigate(
          `/app/meetings/${meetingId}/session`
        );

      } catch (error) {

        console.error(error);

      }

    }, [
      sessionActions,
      navigate,
      meetingId,
    ]);

  // =====================================================
  // JOIN SESSION
  // =====================================================

  const handleJoinSession =
    useCallback(async () => {

      try {

        await sessionActions
          .handleJoinSession();

        navigate(
          `/app/meetings/${meetingId}/session`
        );

      } catch (error) {

        console.error(error);

      }

    }, [
      sessionActions,
      navigate,
      meetingId,
    ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">

        <div className="text-sm text-slate-500">
          Loading meeting...
        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !meeting) {

    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">

        <div className="text-center">

          <h2 className="text-lg font-semibold text-slate-900">
            Meeting not found
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            The meeting does not exist
            or you do not have access.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>

      {/* ================================================= */}
      {/* PAGE */}
      {/* ================================================= */}

      <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">

        {/* HERO */}
        <div className="shrink-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/60 z-20">

          <div className="max-w-5xl mx-auto px-4 sm:px-6">

            <MeetingHero
              meeting={meeting}
              permissions={permissions}
              onStartSession={
                handleStartSession
              }
              onJoinSession={
                handleJoinSession
              }
              onEdit={() =>
                openModal("edit")
              }
              onCancel={() =>
                openModal("cancel")
              }
            />

          </div>
        </div>

        {/* STATS */}
        <div className="shrink-0 bg-white border-b border-slate-200/60 z-10">

          <div className="max-w-5xl mx-auto px-4 sm:px-6">

            <MeetingStats
              meeting={meeting}
            />

          </div>
        </div>

        {/* TABS */}
        <div className="shrink-0 bg-white/90 backdrop-blur-sm border-b border-slate-200/60 z-10">

          <div className="max-w-5xl mx-auto px-4 sm:px-6">

            <MeetingTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={
                setActiveTab
              }
            />

          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto min-h-0">

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">

            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {activeTab ===
                "overview" && (

                <OverviewTab
                  key="overview"
                  meeting={meeting}
                />
              )}

              {/* PARTICIPANTS */}
              {activeTab ===
                "participants" && (

                <ParticipantsTab
                  key="participants"
                  meeting={meeting}
                  permissions={permissions}
                  actions={actions}
                  onAddParticipants={() =>
                    openModal(
                      "addParticipants"
                    )
                  }
                />
              )}

              {/* TARGETS */}
              {activeTab ===
                "targets" && (

                <TargetsTab
                  meeting={meeting}
                  permissions={permissions}
                  actions={actions}
                  onAddTarget={() =>
                    openModal(
                      "manageTargets"
                    )
                  }
                  onEditTarget={(
                    targetId
                  ) => {

                    const target =
                      meeting.targets.find(
                        (t) =>
                          t.id ===
                          targetId
                      );

                    if (!target) {
                      return;
                    }

                    handleEditTarget(
                      target
                    );
                  }}
                />
              )}

              {/* SESSION */}
              {activeTab ===
                "session" && (

                <SessionTab
                  key="session"
                  meeting={meeting}
                  permissions={permissions}
                  actions={sessionActions}
                />
              )}

            </AnimatePresence>

            <div className="h-6" />

          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* EDIT MEETING */}
      {/* ================================================= */}

      <EditMeetingModal
        meeting={meeting}
        isOpen={modals.edit}
        onClose={() =>
          closeModal("edit")
        }
        onSubmit={async (
          data
        ) => {

          try {

            await actions
              .handleUpdateMeeting(
                data
              );

            closeModal(
              "edit"
            );

          } catch (error) {

            console.error(
              error
            );

          }

        }}
      />

      {/* ================================================= */}
      {/* ADD PARTICIPANTS */}
      {/* ================================================= */}

      <AddParticipantsModal
        isOpen={
          modals.addParticipants
        }
        onClose={() =>
          closeModal(
            "addParticipants"
          )
        }
        isLoading={
          actions.isAddingParticipants
        }
        existingParticipants={
          meeting.participants || []
        }
        onSubmit={async (
          ids
        ) => {

          try {

            await actions
              .handleAddParticipants(
                ids
              );

            closeModal(
              "addParticipants"
            );

          } catch (error) {

            console.error(
              error
            );

          }

        }}
      />

      {/* ================================================= */}
      {/* ADD TARGET */}
      {/* ================================================= */}

      <ManageTargetsModal
        isOpen={
          modals.manageTargets
        }
        onClose={() =>
          closeModal(
            "manageTargets"
          )
        }
        existingTargets={
          meeting.targets || []
        }
        isLoading={
          actions.isAddingTarget
        }
        onSubmit={async (
          data
        ) => {

          try {

            await actions
              .handleAddTarget(
                data.targetType,
                data.targetId
              );

            closeModal(
              "manageTargets"
            );

          } catch (error) {

            console.error(
              error
            );

          }

        }}
      />

      {/* ================================================= */}
      {/* EDIT TARGET */}
      {/* ================================================= */}

      <EditTargetModal
        isOpen={
          modals.editTarget
        }
        onClose={() =>
          closeModal(
            "editTarget"
          )
        }
        target={
          selectedTarget
        }
        isLoading={
          actions.isUpdatingTarget
        }
        onSubmit={async ({
          targetId,
          data,
        }) => {

          try {

            await actions
              .handleUpdateTarget(
                targetId,
                data
              );

            closeModal(
              "editTarget"
            );

          } catch (error) {

            console.error(
              error
            );

          }

        }}
      />

      {/* ================================================= */}
      {/* CANCEL */}
      {/* ================================================= */}

      <CancelMeetingModal
        isOpen={
          modals.cancel
        }
        onClose={() =>
          closeModal(
            "cancel"
          )
        }
        isLoading={
          actions.isCancelling
        }
        onConfirm={async (
          reason
        ) => {

          try {

            await actions
              .handleCancelMeeting(
                reason
              );

            closeModal(
              "cancel"
            );

          } catch (error) {

            console.error(
              error
            );

          }

        }}
      />

    </>
  );
};

export default MeetingDetailPage;
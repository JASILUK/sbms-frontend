import MeetingForm from "../components/create/MeetingForm";

export default function CreateMeetingPage() {
  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Create Meeting
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Schedule and manage organization meetings
          </p>
        </div>

        {/* Form */}
        <MeetingForm />
      </div>
    </div>
  );
}
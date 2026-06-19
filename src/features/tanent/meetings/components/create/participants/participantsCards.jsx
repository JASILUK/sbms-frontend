export default function ParticipantCard({
  participant,
}) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <p className="text-sm font-medium">
        {participant.username}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {participant.user_email}
      </p>
    </div>
  );
}
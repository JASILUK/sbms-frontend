import ParticipantCard from "./participantsCards";

export default function ParticipantList({
  participants = [],
}) {
  if (!participants.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {participants.map((participant) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
        />
      ))}
    </div>
  );
}
export default function ConversationItem({
  conversation,
  active,
  onClick
}) {

  return (

    <div
      onClick={onClick}
      className={`p-3 cursor-pointer border-b hover:bg-gray-50
      ${active ? "bg-gray-100" : ""}`}
    >

      <div className="font-medium">
        {conversation.name || "Direct Chat"}
      </div>

      <div className="text-sm text-gray-500">
        {conversation.last_message?.content || "No messages"}
      </div>

    </div>

  );
}
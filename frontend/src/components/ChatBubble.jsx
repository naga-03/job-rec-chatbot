export default function ChatBubble({ text, sender }) {
  return (
    <div className={`chat-bubble ${sender}`}>
      {text}
    </div>
  );
}

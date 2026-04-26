export default function Toast({ messages, onDismiss }) {
  return (
    <div className="toast-container">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`toast toast-${msg.type}`}
          onClick={() => onDismiss(msg.id)}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

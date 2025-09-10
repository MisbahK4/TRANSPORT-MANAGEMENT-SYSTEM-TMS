import { useState, useEffect, useRef } from "react";
import API from "../api";

export default function ChatBox({ room, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const messagesEndRef = useRef(null);

  // Load messages whenever the room changes
  useEffect(() => {
    if (!room?.id) {
      setMessages([]);
      return;
    }

    API.get(`/chatmessages/?room=${room.id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Chat load error:", err));
  }, [room]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const send = () => {
    if (!room?.id || !text.trim()) return;

    API.post("/chatmessages/", { room: room.id, message: text })
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setText("");
      })
      .catch((err) => console.error("Send failed:", err));
  };

  return (
    <div className="flex flex-col h-full border rounded-lg">
      {/* Header */}
      <div className="px-4 py-2 border-b flex justify-between items-center bg-gray-50">
        <span className="font-medium text-gray-700">{room?.title || "Chat"}</span>
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
          Back
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-lg max-w-xs ${
              m.sender.id === userId ? "bg-blue-100 ml-auto" : "bg-gray-100 mr-auto"
            }`}
          >
            {m.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t flex gap-2 bg-gray-50">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}


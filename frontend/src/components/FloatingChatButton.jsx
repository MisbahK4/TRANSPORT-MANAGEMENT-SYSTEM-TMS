// components/FloatingChatButton.jsx
import { FaComments } from "react-icons/fa";

export default function FloatingChatButton({ unreadCount = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition"
    >
      <FaComments className="text-2xl" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

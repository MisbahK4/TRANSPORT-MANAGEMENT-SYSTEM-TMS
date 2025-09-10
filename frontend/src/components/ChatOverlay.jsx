import { useState, useEffect } from "react";
import API from "../api";
import ChatBox from "./ChatBox";

export default function ChatOverlay() {
  const [chats, setChats] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  // Load ongoing chats
  useEffect(() => {
    API.get("/chatmessages/ongoing/")
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          setChats([]);
          setActiveRoom(null);
          return;
        }

        // Group by room id
        const grouped = res.data.reduce((acc, msg) => {
          const roomId = msg.room.id;
          if (!acc[roomId]) acc[roomId] = [];
          acc[roomId].push(msg);
          return acc;
        }, {});

        const chatList = Object.keys(grouped).map((roomId) => {
          const msgs = grouped[roomId];
          const last = msgs[msgs.length - 1];
          return {
            id: Number(roomId),
            title: last.room.package.title || `Room ${roomId}`, // package title from serializer
            lastMessage: last.message,
          };
        });

        setChats(chatList);
        if (chatList.length > 0) setActiveRoom(chatList[0]);
      })
      .catch((err) => console.error("Load ongoing chats failed:", err));
  }, []);

  if (activeRoom) {
    return <ChatBox room={activeRoom} onBack={() => setActiveRoom(null)} />;
  }

  return (
    <div className="h-full border rounded-lg bg-white">
      <div className="px-4 py-2 border-b bg-gray-50 font-medium">Active Chats</div>
      <div className="divide-y">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveRoom(chat)}
            className="p-3 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium">{chat.title}</div>
            <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { chatApi } from "../services/api";
import { ChatMessage, ChatRoom } from "../types";
import { CreateGroupModal } from "./CreateGroupModal";
import { useAuth } from "../context/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const { joinRoom, sendMessage, onMessage, isConnected, socket } = useSocket();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatApi.getRooms().then(setRooms);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      joinRoom(selectedRoom.id);
      chatApi.getMessages(selectedRoom.id).then(setMessages);
    }
  }, [selectedRoom]);

  useEffect(() => {
    onMessage((msg) => {
      if (msg.roomId === selectedRoom?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, [selectedRoom]);

  useEffect(() => {
    if (!socket) return;
    socket.on("typing", ({ roomId, user }) => {
      if (roomId === selectedRoom?.id && user.id !== user?.id) {
        setTypingUser(user.name);
        setTimeout(() => setTypingUser(""), 3000);
      }
    });
  }, [selectedRoom]);

  const handleTyping = () => {
    if (socket && selectedRoom) {
      socket.emit("typing", {
        roomId: selectedRoom.id,
        user: { id: user?.id, name: user?.name },
      });
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    sendMessage(selectedRoom.id, newMessage.trim());
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 border-r bg-white shadow-sm p-4 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">💬 Chats</h2>
          <button
            onClick={() => setShowGroupModal(true)}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
          >
            + Group
          </button>
        </div>
        {rooms.map((room) => {
          const lastMsg = room.messages[0];
          const isUnread =
            lastMsg && lastMsg.senderId !== user?.id && selectedRoom?.id !== room.id;

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedRoom?.id === room.id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {room.name || room.members.find((m) => m.id !== user?.id)?.name}
                </span>
                {isUnread && <span className="text-red-500 text-lg">•</span>}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {lastMsg?.content || "No messages"}
              </p>
            </div>
          );
        })}
      </aside>

      {/* Chat view */}
      <main className="w-full md:w-2/3 p-4 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Header */}
            <div className="text-lg font-semibold border-b pb-2 mb-4">
              {selectedRoom.name ||
                selectedRoom.members.find((m) => m.id !== user?.id)?.name}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  title={new Date(msg.createdAt).toLocaleString()}
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
                    msg.senderId === user?.id
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="text-sm break-words">{msg.content}</div>
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing */}
            {typingUser && (
              <div className="text-sm italic text-gray-500 mt-2">{typingUser} is typing...</div>
            )}

            {/* Input */}
            <div className="mt-4 flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging.
          </div>
        )}
      </main>

      <CreateGroupModal open={showGroupModal} onClose={() => setShowGroupModal(false)} />
    </div>
  );
};

export default ChatPage;

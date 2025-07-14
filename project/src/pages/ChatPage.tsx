import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { chatApi } from "../services/api";
import { ChatMessage, ChatRoom } from "../types";
import { CreateGroupModal } from "./CreateGroupModal";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MessageCircle, Users, Plus, Send } from "lucide-react";

const ChatPage = () => {
  const { user } = useAuth();
  const { joinRoom, sendMessage, onMessage, isConnected, socket } = useSocket();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await chatApi.getRooms();
      console.log('Loaded rooms:', roomsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      console.log('Selected room:', selectedRoom);
      joinRoom(selectedRoom.id);
      loadMessages(selectedRoom.id);
      setShowMobileChat(true);
    }
  }, [selectedRoom, joinRoom]);

  const loadMessages = async (roomId: string) => {
    try {
      const messagesData = await chatApi.getMessages(roomId);
      console.log('Loaded messages:', messagesData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (msg: ChatMessage) => {
      console.log('Received message:', msg);
      if (msg.roomId === selectedRoom?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    onMessage(handleMessage);

    // Cleanup function to remove listener
    return () => {
      if (socket) {
        socket.off('receive-message', handleMessage);
      }
    };
  }, [selectedRoom, onMessage, socket]);

  useEffect(() => {
    if (!socket) return;
    
    const handleTyping = ({ roomId, user: typingUserData }: { roomId: string; user: { id: string; name: string } }) => {
      if (roomId === selectedRoom?.id && typingUserData.id !== user?.id) {
        setTypingUser(typingUserData.name);
        setTimeout(() => setTypingUser(""), 3000);
      }
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [selectedRoom, socket, user]);

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
    console.log('Sending message:', newMessage.trim(), 'to room:', selectedRoom.id);
    sendMessage(selectedRoom.id, newMessage.trim());
    setNewMessage("");
  };

  const handleBackToRooms = () => {
    setShowMobileChat(false);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <aside className={`
        w-full md:w-80 lg:w-96 border-r bg-white shadow-sm flex flex-col
        ${showMobileChat ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            <h2 className="text-lg font-bold">Chats</h2>
          </div>
          <button
            onClick={() => setShowGroupModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Group</span>
          </button>
        </div>

        {/* Connection Status */}
        <div className="px-4 py-2 text-xs bg-gray-50 border-b flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
              <Users className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm text-center">No chats yet</p>
              <p className="text-xs text-center mt-1">Create a group to start chatting</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {rooms.map((room) => {
                const lastMsg = room.messages && room.messages.length > 0 ? room.messages[0] : null;
                const isUnread = lastMsg && lastMsg.senderId !== user?.id && selectedRoom?.id !== room.id;
                const isSelected = selectedRoom?.id === room.id;

                return (
                  <div
                    key={room.id}
                    onClick={() => handleRoomSelect(room)}
                    className={`
                      p-3 rounded-xl cursor-pointer transition-all duration-200 border
                      ${isSelected 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {room.name || room.members.find((m) => m.id !== user?.id)?.name || 'Unknown'}
                          </span>
                          {room.isGroup && <Users className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {lastMsg?.content || "No messages"}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Chat View */}
      <main className={`
        flex-1 flex flex-col
        ${showMobileChat ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm">
              {/* Mobile Back Button */}
              <button
                onClick={handleBackToRooms}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Chat Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedRoom.name || selectedRoom.members.find((m) => m.id !== user?.id)?.name || 'Unknown'}
                </h3>
                {selectedRoom.isGroup && (
                  <p className="text-sm text-gray-500">
                    {selectedRoom.members.length} members
                  </p>
                )}
              </div>

              {/* Connection indicator */}
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[75%] sm:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm
                        ${msg.senderId === user?.id
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-800 border rounded-bl-md'
                        }
                      `}
                      title={new Date(msg.createdAt).toLocaleString()}
                    >
                      {/* Sender name for group chats */}
                      {selectedRoom.isGroup && msg.senderId !== user?.id && (
                        <div className="text-xs text-gray-500 mb-1 font-medium">
                          {msg.sender?.name || 'Unknown'}
                        </div>
                      )}
                      
                      {/* Message content */}
                      <div className="text-sm break-words leading-relaxed">
                        {msg.content}
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-1 ${
                        msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUser && (
              <div className="px-4 py-2 text-sm italic text-gray-500 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span>{typingUser} is typing...</span>
                </div>
              </div>
            )}

            {/* Message Input - ALWAYS VISIBLE */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isConnected ? "Type a message..." : "Connecting..."}
                  className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  disabled={!isConnected}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          // No chat selected state
          <div className="flex items-center justify-center h-full text-gray-500 p-8">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
              <p className="text-sm max-w-sm">
                Select a conversation from the sidebar to start messaging, or create a new group chat.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      <CreateGroupModal 
        open={showGroupModal} 
        onClose={() => {
          setShowGroupModal(false);
          loadRooms(); // Reload rooms after creating a group
        }} 
      />
    </div>
  );
};

export default ChatPage;
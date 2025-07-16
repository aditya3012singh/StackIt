import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketContext";
import { chatApi } from "../services/api";
import { ChatMessage, ChatRoom } from "../types";
import { CreateGroupModal } from "./CreateGroupModal";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MessageCircle, Users, Plus, Send, Search, Zap, Clock } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredRooms = rooms.filter(room => 
    room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.members.some(member => member.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
      
      <div className="relative z-10 flex h-screen">
        {/* Sidebar - Hidden on mobile when chat is open */}
        <motion.aside 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`
            w-full md:w-80 lg:w-96 bg-white/5 backdrop-blur-md border-r border-white/10 shadow-xl flex flex-col
            ${showMobileChat ? 'hidden md:flex' : 'flex'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Chats</h2>
                  <p className="text-sm text-slate-400">Welcome back, <span className="text-blue-400">{user?.name}</span>!</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGroupModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-4 border-b border-white/10"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </motion.div>

          {/* Connection Status */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-4 py-3 text-xs border-b border-white/10 flex items-center gap-2"
          >
            <motion.div 
              animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} 
            />
            <span className={isConnected ? 'text-emerald-400' : 'text-red-400'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </motion.div>

          {/* Rooms List */}
           {/* 💡 ROOMS LIST - FIXED HERE */}
          <div className="flex-1 overflow-y-auto">
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-sm text-center font-medium">No chats yet</p>
                <p className="text-xs text-center mt-1 text-slate-500">
                  Create a group to start chatting
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-3 space-y-2 text-white" // ✅ Fix: Add text-white
              >
                {filteredRooms.map((room) => {
                  const lastMsg = room.messages?.[0];
                  const isUnread = lastMsg && lastMsg.senderId !== user?.id && selectedRoom?.id !== room.id;
                  const isSelected = selectedRoom?.id === room.id;

                  return (
                    <motion.div
                      key={room.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoomSelect(room)}
                      className={`
                        p-4 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-sm
                        ${isSelected 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/25' 
                          : 'hover:bg-white/5 border-transparent hover:border-white/10'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold truncate ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                              {room.name || room.members.find((m) => m.id !== user?.id)?.name || 'Unknown'}
                            </span>
                            {room.isGroup && <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-slate-400 truncate">
                            {lastMsg?.content || "No messages"}
                          </p>
                          {lastMsg && (
                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(lastMsg.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isUnread && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 bg-blue-400 rounded-full flex-shrink-0" 
                            />
                          )}
                          {lastMsg && (
                            <span className="text-xs text-slate-500">
                              {new Date(lastMsg.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.aside>

        {/* Chat View */}
        <motion.main 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`
            flex-1 flex flex-col bg-white/5 backdrop-blur-md
            ${showMobileChat ? 'flex' : 'hidden md:flex'}
          `}
        >
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-4 p-6 border-b border-white/10 bg-white/5 backdrop-blur-md"
              >
                {/* Mobile Back Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBackToRooms}
                  className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </motion.button>
                
                {/* Chat Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xl">
                    {selectedRoom.name || selectedRoom.members.find((m) => m.id !== user?.id)?.name || 'Unknown'}
                  </h3>
                  {selectedRoom.isGroup && (
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {selectedRoom.members.length} members
                    </p>
                  )}
                </div>

                {/* Connection indicator */}
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
                    className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} 
                  />
                  <span className="text-xs text-slate-400">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </motion.div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center h-full text-slate-400"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-10 h-10 opacity-50" />
                      </div>
                      <p className="text-lg font-medium mb-2 text-white">No messages yet</p>
                      <p className="text-sm text-slate-500">Start the conversation!</p>
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg, index) => {
                      const isOwn = msg.senderId === user?.id;
                      const showDate = index === 0 || 
                        new Date(messages[index - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                      
                      return (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Date separator */}
                          {showDate && (
                            <div className="flex items-center justify-center my-6">
                              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <span className="text-xs text-slate-400 font-medium">
                                  {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className={`
                                max-w-[75%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm
                                ${isOwn
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md shadow-blue-500/25'
                                  : 'bg-white/10 text-slate-100 border border-white/20 rounded-bl-md'
                                }
                              `}
                            >
                              {/* Sender name for group chats */}
                              {selectedRoom.isGroup && !isOwn && (
                                <div className="text-xs text-blue-400 mb-1 font-semibold">
                                  {msg.sender?.name || 'Unknown'}
                                </div>
                              )}
                              
                              {/* Message content */}
                              <div className="text-sm break-words leading-relaxed">
                                {msg.content}
                              </div>
                              
                              {/* Timestamp */}
                              <div className={`text-xs mt-2 flex items-center ${
                                isOwn ? 'text-blue-100' : 'text-slate-400'
                              }`}>
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(msg.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing Indicator */}
              <AnimatePresence>
                {typingUser && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="px-6 py-3 text-sm italic text-slate-400 bg-white/5 backdrop-blur-sm border-t border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-blue-400 rounded-full" 
                        />
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                          className="w-2 h-2 bg-blue-400 rounded-full" 
                        />
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-blue-400 rounded-full" 
                        />
                      </div>
                      <span>{typingUser} is typing...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Input */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 bg-white/5 backdrop-blur-md border-t border-white/10"
              >
                <div className="flex gap-3 max-w-4xl mx-auto">
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
                    className="flex-1 border border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 text-white placeholder-slate-400 transition-all duration-300"
                    disabled={!isConnected}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!newMessage.trim() || !isConnected}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl transition-all duration-300 font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            // No chat selected state
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center h-full text-slate-400 p-8"
            >
              <div className="text-center">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20"
                >
                  <MessageCircle className="w-12 h-12 opacity-50" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-white">Welcome to Chat</h3>
                <p className="text-slate-400 max-w-sm mb-6">
                  Select a conversation from the sidebar to start messaging, or create a new group chat.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGroupModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/25 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Group Chat
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.main>

        {/* Create Group Modal */}
        <CreateGroupModal 
          open={showGroupModal} 
          onClose={() => {
            setShowGroupModal(false);
            loadRooms();
          }} 
        />
      </div>
    </div>
  );
};

export default ChatPage;
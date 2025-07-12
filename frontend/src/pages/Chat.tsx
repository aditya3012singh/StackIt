import React, { useState } from 'react';
import { Send, Hash, Users, Search, Smile, PlusCircle, UserPlus, Share2, UserPlus2 } from 'lucide-react';
import { chatRooms, chatMessages, currentUser } from '../utils/data';

const Chat: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0] || null);
  const [message, setMessage] = useState('');
  const [showRoomList, setShowRoomList] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newRoom = {
        id: Date.now().toString(),
        name: newGroupName,
        participants: 1,
        lastMessage: null
      };
      chatRooms.push(newRoom);
      setSelectedRoom(newRoom);
      setNewGroupName('');
      setIsCreatingGroup(false);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite/${selectedRoom?.id}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setInviteLinkCopied(true);
      setTimeout(() => setInviteLinkCopied(false), 2000);
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`w-80 border-r border-gray-200 flex flex-col ${showRoomList ? 'block' : 'hidden'} lg:block`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chat Rooms</h2>
              <button
                onClick={() => setIsCreatingGroup(true)}
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
              >
                <PlusCircle size={16} /> New
              </button>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto">
            {chatRooms.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No groups yet. Create one to start chatting!</div>
            ) : (
              chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowRoomList(false);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedRoom?.id === room.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Hash size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900">{room.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} />
                    <span>{room.participants} members</span>
                  </div>
                  {room.lastMessage && (
                    <p className="text-sm text-gray-600 mt-2 truncate">
                      <span className="font-medium">{room.lastMessage.author.username}:</span> {room.lastMessage.content}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRoomList(true)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Hash size={20} />
                </button>
                <Hash size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{selectedRoom?.name}</h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <button
                  onClick={handleCopyInviteLink}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Share2 size={16} /> {inviteLinkCopied ? 'Link Copied!' : 'Share'}
                </button>
                <button
                  className="flex items-center gap-1 text-green-600 hover:underline"
                >
                  <UserPlus2 size={16} /> Add Member
                </button>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{selectedRoom?.participants} members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <img
                  src={msg.author.avatar}
                  alt={msg.author.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {msg.author.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message #${selectedRoom?.name}`}
                    rows={1}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Smile size={16} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Group creation modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus size={20} /> Create New Group
            </h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsCreatingGroup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

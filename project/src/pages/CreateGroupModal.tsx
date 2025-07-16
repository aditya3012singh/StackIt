import React, { useState, useEffect } from "react";
import { chatApi } from "../services/api";
import { User } from "../types";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      const usersData = await chatApi.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim() || selected.length === 0) return;
    
    setLoading(true);
    try {
      await chatApi.createGroup(groupName.trim(), selected);
      setGroupName("");
      setSelected([]);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-blue rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">Create Group Chat</h2>
        
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        <div className="max-h-64 overflow-y-auto mb-4">
          <p className="text-sm text-gray-600 mb-2">Select members:</p>
          {users.map((user) => (
            <label key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(user.id)}
                onChange={() => toggleSelect(user.id)}
                className="mr-3"
              />
              <span className="text-sm">{user.name}</span>
            </label>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createGroup}
            disabled={!groupName.trim() || selected.length === 0 || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};
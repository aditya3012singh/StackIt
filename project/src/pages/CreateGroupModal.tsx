import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../components/ui/dialog"; // or ../../components/ui/dialog
import { Button } from "../components/ui/button";
import { chatApi } from "../services/api";
import { User } from "../types";

export const CreateGroupModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    chatApi.getUsers().then(setUsers);
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    await chatApi.createGroup(groupName, selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-lg font-semibold mb-2">Create Group Chat</h2>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="w-full border p-2 mb-2 rounded"
        />
        <div className="max-h-64 overflow-y-auto">
          {users.map((user) => (
            <label key={user.id} className="block text-sm">
              <input
                type="checkbox"
                checked={selected.includes(user.id)}
                onChange={() => toggleSelect(user.id)}
                className="mr-2"
              />
              {user.name}
            </label>
          ))}
        </div>
        <Button onClick={createGroup} className="mt-3 w-full">
          Create Group
        </Button>
      </DialogContent>
    </Dialog>
  );
};

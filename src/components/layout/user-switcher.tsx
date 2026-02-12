"use client";

import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { ChevronDown, Plus, User } from "lucide-react";

export function UserSwitcher() {
  const { currentUser, users, setCurrentUser, addUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = async () => {
    if (newName.trim()) {
      await addUser(newName.trim());
      setNewName("");
      setIsAdding(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="font-medium">{currentUser?.name || "Select User"}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setIsAdding(false);
            }}
          />
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-border bg-popover shadow-lg z-50">
            <div className="py-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                    currentUser?.id === user.id ? "bg-accent/50 font-medium" : ""
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  {user.name}
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                {isAdding ? (
                  <div className="px-3 py-2">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd();
                        if (e.key === "Escape") setIsAdding(false);
                      }}
                      placeholder="Name..."
                      className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "@/lib/types";

interface UserContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  refreshUsers: () => Promise<void>;
  addUser: (name: string) => Promise<User>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const refreshUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  }, []);

  useEffect(() => {
    refreshUsers().then(() => {
      // Restore last selected user from localStorage
      const savedId = localStorage.getItem("currentUserId");
      if (savedId) {
        fetch("/api/users").then(r => r.json()).then((allUsers: User[]) => {
          const saved = allUsers.find((u: User) => u.id === Number(savedId));
          if (saved) setCurrentUserState(saved);
          else if (allUsers.length > 0) setCurrentUserState(allUsers[0]);
        });
      }
    });
  }, [refreshUsers]);

  // Once users load, auto-select if none selected
  useEffect(() => {
    if (!currentUser && users.length > 0) {
      const savedId = localStorage.getItem("currentUserId");
      const saved = savedId ? users.find(u => u.id === Number(savedId)) : null;
      setCurrentUserState(saved || users[0]);
    }
  }, [users, currentUser]);

  const setCurrentUser = useCallback((user: User) => {
    setCurrentUserState(user);
    localStorage.setItem("currentUserId", String(user.id));
  }, []);

  const addUser = useCallback(async (name: string): Promise<User> => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newUser = await res.json();
    await refreshUsers();
    setCurrentUser(newUser);
    return newUser;
  }, [refreshUsers, setCurrentUser]);

  return (
    <UserContext.Provider value={{ currentUser, users, setCurrentUser, refreshUsers, addUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

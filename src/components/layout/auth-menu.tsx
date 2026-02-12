"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export function AuthMenu() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-2 py-1 rounded-md text-sm">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
          {profile?.display_name ?? "User"}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

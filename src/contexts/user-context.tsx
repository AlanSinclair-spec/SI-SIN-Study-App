"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

interface UserContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

function mapSupabaseUser(
  supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> },
  profileName?: string | null
): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    displayName:
      profileName ??
      (supabaseUser.user_metadata?.display_name as string) ??
      supabaseUser.email ??
      "",
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string): Promise<string | null> => {
      try {
        const { data } = await supabase
          .from("users")
          .select("display_name")
          .eq("id", userId)
          .single();
        return data?.display_name ?? null;
      } catch {
        return null;
      }
    },
    [supabase]
  );

  // Load initial session
  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();

        if (supabaseUser) {
          const profileName = await fetchProfile(supabaseUser.id);
          setUser(mapSupabaseUser(supabaseUser, profileName));
        }
      } catch {
        // No active session
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [supabase, fetchProfile]);

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED"
      ) {
        if (session?.user) {
          const profileName = await fetchProfile(session.user.id);
          setUser(mapSupabaseUser(session.user, profileName));
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  }, [supabase, router]);

  const updateProfile = useCallback(
    async (displayName: string) => {
      if (!user) return;

      await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", user.id);

      setUser((prev) =>
        prev ? { ...prev, displayName } : null
      );
    },
    [supabase, user]
  );

  return (
    <UserContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

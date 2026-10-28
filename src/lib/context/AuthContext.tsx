"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CommunityMember } from "@/lib/types";

interface AuthContextType {
  currentUser: CommunityMember | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => Promise<void>;
  updateUserSkills: (
    teaching: CommunityMember["teachingSkills"],
    learning: CommunityMember["learningSkills"]
  ) => void;
  addSkillPoints: (points: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<CommunityMember | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const loadedEmailRef = useRef<string | null>(null);

  // Direct fast fetch of real database profile
  const fetchProfile = async (id?: string | null, email?: string | null) => {
    if (!id && !email) return null;
    try {
      const url = `/api/users/profile?${id ? `userId=${encodeURIComponent(id)}` : ""}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setCurrentUser(data);
          return data;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch user profile:", err);
    }
    return null;
  };

  const refreshUser = async () => {
    const id = session?.user?.id;
    const email = session?.user?.email;
    if (id || email) {
      await fetchProfile(id, email);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const email = session.user.email?.toLowerCase();
      const id = session.user.id;
      setIsAdmin((session.user as any)?.role === "ADMIN");

      // Don't re-fetch if we already have the real user loaded for this email
      if (email && loadedEmailRef.current === email && currentUser) {
        return;
      }
      if (email) loadedEmailRef.current = email;

      setIsProfileLoading(true);
      fetchProfile(id, email).finally(() => {
        setIsProfileLoading(false);
      });
    } else if (status === "unauthenticated") {
      loadedEmailRef.current = null;
      setCurrentUser(null);
      setIsAdmin(false);
      setIsProfileLoading(false);
    }
  }, [session?.user?.id, session?.user?.email, status]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password: password || "",
        redirect: false,
      });
      return result?.ok ?? false;
    } catch {
      return false;
    }
  };

  const loginAsAdmin = () => {
    setIsAdmin(true);
  };

  const logout = async () => {
    loadedEmailRef.current = null;
    setCurrentUser(null);
    setIsAdmin(false);
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.warn("NextAuth signOut:", e);
    }
  };

  const updateUserSkills = (
    teaching: CommunityMember["teachingSkills"],
    learning: CommunityMember["learningSkills"]
  ) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      teachingSkills: teaching,
      learningSkills: learning,
    });
  };

  const addSkillPoints = (points: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      skillPointsBalance: currentUser.skillPointsBalance + points,
    });
  };

  const isLoading = status === "loading" || (status === "authenticated" && isProfileLoading && !currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        login,
        loginAsAdmin,
        logout,
        updateUserSkills,
        addSkillPoints,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

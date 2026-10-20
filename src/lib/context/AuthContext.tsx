"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_MEMBERS, CommunityMember } from "@/lib/data/mock-data";

interface AuthContextType {
  currentUser: CommunityMember | null;
  isAdmin: boolean;
  loginAsMember: (memberId: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserSkills: (
    teaching: CommunityMember["teachingSkills"],
    learning: CommunityMember["learningSkills"]
  ) => void;
  addSkillPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Ramesh Kulkarni (member-1)
  const [currentUser, setCurrentUser] = useState<CommunityMember | null>(INITIAL_MEMBERS[0]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("skillbridge_community_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loginAsMember = (memberId: string) => {
    const found = INITIAL_MEMBERS.find((m) => m.id === memberId);
    if (found) {
      setCurrentUser(found);
      setIsAdmin(false);
      localStorage.setItem("skillbridge_community_user", JSON.stringify(found));
    }
  };

  const loginAsAdmin = () => {
    setIsAdmin(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("skillbridge_community_user");
  };

  const updateUserSkills = (
    teaching: CommunityMember["teachingSkills"],
    learning: CommunityMember["learningSkills"]
  ) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      teachingSkills: teaching,
      learningSkills: learning,
    };
    setCurrentUser(updated);
    localStorage.setItem("skillbridge_community_user", JSON.stringify(updated));
  };

  const addSkillPoints = (points: number) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      skillPointsBalance: currentUser.skillPointsBalance + points,
    };
    setCurrentUser(updated);
    localStorage.setItem("skillbridge_community_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loginAsMember,
        loginAsAdmin,
        logout,
        updateUserSkills,
        addSkillPoints,
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

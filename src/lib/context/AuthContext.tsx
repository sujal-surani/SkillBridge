"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { INITIAL_MEMBERS, CommunityMember } from "@/lib/data/mock-data";

interface AuthContextType {
  currentUser: CommunityMember | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginAsMember: (memberId: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => Promise<void>;
  updateUserSkills: (
    teaching: CommunityMember["teachingSkills"],
    learning: CommunityMember["learningSkills"]
  ) => void;
  addSkillPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthInternalProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<CommunityMember | null>(INITIAL_MEMBERS[0]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const isLoading = status === "loading";

  // Synchronize NextAuth session with currentUser
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const email = session.user.email?.toLowerCase();
      const id = session.user.id;

      // Check if session belongs to one of the rich predefined community members
      const found = INITIAL_MEMBERS.find(
        (m) => m.id === id || (email && m.email.toLowerCase() === email)
      );

      if (found) {
        setCurrentUser(found);
        setIsAdmin((session.user as any)?.role === "ADMIN");
        localStorage.setItem("skillbridge_community_user", JSON.stringify(found));
      } else {
        // Dynamic member profile (e.g. Google OAuth sign-in)
        const dynamicUser: CommunityMember = {
          id: session.user.id || `user-${Date.now()}`,
          fullName: session.user.name || "Community Member",
          email: session.user.email || "",
          age: 28,
          avatarUrl:
            session.user.image ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
          occupationOrInterest: "Neighbor & Lifelong Learner",
          neighborhood: "Resident",
          city: "Community Hub",
          modePreference: "HYBRID",
          spokenLanguages: ["English", "Hindi"],
          bio: "Passionate about skill swapping and community learning with neighbors!",
          skillPointsBalance: 50,
          averageRating: 5.0,
          totalSessions: 0,
          teachingSkills: [
            {
              name: "General Skill Sharing",
              pillar: "TECH_PROFESSIONAL",
              category: "Everyday Tech",
              proficiency: "INTERMEDIATE",
              yearsExperience: 2,
            },
          ],
          learningSkills: [
            {
              name: "Organic Terrace Vegetable Gardening",
              pillar: "CREATIVE_PRACTICAL",
              category: "Gardening & Sustainability",
              targetProficiency: "BEGINNER",
            },
          ],
          availability: [
            { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
            { day: "Sunday", timeSlots: ["10:00 - 13:00"] },
          ],
        };
        setCurrentUser(dynamicUser);
        setIsAdmin((session.user as any)?.role === "ADMIN");
        localStorage.setItem("skillbridge_community_user", JSON.stringify(dynamicUser));
      }
    } else if (status === "unauthenticated") {
      // Check if local cache exists for demo continuity
      const saved = localStorage.getItem("skillbridge_community_user");
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch {
          setCurrentUser(INITIAL_MEMBERS[0]);
        }
      }
    }
  }, [session, status]);

  const loginAsMember = async (memberId: string) => {
    const found = INITIAL_MEMBERS.find((m) => m.id === memberId);
    if (found) {
      setCurrentUser(found);
      setIsAdmin(false);
      localStorage.setItem("skillbridge_community_user", JSON.stringify(found));
    }
    try {
      await signIn("credentials", {
        memberId,
        redirect: false,
      });
    } catch (e) {
      console.warn("NextAuth signIn fallback to local state:", e);
    }
  };

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
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("skillbridge_community_user");
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
        isLoading,
        loginAsMember,
        login,
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthInternalProvider>{children}</AuthInternalProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CommunityMember } from "@/lib/types";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<CommunityMember | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const isLoading = status === "loading";

  // Synchronize NextAuth session with database currentUser
  useEffect(() => {
    let isMounted = true;

    async function syncCurrentUser() {
      if (status === "authenticated" && session?.user) {
        const email = session.user.email?.toLowerCase();
        const id = session.user.id;

        try {
          const res = await fetch("/api/members");
          if (res.ok) {
            const dbMembers: CommunityMember[] = await res.json();
            const found = dbMembers.find(
              (m) => m.id === id || (email && m.email.toLowerCase() === email)
            );

            if (found && isMounted) {
              setCurrentUser(found);
              setIsAdmin((session.user as any)?.role === "ADMIN");
              return;
            }
          }
        } catch (err) {
          console.warn("Failed to fetch member details from database:", err);
        }

        // Construct standard fallback member from session metadata
        if (isMounted) {
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
                name: "Practical Crafts",
                pillar: "CREATIVE_PRACTICAL",
                category: "General",
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
        }
      } else if (status === "unauthenticated") {
        if (isMounted) {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
    }

    syncCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  const loginAsMember = async (memberId: string) => {
    try {
      await signIn("credentials", {
        memberId,
        redirect: false,
      });

      const res = await fetch("/api/members");
      if (res.ok) {
        const dbMembers: CommunityMember[] = await res.json();
        const found = dbMembers.find((m) => m.id === memberId);
        if (found) {
          setCurrentUser(found);
          setIsAdmin(false);
        }
      }
    } catch (e) {
      console.warn("NextAuth signIn fallback:", e);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

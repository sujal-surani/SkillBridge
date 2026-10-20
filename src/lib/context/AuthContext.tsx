"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_STUDENTS, StudentProfile } from "@/lib/data/mock-data";

interface AuthContextType {
  currentUser: StudentProfile | null;
  isAdmin: boolean;
  loginAsStudent: (studentId: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserSkills: (
    teaching: StudentProfile["teachingSkills"],
    learning: StudentProfile["learningSkills"]
  ) => void;
  addSkillPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Aarav Sharma (student-1)
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(INITIAL_STUDENTS[0]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("skillbridge_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loginAsStudent = (studentId: string) => {
    const found = INITIAL_STUDENTS.find((s) => s.id === studentId);
    if (found) {
      setCurrentUser(found);
      setIsAdmin(false);
      localStorage.setItem("skillbridge_user", JSON.stringify(found));
    }
  };

  const loginAsAdmin = () => {
    setIsAdmin(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("skillbridge_user");
  };

  const updateUserSkills = (
    teaching: StudentProfile["teachingSkills"],
    learning: StudentProfile["learningSkills"]
  ) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      teachingSkills: teaching,
      learningSkills: learning,
    };
    setCurrentUser(updated);
    localStorage.setItem("skillbridge_user", JSON.stringify(updated));
  };

  const addSkillPoints = (points: number) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      skillPointsBalance: currentUser.skillPointsBalance + points,
    };
    setCurrentUser(updated);
    localStorage.setItem("skillbridge_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loginAsStudent,
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

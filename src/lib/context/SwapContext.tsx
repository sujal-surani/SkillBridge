"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_MEMBERS, CommunityMember } from "@/lib/data/mock-data";
import { toast } from "sonner";

export interface SwapProposal {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLocation: string;
  senderAge?: number;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  offeredSkill: string;
  requestedSkill: string;
  proposedTime: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  timestamp: string;
  message: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  location?: string;
  role: "mentor" | "learner" | "peer";
}

export interface SwapSession {
  id: string;
  proposalId?: string;
  roomId: string;
  topic: string;
  offeredSkill: string;
  requestedSkill: string;
  participants: Participant[];
  scheduledFor: string;
  durationMinutes: number;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  completedAt?: string;
}

export interface SessionReview {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  targetMemberId: string;
  rating: number;
  comment: string;
  badges: string[];
  date: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  type: "EARNED" | "SPENT" | "BONUS";
  description: string;
  timestamp: string;
}

interface SwapContextType {
  proposals: SwapProposal[];
  sessions: SwapSession[];
  reviews: SessionReview[];
  transactions: PointsTransaction[];
  isLoading: boolean;
  createProposal: (data: {
    receiver: CommunityMember;
    offeredSkill: string;
    requestedSkill: string;
    proposedTime: string;
    message: string;
    currentUser: CommunityMember;
  }) => Promise<SwapProposal>;
  acceptProposal: (proposalId: string) => Promise<SwapSession>;
  declineProposal: (proposalId: string, reason?: string) => Promise<void>;
  completeSession: (
    sessionIdOrRoomId: string,
    reviewData: {
      rating: number;
      comment: string;
      badges: string[];
      reviewer: CommunityMember;
      pointsToAward?: number;
    }
  ) => Promise<void>;
  getSessionByRoomId: (roomId: string) => SwapSession | undefined;
}

const STORAGE_KEYS = {
  PROPOSALS: "skillbridge_swap_proposals_v2",
  SESSIONS: "skillbridge_swap_sessions_v2",
  REVIEWS: "skillbridge_swap_reviews_v2",
  TRANSACTIONS: "skillbridge_swap_transactions_v2",
};

// Realistic seed data
const SEED_PROPOSALS: SwapProposal[] = [
  {
    id: "prop-101",
    senderId: "member-2",
    senderName: "Kavita Nair",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    senderLocation: "Panampilly Nagar, Kochi",
    senderAge: 39,
    receiverId: "member-1",
    receiverName: "Pooja Sharma",
    receiverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    offeredSkill: "Morning Hatha Yoga & Posture",
    requestedSkill: "Watercolor Landscape Painting & Washes",
    proposedTime: "Saturday at 10:00 AM IST",
    status: "PENDING",
    timestamp: "Today, 10:15 AM",
    message: "Namaste Pooja! I've been admiring your watercolor sketches. I'd love to guide you through restorative Hatha Yoga stretches to release easel tension in exchange for a beginner sky wash demo!",
  },
  {
    id: "prop-102",
    senderId: "member-3",
    senderName: "Ramesh Kulkarni",
    senderAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
    senderLocation: "Koregaon Park, Pune",
    senderAge: 45,
    receiverId: "member-1",
    receiverName: "Pooja Sharma",
    receiverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    offeredSkill: "Organic Terrace Vegetable Gardening",
    requestedSkill: "Pencil Sketching & Botanical Illustration",
    proposedTime: "Sunday at 11:30 AM IST",
    status: "PENDING",
    timestamp: "Yesterday, 4:30 PM",
    message: "Hello! I can teach you home vermicomposting and container soil mix for balcony tomatoes if you can teach me how to sketch garden botanical leaves.",
  },
];

const SEED_SESSIONS: SwapSession[] = [
  {
    id: "sess-201",
    proposalId: "prop-prev-1",
    roomId: "SB-482",
    topic: "Watercolor Landscape Painting ⇄ Hatha Yoga Posture",
    offeredSkill: "Morning Hatha Yoga & Posture",
    requestedSkill: "Watercolor Landscape Painting & Washes",
    participants: [
      {
        id: "member-1",
        name: "Pooja Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
        location: "C-Scheme, Jaipur",
        role: "peer",
      },
      {
        id: "member-2",
        name: "Kavita Nair",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
        location: "Panampilly Nagar, Kochi",
        role: "peer",
      },
    ],
    scheduledFor: "Saturday at 10:00 AM IST",
    durationMinutes: 60,
    status: "UPCOMING",
    createdAt: "2 days ago",
  },
  {
    id: "sess-prev-1",
    roomId: "SB-210",
    topic: "Pencil Sketching Basics ⇄ Spoken English Storytelling",
    offeredSkill: "Spoken English Fluency & Confidence",
    requestedSkill: "Pencil Sketching & Botanical Illustration",
    participants: [
      {
        id: "member-1",
        name: "Pooja Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
        role: "peer",
      },
      {
        id: "member-5",
        name: "Harish Patel",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
        location: "Navrangpura, Ahmedabad",
        role: "peer",
      },
    ],
    scheduledFor: "Oct 14, 2026",
    durationMinutes: 45,
    status: "COMPLETED",
    createdAt: "Oct 12, 2026",
    completedAt: "Oct 14, 2026",
  },
];

const SEED_REVIEWS: SessionReview[] = [
  {
    id: "rev-301",
    sessionId: "sess-prev-1",
    authorId: "member-5",
    authorName: "Harish Patel",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    authorLocation: "Navrangpura, Ahmedabad",
    targetMemberId: "member-1",
    rating: 5,
    date: "Oct 14, 2026",
    comment: "Pooja is a gifted artist and a patient instructor. My grandchildren were delighted by the botanical sketches we made together!",
    badges: ["Deep Practical Experience", "Clear Explanations", "Warm & Respectful"],
  },
];

const SEED_TRANSACTIONS: PointsTransaction[] = [
  {
    id: "tx-1",
    amount: 50,
    type: "BONUS",
    description: "Welcome Community Bonus",
    timestamp: "Oct 10, 2026",
  },
  {
    id: "tx-2",
    amount: 25,
    type: "EARNED",
    description: "Completed exchange with Harish Patel",
    timestamp: "Oct 14, 2026",
  },
];

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export function SwapProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<SwapProposal[]>(SEED_PROPOSALS);
  const [sessions, setSessions] = useState<SwapSession[]>(SEED_SESSIONS);
  const [reviews, setReviews] = useState<SessionReview[]>(SEED_REVIEWS);
  const [transactions, setTransactions] = useState<PointsTransaction[]>(SEED_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage or initialize with seed data
  useEffect(() => {
    try {
      const storedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
      const storedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

      setProposals(storedProposals ? JSON.parse(storedProposals) : SEED_PROPOSALS);
      setSessions(storedSessions ? JSON.parse(storedSessions) : SEED_SESSIONS);
      setReviews(storedReviews ? JSON.parse(storedReviews) : SEED_REVIEWS);
      setTransactions(storedTx ? JSON.parse(storedTx) : SEED_TRANSACTIONS);
    } catch (e) {
      console.error("Failed to load swap data from localStorage", e);
      setProposals(SEED_PROPOSALS);
      setSessions(SEED_SESSIONS);
      setReviews(SEED_REVIEWS);
      setTransactions(SEED_TRANSACTIONS);
    }
  }, []);

  // Sync state helpers
  const saveProposals = (newProposals: SwapProposal[]) => {
    setProposals(newProposals);
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(newProposals));
  };

  const saveSessions = (newSessions: SwapSession[]) => {
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newSessions));
  };

  const saveReviews = (newReviews: SessionReview[]) => {
    setReviews(newReviews);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(newReviews));
  };

  const saveTransactions = (newTx: PointsTransaction[]) => {
    setTransactions(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTx));
  };

  // Helper delay to simulate clean asynchronous network requests
  const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

  // 1. Create Proposal
  const createProposal = useCallback(
    async (data: {
      receiver: CommunityMember;
      offeredSkill: string;
      requestedSkill: string;
      proposedTime: string;
      message: string;
      currentUser: CommunityMember;
    }): Promise<SwapProposal> => {
      setIsLoading(true);
      await delay(500);

      const newProposal: SwapProposal = {
        id: `prop-${Date.now()}`,
        senderId: data.currentUser.id,
        senderName: data.currentUser.fullName,
        senderAvatar: data.currentUser.avatarUrl,
        senderLocation: `${data.currentUser.neighborhood}, ${data.currentUser.city}`,
        senderAge: data.currentUser.age,
        receiverId: data.receiver.id,
        receiverName: data.receiver.fullName,
        receiverAvatar: data.receiver.avatarUrl,
        offeredSkill: data.offeredSkill,
        requestedSkill: data.requestedSkill,
        proposedTime: data.proposedTime || "Saturday at 10:00 AM IST",
        status: "PENDING",
        timestamp: "Just now",
        message: data.message,
      };

      const updated = [newProposal, ...proposals];
      saveProposals(updated);
      setIsLoading(false);

      toast.success("Swap proposal sent!", {
        description: `Delivered to ${data.receiver.fullName}. You can track it on your Community Dashboard.`,
      });

      return newProposal;
    },
    [proposals]
  );

  // 2. Accept Proposal
  const acceptProposal = useCallback(
    async (proposalId: string): Promise<SwapSession> => {
      setIsLoading(true);
      await delay(500);

      const targetProp = proposals.find((p) => p.id === proposalId);
      if (!targetProp) {
        setIsLoading(false);
        throw new Error("Proposal not found");
      }

      // Update proposal status
      const updatedProposals = proposals.map((p) =>
        p.id === proposalId ? { ...p, status: "ACCEPTED" as const } : p
      );
      saveProposals(updatedProposals);

      // Auto-generate realistic Room ID
      const generatedRoomId = `SB-${Math.floor(200 + Math.random() * 700)}`;

      const newSession: SwapSession = {
        id: `sess-${Date.now()}`,
        proposalId,
        roomId: generatedRoomId,
        topic: `${targetProp.offeredSkill} ⇄ ${targetProp.requestedSkill}`,
        offeredSkill: targetProp.offeredSkill,
        requestedSkill: targetProp.requestedSkill,
        participants: [
          {
            id: targetProp.senderId,
            name: targetProp.senderName,
            avatar: targetProp.senderAvatar,
            location: targetProp.senderLocation,
            role: "peer",
          },
          {
            id: targetProp.receiverId,
            name: targetProp.receiverName,
            avatar: targetProp.receiverAvatar,
            role: "peer",
          },
        ],
        scheduledFor: targetProp.proposedTime,
        durationMinutes: 60,
        status: "UPCOMING",
        createdAt: "Just now",
      };

      const updatedSessions = [newSession, ...sessions];
      saveSessions(updatedSessions);
      setIsLoading(false);

      toast.success("Proposal Accepted!", {
        description: `Session scheduled for ${targetProp.proposedTime}. Room #${generatedRoomId} is ready!`,
      });

      return newSession;
    },
    [proposals, sessions]
  );

  // 3. Decline Proposal
  const declineProposal = useCallback(
    async (proposalId: string, reason?: string) => {
      setIsLoading(true);
      await delay(500);

      const updatedProposals = proposals.map((p) =>
        p.id === proposalId ? { ...p, status: "DECLINED" as const } : p
      );
      saveProposals(updatedProposals);
      setIsLoading(false);

      toast.info("Proposal declined", {
        description: reason || "The member has been notified politely.",
      });
    },
    [proposals]
  );

  // 4. Complete Session & Review
  const completeSession = useCallback(
    async (
      sessionIdOrRoomId: string,
      reviewData: {
        rating: number;
        comment: string;
        badges: string[];
        reviewer: CommunityMember;
        pointsToAward?: number;
      }
    ) => {
      setIsLoading(true);
      await delay(500);

      const points = reviewData.pointsToAward || 25;

      // Update session status
      const updatedSessions = sessions.map((s) => {
        if (s.id === sessionIdOrRoomId || s.roomId === sessionIdOrRoomId) {
          return {
            ...s,
            status: "COMPLETED" as const,
            completedAt: "Just now",
          };
        }
        return s;
      });
      saveSessions(updatedSessions);

      // Create new review
      const newReview: SessionReview = {
        id: `rev-${Date.now()}`,
        sessionId: sessionIdOrRoomId,
        authorId: reviewData.reviewer.id,
        authorName: reviewData.reviewer.fullName,
        authorAvatar: reviewData.reviewer.avatarUrl,
        authorLocation: `${reviewData.reviewer.neighborhood}, ${reviewData.reviewer.city}`,
        targetMemberId: "member-2", // Default partner target
        rating: reviewData.rating,
        comment: reviewData.comment,
        badges: reviewData.badges,
        date: "Just now",
      };
      saveReviews([newReview, ...reviews]);

      // Record transaction
      const newTx: PointsTransaction = {
        id: `tx-${Date.now()}`,
        amount: points,
        type: "EARNED",
        description: `Session completed in Room #${sessionIdOrRoomId}`,
        timestamp: "Just now",
      };
      saveTransactions([newTx, ...transactions]);

      setIsLoading(false);

      toast.success(`✨ Session Completed! +${points} Skill Points!`, {
        description: "Your review and verified swap credit have been deposited into your profile.",
      });
    },
    [sessions, reviews, transactions]
  );

  // 5. Get Session by RoomId
  const getSessionByRoomId = useCallback(
    (roomId: string) => {
      return sessions.find((s) => s.roomId === roomId || s.id === roomId);
    },
    [sessions]
  );

  return (
    <SwapContext.Provider
      value={{
        proposals,
        sessions,
        reviews,
        transactions,
        isLoading,
        createProposal,
        acceptProposal,
        declineProposal,
        completeSession,
        getSessionByRoomId,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap() {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error("useSwap must be used within a SwapProvider");
  }
  return context;
}

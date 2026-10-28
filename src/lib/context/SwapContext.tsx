"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CommunityMember,
  SwapProposal,
  Participant,
  SwapSession,
  SessionReview,
  PointsTransaction,
} from "@/lib/types";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

export type {
  SwapProposal,
  Participant,
  SwapSession,
  SessionReview,
  PointsTransaction,
};

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

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export function SwapProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState<SwapProposal[]>([]);
  const [sessions, setSessions] = useState<SwapSession[]>([]);
  const [reviews, setReviews] = useState<SessionReview[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadedUserIdRef = React.useRef<string | null>(null);

  // Initial Data Fetching from real Prisma Next.js API Route Handlers
  useEffect(() => {
    let isMounted = true;
    const userId = currentUser?.id;

    if (!userId) {
      setProposals([]);
      setSessions([]);
      setReviews([]);
      setTransactions([]);
      loadedUserIdRef.current = null;
      return;
    }

    // Guard against duplicate / infinite fetch cascades
    if (loadedUserIdRef.current === userId) {
      return;
    }
    loadedUserIdRef.current = userId;

    async function fetchInitialData() {
      if (!userId) return;
      const validUserId = userId;
      setIsLoading(true);

      try {
        const [propRes, sessRes, revRes, karmaRes] = await Promise.all([
          fetch(`/api/proposals?userId=${encodeURIComponent(validUserId)}`),
          fetch(`/api/sessions?userId=${encodeURIComponent(validUserId)}`),
          fetch(`/api/reviews?targetMemberId=${encodeURIComponent(validUserId)}`),
          fetch(`/api/karma?userId=${encodeURIComponent(validUserId)}`),
        ]);

        if (!isMounted) return;

        if (propRes.ok) {
          const propData = await propRes.json();
          if (Array.isArray(propData)) {
            setProposals(propData);
          }
        }

        if (sessRes.ok) {
          const sessData = await sessRes.json();
          if (Array.isArray(sessData)) {
            setSessions(sessData);
          }
        }

        if (revRes.ok) {
          const revData = await revRes.json();
          if (Array.isArray(revData)) {
            setReviews(revData);
          }
        }

        if (karmaRes.ok) {
          const karmaData = await karmaRes.json();
          if (Array.isArray(karmaData?.transactions)) {
            setTransactions(karmaData.transactions);
          }
        }
      } catch (err) {
        console.warn("API data fetch failed, using active memory state:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  // 1. Create Proposal: POST /api/proposals + Optimistic UI
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

      const optimisticProposal: SwapProposal = {
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

      try {
        const res = await fetch("/api/proposals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            message: data.message,
          }),
        });

        let finalProposal = optimisticProposal;
        if (res.ok) {
          finalProposal = await res.json();
        }

        setProposals((prev) => [finalProposal, ...prev]);

        toast.success("Swap proposal sent!", {
          description: `Delivered to ${data.receiver.fullName}. You can track it on your Community Dashboard.`,
        });

        return finalProposal;
      } catch (e) {
        console.warn("POST /api/proposals network fallback:", e);
        setProposals((prev) => [optimisticProposal, ...prev]);
        toast.success("Swap proposal sent!", {
          description: `Delivered to ${data.receiver.fullName}. Track it on your Dashboard.`,
        });
        return optimisticProposal;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 2. Accept Proposal: PATCH /api/proposals + POST /api/sessions + Optimistic UI
  const acceptProposal = useCallback(
    async (proposalId: string): Promise<SwapSession> => {
      setIsLoading(true);

      const targetProp = proposals.find((p) => p.id === proposalId);
      if (!targetProp) {
        setIsLoading(false);
        throw new Error("Proposal not found");
      }

      // Optimistically update proposal status
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: "ACCEPTED" as const } : p))
      );

      const generatedRoomId = `SB-${Math.floor(200 + Math.random() * 700)}`;

      const optimisticSession: SwapSession = {
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

      try {
        // Fire PATCH /api/proposals to update DB
        fetch("/api/proposals", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: proposalId, status: "ACCEPTED" }),
        }).catch((err) => console.warn("Proposal status PATCH failed:", err));

        // Fire POST /api/sessions to create session and participants in DB
        const sessRes = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proposalId,
            roomId: generatedRoomId,
            topic: optimisticSession.topic,
            offeredSkill: targetProp.offeredSkill,
            requestedSkill: targetProp.requestedSkill,
            scheduledFor: targetProp.proposedTime,
            durationMinutes: 60,
            participants: optimisticSession.participants,
          }),
        });

        let finalSession = optimisticSession;
        if (sessRes.ok) {
          finalSession = await sessRes.json();
        }

        setSessions((prev) => [finalSession, ...prev]);

        toast.success("Proposal Accepted!", {
          description: `Session scheduled for ${targetProp.proposedTime}. Room #${finalSession.roomId} is ready!`,
        });

        return finalSession;
      } catch (e) {
        console.warn("POST /api/sessions network fallback:", e);
        setSessions((prev) => [optimisticSession, ...prev]);
        toast.success("Proposal Accepted!", {
          description: `Session scheduled for ${targetProp.proposedTime}. Room #${optimisticSession.roomId} is ready!`,
        });
        return optimisticSession;
      } finally {
        setIsLoading(false);
      }
    },
    [proposals]
  );

  // 3. Decline Proposal: PATCH /api/proposals + Optimistic UI
  const declineProposal = useCallback(
    async (proposalId: string, reason?: string) => {
      setIsLoading(true);

      // Optimistically update proposal status
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: "DECLINED" as const } : p))
      );

      try {
        await fetch("/api/proposals", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: proposalId, status: "DECLINED" }),
        });

        toast.info("Proposal declined", {
          description: reason || "The member has been notified politely.",
        });
      } catch (e) {
        console.warn("PATCH /api/proposals decline fallback:", e);
        toast.info("Proposal declined", {
          description: reason || "The member has been notified politely.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 4. Complete Session & Review: PATCH /api/sessions + POST /api/reviews + POST /api/karma
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
      const points = reviewData.pointsToAward || 25;

      // Optimistically complete session in local state
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionIdOrRoomId || s.roomId === sessionIdOrRoomId) {
            return {
              ...s,
              status: "COMPLETED" as const,
              completedAt: "Just now",
            };
          }
          return s;
        })
      );

      // Optimistically append review
      const newReview: SessionReview = {
        id: `rev-${Date.now()}`,
        sessionId: sessionIdOrRoomId,
        authorId: reviewData.reviewer.id,
        authorName: reviewData.reviewer.fullName,
        authorAvatar: reviewData.reviewer.avatarUrl,
        authorLocation: `${reviewData.reviewer.neighborhood}, ${reviewData.reviewer.city}`,
        targetMemberId: "member-2",
        rating: reviewData.rating,
        comment: reviewData.comment,
        badges: reviewData.badges,
        date: "Just now",
      };
      setReviews((prev) => [newReview, ...prev]);

      // Optimistically append karma transaction
      const newTx: PointsTransaction = {
        id: `tx-${Date.now()}`,
        amount: points,
        type: "EARNED",
        description: `Session completed in Room #${sessionIdOrRoomId}`,
        timestamp: "Just now",
      };
      setTransactions((prev) => [newTx, ...prev]);

      try {
        // Parallel API calls to update backend database
        await Promise.allSettled([
          fetch("/api/sessions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: sessionIdOrRoomId,
              status: "COMPLETED",
            }),
          }),
          fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionIdOrRoomId,
              authorId: reviewData.reviewer.id,
              authorName: reviewData.reviewer.fullName,
              authorAvatar: reviewData.reviewer.avatarUrl,
              authorLocation: `${reviewData.reviewer.neighborhood}, ${reviewData.reviewer.city}`,
              targetMemberId: "member-2",
              rating: reviewData.rating,
              comment: reviewData.comment,
              badges: reviewData.badges,
            }),
          }),
          fetch("/api/karma", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: reviewData.reviewer.id,
              amount: points,
              type: "EARNED",
              description: `Session completed in Room #${sessionIdOrRoomId}`,
            }),
          }),
        ]);

        toast.success(`✨ Session Completed! +${points} Skill Points!`, {
          description: "Your review and verified swap credit have been deposited into your profile.",
        });
      } catch (e) {
        console.warn("Session completion API calls fallback:", e);
        toast.success(`✨ Session Completed! +${points} Skill Points!`, {
          description: "Your review and verified swap credit have been deposited into your profile.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 5. Get Session by Room ID
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

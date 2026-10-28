"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  ArrowRight, 
  Coins, 
  Star, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  MapPin, 
  HeartHandshake, 
  Sprout, 
  Laptop, 
  HeartPulse, 
  BookOpen, 
  Loader2, 
  Inbox,
  Award,
  HelpCircle,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { useSwap } from "@/lib/context/SwapContext";
import { CommunityMember } from "@/lib/types";
import { calculateMatchScore } from "@/lib/matching";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { proposals, sessions, acceptProposal, declineProposal } = useSwap();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<"requests" | "matches" | "community" | "skills">("requests");
  const [requestTab, setRequestTab] = useState<"incoming" | "outgoing">("incoming");
  const [members, setMembers] = useState<CommunityMember[]>([]);

  React.useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setMembers(data);
        }
      } catch (err) {}
    }
    loadMembers();
  }, []);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl text-center py-28 px-4">
        <h2 className="text-xl font-bold text-slate-heading">Sign in to view your community dashboard</h2>
        <p className="text-xs text-slate-muted mt-2">Access your matches, scheduled sessions, and karma points.</p>
        <Link href="/auth/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  // Calculate algorithmic matches against other community candidates
  const candidateMatches = members
    .filter((m) => m.id !== currentUser.id)
    .map((candidate) => ({
      candidate,
      match: calculateMatchScore(currentUser, candidate),
    }))
    .sort((a, b) => b.match.totalScore - a.match.totalScore);

  // Derive sessions & requests from centralized SwapContext
  const upcomingSessions = sessions.filter((s) => s.status === "UPCOMING");
  const nextSession = upcomingSessions[0];

  const incomingRequests = proposals.filter(
    (p) => p.receiverId === currentUser.id && p.status === "PENDING"
  );
  const outgoingRequests = proposals.filter(
    (p) => p.senderId === currentUser.id && p.status === "PENDING"
  );

  const activeDisplayRequests = requestTab === "incoming" ? incomingRequests : outgoingRequests;

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await acceptProposal(id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    try {
      await declineProposal(id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* 1. Primary Focus (Top): Spacious Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-white to-peach-50/80 border border-[#EDE7DE] p-6 sm:p-10 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link href="/profile">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="h-20 w-20 rounded-3xl object-cover border-3 border-peach-200 shadow-md hover:scale-105 transition-transform cursor-pointer"
            />
          </Link>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-heading tracking-tight">
                Welcome back, {currentUser.fullName.split(" ")[0]}!
              </h1>
              <Badge variant="burgundy">Community Mentor</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-muted flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-burgundy-600 shrink-0" />
              <span>{currentUser.neighborhood}, {currentUser.city}</span>
              <span>•</span>
              <span className="font-medium text-slate-heading">{currentUser.occupationOrInterest}</span>
            </p>
          </div>
        </div>

        {/* Breathable Metrics Pills */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-start sm:justify-end">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle min-w-[130px]">
            <div className="h-10 w-10 rounded-xl bg-peach-100 flex items-center justify-center text-burgundy-700 shrink-0">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-heading leading-tight">
                {currentUser.skillPointsBalance} pts
              </div>
              <div className="text-[11px] text-slate-muted font-medium">Karma Wallet</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle min-w-[130px]">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-heading leading-tight">
                {currentUser.averageRating.toFixed(1)} / 5.0
              </div>
              <div className="text-[11px] text-slate-muted font-medium">Neighbor Score</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle min-w-[130px]">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-heading leading-tight">
                {currentUser.totalSessions}
              </div>
              <div className="text-[11px] text-slate-muted font-medium">Swaps Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Focus: Next Scheduled Exchange (Prominent Hero Card) */}
      <Card className="border-l-6 border-l-burgundy-600 overflow-hidden shadow-card">
        <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">
                Confirmed 1-on-1 Session
              </span>
            </div>
            <CardTitle className="text-xl sm:text-2xl text-slate-heading">
              {nextSession ? nextSession.topic : "No Scheduled Exchange Right Now"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              {nextSession ? (
                <>
                  Swapping with{" "}
                  <strong className="text-slate-heading font-semibold">
                    {nextSession.participants.find((p) => p.id !== currentUser.id)?.name || "Community Partner"}
                  </strong>
                </>
              ) : (
                "Propose a swap with a neighbor or accept an incoming request to generate your room link."
              )}
            </CardDescription>
          </div>
          <Badge
            variant={nextSession ? "match" : "outline"}
            className="self-start sm:self-auto text-xs px-3 py-1 font-bold"
          >
            {nextSession ? "Confirmed & Ready" : "Standby"}
          </Badge>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 pt-0">
          {nextSession ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-cream-100/80 border border-cream-200">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white border border-[#EDE7DE] flex items-center justify-center text-burgundy-600 shadow-xs shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-heading">{nextSession.scheduledFor}</p>
                  <p className="text-xs text-slate-muted mt-0.5">
                    {nextSession.durationMinutes} Minutes • Virtual Room #{nextSession.roomId} • Notes & Video Ready
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <Button variant="secondary" size="md" className="gap-2 text-xs">
                    <MessageSquare className="h-4 w-4" />
                    Coordinate in Chat
                  </Button>
                </Link>
                <Link href={`/room/${nextSession.roomId}`}>
                  <Button variant="primary" size="md" className="gap-2 text-xs font-bold bg-burgundy-600 hover:bg-burgundy-700 shadow-md">
                    <Video className="h-4 w-4 text-peach-200" />
                    Enter Room #{nextSession.roomId}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 px-6 rounded-3xl bg-cream-50 border border-dashed border-[#EDE7DE] space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-peach-100 text-burgundy-700 flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-heading">No Upcoming Exchange Scheduled</h4>
              <p className="text-xs text-slate-muted max-w-md mx-auto">
                Find compatible neighbors via our 6-factor matching engine and schedule your next skill trade!
              </p>
              <Link href="/matches" className="inline-block pt-1">
                <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-peach-200" />
                  Explore Smart Matches
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Confirmed Sessions (rendered if more than 1 scheduled exchange exists) */}
      {upcomingSessions.length > 1 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-burgundy-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-heading">
                Upcoming Schedule ({upcomingSessions.length - 1} more)
              </h3>
            </div>
            <Badge variant="outline" className="text-[10px] bg-white text-slate-muted border-[#EDE7DE]">
              Chronological
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.slice(1).map((session, idx) => {
              const partner =
                session.participants.find((p) => p.id !== currentUser.id) ||
                session.participants[0];
              return (
                <Card
                  key={session.id || session.roomId || idx}
                  className="p-5 border border-[#EDE7DE] shadow-subtle hover:border-burgundy-300 hover:shadow-card transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="peach" className="text-[10px] px-2 py-0.5 font-bold">
                        Exchange #{idx + 2}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-muted flex items-center gap-1">
                        <Clock className="h-3 w-3 text-burgundy-600" />
                        {session.durationMinutes} min
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-heading line-clamp-1 group-hover:text-burgundy-700 transition-colors">
                      {session.topic}
                    </h4>

                    <div className="flex items-center gap-2.5 text-xs text-slate-muted">
                      {partner?.avatar && (
                        <img
                          src={partner.avatar}
                          alt={partner.name}
                          className="h-6 w-6 rounded-full object-cover border border-peach-200"
                        />
                      )}
                      <span>
                        Partner: <strong className="text-slate-heading font-semibold">{partner?.name || "Neighbor"}</strong>
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-heading bg-cream-50 p-2.5 rounded-xl border border-cream-200/60 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-burgundy-600 shrink-0" />
                      <span>{session.scheduledFor}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-cream-200/60">
                    <Link href="/chat" className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5 h-8">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/room/${session.roomId}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full text-xs font-bold gap-1.5 h-8 bg-burgundy-600 hover:bg-burgundy-700 shadow-xs">
                        <Video className="h-3.5 w-3.5 text-peach-200" />
                        Room #{session.roomId}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Progressive Disclosure: Clean Tabbed Workspace */}
      <div className="space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-[#EDE7DE] pb-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setMainTab("requests")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              mainTab === "requests"
                ? "bg-burgundy-600 text-white shadow-xs font-semibold"
                : "text-slate-muted hover:text-slate-heading hover:bg-cream-200"
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Action Required: Swap Requests</span>
            {incomingRequests.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                mainTab === "requests" ? "bg-white text-burgundy-800" : "bg-peach-200 text-burgundy-900"
              }`}>
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMainTab("matches")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              mainTab === "matches"
                ? "bg-burgundy-600 text-white shadow-xs font-semibold"
                : "text-slate-muted hover:text-slate-heading hover:bg-cream-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Recommended Matches</span>
            <span className="text-[10px] opacity-80">({candidateMatches.length})</span>
          </button>

          <button
            onClick={() => setMainTab("community")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              mainTab === "community"
                ? "bg-burgundy-600 text-white shadow-xs font-semibold"
                : "text-slate-muted hover:text-slate-heading hover:bg-cream-200"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Neighborhood Q&A</span>
          </button>

          <button
            onClick={() => setMainTab("skills")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              mainTab === "skills"
                ? "bg-burgundy-600 text-white shadow-xs font-semibold"
                : "text-slate-muted hover:text-slate-heading hover:bg-cream-200"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>My Skills Snapshot</span>
          </button>
        </div>

        {/* Tab 1: Action Required (Swap Requests) */}
        {mainTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-heading">Community Swap Proposals</h3>
                <p className="text-xs text-slate-muted">Manage requests sent to you and track your outgoing proposals.</p>
              </div>

              {/* Sub tabs: Incoming vs Outgoing */}
              <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-2xl text-xs">
                <button
                  onClick={() => setRequestTab("incoming")}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                    requestTab === "incoming"
                      ? "bg-white text-burgundy-700 shadow-xs"
                      : "text-slate-muted hover:text-slate-heading"
                  }`}
                >
                  Incoming ({incomingRequests.length})
                </button>
                <button
                  onClick={() => setRequestTab("outgoing")}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                    requestTab === "outgoing"
                      ? "bg-white text-burgundy-700 shadow-xs"
                      : "text-slate-muted hover:text-slate-heading"
                  }`}
                >
                  Sent ({outgoingRequests.length})
                </button>
              </div>
            </div>

            {activeDisplayRequests.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-3xl bg-white border border-[#EDE7DE] shadow-subtle space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-cream-100 text-slate-muted flex items-center justify-center mx-auto">
                  <Inbox className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-heading">
                  {requestTab === "incoming" ? "No incoming swap requests" : "No outgoing proposals dispatched"}
                </h4>
                <p className="text-xs text-slate-muted max-w-sm mx-auto">
                  {requestTab === "incoming"
                    ? "When a neighbor proposes a skill exchange with you, it will appear here for one-click scheduling."
                    : "Discover neighbors in the catalog and propose a swap to start exchanging!"}
                </p>
                <Link href="/explore" className="inline-block pt-1">
                  <Button variant="secondary" size="sm" className="text-xs">
                    Browse Skills Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeDisplayRequests.map((req) => (
                  <Card key={req.id} className="p-6 space-y-4 hover:shadow-subtle transition-all border border-[#EDE7DE]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/members/${req.senderId}`}>
                          <img
                            src={requestTab === "incoming" ? req.senderAvatar : req.receiverAvatar}
                            alt=""
                            className="h-12 w-12 rounded-2xl object-cover border-2 border-peach-300 hover:scale-105 transition-transform"
                          />
                        </Link>
                        <div>
                          <Link href={`/members/${req.senderId}`}>
                            <h4 className="text-sm font-bold text-slate-heading hover:text-burgundy-700 transition-colors">
                              {requestTab === "incoming" ? req.senderName : `To: ${req.receiverName}`}
                            </h4>
                          </Link>
                          <p className="text-[11px] text-slate-muted">
                            {requestTab === "incoming" ? req.senderLocation : req.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge variant="peach">{req.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-burgundy-50/70 border border-burgundy-100">
                        <span className="text-slate-muted block text-[10px] uppercase font-bold">They Offer:</span>
                        <span className="font-bold text-burgundy-800 text-xs block truncate">{req.offeredSkill}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <span className="text-slate-muted block text-[10px] uppercase font-bold">They Seek:</span>
                        <span className="font-bold text-emerald-800 text-xs block truncate">{req.requestedSkill}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-body bg-cream-50 p-3 rounded-2xl leading-relaxed italic border border-cream-200/60">
                      &quot;{req.message}&quot;
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-cream-200/80">
                      <div className="text-slate-muted text-[11px] flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-burgundy-600" />
                        <span>Slot: <strong className="text-slate-heading">{req.proposedTime}</strong></span>
                      </div>

                      {requestTab === "incoming" && req.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={processingId === req.id}
                            onClick={() => handleDecline(req.id)}
                            className="text-xs h-8 text-slate-muted hover:text-red-600"
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={processingId === req.id}
                            onClick={() => handleAccept(req.id)}
                            className="text-xs h-8 gap-1.5 shadow-sm"
                          >
                            {processingId === req.id ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-peach-200" />
                                Scheduling...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3.5 w-3.5 text-peach-200" />
                                Accept & Schedule
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {requestTab === "outgoing" && (
                        <Badge variant="default" className="text-[11px]">
                          Awaiting Response
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Recommended Matches */}
        {mainTab === "matches" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-heading">Top Algorithmic Community Fits</h3>
                <p className="text-xs text-slate-muted">Calculated based on reciprocal skills, schedules, and neighbor proximity.</p>
              </div>
              <Link href="/matches">
                <Button variant="secondary" size="sm" className="text-xs">
                  Full 6-Factor Engine
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidateMatches.slice(0, 4).map(({ candidate, match }) => (
                <Card key={candidate.id} className="p-6 space-y-4 hover:shadow-subtle transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/members/${candidate.id}`}>
                        <img
                          src={candidate.avatarUrl}
                          alt={candidate.fullName}
                          className="h-12 w-12 rounded-2xl object-cover border-2 border-peach-300 hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div>
                        <Link href={`/members/${candidate.id}`}>
                          <h4 className="text-sm font-bold text-slate-heading hover:text-burgundy-700 transition-colors">
                            {candidate.fullName} ({candidate.age})
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-muted flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-burgundy-600" />
                          {candidate.neighborhood}, {candidate.city.split(",")[0]}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-burgundy-600">{match.totalScore}%</span>
                      <span className="block text-[10px] text-slate-muted uppercase font-bold -mt-0.5">Match</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200">
                      <span className="text-[10px] text-slate-muted uppercase font-bold block">They Teach:</span>
                      <span className="font-semibold text-burgundy-800 text-xs truncate block">{match.mutualLearnSkill}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200">
                      <span className="text-[10px] text-slate-muted uppercase font-bold block">They Seek:</span>
                      <span className="font-semibold text-emerald-800 text-xs truncate block">{match.mutualTeachSkill}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-cream-200/80">
                    <span className="text-xs text-slate-muted font-medium">
                      Next free: {candidate.availability[0]?.day || "Weekends"}
                    </span>
                    <Link href={`/members/${candidate.id}`}>
                      <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-xs">
                        View Public Profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Community Q&A */}
        {mainTab === "community" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-heading">Neighborhood Problem Board</h3>
                <p className="text-xs text-slate-muted">Ask community questions, solve neighbor doubts, and earn +15 Karma.</p>
              </div>
              <Link href="/community">
                <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-sm">
                  <HelpCircle className="h-4 w-4" />
                  Ask Question
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success">Solved</Badge>
                  <span className="text-[11px] text-slate-muted">Yesterday</span>
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Preventing watercolor paper from buckling during heavy washes</h4>
                <p className="text-xs text-slate-body line-clamp-2 leading-relaxed">
                  Asked by Siddharth (Bengaluru) • Best answer by Pooja Sharma: &quot;Tape down 300 GSM cotton paper to a drawing board using water-activated gummed tape before wetting...&quot;
                </p>
                <Link href="/community" className="block pt-1 text-xs font-bold text-burgundy-700 hover:underline">
                  View full solution & thread &rarr;
                </Link>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="peach">Active Discussion</Badge>
                  <span className="text-[11px] text-slate-muted">2 hours ago</span>
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Best organic mix for balcony tomato planters in Indian climate</h4>
                <p className="text-xs text-slate-body line-clamp-2 leading-relaxed">
                  Asked by Kavita Nair (Kochi) • Discussion led by Ramesh Kulkarni on vermicompost, coco peat ratios, and neem cake powder...
                </p>
                <Link href="/community" className="block pt-1 text-xs font-bold text-burgundy-700 hover:underline">
                  Contribute an answer &rarr;
                </Link>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 4: My Skills Snapshot */}
        {mainTab === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-heading">My Skills & Availability Snapshot</h3>
                <p className="text-xs text-slate-muted">Visible to all neighbors discovering you in the directory.</p>
              </div>
              <Link href="/onboarding">
                <Button variant="secondary" size="sm" className="text-xs">
                  Edit in Onboarding Wizard
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 border-l-4 border-l-burgundy-600">
                <div className="flex items-center gap-2 text-burgundy-700">
                  <Award className="h-5 w-5" />
                  <h4 className="text-sm font-bold text-slate-heading">What I Teach</h4>
                </div>
                <div className="space-y-2.5">
                  {currentUser.teachingSkills.map((sk) => (
                    <div key={sk.name} className="flex items-center justify-between p-3 rounded-2xl bg-burgundy-50/70 border border-burgundy-200 text-xs">
                      <div>
                        <p className="font-bold text-burgundy-900">{sk.name}</p>
                        <p className="text-[11px] text-slate-muted">{sk.category} • {sk.yearsExperience} yrs</p>
                      </div>
                      <Badge variant="burgundy">{sk.proficiency}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-4 border-l-4 border-l-emerald-600">
                <div className="flex items-center gap-2 text-emerald-700">
                  <BookOpen className="h-5 w-5" />
                  <h4 className="text-sm font-bold text-slate-heading">What I Want to Learn</h4>
                </div>
                <div className="space-y-2.5">
                  {currentUser.learningSkills.map((sk) => (
                    <div key={sk.name} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
                      <div>
                        <p className="font-bold text-emerald-900">{sk.name}</p>
                        <p className="text-[11px] text-slate-muted">{sk.category}</p>
                      </div>
                      <Badge variant="success">Target: {sk.targetProficiency}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

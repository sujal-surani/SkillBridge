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
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { INITIAL_MEMBERS } from "@/lib/data/mock-data";
import { calculateMatchScore } from "@/lib/matching";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      senderName: "Kavita Nair",
      senderAge: 39,
      senderLocation: "Panampilly Nagar, Kochi",
      senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128",
      offeredSkill: "Morning Hatha Yoga & Posture",
      requestedSkill: "Watercolor Landscape Painting & Washes",
      proposedTime: "Saturday at 10:00 AM IST",
      message: "Namaste Pooja! I've been admiring your watercolor sketches. I'd love to guide you through restorative Hatha Yoga stretches to release easel tension in exchange for a beginner sky wash demo!",
      status: "PENDING",
    },
  ]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl text-center py-24 px-4">
        <h2 className="text-xl font-bold text-slate-heading">Sign in to view your community dashboard</h2>
        <p className="text-xs text-slate-muted mt-2">Access your matches, scheduled sessions, and karma points.</p>
        <Link href="/auth/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  // Calculate algorithmic matches against other community candidates
  const candidateMatches = INITIAL_MEMBERS
    .filter((m) => m.id !== currentUser.id)
    .map((candidate) => ({
      candidate,
      match: calculateMatchScore(currentUser, candidate),
    }))
    .sort((a, b) => b.match.totalScore - a.match.totalScore);

  const topMatch = candidateMatches[0];

  const handleAcceptRequest = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "ACCEPTED" } : r))
    );
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "DECLINED" } : r))
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Bento Header */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-white to-peach-50/70 border border-[#EDE7DE] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-peach-300 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-heading">
                Welcome, {currentUser.fullName.split(" ")[0]}!
              </h1>
              <Badge variant="burgundy">Community Mentor</Badge>
            </div>
            <p className="text-xs text-slate-muted mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-burgundy-600" />
              {currentUser.neighborhood}, {currentUser.city} • {currentUser.occupationOrInterest}
            </p>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle">
            <div className="h-9 w-9 rounded-xl bg-peach-100 flex items-center justify-center text-burgundy-700">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-heading">
                {currentUser.skillPointsBalance} pts
              </div>
              <div className="text-[10px] text-slate-muted font-medium">Karma Balance</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle">
            <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-heading">
                {currentUser.averageRating.toFixed(1)} / 5.0
              </div>
              <div className="text-[10px] text-slate-muted font-medium">Neighbor Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-heading">
                {currentUser.totalSessions}
              </div>
              <div className="text-[10px] text-slate-muted font-medium">Exchanges Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Next Confirmed Learning Session */}
          <Card className="border-l-4 border-l-burgundy-600">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">
                    Next Scheduled Exchange
                  </span>
                </div>
                <CardTitle className="mt-1">
                  Watercolor Landscape Painting ⇄ Hatha Yoga Postures
                </CardTitle>
                <CardDescription>
                  Swapping with Kavita Nair (Panampilly Nagar, Kochi)
                </CardDescription>
              </div>
              <Badge variant="match">Confirmed</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cream-100 border border-cream-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-burgundy-600" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-heading">Saturday, 10:00 AM – 11:00 AM IST</p>
                    <p className="text-slate-muted">60 Minutes • Virtual Learning Room #SB-482 / Notes Shared</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href="/chat">
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Chat
                    </Button>
                  </Link>
                  <Link href="/room/SB-482">
                    <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                      <Video className="h-3.5 w-3.5 text-peach-200" />
                      Enter Room
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Top Algorithmic Match */}
          {topMatch && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <Badge variant="peach" className="mb-1">Algorithmic Best Fit</Badge>
                  <CardTitle>Recommended Community Match</CardTitle>
                  <CardDescription>
                    Looking to learn: {currentUser.learningSkills[0]?.name}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-burgundy-600">
                    {topMatch.match.totalScore}%
                  </span>
                  <span className="block text-[10px] text-slate-muted uppercase font-bold">
                    Compatibility
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-cream-100 border border-cream-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={topMatch.candidate.avatarUrl}
                      alt={topMatch.candidate.fullName}
                      className="h-12 w-12 rounded-2xl object-cover border border-peach-300"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-heading">
                        {topMatch.candidate.fullName} ({topMatch.candidate.age})
                      </h4>
                      <p className="text-xs text-slate-muted flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-burgundy-600" />
                        {topMatch.candidate.neighborhood}, {topMatch.candidate.city.split(",")[0]}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {topMatch.candidate.averageRating.toFixed(1)} rating ({topMatch.candidate.totalSessions} swaps)
                      </div>
                    </div>
                  </div>

                  <Link href="/matches">
                    <Button size="sm" variant="primary" className="text-xs gap-1">
                      Propose Swap
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDE7DE]">
                    <span className="text-[10px] text-slate-muted uppercase font-bold block">They Teach:</span>
                    <span className="font-semibold text-burgundy-700 truncate block">
                      {topMatch.match.mutualLearnSkill}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDE7DE]">
                    <span className="text-[10px] text-slate-muted uppercase font-bold block">They Seek:</span>
                    <span className="font-semibold text-emerald-700 truncate block">
                      {topMatch.match.mutualTeachSkill}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDE7DE] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-muted uppercase font-bold block">Mode & Spoken:</span>
                    <span className="font-semibold text-slate-heading block truncate">
                      {topMatch.candidate.modePreference} ({topMatch.candidate.spokenLanguages.slice(0, 2).join(", ")})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card 3: Pending Inbound Exchange Requests */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Incoming Swap Proposals</CardTitle>
                <CardDescription>Community members wanting to learn with you</CardDescription>
              </div>
              <Badge variant="outline">{requests.filter(r => r.status === "PENDING").length} Pending</Badge>
            </CardHeader>
            <CardContent>
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-white border border-[#EDE7DE] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.senderAvatar}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-heading">
                          {req.senderName} ({req.senderAge})
                        </h4>
                        <p className="text-[11px] text-slate-muted">{req.senderLocation}</p>
                      </div>
                    </div>
                    <Badge variant={req.status === "PENDING" ? "peach" : req.status === "ACCEPTED" ? "success" : "default"}>
                      {req.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-body bg-cream-100 p-2.5 rounded-xl leading-relaxed italic">
                    &quot;{req.message}&quot;
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
                    <div className="text-slate-muted">
                      Slot: <span className="font-semibold text-slate-heading">{req.proposedTime}</span>
                    </div>

                    {req.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeclineRequest(req.id)}
                          className="text-xs h-8 text-slate-muted hover:text-red-600"
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAcceptRequest(req.id)}
                          className="text-xs h-8"
                        >
                          Accept & Schedule
                        </Button>
                      </div>
                    )}

                    {req.status === "ACCEPTED" && (
                      <Link href="/room/SB-482">
                        <Button size="sm" variant="peach" className="text-xs h-8">
                          Open Session Workspace
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          
          {/* Bento Widget: Skills Portfolio Snapshot */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">My Skills Portfolio</CardTitle>
              <CardDescription>What you offer & seek across the network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-heading uppercase tracking-wider text-[10px] block mb-1.5 text-burgundy-700">
                  Offering to Teach:
                </span>
                <div className="space-y-1.5">
                  {currentUser.teachingSkills.map((sk) => (
                    <div
                      key={sk.name}
                      className="flex items-center justify-between p-2 rounded-xl bg-burgundy-50/70 border border-burgundy-200"
                    >
                      <span className="font-bold text-burgundy-800">{sk.name}</span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded text-burgundy-700 font-semibold">
                        {sk.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-heading uppercase tracking-wider text-[10px] block mb-1.5 text-emerald-700">
                  Looking to Learn:
                </span>
                <div className="space-y-1.5">
                  {currentUser.learningSkills.map((sk) => (
                    <div
                      key={sk.name}
                      className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200"
                    >
                      <span className="font-bold text-emerald-800">{sk.name}</span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded text-emerald-700 font-semibold">
                        Target: {sk.targetProficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/onboarding" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Update Skills & Availability
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bento Widget: Community Doubt Board Snippet */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Neighborhood Q&A</CardTitle>
                <CardDescription>Help a neighbor & earn +15 karma</CardDescription>
              </div>
              <Link href="/community">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  View Board
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-cream-100 border border-cream-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-heading line-clamp-1">
                    Preventing watercolor paper from buckling
                  </span>
                  <Badge variant="success">Solved</Badge>
                </div>
                <p className="text-slate-muted text-[11px] line-clamp-2">
                  Asked by Siddharth (Bengaluru) • Answered by Pooja Sharma
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cream-100 border border-cream-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-heading line-clamp-1">
                    Gentle yoga postures for desk neck stiffness
                  </span>
                  <Badge variant="peach">Active</Badge>
                </div>
                <p className="text-slate-muted text-[11px] line-clamp-2">
                  Asked by Harish Patel (Ahmedabad) • Answered by Kavita
                </p>
              </div>

              <Link href="/community" className="block pt-1">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  Ask a Community Question
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

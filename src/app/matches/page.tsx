"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  HeartHandshake, 
  ArrowRight,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { INITIAL_MEMBERS, CommunityMember } from "@/lib/data/mock-data";
import { calculateMatchScore } from "@/lib/matching";

export default function MyMatchesPage() {
  const { currentUser } = useAuth();
  const [minMatchScore, setMinMatchScore] = useState<number>(60);
  const [proposalMember, setProposalMember] = useState<CommunityMember | null>(null);
  const [proposalSent, setProposalSent] = useState(false);
  const [note, setNote] = useState("");

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl text-center py-24 px-4">
        <h2 className="text-xl font-bold text-slate-heading">Sign in to calculate your community matches</h2>
        <p className="text-xs text-slate-muted mt-2">Discover neighbors whose skills complement yours.</p>
        <Link href="/auth/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  // Calculate scores for all other candidates
  const scoredCandidates = INITIAL_MEMBERS
    .filter((m) => m.id !== currentUser.id)
    .map((candidate) => ({
      candidate,
      match: calculateMatchScore(currentUser, candidate),
    }))
    .filter((item) => item.match.totalScore >= minMatchScore)
    .sort((a, b) => b.match.totalScore - a.match.totalScore);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSent(true);
    setTimeout(() => {
      setProposalMember(null);
      setProposalSent(false);
      setNote("");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <Badge variant="burgundy">6-Factor Community Matching Engine</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-heading">
          Your Recommended Community Matches
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted max-w-xl mx-auto">
          Scored across 6 weighted dimensions: complementary skills (50%), shared free days (15%), spoken language (10%), level compatibility (10%), neighborhood/mode proximity (10%), and karma reputation (5%).
        </p>
      </div>

      {/* Filter / Threshold Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-heading">Minimum Match Threshold:</span>
          <div className="flex items-center gap-1">
            {[60, 75, 85].map((score) => (
              <button
                key={score}
                onClick={() => setMinMatchScore(score)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  minMatchScore === score
                    ? "bg-burgundy-600 text-white"
                    : "bg-cream-200 text-slate-muted hover:bg-cream-300"
                }`}
              >
                {score}%+
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-muted">
          Showing <strong>{scoredCandidates.length}</strong> compatible community members
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scoredCandidates.map(({ candidate, match }) => (
          <Card key={candidate.id} className="relative overflow-hidden flex flex-col justify-between">
            {/* Top Score Badge */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={candidate.avatarUrl}
                    alt={candidate.fullName}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-peach-300 shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-heading">
                      {candidate.fullName} ({candidate.age})
                    </h3>
                    <p className="text-xs text-slate-muted flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-burgundy-600" />
                      {candidate.neighborhood}, {candidate.city}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {candidate.averageRating.toFixed(1)}
                      </span>
                      <span className="text-slate-muted">• {candidate.totalSessions} community swaps</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-burgundy-600 tracking-tight">
                    {match.totalScore}%
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-muted block -mt-1">
                    Match Score
                  </span>
                </div>
              </div>

              {/* Mutual Skill Exchange Highlight Box */}
              <div className="mt-5 p-3.5 rounded-2xl bg-cream-100 border border-cream-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted font-medium">You Teach Them:</span>
                  <span className="font-bold text-burgundy-700 bg-white px-2.5 py-0.5 rounded-lg border border-burgundy-200 shadow-xs">
                    {match.mutualTeachSkill}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted font-medium">They Teach You:</span>
                  <span className="font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-xs">
                    {match.mutualLearnSkill}
                  </span>
                </div>
              </div>

              {/* 6-Factor Algorithmic Score Breakdown Progress */}
              <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-muted block">
                  Weighted Factor Breakdown
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-white border border-[#EDE7DE]">
                    <div className="font-bold text-slate-heading">{match.skillScore}/50</div>
                    <div className="text-slate-muted">Skills</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EDE7DE]">
                    <div className="font-bold text-slate-heading">{match.availabilityScore}/15</div>
                    <div className="text-slate-muted">Availability</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EDE7DE]">
                    <div className="font-bold text-slate-heading">{match.languageScore}/10</div>
                    <div className="text-slate-muted">Language</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EDE7DE]">
                    <div className="font-bold text-slate-heading">{match.levelScore}/10</div>
                    <div className="text-slate-muted">Level</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EDE7DE]">
                    <div className="font-bold text-slate-heading">{match.modeGeoScore}/10</div>
                    <div className="text-slate-muted">Loc/Mode</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EDE7DE]">
                    <div className="font-bold text-slate-heading">{match.reputationScore}/5</div>
                    <div className="text-slate-muted">Karma</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with action */}
            <CardFooter className="p-6 pt-3 border-t border-cream-200 flex items-center justify-between bg-cream-50/50">
              <span className="text-xs text-slate-muted">
                Free on: {candidate.availability.map((a) => a.day).join(", ")}
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setProposalMember(candidate)}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-peach-200" />
                Request Exchange
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Request Exchange Modal */}
      {proposalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-cream-200">
              <div className="flex items-center gap-3">
                <img
                  src={proposalMember.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-heading">
                    Request Swap with {proposalMember.fullName} ({proposalMember.age})
                  </h3>
                  <p className="text-xs text-slate-muted">{proposalMember.neighborhood}, {proposalMember.city}</p>
                </div>
              </div>
              <button
                onClick={() => setProposalMember(null)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {proposalSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Proposal Dispatched!</h4>
                <p className="text-xs text-slate-muted">
                  {proposalMember.fullName.split(" ")[0]} has been notified. Check your dashboard for updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Proposed Meeting Window:
                  </label>
                  <select className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50">
                    <option>Saturday at 10:00 AM IST</option>
                    <option>Sunday at 4:00 PM IST</option>
                    <option>Wednesday at 6:30 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Friendly Neighborhood Note:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Hello! I saw our 94% match score and would love to swap..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE7DE] p-2.5 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setProposalMember(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                    <Sparkles className="h-4 w-4 text-peach-200" />
                    Dispatch Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { useSwap } from "@/lib/context/SwapContext";
import { CommunityMember } from "@/lib/types";
import { calculateMatchScore } from "@/lib/matching";

export default function MyMatchesPage() {
  const { currentUser } = useAuth();
  const { createProposal } = useSwap();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [minMatchScore, setMinMatchScore] = useState<number>(60);
  const [proposalMember, setProposalMember] = useState<CommunityMember | null>(null);
  const [proposedTime, setProposedTime] = useState("Saturday at 10:00 AM IST");
  const [proposalSent, setProposalSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function fetchLiveMembers() {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) return;
        const dbMembers: CommunityMember[] = await res.json();
        if (Array.isArray(dbMembers)) {
          setMembers(dbMembers);
        }
      } catch (err) {
        console.warn("Failed to fetch live members for matches:", err);
      }
    }
    fetchLiveMembers();
  }, []);

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
  const scoredCandidates = members
    .filter((m) => m.id !== currentUser.id)
    .map((candidate) => ({
      candidate,
      match: calculateMatchScore(currentUser, candidate),
    }))
    .filter((item) => item.match.totalScore >= minMatchScore)
    .sort((a, b) => b.match.totalScore - a.match.totalScore);

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalMember || !currentUser) return;
    setIsSubmitting(true);

    try {
      const matchData = calculateMatchScore(currentUser, proposalMember);
      await createProposal({
        receiver: proposalMember,
        offeredSkill: matchData.mutualTeachSkill || currentUser.teachingSkills[0]?.name || "Creative Guidance",
        requestedSkill: matchData.mutualLearnSkill || proposalMember.teachingSkills[0]?.name || "Wellness Practice",
        proposedTime,
        message: note.trim() || `Hello ${proposalMember.fullName.split(" ")[0]}! I saw our ${matchData.totalScore}% compatibility score and would love to exchange skills with you!`,
        currentUser,
      });

      setProposalSent(true);
      setTimeout(() => {
        setProposalMember(null);
        setProposalSent(false);
        setNote("");
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
    }
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
                  <Link href={`/members/${candidate.id}`}>
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.fullName}
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-peach-300 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                    />
                  </Link>
                  <div>
                    <Link href={`/members/${candidate.id}`}>
                      <h3 className="text-lg font-bold text-slate-heading hover:text-burgundy-700 transition-colors">
                        {candidate.fullName} ({candidate.age})
                      </h3>
                    </Link>
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
                  Match Breakdown
                </span>
                <div className="space-y-1.5 text-[11px]">
                  {match.breakdown.map((item, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-slate-heading">
                        <span>{item.dimension}</span>
                        <span className="font-bold">{item.points} / {item.max} pts</span>
                      </div>
                      <div className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-burgundy-600 rounded-full transition-all"
                          style={{ width: `${(item.points / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 mt-2 flex items-center justify-between gap-3 border-t border-cream-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-muted">
                <Clock className="h-3.5 w-3.5 text-burgundy-600" />
                <span>Next slot: {candidate.availability[0]?.day || "Flexible"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/members/${candidate.id}`}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    View Profile
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setProposalMember(candidate)}
                  className="gap-1.5 text-xs"
                >
                  <HeartHandshake className="h-3.5 w-3.5 text-peach-200" />
                  Propose Swap
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Proposal Modal */}
      {proposalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={proposalMember.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-heading">
                    Propose Swap to {proposalMember.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-muted">
                    {proposalMember.neighborhood}, {proposalMember.city}
                  </p>
                </div>
              </div>
              <button
                disabled={isSubmitting}
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
                  <select
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50"
                  >
                    <option value="Saturday at 10:00 AM IST">Saturday at 10:00 AM IST</option>
                    <option value="Sunday at 4:00 PM IST">Sunday at 4:00 PM IST</option>
                    <option value="Wednesday at 6:30 PM IST">Wednesday at 6:30 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Friendly Neighborhood Note:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Hello! I would love to exchange our skills this weekend..."
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
                    disabled={isSubmitting}
                    onClick={() => setProposalMember(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="gap-1.5">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-peach-200" />
                        Dispatching...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-peach-200" />
                        Dispatch Request
                      </>
                    )}
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

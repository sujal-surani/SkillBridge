"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  MessageSquare, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Languages, 
  X,
  Loader2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { INITIAL_MEMBERS, CommunityMember } from "@/lib/data/mock-data";
import { useAuth } from "@/lib/context/AuthContext";
import { useSwap } from "@/lib/context/SwapContext";

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createProposal, reviews } = useSwap();
  const memberId = params?.id as string;

  // Find member from community catalog with live DB fallback
  const [member, setMember] = useState<CommunityMember>(
    INITIAL_MEMBERS.find((m) => m.id === memberId) || INITIAL_MEMBERS[1]
  );

  useEffect(() => {
    async function loadMember() {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) return;
        const dbMembers: CommunityMember[] = await res.json();
        const found = dbMembers.find((m) => m.id === memberId);
        if (found) {
          setMember(found);
        }
      } catch (err) {}
    }
    loadMember();
  }, [memberId]);

  // Proposal Modal State
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState(
    member.teachingSkills[0]?.name || ""
  );
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState(
    currentUser?.teachingSkills[0]?.name || "Creative Arts"
  );
  const [proposedSlot, setProposedSlot] = useState("Saturday at 10:00 AM IST");
  const [proposedNote, setProposedNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  // Filter reviews for this member from SwapContext
  const memberReviews = reviews.filter(
    (r) => r.targetMemberId === member.id || member.id === "member-2" || r.authorId === member.id
  );

  const handleOpenProposal = () => {
    setSelectedRequestedSkill(member.teachingSkills[0]?.name || "");
    setSelectedOfferedSkill(currentUser?.teachingSkills[0]?.name || "General Mentoring");
    setProposedNote(
      `Hello ${member.fullName.split(" ")[0]}! I saw your public profile and would love to exchange skills with you.`
    );
    setProposalModalOpen(true);
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProposal({
        receiver: member,
        offeredSkill: selectedOfferedSkill,
        requestedSkill: selectedRequestedSkill,
        proposedTime: proposedSlot,
        message: proposedNote,
        currentUser,
      });

      setProposalSent(true);
      setTimeout(() => {
        setProposalModalOpen(false);
        setProposalSent(false);
        setIsSubmitting(false);
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-muted hover:text-burgundy-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="peach">Community Mentor</Badge>
          <Badge variant="outline">{member.modePreference.replace("_", " ")}</Badge>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-3xl bg-white border border-[#EDE7DE] p-6 sm:p-10 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 z-10">
          <img
            src={member.avatarUrl}
            alt={member.fullName}
            className="h-28 w-28 rounded-3xl object-cover border-4 border-peach-200 shadow-md"
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-heading tracking-tight">
                {member.fullName}
              </h1>
              <span className="text-xs font-bold text-slate-muted bg-cream-200 px-2.5 py-1 rounded-full">
                {member.age} yrs
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Neighbor
              </span>
            </div>

            <p className="text-sm font-semibold text-burgundy-700">
              {member.occupationOrInterest}
            </p>

            <p className="text-xs text-slate-muted flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-burgundy-600 shrink-0" />
              <span>{member.neighborhood}, {member.city}</span>
              <span>•</span>
              <span>Speaks {member.spokenLanguages.join(", ")}</span>
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{member.averageRating.toFixed(1)} / 5.0</span>
                <span className="text-slate-muted font-normal">({member.totalSessions} swaps)</span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-burgundy-800 bg-peach-100 px-3 py-1 rounded-full border border-peach-200">
                <Sparkles className="h-3.5 w-3.5 text-burgundy-600" />
                <span>{member.skillPointsBalance} Karma Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto z-10 shrink-0">
          <Button
            size="lg"
            variant="primary"
            onClick={handleOpenProposal}
            className="w-full justify-center gap-2 shadow-md bg-burgundy-600 hover:bg-burgundy-700 text-sm"
          >
            <HeartHandshake className="h-4 w-4 text-peach-200" />
            Propose Skill Swap
          </Button>

          <Link href="/chat" className="w-full">
            <Button
              size="lg"
              variant="secondary"
              className="w-full justify-center gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Direct Message
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Bio & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Bio & Teaching/Learning Cards */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Detailed Bio Card */}
          <Card className="p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-slate-heading">About {member.fullName.split(" ")[0]}</h2>
            <p className="text-xs sm:text-sm text-slate-body leading-relaxed whitespace-pre-line">
              {member.bio}
            </p>
          </Card>

          {/* Skills They Teach */}
          <Card className="p-6 sm:p-8 space-y-4 border-l-4 border-l-burgundy-600">
            <div className="flex items-center gap-2 text-burgundy-700">
              <Award className="h-5 w-5" />
              <h2 className="text-base font-bold text-slate-heading">What {member.fullName.split(" ")[0]} Can Teach You</h2>
            </div>

            <div className="space-y-3 pt-1">
              {member.teachingSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-burgundy-50/70 border border-burgundy-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-burgundy-900 text-sm">{sk.name}</p>
                    <p className="text-[11px] text-slate-muted">{sk.category} • {sk.yearsExperience} years hands-on experience</p>
                  </div>
                  <Badge variant="burgundy" className="self-start sm:self-auto">{sk.proficiency}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Skills They Seek */}
          <Card className="p-6 sm:p-8 space-y-4 border-l-4 border-l-emerald-600">
            <div className="flex items-center gap-2 text-emerald-700">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-base font-bold text-slate-heading">What {member.fullName.split(" ")[0]} Wants to Learn</h2>
            </div>

            <div className="space-y-3 pt-1">
              {member.learningSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-emerald-900 text-sm">{sk.name}</p>
                    <p className="text-[11px] text-slate-muted">{sk.category}</p>
                  </div>
                  <Badge variant="success" className="self-start sm:self-auto">Target: {sk.targetProficiency}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Neighbor Reviews & Testimonials */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-heading">Neighbor Reviews & Community Trust</h2>
                <p className="text-xs text-slate-muted">Feedback from verified peer-to-peer exchanges</p>
              </div>
              <Badge variant="peach">{memberReviews.length} Reviews</Badge>
            </div>

            <div className="space-y-4 pt-2">
              {memberReviews.length === 0 ? (
                <p className="text-xs text-slate-muted text-center py-6">
                  No written reviews yet. Be the first neighbor to exchange with {member.fullName.split(" ")[0]}!
                </p>
              ) : (
                memberReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-cream-50/70 border border-[#EDE7DE] space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.authorAvatar}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover border border-peach-300"
                        />
                        <div>
                          <p className="font-bold text-slate-heading">{rev.authorName}</p>
                          <p className="text-[10px] text-slate-muted">{rev.authorLocation} • {rev.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-body italic leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.badges.map((b) => (
                        <span key={b} className="text-[10px] font-semibold bg-white border border-cream-200 text-burgundy-800 px-2 py-0.5 rounded-md">
                          🏆 {b}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Availability & Quick Stats */}
        <div className="space-y-6">
          {/* Availability Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-heading">
              <Calendar className="h-4 w-4 text-burgundy-600" />
              <h3 className="text-sm font-bold">Weekly Availability</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {member.availability.map((av, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-cream-100/70 border border-cream-200"
                >
                  <span className="font-bold text-slate-heading">{av.day}</span>
                  <span className="text-slate-muted font-medium">{av.timeSlots.join(", ")}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-muted leading-relaxed pt-1">
              💡 Times are in Indian Standard Time (IST). Flexible for weekend morning or evening sessions.
            </p>
          </Card>

          {/* Meeting Mode & Location Safety */}
          <Card className="p-6 space-y-3.5 text-xs">
            <h3 className="text-sm font-bold text-slate-heading flex items-center gap-2">
              <MapPin className="h-4 w-4 text-burgundy-600" />
              Meeting Preferences
            </h3>

            <div className="p-3 rounded-2xl bg-peach-50 border border-peach-200 space-y-1">
              <span className="font-bold text-burgundy-800 block">Preferred Mode: {member.modePreference}</span>
              <p className="text-[11px] text-burgundy-700">
                Open to {member.modePreference === "HYBRID" ? "both online video and neighborhood meetups" : member.modePreference === "IN_PERSON" ? "in-person community sessions" : "online virtual exchanges"}.
              </p>
            </div>

            <div className="pt-2 text-[11px] text-slate-muted space-y-1">
              <span className="font-semibold text-slate-heading block">Neighborhood:</span>
              <p>{member.neighborhood}, {member.city}</p>
            </div>
          </Card>

          {/* Propose Swap Promo Card */}
          <div className="rounded-3xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 text-white p-6 shadow-xl space-y-3 text-center">
            <Sparkles className="h-8 w-8 text-peach-300 mx-auto" />
            <h4 className="font-bold text-sm">Have complementary skills?</h4>
            <p className="text-xs text-cream-200 leading-relaxed">
              SkillBridge is 100% free and peer-to-peer. Offer what you know, learn what you love.
            </p>
            <Button
              variant="peach"
              size="sm"
              onClick={handleOpenProposal}
              className="w-full text-xs font-bold text-burgundy-900"
            >
              Propose Swap Now
            </Button>
          </div>
        </div>
      </div>

      {/* Propose Swap Modal */}
      {proposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl object-cover border border-peach-300"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-heading">
                    Propose Swap to {member.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-muted">
                    {member.neighborhood}, {member.city}
                  </p>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setProposalModalOpen(false)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {proposalSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Proposal Dispatched!</h4>
                <p className="text-xs text-slate-muted">
                  {member.fullName.split(" ")[0]} has been notified. You can track this swap in your Community Dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Skill you want to learn from {member.fullName.split(" ")[0]}:
                  </label>
                  <select
                    value={selectedRequestedSkill}
                    onChange={(e) => setSelectedRequestedSkill(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50"
                  >
                    {member.teachingSkills.map((sk) => (
                      <option key={sk.name} value={sk.name}>
                        {sk.name} ({sk.proficiency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Skill you offer in exchange:
                  </label>
                  <select
                    value={selectedOfferedSkill}
                    onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50"
                  >
                    {currentUser?.teachingSkills.map((sk) => (
                      <option key={sk.name} value={sk.name}>
                        {sk.name} ({sk.proficiency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Preferred Session Time:
                  </label>
                  <Input
                    type="text"
                    value={proposedSlot}
                    onChange={(e) => setProposedSlot(e.target.value)}
                    className="text-xs h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Friendly Message / Learning Goals:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={proposedNote}
                    onChange={(e) => setProposedNote(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE7DE] p-2.5 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => setProposalModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    className="gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-peach-200" />
                        Dispatching...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-peach-200" />
                        Send Proposal
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

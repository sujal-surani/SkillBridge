"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Star, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  X,
  Sprout,
  HeartPulse,
  Palette,
  Laptop,
  BookOpen,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CommunityMember } from "@/lib/types";
import { useAuth } from "@/lib/context/AuthContext";
import { useSwap } from "@/lib/context/SwapContext";

export default function ExploreSkillsPage() {
  const { currentUser } = useAuth();
  const { createProposal } = useSwap();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("ALL");
  const [selectedMode, setSelectedMode] = useState("ALL");
  const [proposalModalMember, setProposalModalMember] = useState<CommunityMember | null>(null);
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("");
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState("");
  const [proposedMessage, setProposedMessage] = useState("");
  const [proposedSlot, setProposedSlot] = useState("Saturday at 10:00 AM IST");
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        console.warn("Failed to fetch live members for explore:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLiveMembers();
  }, []);

  const pillars = [
    { id: "ALL", label: "All Skills" },
    { id: "CREATIVE_PRACTICAL", label: "Gardening, Baking & Arts" },
    { id: "HEALTH_WELLNESS", label: "Health, Yoga & First Aid" },
    { id: "TECH_PROFESSIONAL", label: "Tech, Excel & Digital" },
    { id: "ACADEMIC_LANGUAGES", label: "Languages & Academic" },
  ];

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.teachingSkills.some((sk) =>
        sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sk.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      m.learningSkills.some((sk) =>
        sk.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesPillar =
      selectedPillar === "ALL" ||
      m.teachingSkills.some((sk) => sk.pillar === selectedPillar);

    const matchesMode =
      selectedMode === "ALL" || m.modePreference === selectedMode;

    return matchesSearch && matchesPillar && matchesMode;
  });

  const handleOpenProposal = (member: CommunityMember) => {
    setProposalModalMember(member);
    setSelectedRequestedSkill(member.teachingSkills[0]?.name || "");
    setSelectedOfferedSkill(currentUser?.teachingSkills[0]?.name || "Creative Mentoring");
    setProposedMessage(`Hello ${member.fullName.split(" ")[0]}! I saw your skill in ${member.teachingSkills[0]?.name || "your craft"} and would love to exchange knowledge.`);
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalModalMember || !currentUser) return;
    setIsSubmitting(true);

    try {
      await createProposal({
        receiver: proposalModalMember,
        offeredSkill: selectedOfferedSkill || currentUser.teachingSkills[0]?.name || "Practical Skill",
        requestedSkill: selectedRequestedSkill || proposalModalMember.teachingSkills[0]?.name || "Community Skill",
        proposedTime: proposedSlot,
        message: proposedMessage,
        currentUser,
      });

      setRequestSent(true);
      setTimeout(() => {
        setProposalModalMember(null);
        setRequestSent(false);
        setProposedMessage("");
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Search Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="peach">Community Skill Catalog</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-heading">
          Explore Skills & Discover Neighbors
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted max-w-xl mx-auto">
          Connect with local and online community members offering 1-on-1 swaps. Filter by topic, neighborhood, spoken language, or meeting mode.
        </p>

        {/* Big Search Input */}
        <div className="pt-2 relative max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search by skill (e.g. Gardening, Yoga, Excel, Guitar, Cooking), person, or neighborhood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-11 pr-4 rounded-2xl shadow-sm text-sm"
          />
          <Search className="h-5 w-5 text-slate-muted absolute left-4 top-3.5" />
        </div>
      </div>

      {/* Filter Chips & Meeting Mode Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle text-xs">
        {/* Topic Pillars */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {pillars.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPillar(p.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedPillar === p.id
                  ? "bg-burgundy-600 text-white shadow-xs font-semibold"
                  : "bg-cream-100 text-slate-body hover:bg-cream-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-slate-muted font-medium">Mode:</span>
          <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-xl">
            {["ALL", "HYBRID", "ONLINE", "IN_PERSON"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                  selectedMode === mode
                    ? "bg-white text-burgundy-700 shadow-xs"
                    : "text-slate-muted hover:text-slate-heading"
                }`}
              >
                {mode === "ALL" ? "Any" : mode.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Community Mentors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="flex flex-col justify-between overflow-hidden group hover:shadow-hover transition-all">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Link href={`/members/${member.id}`}>
                    <img
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-peach-300 shadow-sm group-hover:scale-105 transition-transform cursor-pointer"
                    />
                  </Link>
                  <div>
                    <Link href={`/members/${member.id}`}>
                      <h3 className="text-base font-bold text-slate-heading flex items-center gap-1.5 hover:text-burgundy-700 transition-colors">
                        {member.fullName}
                        <span className="text-xs font-normal text-slate-muted">({member.age})</span>
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-burgundy-600" />
                      {member.neighborhood}, {member.city.split(",")[0]}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs mt-1">
                      <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {member.averageRating.toFixed(1)}
                      </span>
                      <span className="text-slate-muted text-[11px]">• {member.totalSessions} swaps</span>
                    </div>
                  </div>
                </div>

                <Badge variant={member.modePreference === "IN_PERSON" ? "success" : member.modePreference === "ONLINE" ? "match" : "peach"}>
                  {member.modePreference.replace("_", " ")}
                </Badge>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-muted mt-3 line-clamp-2 leading-relaxed">
                {member.bio}
              </p>
            </CardHeader>

            <CardContent className="px-6 py-2 space-y-3">
              {/* Teaching skills */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-700 block mb-1">
                  Offers to Teach:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.teachingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-peach-100/70 border border-peach-200 text-burgundy-800 text-xs font-semibold"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seeking to learn */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-muted block mb-1">
                  Looking to Learn:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.learningSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-cream-100 border border-cream-200 text-slate-heading text-xs font-medium"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="pt-2 text-[11px] text-slate-muted flex items-center gap-1">
                <span className="font-semibold text-slate-heading">Speaks:</span>
                <span>{member.spokenLanguages.join(", ")}</span>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-3 border-t border-cream-200/80 flex items-center justify-between gap-2">
              <Link href={`/members/${member.id}`}>
                <Button variant="secondary" size="sm" className="text-xs">
                  View Profile
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenProposal(member)}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-peach-200" />
                Propose Swap
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Propose Swap Modal */}
      {proposalModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={proposalModalMember.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl object-cover border border-peach-300"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-heading">
                    Propose Swap to {proposalModalMember.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-muted">
                    {proposalModalMember.neighborhood}, {proposalModalMember.city}
                  </p>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setProposalModalMember(null)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {requestSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Proposal Dispatched!</h4>
                <p className="text-xs text-slate-muted">
                  {proposalModalMember.fullName.split(" ")[0]} has received your proposal. Check your dashboard to view scheduled swaps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Skill you want to learn from them:
                  </label>
                  <select
                    value={selectedRequestedSkill}
                    onChange={(e) => setSelectedRequestedSkill(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50"
                  >
                    {proposalModalMember.teachingSkills.map((sk) => (
                      <option key={sk.name} value={sk.name}>
                        {sk.name} ({sk.proficiency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Skill you offer in return:
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
                    Proposed Meeting Window:
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
                    Friendly Neighborhood Note:
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Hello! I saw your profile and would love to exchange..."
                    value={proposedMessage}
                    onChange={(e) => setProposedMessage(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE7DE] p-2.5 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => setProposalModalMember(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="gap-1.5">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-peach-200" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-peach-200" />
                        Send Swap Proposal
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

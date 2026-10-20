"use client";

import React, { useState } from "react";
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
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { INITIAL_MEMBERS, CommunityMember } from "@/lib/data/mock-data";
import { useAuth } from "@/lib/context/AuthContext";

export default function ExploreSkillsPage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("ALL");
  const [selectedMode, setSelectedMode] = useState("ALL");
  const [proposalModalMember, setProposalModalMember] = useState<CommunityMember | null>(null);
  const [proposedMessage, setProposedMessage] = useState("");
  const [proposedSlot, setProposedSlot] = useState("Saturday at 10:00 AM IST");
  const [requestSent, setRequestSent] = useState(false);

  const pillars = [
    { id: "ALL", label: "All Skills" },
    { id: "CREATIVE_PRACTICAL", label: "Gardening, Baking & Arts" },
    { id: "HEALTH_WELLNESS", label: "Health, Yoga & First Aid" },
    { id: "TECH_PROFESSIONAL", label: "Tech, Excel & Digital" },
    { id: "ACADEMIC_LANGUAGES", label: "Languages & Academic" },
  ];

  const filteredMembers = INITIAL_MEMBERS.filter((m) => {
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

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setProposalModalMember(null);
      setRequestSent(false);
      setProposedMessage("");
    }, 1200);
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

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-[#EDE7DE]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
          {pillars.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPillar(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPillar === p.id
                  ? "bg-burgundy-600 text-white shadow-xs"
                  : "bg-white text-slate-muted border border-cream-300 hover:bg-cream-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-muted">
          <span>Mode:</span>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="h-8 rounded-lg border border-cream-300 bg-white px-2 text-xs text-slate-heading"
          >
            <option value="ALL">All Modes</option>
            <option value="IN_PERSON">In-Person Only</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONLINE">Online Only</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-muted">
        <span>
          Showing <strong>{filteredMembers.length}</strong> active community mentors
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-burgundy-600 hover:underline flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear search
          </button>
        )}
      </div>

      {/* Members Cards Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((m) => (
            <Card key={m.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatarUrl}
                      alt={m.fullName}
                      className="h-12 w-12 rounded-2xl object-cover border border-peach-300"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-heading">
                        {m.fullName} ({m.age})
                      </h4>
                      <p className="text-xs text-slate-muted flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-burgundy-600" />
                        {m.neighborhood}, {m.city.split(",")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {m.averageRating.toFixed(1)}
                  </div>
                </div>

                <p className="text-xs text-slate-muted mt-3 line-clamp-2 leading-relaxed">
                  {m.bio}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 text-xs pt-0">
                {/* Teaching Skills */}
                <div>
                  <span className="text-[10px] font-bold text-slate-muted uppercase tracking-wider block mb-1">
                    Offers to Teach:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.teachingSkills.map((sk) => (
                      <span
                        key={sk.name}
                        className="px-2 py-0.5 rounded-md bg-burgundy-50 text-burgundy-700 font-semibold text-[11px]"
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Seeking Skills */}
                <div>
                  <span className="text-[10px] font-bold text-slate-muted uppercase tracking-wider block mb-1">
                    Looking to Learn:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.learningSkills.map((sk) => (
                      <span
                        key={sk.name}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]"
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mode & Languages */}
                <div className="pt-2 border-t border-cream-200 flex items-center justify-between text-[11px] text-slate-muted">
                  <span>Mode: <strong>{m.modePreference}</strong></span>
                  <span>Speaks: {m.spokenLanguages.slice(0, 2).join(", ")}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-cream-200 flex items-center justify-between">
                <span className="text-xs text-slate-muted">
                  {m.totalSessions} community swaps
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setProposalModalMember(m)}
                  className="h-8 text-xs gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-peach-200" />
                  Request Exchange
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EDE7DE] max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-cream-200 text-slate-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading">No Members Found</h3>
          <p className="text-xs text-slate-muted mt-1 max-w-sm mx-auto">
            Try resetting your search or broadening the filter to &quot;All Skills&quot;.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedPillar("ALL");
              setSelectedMode("ALL");
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Exchange Proposal Modal */}
      {proposalModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4 animate-scale-up">
            <div className="flex items-start justify-between pb-3 border-b border-cream-200">
              <div className="flex items-center gap-3">
                <img
                  src={proposalModalMember.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-heading">
                    Propose Swap to {proposalModalMember.fullName} ({proposalModalMember.age})
                  </h3>
                  <p className="text-xs text-slate-muted">
                    {proposalModalMember.neighborhood}, {proposalModalMember.city}
                  </p>
                </div>
              </div>
              <button
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
                  We alerted {proposalModalMember.fullName.split(" ")[0]}. You can track its status in your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Skill you want to learn from them:
                  </label>
                  <select className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50">
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
                  <select className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50">
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
                    onClick={() => setProposalModalMember(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                    <Sparkles className="h-4 w-4 text-peach-200" />
                    Send Swap Proposal
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

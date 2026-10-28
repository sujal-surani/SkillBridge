"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  Activity, 
  Check, 
  X, 
  Search, 
  TrendingUp,
  Coins,
  HeartHandshake,
  MapPin,
  Sprout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CommunityMember } from "@/lib/types";

export default function AdminPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [adminTab, setAdminTab] = useState<"analytics" | "users" | "skills" | "reports">("analytics");
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    async function fetchAdminMembers() {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setMembers(data);
        }
      } catch (err) {}
    }
    fetchAdminMembers();
  }, []);

  const [skillsTaxonomy, setSkillsTaxonomy] = useState([
    { name: "Watercolor Landscape Painting & Washes", pillar: "CREATIVE_PRACTICAL", status: "APPROVED", memberCount: 68 },
    { name: "Morning Hatha Yoga & Posture", pillar: "HEALTH_WELLNESS", status: "APPROVED", memberCount: 94 },
    { name: "Organic Terrace Vegetable Gardening", pillar: "CREATIVE_PRACTICAL", status: "APPROVED", memberCount: 54 },
    { name: "First Aid Basics & Emergency CPR", pillar: "HEALTH_WELLNESS", status: "APPROVED", memberCount: 48 },
    { name: "Artisanal Sourdough & Baking", pillar: "CREATIVE_PRACTICAL", status: "APPROVED", memberCount: 42 },
    { name: "Acoustic Guitar Basics & Chords", pillar: "CREATIVE_PRACTICAL", status: "APPROVED", memberCount: 52 },
    { name: "Spoken English Fluency & Confidence", pillar: "ACADEMIC_LANGUAGES", status: "APPROVED", memberCount: 76 },
    { name: "Basic Home Electrical & Plumbing Repairs", pillar: "CREATIVE_PRACTICAL", status: "APPROVED", memberCount: 31 },
    { name: "Pottery & Clay Sculpting", pillar: "CREATIVE_PRACTICAL", status: "PENDING_APPROVAL", memberCount: 8 },
    { name: "Terrace Drip Irrigation Setup", pillar: "CREATIVE_PRACTICAL", status: "PENDING_APPROVAL", memberCount: 5 },
  ]);

  const [reports, setReports] = useState([
    {
      id: "rep-1",
      reporter: "Siddharth Roy (Bengaluru)",
      reported: "Anonymous User #402",
      reason: "No-show for scheduled morning in-person gardening meetup",
      status: "PENDING",
      timestamp: "Yesterday, 11:15 AM",
    },
  ]);

  const handleApproveSkill = (name: string) => {
    setSkillsTaxonomy(
      skillsTaxonomy.map((s) => (s.name === name ? { ...s, status: "APPROVED" } : s))
    );
  };

  const handleResolveReport = (id: string) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, status: "RESOLVED" } : r))
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-peach-300" />
            <h1 className="text-xl sm:text-2xl font-bold">SkillBridge Community Admin & Moderation</h1>
          </div>
          <p className="text-xs text-slate-400">
            Community safety, member directory, skill taxonomy across all 4 pillars, and engagement analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="peach" className="bg-peach-200 text-burgundy-900 font-bold">
            CEP Community Moderator
          </Badge>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE7DE] pb-2 text-xs font-bold">
        {[
          { id: "analytics", label: "Community Analytics" },
          { id: "users", label: "Members Directory (6 Active)" },
          { id: "skills", label: "Skills Taxonomy (8)" },
          { id: "reports", label: "Community Safety Queue (1)" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setAdminTab(t.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              adminTab === t.id
                ? "bg-burgundy-600 text-white shadow-xs"
                : "bg-white text-slate-muted hover:bg-cream-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {adminTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Community Swaps</span>
              <p className="text-3xl font-extrabold text-burgundy-600 mt-2">1,840</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" /> +24% this month
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Active Cities</span>
              <p className="text-3xl font-extrabold text-slate-heading mt-2">18</p>
              <span className="text-[10px] text-slate-muted font-medium block mt-1">
                Pune, Bengaluru, Mumbai, Delhi
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Community Karma</span>
              <p className="text-3xl font-extrabold text-burgundy-600 mt-2">42.5k</p>
              <span className="text-[10px] text-slate-muted font-medium block mt-1">
                Points circulated
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Neighbor Trust</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">99.1%</p>
              <span className="text-[10px] text-slate-muted font-medium block mt-1">
                Rated 4 or 5 stars
              </span>
            </Card>
          </div>

          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Top Community Exchange Pairings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Watercolor Landscape Painting ⇄ Morning Hatha Yoga</span>
                <Badge variant="burgundy">284 Exchanges</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Terrace Vegetable Gardening ⇄ Acoustic Guitar Chords</span>
                <Badge variant="burgundy">216 Exchanges</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Artisanal Sourdough Baking ⇄ Smartphone Photography</span>
                <Badge variant="burgundy">172 Exchanges</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Spoken English Fluency ⇄ Basic Home Repairs & DIY</span>
                <Badge variant="burgundy">124 Exchanges</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Directory Tab */}
      {adminTab === "users" && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-heading">Community Members Directory</h3>
            <Input
              placeholder="Search member..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="max-w-xs h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-slate-heading font-bold border-b border-cream-200">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Neighborhood</th>
                  <th className="p-3">Primary Craft / Skill</th>
                  <th className="p-3">Karma Points</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-cream-50">
                    <td className="p-3 flex items-center gap-2">
                      <img src={m.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-heading block">{m.fullName} ({m.age})</span>
                        <span className="text-[10px] text-slate-muted">{m.email}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-heading">{m.neighborhood}, {m.city.split(",")[0]}</td>
                    <td className="p-3">{m.teachingSkills[0]?.name}</td>
                    <td className="p-3 font-bold text-burgundy-700">{m.skillPointsBalance} pts</td>
                    <td className="p-3 font-bold text-amber-600">★ {m.averageRating.toFixed(1)}</td>
                    <td className="p-3">
                      <Badge variant="success">Active Member</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Skills Taxonomy Tab */}
      {adminTab === "skills" && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-heading">Official 4-Pillar Skill Taxonomy</h3>
          <div className="space-y-2">
            {skillsTaxonomy.map((sk) => (
              <div
                key={sk.name}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-100 border border-cream-200 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-heading block">{sk.name}</span>
                  <span className="text-[10px] text-slate-muted">Pillar: {sk.pillar} • {sk.memberCount} active mentors</span>
                </div>
                {sk.status === "APPROVED" ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="peach"
                    onClick={() => handleApproveSkill(sk.name)}
                    className="text-xs h-7 gap-1"
                  >
                    <Check className="h-3 w-3" /> Approve Category
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reports Queue Tab */}
      {adminTab === "reports" && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-heading">Community Moderation Tickets</h3>
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-heading">Ticket #{rep.id}</span>
                <Badge variant={rep.status === "RESOLVED" ? "success" : "peach"}>
                  {rep.status}
                </Badge>
              </div>
              <p className="text-slate-body"><strong>Reason:</strong> {rep.reason}</p>
              <p className="text-[11px] text-slate-muted">Filed by: {rep.reporter} • {rep.timestamp}</p>
              {rep.status === "PENDING" && (
                <div className="pt-1 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleResolveReport(rep.id)}
                    className="text-xs h-8"
                  >
                    Mark as Resolved & Check In with Members
                  </Button>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

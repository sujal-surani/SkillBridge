"use client";

import React, { useState } from "react";
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
  Trash2, 
  TrendingUp,
  Coins,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { INITIAL_STUDENTS, StudentProfile } from "@/lib/data/mock-data";

export default function AdminPage() {
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [adminTab, setAdminTab] = useState<"users" | "skills" | "reports" | "analytics">("analytics");
  const [searchUser, setSearchUser] = useState("");

  const [skillsTaxonomy, setSkillsTaxonomy] = useState([
    { name: "Next.js & React", category: "Web Dev", status: "APPROVED", studentCount: 42 },
    { name: "C++ Data Structures & Algorithms", category: "DSA", status: "APPROVED", studentCount: 78 },
    { name: "Machine Learning with PyTorch", category: "AI/ML", status: "APPROVED", studentCount: 31 },
    { name: "Three.js & WebGL", category: "Web Dev", status: "PENDING_APPROVAL", studentCount: 4 },
    { name: "Solidity & Smart Contracts", category: "Web3", status: "PENDING_APPROVAL", studentCount: 2 },
  ]);

  const [reports, setReports] = useState([
    {
      id: "rep-1",
      reporter: "Sneha Nair (NIT Trichy)",
      reported: "Anonymous User #921",
      reason: "No-show for scheduled learning room session",
      status: "PENDING",
      timestamp: "Yesterday, 4:15 PM",
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
            <h1 className="text-xl sm:text-2xl font-bold">SkillBridge Administrative Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Community moderation, user directory, skill taxonomy, and academic integrity metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="peach" className="bg-peach-200 text-burgundy-900 font-bold">
            CEP Admin Access
          </Badge>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE7DE] pb-2 text-xs font-bold">
        {[
          { id: "analytics", label: "Executive Analytics" },
          { id: "users", label: "Students Directory (6 Active)" },
          { id: "skills", label: "Skills Taxonomy (5)" },
          { id: "reports", label: "Moderation Queue (1)" },
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
              <span className="text-xs text-slate-muted font-bold uppercase">Total Swaps Completed</span>
              <p className="text-3xl font-extrabold text-burgundy-600 mt-2">1,420</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" /> +18.4% this month
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Active Colleges</span>
              <p className="text-3xl font-extrabold text-slate-heading mt-2">24</p>
              <span className="text-[10px] text-slate-muted font-medium block mt-1">
                IITs, NITs, BITS, VJTI, COEP
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Peer Karma Issued</span>
              <p className="text-3xl font-extrabold text-burgundy-600 mt-2">35.5k</p>
              <span className="text-[10px] text-slate-muted font-medium block mt-1">
                Skill points in circulation
              </span>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-slate-muted font-bold uppercase">Match Satisfaction</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">98.2%</p>
              <span className="text-[10px] text-slate-muted font-medium block mt-1">
                Rated 4 or 5 stars
              </span>
            </Card>
          </div>

          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Top Exchanged Skill Pairs (Mutual Swaps)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Next.js & React ⇄ C++ Dynamic Programming</span>
                <Badge variant="burgundy">214 Sessions</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Figma UI/UX ⇄ Flutter Mobile Dev</span>
                <Badge variant="burgundy">168 Sessions</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100">
                <span className="font-bold text-slate-heading">Machine Learning (PyTorch) ⇄ Docker & Backend</span>
                <Badge variant="burgundy">122 Sessions</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Directory Tab */}
      {adminTab === "users" && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-heading">Registered Engineering Students</h3>
            <Input
              placeholder="Search student..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="max-w-xs h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-slate-heading font-bold border-b border-cream-200">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Teaches</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-cream-50">
                    <td className="p-3 flex items-center gap-2">
                      <img src={st.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-heading block">{st.fullName}</span>
                        <span className="text-[10px] text-slate-muted">{st.email}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-heading">{st.collegeName}</td>
                    <td className="p-3">{st.teachingSkills[0]?.name}</td>
                    <td className="p-3 font-bold text-burgundy-700">{st.skillPointsBalance} pts</td>
                    <td className="p-3 font-bold text-amber-600">★ {st.averageRating.toFixed(1)}</td>
                    <td className="p-3">
                      <Badge variant="success">Active</Badge>
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
          <h3 className="text-base font-bold text-slate-heading">Official Skill Catalog</h3>
          <div className="space-y-2">
            {skillsTaxonomy.map((sk) => (
              <div
                key={sk.name}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-100 border border-cream-200 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-heading block">{sk.name}</span>
                  <span className="text-[10px] text-slate-muted">{sk.category} • {sk.studentCount} active students</span>
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
                    <Check className="h-3 w-3" /> Approve Topic
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
          <h3 className="text-base font-bold text-slate-heading">Peer Moderation Tickets</h3>
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-heading">Report #{rep.id}</span>
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
                    Mark as Resolved & Warn User
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

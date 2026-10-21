"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HeartHandshake, 
  MapPin, 
  Calendar, 
  Star, 
  Coins, 
  CheckCircle2, 
  Edit3, 
  Award, 
  Clock, 
  Languages, 
  ShieldCheck, 
  BookOpen, 
  Sprout, 
  Laptop, 
  Inbox,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  User,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { useSwap } from "@/lib/context/SwapContext";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { sessions, reviews, transactions } = useSwap();
  const [activeTab, setActiveTab] = useState<"portfolio" | "history" | "ledger" | "reviews">("portfolio");

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl text-center py-28 px-4">
        <h2 className="text-xl font-bold text-slate-heading">Sign in to view your community profile</h2>
        <Link href="/auth/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Profile Card Header */}
      <div className="rounded-3xl bg-white border border-[#EDE7DE] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="h-20 w-20 rounded-3xl object-cover border-2 border-peach-300 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-slate-heading">
                {currentUser.fullName}
              </h1>
              <Badge variant="peach">{currentUser.age} yrs</Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3 w-3" />
                Verified Neighbor
              </span>
            </div>

            <p className="text-xs font-semibold text-burgundy-700">
              {currentUser.occupationOrInterest}
            </p>

            <p className="text-xs text-slate-muted flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-burgundy-600 shrink-0" />
              {currentUser.neighborhood}, {currentUser.city} • Mode:{" "}
              <strong className="text-slate-heading">{currentUser.modePreference}</strong>
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {currentUser.averageRating.toFixed(1)} / 5.0
              </span>
              <span className="text-slate-muted font-medium">
                • {completedSessions.length || currentUser.totalSessions} sessions completed
              </span>
            </div>
          </div>
        </div>

        {/* Action Button & Quick Karma Pill */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-peach-100 border border-peach-200 text-burgundy-800 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Coins className="h-4 w-4 text-burgundy-600" />
            <span>{currentUser.skillPointsBalance} Karma Points</span>
          </div>

          <Link href="/onboarding">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Edit3 className="h-3.5 w-3.5" />
              Edit Portfolio
            </Button>
          </Link>
        </div>
      </div>

      {/* Spacious Progressive Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE7DE] pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: "portfolio", label: "My Portfolio & Skills" },
          { id: "history", label: `Session History (${completedSessions.length})` },
          { id: "ledger", label: `Karma Ledger (${transactions.length})` },
          { id: "reviews", label: `Neighbor Reviews (${reviews.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-burgundy-600 text-white shadow-xs font-semibold"
                : "text-slate-muted hover:text-slate-heading hover:bg-cream-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: My Portfolio */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Bio Overview */}
          <Card className="p-6 sm:p-8 space-y-3">
            <h3 className="text-sm font-bold text-slate-heading">My Neighborhood Bio</h3>
            <p className="text-xs sm:text-sm text-slate-body leading-relaxed">
              {currentUser.bio}
            </p>
          </Card>

          {/* 2-Column Teaching & Learning Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4 border-l-4 border-l-burgundy-600">
              <div className="flex items-center justify-between text-burgundy-700">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <h3 className="text-base font-bold text-slate-heading">Skills I Teach</h3>
                </div>
                <Badge variant="burgundy">{currentUser.teachingSkills.length} Skills</Badge>
              </div>

              <div className="space-y-3 pt-1">
                {currentUser.teachingSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="p-3.5 rounded-2xl bg-burgundy-50/60 border border-burgundy-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-heading">{sk.name}</p>
                      <p className="text-[11px] text-slate-muted">{sk.category} • {sk.yearsExperience} yrs experience</p>
                    </div>
                    <Badge variant="burgundy">{sk.proficiency}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between text-emerald-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="text-base font-bold text-slate-heading">Skills I Want to Learn</h3>
                </div>
                <Badge variant="success">{currentUser.learningSkills.length} Desired</Badge>
              </div>

              <div className="space-y-3 pt-1">
                {currentUser.learningSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-heading">{sk.name}</p>
                      <p className="text-[11px] text-slate-muted">{sk.category}</p>
                    </div>
                    <Badge variant="success">Target: {sk.targetProficiency}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Weekly Availability & Spoken Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-heading">
                <Calendar className="h-4 w-4 text-burgundy-600" />
                <h3 className="text-sm font-bold">My Weekly Availability</h3>
              </div>
              <div className="space-y-2 text-xs">
                {currentUser.availability.map((av, idx) => (
                  <div key={idx} className="flex justify-between p-2.5 rounded-xl bg-cream-100/70 border border-cream-200">
                    <span className="font-bold text-slate-heading">{av.day}</span>
                    <span className="text-slate-muted">{av.timeSlots.join(", ")}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-heading">
                <Languages className="h-4 w-4 text-burgundy-600" />
                <h3 className="text-sm font-bold">Spoken Languages & Location</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-cream-100/70 border border-cream-200 flex justify-between">
                  <span className="font-semibold text-slate-heading">Languages:</span>
                  <span className="text-slate-muted">{currentUser.spokenLanguages.join(", ")}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cream-100/70 border border-cream-200 flex justify-between">
                  <span className="font-semibold text-slate-heading">Neighborhood / City:</span>
                  <span className="text-slate-muted">{currentUser.neighborhood}, {currentUser.city}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Session History */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {completedSessions.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EDE7DE] space-y-3">
              <div className="h-12 w-12 rounded-full bg-cream-100 text-slate-muted flex items-center justify-center mx-auto">
                <Inbox className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-heading">No completed exchanges recorded yet</h4>
              <p className="text-xs text-slate-muted max-w-sm mx-auto">
                Completed 1-on-1 sessions will appear here along with room archives and earned points.
              </p>
              <Link href="/matches">
                <Button size="sm" variant="primary" className="text-xs">
                  Discover Neighbors
                </Button>
              </Link>
            </div>
          ) : (
            completedSessions.map((sess) => {
              const partner = sess.participants.find((p) => p.id !== currentUser.id) || sess.participants[0];
              return (
                <Card key={sess.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-subtle transition-shadow">
                  <div className="flex items-center gap-4">
                    <Link href={`/members/${partner?.id || "member-2"}`}>
                      <img
                        src={partner?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128"}
                        alt=""
                        className="h-12 w-12 rounded-2xl object-cover border-2 border-peach-300 hover:scale-105 transition-transform"
                      />
                    </Link>
                    <div>
                      <h4 className="text-sm font-bold text-slate-heading">{sess.topic}</h4>
                      <p className="text-xs text-slate-muted mt-0.5">
                        With <Link href={`/members/${partner?.id || "member-2"}`} className="font-semibold text-burgundy-700 hover:underline">{partner?.name}</Link> • Room #{sess.roomId} • {sess.completedAt || sess.scheduledFor} ({sess.durationMinutes} mins)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="peach">+25 Karma</Badge>
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <span className="ml-1">5.0</span>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Karma Ledger (Financial / Points Transaction Statement) */}
      {activeTab === "ledger" && (
        <div className="space-y-6">
          {/* Balance Summary Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cream-100 via-white to-peach-100/70 border border-[#EDE7DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-muted">Total Available Karma</span>
              <div className="flex items-center gap-2">
                <Coins className="h-7 w-7 text-burgundy-600" />
                <span className="text-3xl font-black text-slate-heading">{currentUser.skillPointsBalance} Points</span>
              </div>
              <p className="text-xs text-slate-muted">Used for scheduling sessions, tipping helpful mentors, and unlocking badges.</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" className="px-3 py-1 font-bold">+25 pts / Exchange</Badge>
            </div>
          </div>

          {/* Transactions List */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-sm font-bold text-slate-heading">Transaction Activity</h3>
              <span className="text-xs text-slate-muted">{transactions.length} Transactions</span>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-muted text-center py-6">No point transactions yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-50/80 border border-[#EDE7DE] text-xs hover:bg-cream-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold ${
                          tx.type === "EARNED" || tx.type === "BONUS"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.type === "EARNED" || tx.type === "BONUS" ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-heading">{tx.description}</p>
                        <p className="text-[11px] text-slate-muted">{tx.timestamp} • {tx.type}</p>
                      </div>
                    </div>

                    <div
                      className={`font-black text-sm ${
                        tx.type === "EARNED" || tx.type === "BONUS"
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      +{tx.amount} pts
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Neighbor Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EDE7DE] space-y-3">
              <div className="h-12 w-12 rounded-full bg-cream-100 text-slate-muted flex items-center justify-center mx-auto">
                <Inbox className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-heading">No reviews yet</h4>
              <p className="text-xs text-slate-muted max-w-sm mx-auto">
                Reviews left by community peers after completing exchanges will show up here.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <Card key={rev.id} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.authorAvatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover border border-peach-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-heading">
                        {rev.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-muted">{rev.authorLocation} • {rev.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-body italic leading-relaxed">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rev.badges.map((b) => (
                    <span key={b} className="text-[10px] font-semibold bg-cream-200 text-slate-heading px-2 py-0.5 rounded-md">
                      🏆 {b}
                    </span>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

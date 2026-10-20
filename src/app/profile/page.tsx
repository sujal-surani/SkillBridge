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
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"skills" | "history" | "reviews">("skills");

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl text-center py-24 px-4">
        <h2 className="text-xl font-bold text-slate-heading">Sign in to view your community profile</h2>
        <Link href="/auth/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const sessionHistory = [
    {
      id: "sess-1",
      partnerName: "Kavita Nair",
      partnerAge: 39,
      partnerLocation: "Panampilly Nagar, Kochi",
      partnerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128",
      topic: "Watercolor Sky Washes ⇄ Morning Hatha Yoga",
      date: "Yesterday",
      duration: "60 mins",
      pointsEarned: "+25 pts",
      ratingGiven: 5,
    },
    {
      id: "sess-2",
      partnerName: "Harish Patel",
      partnerAge: 58,
      partnerLocation: "Navrangpura, Ahmedabad",
      partnerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128",
      topic: "Pencil Sketching Basics ⇄ Spoken English Storytelling",
      date: "Oct 14, 2026",
      duration: "45 mins",
      pointsEarned: "+25 pts",
      ratingGiven: 5,
    },
  ];

  const receivedReviews = [
    {
      id: "rev-1",
      authorName: "Kavita Nair",
      authorAge: 39,
      authorLocation: "Panampilly Nagar, Kochi",
      rating: 5,
      date: "Yesterday",
      comment: "Pooja's color mixing demonstration was so clear and inspiring! She helped me understand how to control water on cotton paper without fear.",
      badges: ["Patient Mentor", "Practical Art Guidance", "Warm & Respectful"],
    },
    {
      id: "rev-2",
      authorName: "Harish Patel",
      authorAge: 58,
      authorLocation: "Navrangpura, Ahmedabad",
      rating: 5,
      date: "Oct 14, 2026",
      comment: "Pooja is a gifted artist and a patient instructor. My grandchildren were delighted by the botanical sketches we made together!",
      badges: ["Deep Practical Experience", "Clear Explanations"],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Card Header */}
      <div className="rounded-3xl bg-white border border-[#EDE7DE] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="h-20 w-20 rounded-3xl object-cover border-2 border-peach-300 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-heading">
                {currentUser.fullName} ({currentUser.age})
              </h1>
              <Badge variant="burgundy">Community Mentor</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-muted flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-burgundy-600" />
              {currentUser.neighborhood}, {currentUser.city} • {currentUser.occupationOrInterest}
            </p>
            <p className="text-xs text-slate-muted flex items-center gap-2">
              <span>Mode: <strong>{currentUser.modePreference}</strong></span>
              <span>• Speaks: {currentUser.spokenLanguages.join(", ")}</span>
            </p>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 rounded-2xl bg-peach-50 border border-peach-200 text-center">
            <div className="flex items-center gap-1.5 text-burgundy-800 font-extrabold text-lg">
              <Coins className="h-5 w-5 text-burgundy-600" />
              <span>{currentUser.skillPointsBalance} pts</span>
            </div>
            <span className="text-[10px] text-slate-muted uppercase font-bold block">
              Karma Points Balance
            </span>
          </div>

          <Link href="/onboarding">
            <Button variant="secondary" size="sm" className="gap-1.5 h-11 text-xs">
              <Edit3 className="h-4 w-4" />
              Edit Skills
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE7DE] pb-2 text-xs font-bold">
        {[
          { id: "skills", label: "Skills & Learning Wishlist" },
          { id: "history", label: "Exchange History (16)" },
          { id: "reviews", label: "Neighbor Reviews & Accolades" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-burgundy-600 text-white shadow-xs"
                : "bg-white text-slate-muted hover:bg-cream-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Skills & Goals */}
      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-burgundy-700">
              <Sprout className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-heading">Skills I Can Teach</h3>
            </div>
            <div className="space-y-3">
              {currentUser.teachingSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="p-3.5 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-between text-xs"
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

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <BookOpen className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-heading">What I Want to Learn</h3>
            </div>
            <div className="space-y-3">
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
      )}

      {/* Tab 2: Session History */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {sessionHistory.map((sess) => (
            <Card key={sess.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={sess.partnerAvatar}
                  alt=""
                  className="h-11 w-11 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-heading">{sess.topic}</h4>
                  <p className="text-xs text-slate-muted">
                    With {sess.partnerName} ({sess.partnerAge}) • {sess.partnerLocation} • {sess.date} ({sess.duration})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <Badge variant="peach">{sess.pointsEarned}</Badge>
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="ml-1">{sess.ratingGiven}.0</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {receivedReviews.map((rev) => (
            <Card key={rev.id} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-peach-100 flex items-center justify-center font-bold text-burgundy-700 text-xs">
                    {rev.authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-heading">
                      {rev.authorName} ({rev.authorAge})
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
          ))}
        </div>
      )}
    </div>
  );
}

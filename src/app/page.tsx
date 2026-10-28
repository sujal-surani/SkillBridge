"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  HeartHandshake, 
  Users, 
  Star, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Sprout,
  HeartPulse,
  Palette,
  Laptop,
  Languages,
  Wrench,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CommunityMember } from "@/lib/types";

export default function HomePage() {
  const [featuredMembers, setFeaturedMembers] = useState<CommunityMember[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeaturedMembers(data.slice(0, 3));
        }
      } catch (err) {}
    }
    loadFeatured();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-gradient-to-b from-peach-100/60 via-cream-200/40 to-transparent pointer-events-none -z-10 blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 lg:px-8 text-center">
        {/* Top Community Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-100 border border-peach-200 text-burgundy-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="h-4 w-4 text-burgundy-600" />
          <span>Community Engagement Project • Free Skill Exchange For Everyone</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-heading tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Trade skills. Not money.{" "}
          <span className="text-burgundy-600 block sm:inline">
            Knowledge for Everyone.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-muted max-w-2xl mx-auto font-normal leading-relaxed">
          From watercolor drawing, yoga, and cooking to terrace gardening, spoken languages, and practical repairs. Connect with neighbors and community members for authentic 1-on-1 swaps.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Join the Community
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore All Skills
            </Button>
          </Link>
        </div>

        {/* Interactive Live Skill Swap Simulation Card: Pooja (Drawing) & Kavita (Yoga) */}
        <div className="mt-14 max-w-3xl mx-auto p-4 sm:p-6 rounded-3xl bg-white border border-[#EDE7DE] shadow-card-hover text-left">
          <div className="flex items-center justify-between pb-4 border-b border-cream-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-heading">Live Community Match Example</span>
            </div>
            <Badge variant="match">96% Mutual Compatibility</Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Member 1: Pooja Sharma (34, Drawing & Watercolor, Jaipur) */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
                  alt="Pooja Sharma"
                  className="h-12 w-12 rounded-full object-cover border border-peach-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-heading">Pooja Sharma (34)</h4>
                  <p className="text-xs text-slate-muted flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-burgundy-600" />
                    C-Scheme, Jaipur
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Teaches:</span>
                  <span className="font-semibold text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Palette className="h-3 w-3" /> Watercolor Painting & Drawing
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Wants:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <HeartPulse className="h-3 w-3" /> Morning Hatha Yoga & Posture
                  </span>
                </div>
              </div>
            </div>

            {/* Member 2: Kavita Nair (39, Yoga & Posture, Kochi) */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128"
                  alt="Kavita Nair"
                  className="h-12 w-12 rounded-full object-cover border border-peach-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-heading">Kavita Nair (39)</h4>
                  <p className="text-xs text-slate-muted flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-burgundy-600" />
                    Panampilly Nagar, Kochi
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Teaches:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <HeartPulse className="h-3 w-3" /> Morning Hatha Yoga & Posture
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Wants:</span>
                  <span className="font-semibold text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Palette className="h-3 w-3" /> Watercolor Painting & Drawing
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Direct 1:1 cross-generational exchange. Zero middleman fees.
            </span>
            <Link href="/matches">
              <Button size="sm" variant="peach" className="h-8">
                Calculate My Community Matches
              </Button>
            </Link>
          </div>
        </div>

        {/* Realistic Social Proof Counter */}
        <div className="mt-14 pt-8 border-t border-[#EDE7DE] grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-3xl font-extrabold text-burgundy-600">2,140+</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Community Swaps Completed</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-heading">95.4%</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Algorithmic Match Rate</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-burgundy-600">₹0</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Mandatory Cost (Skill for Skill)</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-heading">4.97 / 5</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Neighbor Satisfaction Rating</div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="burgundy" className="mb-2">Diverse Knowledge Spectrum</Badge>
          <h2 className="text-3xl font-extrabold text-slate-heading">
            Learn Anything. Share Everything.
          </h2>
          <p className="mt-2 text-sm text-slate-muted max-w-lg mx-auto">
            From creative arts and wellness habits to culinary mastery and everyday life crafts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:border-burgundy-300">
            <div className="h-12 w-12 rounded-2xl bg-peach-100 border border-peach-200 flex items-center justify-center text-burgundy-700 mx-auto mb-3">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-heading mb-1">Drawing & Creative Arts</h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              Watercolor painting, pencil portrait sketching, guitar, and hand embroidery.
            </p>
          </Card>

          <Card className="p-6 text-center hover:border-burgundy-300">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-3">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-heading mb-1">Health & Wellness</h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              Hatha Yoga, desk posture alignment, emergency CPR & First Aid, and meal nutrition.
            </p>
          </Card>

          <Card className="p-6 text-center hover:border-burgundy-300">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto mb-3">
              <Utensils className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-heading mb-1">Cooking & Gardening</h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              Sourdough baking, organic terrace composting, regional pickles, and home cooking.
            </p>
          </Card>

          <Card className="p-6 text-center hover:border-burgundy-300">
            <div className="h-12 w-12 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-700 mx-auto mb-3">
              <Languages className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-heading mb-1">Languages & Life Skills</h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              Spoken English, French/Spanish for travel, basic home repairs, and personal budgeting.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Community Members */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-cream-200/50 rounded-3xl my-8 border border-cream-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="peach" className="mb-2">Community Spotlight</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-heading">
              Neighbors Ready to Trade Knowledge
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="sm" className="gap-1">
              View All Mentors & Topics
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMembers.map((m) => (
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
                        <MapPin className="h-3 w-3 text-burgundy-600" />
                        {m.neighborhood}, {m.city.split(",")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {m.averageRating.toFixed(1)}
                  </div>
                </div>
                <p className="text-xs text-slate-muted mt-3 line-clamp-2 leading-relaxed">
                  {m.bio}
                </p>
              </CardHeader>

              <CardContent className="space-y-2.5 text-xs pt-0">
                <div>
                  <span className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider block mb-1">
                    Teaches:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.teachingSkills.map((sk) => (
                      <span key={sk.name} className="px-2 py-0.5 rounded-md bg-burgundy-50 text-burgundy-700 font-medium">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider block mb-1">
                    Wants to Learn:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.learningSkills.map((sk) => (
                      <span key={sk.name} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-cream-200 flex items-center justify-between">
                <span className="text-xs text-slate-muted">
                  {m.totalSessions} community swaps
                </span>
                <Link href="/matches">
                  <Button size="sm" variant="primary" className="h-8 text-xs">
                    Request Swap
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="burgundy" className="mb-2">Real Stories</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-heading">
            Neighbors Helping Neighbors Across All Ages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-body italic leading-relaxed">
              &quot;Pooja taught me how to blend watercolor skies on textured paper. In return, I walked her through morning yoga postures to ease neck strain from painting. This is community learning at its purest!&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=96"
                alt="Kavita Nair"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-heading">Kavita Nair (39)</p>
                <p className="text-[11px] text-slate-muted">Panampilly Nagar, Kochi</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-body italic leading-relaxed">
              &quot;I taught Rameshji basic guitar chords so he could play music with his family, and he shared his 8-year organic composting formula for my apartment balcony. We became great neighborhood friends!&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=96"
                alt="Siddharth Roy"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-heading">Siddharth Roy (29)</p>
                <p className="text-[11px] text-slate-muted">Indiranagar, Bengaluru</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-burgundy-600 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-card-hover">
          <div className="absolute top-0 right-0 w-80 h-80 bg-peach-300/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to turn what you know into what you need?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cream-200 max-w-xl mx-auto">
            Create your community profile in under 90 seconds. Everyone has valuable skills to share.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-burgundy-700 hover:bg-cream-100 border-none font-bold">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

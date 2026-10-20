"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Zap, 
  BookOpen, 
  Star, 
  RefreshCw,
  Award,
  Clock,
  Laptop,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { INITIAL_STUDENTS } from "@/lib/data/mock-data";

export default function HomePage() {
  const featuredMentors = INITIAL_STUDENTS.slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-peach-100/60 via-cream-200/40 to-transparent pointer-events-none -z-10 blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 lg:px-8 text-center">
        {/* Top Community Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-100 border border-peach-200 text-burgundy-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="h-4 w-4 text-burgundy-600" />
          <span>Community Engagement Project • 100% Free Peer Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-heading tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Trade skills. Not money.{" "}
          <span className="text-burgundy-600 block sm:inline">
            Knowledge for Knowledge.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-muted max-w-2xl mx-auto font-normal leading-relaxed">
          The peer-to-peer exchange for Indian engineering students. Teach what you excel at — learn what you need to crack your dream role.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Join SkillBridge Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Active Skills
            </Button>
          </Link>
        </div>

        {/* Interactive Live Skill Swap Simulation Card */}
        <div className="mt-14 max-w-3xl mx-auto p-4 sm:p-6 rounded-3xl bg-white border border-[#EDE7DE] shadow-card-hover text-left">
          <div className="flex items-center justify-between pb-4 border-b border-cream-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-heading">Live Matchmaking Simulation</span>
            </div>
            <Badge variant="match">94% Mutual Compatibility</Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Student 1 */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=128"
                  alt="Aarav Sharma"
                  className="h-11 w-11 rounded-full object-cover border border-peach-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-heading">Aarav Sharma</h4>
                  <p className="text-xs text-slate-muted">IIT Bombay • CSE &apos;26</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Teaches:</span>
                  <span className="font-semibold text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded">
                    Next.js & React
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Wants:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    C++ DSA & Graphs
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Indicator */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
                  alt="Priya Patel"
                  className="h-11 w-11 rounded-full object-cover border border-peach-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-heading">Priya Patel</h4>
                  <p className="text-xs text-slate-muted">VJTI Mumbai • IT &apos;26</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Teaches:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    C++ DSA & Graphs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Wants:</span>
                  <span className="font-semibold text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded">
                    Next.js & React
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Direct 1:1 match. Zero middleman fees. Verified college identity.
            </span>
            <Link href="/matches">
              <Button size="sm" variant="peach" className="h-8">
                Find My Match
              </Button>
            </Link>
          </div>
        </div>

        {/* Realistic Social Proof Counter */}
        <div className="mt-14 pt-8 border-t border-[#EDE7DE] grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-3xl font-extrabold text-burgundy-600">1,420+</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Sessions Completed</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-heading">94.6%</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Algorithmic Match Rate</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-burgundy-600">₹0</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Mandatory Cost</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-heading">4.92 / 5</div>
            <div className="text-xs text-slate-muted font-medium mt-1">Peer Satisfaction</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="burgundy" className="mb-2">The Philosophy</Badge>
          <h2 className="text-3xl font-extrabold text-slate-heading">
            How SkillBridge Works
          </h2>
          <p className="mt-2 text-sm text-slate-muted max-w-lg mx-auto">
            Traditional ed-tech charges ₹40,000 for canned recorded videos. We connect you with a real engineering senior or peer who explains it 1-on-1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-peach-100/50 rounded-bl-full -z-0 pointer-events-none" />
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-peach-100 flex items-center justify-center text-burgundy-700 font-bold mb-3 z-10">
                1
              </div>
              <CardTitle>List Your Tech Strengths</CardTitle>
              <CardDescription>
                Good at Python, Figma, or System Design? List it on your profile alongside what you want to master this semester.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Specify proficiency & available days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Set online or on-campus preferences</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-peach-100/50 rounded-bl-full -z-0 pointer-events-none" />
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-peach-100 flex items-center justify-center text-burgundy-700 font-bold mb-3 z-10">
                2
              </div>
              <CardTitle>Algorithmic Peer Pairing</CardTitle>
              <CardDescription>
                Our 6-factor algorithm calculates mutual overlaps in skills, availability, preferred spoken language, and target level.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Weighted score from 0% to 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>One-click session proposal flow</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-peach-100/50 rounded-bl-full -z-0 pointer-events-none" />
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-peach-100 flex items-center justify-center text-burgundy-700 font-bold mb-3 z-10">
                3
              </div>
              <CardTitle>The Virtual Learning Room</CardTitle>
              <CardDescription>
                Hop into a dedicated room with a synchronized markdown scratchpad, 60-min timer, and earn Skill Points + reviews.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>+25 points for teaching a session</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Peer verified badge for your resume</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Peers Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-cream-200/50 rounded-3xl my-8 border border-cream-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="peach" className="mb-2">Community Spotlight</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-heading">
              Featured Engineering Peers Ready to Trade
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="sm" className="gap-1">
              View All 100+ Peers
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMentors.map((st) => (
            <Card key={st.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatarUrl}
                      alt={st.fullName}
                      className="h-12 w-12 rounded-2xl object-cover border border-peach-300"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-heading">{st.fullName}</h4>
                      <p className="text-xs text-slate-muted">{st.collegeName} • {st.major.split("&")[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {st.averageRating.toFixed(1)}
                  </div>
                </div>
                <p className="text-xs text-slate-muted mt-3 line-clamp-2 leading-relaxed">
                  {st.bio}
                </p>
              </CardHeader>

              <CardContent className="space-y-2.5 text-xs pt-0">
                <div>
                  <span className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider block mb-1">
                    Teaches:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {st.teachingSkills.map((sk) => (
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
                    {st.learningSkills.map((sk) => (
                      <span key={sk.name} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-cream-200 flex items-center justify-between">
                <span className="text-xs text-slate-muted">
                  {st.totalSessions} sessions completed
                </span>
                <Link href={`/matches`}>
                  <Button size="sm" variant="primary" className="h-8 text-xs">
                    Request Swap
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* College Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="burgundy" className="mb-2">Peer Stories</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-heading">
            Built by College Students, Loved by Campus Minds
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
              &quot;I taught Rohan React components and in return he spent 3 sessions walking me through C++ dynamic programming trees. Cracked my technical round at a Mumbai fintech startup thanks to this swap!&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=96"
                alt="Priya Patel"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-heading">Priya Patel</p>
                <p className="text-[11px] text-slate-muted">VJTI Mumbai &apos;26</p>
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
              &quot;The Skill Points system keeps everyone accountable. You only get points when your peer confirms you showed up and genuinely taught them. This is what community learning should be.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=96"
                alt="Rohan Verma"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-heading">Rohan Verma</p>
                <p className="text-[11px] text-slate-muted">BITS Pilani &apos;25</p>
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
            Create your peer profile in under 90 seconds. List 1 skill you can teach, pick 1 skill you want to learn, and let the algorithm do the rest.
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

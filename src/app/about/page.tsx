import Link from "next/link";
import { 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  BookOpen, 
  Coins, 
  Check, 
  X,
  Target,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="burgundy" className="mb-3">
          The SkillBridge Manifesto
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-heading tracking-tight leading-tight">
          Democratizing Engineering Knowledge Through Direct Peer Exchange
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-muted leading-relaxed">
          SkillBridge was born out of a simple observation across engineering hostels and campus libraries:
          the best teacher is often not a ₹50,000 corporate video course, but the peer sitting across the desk from you.
        </p>
      </div>

      {/* The Core Formula Banner */}
      <div className="my-12 p-8 rounded-3xl bg-peach-100/70 border border-peach-200 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-burgundy-800">
          &ldquo;I know something that you want to learn, and you know something that I want to learn.&rdquo;
        </h2>
        <p className="mt-2 text-sm text-burgundy-900/80 font-medium max-w-xl mx-auto">
          No credit card required. No paywalls. No recurring subscriptions. Pure mutual benefit and campus community growth.
        </p>
      </div>

      {/* Three Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <Card className="p-6">
          <div className="h-11 w-11 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-700 mb-4">
            <Coins className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading mb-2">Zero Mandatory Fees</h3>
          <p className="text-sm text-slate-muted leading-relaxed">
            Education should never be gated by privilege. Every student possesses valuable knowledge, whether in DSA, Figma, Docker, or interview prep.
          </p>
        </Card>

        <Card className="p-6">
          <div className="h-11 w-11 rounded-2xl bg-peach-100 border border-peach-200 flex items-center justify-center text-burgundy-700 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading mb-2">Peer-to-Peer Accountability</h3>
          <p className="text-sm text-slate-muted leading-relaxed">
            When you teach a peer, you reinforce your own conceptual mastery. Our Skill Points system rewards reliability, punctuality, and clarity.
          </p>
        </Card>

        <Card className="p-6">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading mb-2">Algorithmic Precision</h3>
          <p className="text-sm text-slate-muted leading-relaxed">
            Instead of endlessly browsing Discord groups or Reddit threads, our 6-factor engine matches you based on complementary skills, mode, and time slots.
          </p>
        </Card>
      </div>

      {/* Comparison Matrix: SkillBridge vs Commercial Platforms */}
      <div className="my-16">
        <div className="text-center mb-8">
          <Badge variant="peach" className="mb-2">Honest Comparison</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-heading">
            SkillBridge vs Commercial Ed-Tech
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#EDE7DE] bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 border-b border-cream-200 text-slate-heading font-bold">
              <tr>
                <th className="p-4 sm:p-5">Feature</th>
                <th className="p-4 sm:p-5 text-burgundy-700 font-extrabold">SkillBridge (CEP)</th>
                <th className="p-4 sm:p-5 text-slate-muted">Commercial Bootcamps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Direct Cost to Student</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> ₹0 (Pure Skill Exchange)
                </td>
                <td className="p-4 sm:p-5 text-slate-muted flex items-center gap-1.5">
                  <X className="h-4 w-4 text-red-500" /> ₹25,000 - ₹80,000+
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Format</td>
                <td className="p-4 sm:p-5 font-bold text-slate-heading">Interactive 1:1 Peer Session</td>
                <td className="p-4 sm:p-5 text-slate-muted">One-size-fits-all pre-recorded videos</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Doubt Resolution Time</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Real-time in Learning Room
                </td>
                <td className="p-4 sm:p-5 text-slate-muted">24-48 hours on support tickets</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Mutual Learning Benefit</td>
                <td className="p-4 sm:p-5 font-bold text-slate-heading">Both parties learn & earn points</td>
                <td className="p-4 sm:p-5 text-slate-muted">Passive listening only</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Campus Community</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Real peer networking across colleges
                </td>
                <td className="p-4 sm:p-5 text-slate-muted">Isolated portal user</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CEP Academic Notice */}
      <div className="p-6 rounded-3xl bg-cream-200/60 border border-cream-300 text-xs sm:text-sm text-slate-muted leading-relaxed">
        <p className="font-semibold text-slate-heading mb-1 flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-burgundy-600" />
          Community Engagement Project (CEP) Initiative
        </p>
        SkillBridge is developed as a nonprofit, student-led open learning platform. We do not sell user data, run advertisements, or enforce paid subscriptions. All student accounts are authenticated with collegiate trust and verified peer feedback.
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Link href="/auth/signup">
          <Button size="lg" className="gap-2">
            Become a SkillBridge Member
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

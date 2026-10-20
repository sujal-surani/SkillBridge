import Link from "next/link";
import { 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Coins, 
  Check, 
  X, 
  Target, 
  ArrowRight,
  Sprout,
  HeartPulse,
  Palette,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="burgundy" className="mb-3">
          The Community Manifesto
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-heading tracking-tight leading-tight">
          Democratizing Everyday Learning Through Direct Neighborhood Exchange
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-muted leading-relaxed">
          SkillBridge is built on a timeless truth: every neighborhood is already an open learning circle. 
          The master baker next door, the organic gardener down the street, the artist teaching watercolor sketching, 
          the yoga practitioner, and the neighbor sharing personal finance all have something invaluable to teach and learn.
        </p>
      </div>

      {/* The Core Formula Banner */}
      <div className="my-12 p-8 rounded-3xl bg-peach-100/70 border border-peach-200 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-burgundy-800">
          &ldquo;I know something that you want to learn, and you know something that I want to learn.&rdquo;
        </h2>
        <p className="mt-2 text-sm text-burgundy-900/80 font-medium max-w-xl mx-auto">
          No credit cards required. No subscriptions. Skill for Skill. Knowledge for Knowledge. Community-driven learning for everyone.
        </p>
      </div>

      {/* Three Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <Card className="p-6">
          <div className="h-11 w-11 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-700 mb-4">
            <Coins className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading mb-2">Zero Mandatory Money</h3>
          <p className="text-sm text-slate-muted leading-relaxed">
            Education and hobbies shouldn&apos;t be privileges for those who can afford ₹30,000 workshops. Knowledge is the universal currency.
          </p>
        </Card>

        <Card className="p-6">
          <div className="h-11 w-11 rounded-2xl bg-peach-100 border border-peach-200 flex items-center justify-center text-burgundy-700 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading mb-2">Cross-Generational Bonding</h3>
          <p className="text-sm text-slate-muted leading-relaxed">
            Bridging age groups and backgrounds. Young professionals learn home gardening and nutrition; elders master smartphone apps and digital tools.
          </p>
        </Card>

        <Card className="p-6">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-heading mb-2">Algorithmic Matchmaking</h3>
          <p className="text-sm text-slate-muted leading-relaxed">
            Our 6-factor matrix matches you based on complementary skills, neighborhood location, preferred spoken language, and free weekend slots.
          </p>
        </Card>
      </div>

      {/* Comparison Matrix */}
      <div className="my-16">
        <div className="text-center mb-8">
          <Badge variant="peach" className="mb-2">Honest Comparison</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-heading">
            SkillBridge vs Commercial Learning Platforms
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#EDE7DE] bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 border-b border-cream-200 text-slate-heading font-bold">
              <tr>
                <th className="p-4 sm:p-5">Dimension</th>
                <th className="p-4 sm:p-5 text-burgundy-700 font-extrabold">SkillBridge (CEP)</th>
                <th className="p-4 sm:p-5 text-slate-muted">Commercial Classes / Masterclasses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Financial Cost</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> ₹0 (Pure Mutual Exchange)
                </td>
                <td className="p-4 sm:p-5 text-slate-muted flex items-center gap-1.5">
                  <X className="h-4 w-4 text-red-500" /> ₹5,000 - ₹35,000+
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Learning Format</td>
                <td className="p-4 sm:p-5 font-bold text-slate-heading">Interactive 1:1 Live Session or Local Meetup</td>
                <td className="p-4 sm:p-5 text-slate-muted">Pre-recorded one-way video lectures</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Skill Range</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Tech, Health, Gardening, Cooking, Arts, Languages
                </td>
                <td className="p-4 sm:p-5 text-slate-muted">Narrow corporate or academic syllabi</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-heading">Social Connection</td>
                <td className="p-4 sm:p-5 font-bold text-slate-heading">Builds authentic neighborhood community</td>
                <td className="p-4 sm:p-5 text-slate-muted">Isolated online user experience</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Community Engagement Project Notice */}
      <div className="p-6 rounded-3xl bg-cream-200/60 border border-cream-300 text-xs sm:text-sm text-slate-muted leading-relaxed">
        <p className="font-semibold text-slate-heading mb-1 flex items-center gap-1.5">
          <HeartHandshake className="h-4 w-4 text-burgundy-600" />
          Community Engagement Project (CEP) Initiative
        </p>
        SkillBridge operates as a nonprofit, open community project. We do not sell user data, run intrusive advertisements, or enforce paid subscriptions.
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Link href="/auth/signup">
          <Button size="lg" className="gap-2">
            Join the Community Movement
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

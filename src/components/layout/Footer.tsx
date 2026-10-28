"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide the global marketing footer on live video sessions (/room/...) and dedicated chat (/chat)
  // to prevent overlapping notes workspace, video feeds, and message bars.
  if (pathname?.startsWith("/room") || pathname?.startsWith("/chat")) {
    return null;
  }

  return (
    <footer className="border-t border-[#EDE7DE] bg-white text-slate-body">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div suppressHydrationWarning className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy-600 text-white shadow-sm">
                <HeartHandshake className="h-5 w-5 text-peach-200" />
              </div>
              <span className="font-heading text-lg font-bold text-slate-heading">
                Skill<span className="text-burgundy-600">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-muted leading-relaxed">
              Empowering local community neighbors of all ages to trade skills freely. Skill for skill, recipe for formula, chord for seedling.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100/70 border border-peach-200 text-xs font-semibold text-burgundy-800">
              <ShieldCheck className="h-3.5 w-3.5 text-burgundy-600" />
              100% Free & Community-Driven
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-heading uppercase tracking-wider mb-3">
              Explore Skills
            </h4>
            <ul className="space-y-2 text-sm text-slate-muted">
              <li>
                <Link href="/explore" className="hover:text-burgundy-600 transition-colors">
                  Gardening & Sustainability
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-burgundy-600 transition-colors">
                  Health, Yoga & First Aid
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-burgundy-600 transition-colors">
                  Culinary Arts & Baking
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-burgundy-600 transition-colors">
                  Tech, Excel & Digital Skills
                </Link>
              </li>
            </ul>
          </div>

          {/* Philosophy */}
          <div>
            <h4 className="text-sm font-bold text-slate-heading uppercase tracking-wider mb-3">
              Community Ethos
            </h4>
            <ul className="space-y-2 text-sm text-slate-muted">
              <li>
                <Link href="/about" className="hover:text-burgundy-600 transition-colors">
                  The SkillBridge Community Manifesto
                </Link>
              </li>
              <li>
                <span className="text-slate-muted/80">Community Karma Points</span>
              </li>
              <li>
                <span className="text-slate-muted/80">Neighborhood Safety & Respect Code</span>
              </li>
              <li>
                <span className="text-slate-muted/80">Community Engagement Project (CEP)</span>
              </li>
            </ul>
          </div>

          {/* Active Cities */}
          <div>
            <h4 className="text-sm font-bold text-slate-heading uppercase tracking-wider mb-3">
              Active Neighborhoods
            </h4>
            <p className="text-xs text-slate-muted mb-2">
              Connecting enthusiastic learners across towns and cities:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">Pune (Koregaon Park)</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">Bengaluru (Indiranagar)</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">Mumbai (Bandra)</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">Hyderabad (Banjara Hills)</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">Delhi (Hauz Khas)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-muted">
          <p>© {new Date().getFullYear()} SkillBridge Community Engagement Project (CEP). Open for everyone.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Built with <Heart className="h-3.5 w-3.5 text-burgundy-600 fill-burgundy-600" /> for inclusive peer learning.
          </p>
        </div>
      </div>
    </footer>
  );
}

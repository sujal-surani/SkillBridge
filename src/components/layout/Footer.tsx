import Link from "next/link";
import { GraduationCap, Heart, ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#EDE7DE] bg-white text-slate-body">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5 text-peach-200" />
              </div>
              <span className="font-heading text-lg font-bold text-slate-heading">
                Skill<span className="text-burgundy-600">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-muted leading-relaxed">
              Empowering college students to trade knowledge freely. Skill for skill, code for code, concept for concept.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100/70 border border-peach-200 text-xs font-semibold text-burgundy-800">
              <ShieldCheck className="h-3.5 w-3.5 text-burgundy-600" />
              100% Free & Community-Driven
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-heading uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-muted">
              <li>
                <Link href="/explore" className="hover:text-burgundy-600 transition-colors">
                  Explore Tech Skills
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-burgundy-600 transition-colors">
                  Algorithmic Matcher
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-burgundy-600 transition-colors">
                  Campus Doubt Board
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-burgundy-600 transition-colors">
                  Student Bento Dashboard
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
                  The SkillBridge Manifesto
                </Link>
              </li>
              <li>
                <span className="text-slate-muted/80">Skill Points & Karma System</span>
              </li>
              <li>
                <span className="text-slate-muted/80">Peer Code of Conduct</span>
              </li>
              <li>
                <span className="text-slate-muted/80">Community Engagement Project (CEP)</span>
              </li>
            </ul>
          </div>

          {/* College Network */}
          <div>
            <h4 className="text-sm font-bold text-slate-heading uppercase tracking-wider mb-3">
              Active Campuses
            </h4>
            <p className="text-xs text-slate-muted mb-2">
              Connecting engineering minds across premier institutes:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">IIT Bombay</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">VJTI Mumbai</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">BITS Pilani</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">COEP Pune</span>
              <span className="px-2 py-1 rounded-md bg-cream-200 text-slate-heading font-medium">DTU Delhi</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-muted">
          <p>© {new Date().getFullYear()} SkillBridge CEP. Built by students, for students.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="h-3.5 w-3.5 text-burgundy-600 fill-burgundy-600" /> for Indian engineering peers.
          </p>
        </div>
      </div>
    </footer>
  );
}

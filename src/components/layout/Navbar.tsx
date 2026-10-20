"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Users, 
  HelpCircle, 
  Compass, 
  Menu, 
  X,
  HeartHandshake,
  LayoutDashboard,
  Coins,
  Shield,
  LogOut,
  ChevronDown,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/context/AuthContext";
import { INITIAL_MEMBERS } from "@/lib/data/mock-data";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { currentUser, loginAsMember, logout } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Community Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Explore Skills", href: "/explore", icon: Compass },
    { label: "My Matches", href: "/matches", icon: Users },
    { label: "Problem Board", href: "/community", icon: HelpCircle },
    { label: "About", href: "/about", icon: null },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-header transition-all">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy-600 text-white shadow-md shadow-burgundy-600/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="h-5 w-5 text-peach-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-slate-heading">
              Skill<span className="text-burgundy-600">Bridge</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-burgundy-700/80 -mt-1">
              Share • Learn • Repeat
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-cream-200/50 p-1.5 rounded-2xl border border-cream-300/60">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-burgundy-700 shadow-sm font-semibold"
                    : "text-slate-muted hover:text-burgundy-600 hover:bg-white/50"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: User Status or Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!mounted ? (
            <div className="h-9 w-32 rounded-2xl bg-cream-200/50 animate-pulse" />
          ) : currentUser ? (
            <div className="flex items-center gap-3">
              {/* Skill Points Pill */}
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 border border-peach-200 text-burgundy-800 text-xs font-bold hover:bg-peach-200 transition-colors">
                <Coins className="h-3.5 w-3.5 text-burgundy-600" />
                <span>{currentUser.skillPointsBalance} pts</span>
              </Link>

              {/* User Switcher / Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl border border-cream-300 bg-white hover:bg-cream-100 transition-all text-left"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="h-7 w-7 rounded-full object-cover border border-peach-300"
                  />
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs font-bold text-slate-heading leading-none">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-slate-muted leading-tight flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5 text-burgundy-600" />
                      {currentUser.neighborhood}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-muted" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#EDE7DE] p-2 shadow-card-hover z-50">
                    <div className="px-3 py-2 border-b border-cream-200">
                      <p className="text-xs font-semibold text-slate-heading">Active Community Persona</p>
                      <p className="text-xs text-slate-muted">{currentUser.occupationOrInterest}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 py-1 text-[10px] font-bold uppercase text-slate-muted tracking-wider">
                        Switch Community Persona (Demo)
                      </p>
                      {INITIAL_MEMBERS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            loginAsMember(m.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors text-left ${
                            currentUser.id === m.id
                              ? "bg-burgundy-50 text-burgundy-700 font-bold"
                              : "text-slate-body hover:bg-cream-100"
                          }`}
                        >
                          <img
                            src={m.avatarUrl}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div className="truncate flex-1">
                            <div className="flex items-center justify-between">
                              <span>{m.fullName} ({m.age})</span>
                              <span className="text-[10px] text-burgundy-700 font-medium">{m.neighborhood}</span>
                            </div>
                            <div className="text-[10px] text-slate-muted truncate">
                              Teaches: {m.teachingSkills[0]?.name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-cream-200 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-heading hover:bg-cream-100 rounded-xl"
                      >
                        My Community Profile & Badges
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-heading hover:bg-cream-100 rounded-xl"
                      >
                        <Shield className="h-3.5 w-3.5 text-burgundy-600" />
                        Admin Moderation
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-medium"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Sparkles className="h-4 w-4 text-peach-200" />
                  Join the Community
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-muted hover:text-burgundy-600 hover:bg-cream-200"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cream-300 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-heading hover:bg-cream-100"
              >
                {link.icon && <link.icon className="h-4 w-4 text-burgundy-600" />}
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-heading hover:bg-cream-100"
            >
              <Shield className="h-4 w-4 text-burgundy-600" />
              Admin Panel
            </Link>
          </div>
          <div className="pt-3 border-t border-cream-200 flex flex-col gap-2">
            {!mounted ? (
              <div className="h-12 w-full rounded-xl bg-cream-200/50 animate-pulse" />
            ) : currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-cream-100">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-heading">{currentUser.fullName}</div>
                    <div className="text-[10px] text-slate-muted">{currentUser.neighborhood}, {currentUser.city}</div>
                  </div>
                </div>
                <Badge variant="peach">{currentUser.skillPointsBalance} pts</Badge>
              </div>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-peach-200" />
                    Join the Community
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

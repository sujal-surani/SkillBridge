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
  LayoutDashboard,
  Coins,
  Shield,
  LogOut,
  ChevronDown,
  MapPin,
  User,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/context/AuthContext";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { currentUser, logout, isLoading, isAdmin } = useAuth();

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
          <BrandLogo />
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
          {/* Skeleton while hydrating or loading session */}
          {!mounted || (isLoading && !currentUser) ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 rounded-full bg-cream-200/70 animate-pulse" />
              <div className="h-9 w-32 rounded-2xl bg-cream-200/70 animate-pulse" />
            </div>
          ) : currentUser ? (
            <div className="flex items-center gap-3">
              {/* Skill Points Pill */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-peach-100 border border-peach-200 text-burgundy-800 text-xs font-bold hover:bg-peach-200 transition-colors shadow-xs"
              >
                <Coins className="h-3.5 w-3.5 text-burgundy-600" />
                <span>{currentUser.skillPointsBalance} pts</span>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl border border-cream-300 bg-white hover:bg-cream-100 transition-all text-left shadow-xs"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName || "Community Member"}
                    className="h-7 w-7 rounded-full object-cover border border-peach-300"
                  />
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs font-bold text-slate-heading leading-none">
                      {currentUser.fullName || "Community Member"}
                    </span>
                    <span className="text-[10px] text-slate-muted leading-tight flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5 text-burgundy-600" />
                      {currentUser.neighborhood || "Resident"}
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-muted transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#EDE7DE] p-2 shadow-card-hover z-50 animate-in fade-in-50 zoom-in-95">
                    {/* User Identity Header */}
                    <div className="px-3 py-2.5 border-b border-cream-200">
                      <p className="text-xs font-bold text-slate-heading truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-slate-muted truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded-md">
                        {currentUser.neighborhood}, {currentUser.city}
                      </span>
                    </div>

                    {/* Clean Navigation Links */}
                    <div className="py-1.5 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-heading hover:bg-cream-100 rounded-xl transition-colors font-medium"
                      >
                        <User className="h-3.5 w-3.5 text-burgundy-600" />
                        My Profile & Badges
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-heading hover:bg-cream-100 rounded-xl transition-colors font-medium"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-burgundy-600" />
                        Community Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-heading hover:bg-cream-100 rounded-xl transition-colors font-medium"
                      >
                        <Settings className="h-3.5 w-3.5 text-burgundy-600" />
                        Account Settings
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-heading hover:bg-cream-100 rounded-xl transition-colors font-medium"
                        >
                          <Shield className="h-3.5 w-3.5 text-burgundy-600" />
                          Admin Moderation
                        </Link>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="pt-1.5 border-t border-cream-200">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
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
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-heading hover:bg-cream-100"
              >
                <Shield className="h-4 w-4 text-burgundy-600" />
                Admin Panel
              </Link>
            )}
          </div>
          <div className="pt-3 border-t border-cream-200 flex flex-col gap-2">
            {!mounted || (isLoading && !currentUser) ? (
              <div className="h-12 w-full rounded-xl bg-cream-200/50 animate-pulse" />
            ) : currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-cream-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName || "Community Member"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-heading">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[10px] text-slate-muted">
                        {currentUser.neighborhood}, {currentUser.city}
                      </div>
                    </div>
                  </div>
                  <Badge variant="peach">{currentUser.skillPointsBalance} pts</Badge>
                </div>
                <div className="flex gap-2">
                  <Link href="/profile" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
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

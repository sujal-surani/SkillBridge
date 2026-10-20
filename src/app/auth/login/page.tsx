"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowRight, Lock, Mail, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/context/AuthContext";
import { INITIAL_MEMBERS } from "@/lib/data/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsMember } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const found = INITIAL_MEMBERS.find((m) => m.email.toLowerCase() === email.toLowerCase());
      if (found) {
        loginAsMember(found.id);
      } else {
        loginAsMember("member-1");
      }
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickLogin = (memberId: string) => {
    loginAsMember(memberId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-burgundy-600 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="h-5 w-5 text-peach-200" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-heading">Welcome Back to SkillBridge</h1>
          <p className="text-xs text-slate-muted">
            Log in to continue your community skill trades and message neighbors.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE7DE] shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  placeholder="e.g. ramesh.kulkarni@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
                <Mail className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-heading">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-burgundy-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
                <Lock className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full justify-center gap-2 mt-2"
            >
              {isLoading ? "Authenticating..." : "Sign In to Community Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-6 border-t border-cream-200">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-slate-muted">
              <Sparkles className="h-3.5 w-3.5 text-burgundy-600" />
              One-Click Persona Login (Demo)
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("member-1")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 hover:border-burgundy-300 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=96"
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-heading block">Pooja Sharma (34)</span>
                    <span className="text-[10px] text-slate-muted">Jaipur • Teaches Watercolor Painting & Drawing</span>
                  </div>
                </div>
                <Badge variant="peach">Login</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("member-2")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 hover:border-burgundy-300 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=96"
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-heading block">Kavita Nair (39)</span>
                    <span className="text-[10px] text-slate-muted">Kochi • Teaches Hatha Yoga & Posture</span>
                  </div>
                </div>
                <Badge variant="peach">Login</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("member-3")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 hover:border-burgundy-300 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=96"
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-heading block">Ramesh Kulkarni (45)</span>
                    <span className="text-[10px] text-slate-muted">Pune • Teaches Organic Terrace Gardening</span>
                  </div>
                </div>
                <Badge variant="peach">Login</Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-muted">
          New to the neighborhood?{" "}
          <Link href="/auth/signup" className="font-bold text-burgundy-600 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
}

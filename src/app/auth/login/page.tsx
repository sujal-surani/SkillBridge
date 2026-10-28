"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const ok = await login(email, password);
      if (ok) {
        router.push("/dashboard");
      } else {
        setErrorMsg("Invalid credentials or account not found. Please check your email or click Register below.");
      }
    } finally {
      setIsLoading(false);
    }
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
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
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

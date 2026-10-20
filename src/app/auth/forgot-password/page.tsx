"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-burgundy-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="h-5 w-5 text-peach-200" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-heading">Reset Your Password</h1>
          <p className="text-xs text-slate-muted">
            Enter your college email address and we will send you a secure verification link.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE7DE] shadow-card">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-heading">Reset Link Sent</h3>
              <p className="text-xs text-slate-muted">
                If an account exists for <span className="font-semibold text-slate-heading">{email}</span>, a password reset link has been dispatched to your inbox.
              </p>
              <Link href="/auth/login">
                <Button variant="secondary" className="w-full justify-center mt-4">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  College Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    required
                    placeholder="e.g. aarav.sharma@cse.iitb.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                  <Mail className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <Button type="submit" className="w-full justify-center mt-2">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-muted hover:text-burgundy-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

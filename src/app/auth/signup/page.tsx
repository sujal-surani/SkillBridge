"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, Mail, User, Building, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { loginAsStudent } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState("IIT Bombay");
  const [major, setMajor] = useState("Computer Science");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginAsStudent("student-1");
      setIsLoading(false);
      // Route straight to onboarding wizard
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-burgundy-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="h-5 w-5 text-peach-200" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-heading">Create Your SkillBridge Profile</h1>
          <p className="text-xs text-slate-muted">
            Join hundreds of Indian engineering students swapping tech skills for free.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE7DE] shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  placeholder="e.g. Rohan Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9"
                />
                <User className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                College / University Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  placeholder="e.g. rohan.verma@pilani.bits-pilani.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
                <Mail className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  Institution
                </label>
                <select
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#EDE7DE] bg-white px-3 py-2 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                >
                  <option value="IIT Bombay">IIT Bombay</option>
                  <option value="VJTI Mumbai">VJTI Mumbai</option>
                  <option value="BITS Pilani">BITS Pilani</option>
                  <option value="COEP Pune">COEP Pune</option>
                  <option value="DTU Delhi">DTU Delhi</option>
                  <option value="NIT Trichy">NIT Trichy</option>
                  <option value="RVCE Bengaluru">RVCE Bengaluru</option>
                  <option value="Other Premier College">Other Engineering College</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  Engineering Branch
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="pl-9 text-xs"
                  />
                  <BookOpen className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
                <Lock className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-peach-50 border border-peach-200 text-[11px] text-burgundy-800 leading-relaxed">
              ⭐ <strong>Welcome Bonus:</strong> You will immediately receive <strong>50 Skill Points</strong> upon setting up your profile to initiate your first exchange.
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full justify-center gap-2 mt-2"
            >
              {isLoading ? "Creating Profile..." : "Continue to Skill Setup (Step 1 of 4)"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-muted">
          Already registered?{" "}
          <Link href="/auth/login" className="font-bold text-burgundy-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

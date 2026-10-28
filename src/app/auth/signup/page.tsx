"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowRight, Lock, Mail, User, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("28");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [neighborhood, setNeighborhood] = useState("Koregaon Park");
  const [city, setCity] = useState("Pune, MH");
  const [occupation, setOccupation] = useState("Gardening & Organic Food Enthusiast");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          age,
          email,
          password,
          neighborhood,
          city,
          occupation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Authenticate newly created user via NextAuth
      const loginOk = await login(email, password);
      if (loginOk) {
        router.push("/onboarding");
      } else {
        // Fallback redirect to onboarding even if credentials session initializes on mount
        router.push("/onboarding");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-burgundy-600 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="h-5 w-5 text-peach-200" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-heading">Join the SkillBridge Community</h1>
          <p className="text-xs text-slate-muted">
            Share what you know, learn what you love. Open to all ages and backgrounds.
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 text-xs"
                  />
                  <User className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  Age
                </label>
                <Input
                  type="number"
                  min="13"
                  max="100"
                  required
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

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
                  className="pl-9 text-xs"
                />
                <Mail className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  Neighborhood / Locality
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Koregaon Park / Indiranagar"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="pl-9 text-xs"
                  />
                  <MapPin className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#EDE7DE] bg-white px-3 py-2 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                >
                  <option value="Pune, MH">Pune, MH</option>
                  <option value="Bengaluru, KA">Bengaluru, KA</option>
                  <option value="Mumbai, MH">Mumbai, MH</option>
                  <option value="Hyderabad, TS">Hyderabad, TS</option>
                  <option value="New Delhi, DL">New Delhi, DL</option>
                  <option value="Kolkata, WB">Kolkata, WB</option>
                  <option value="Chennai, TN">Chennai, TN</option>
                  <option value="Other City">Other Town / City</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-heading mb-1.5">
                Primary Interest or Occupation
              </label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  placeholder="e.g. Artist & Painter, Yoga Teacher, Home Baker, Gardener, Writer"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="pl-9 text-xs"
                />
                <Briefcase className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
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
                  className="pl-9 text-xs"
                />
                <Lock className="h-4 w-4 text-slate-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-peach-50 border border-peach-200 text-[11px] text-burgundy-800 leading-relaxed">
              ⭐ <strong>Community Bonus:</strong> You receive <strong>50 Community Skill Points</strong> upon profile completion to request your first session.
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

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  Sparkles,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const [name, setName] = useState(currentUser?.fullName || "Aarav Sharma");
  const [city, setCity] = useState(currentUser?.city || "Mumbai, MH");
  const [allowPublicSearch, setAllowPublicSearch] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-heading">Settings & Preferences</h1>
        <p className="text-xs text-slate-muted mt-1">Manage your student account, privacy controls, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Nav Pills */}
        <div className="space-y-1">
          <button className="w-full text-left p-3 rounded-2xl bg-white border border-[#EDE7DE] font-bold text-xs text-burgundy-700 shadow-xs flex items-center gap-2">
            <User className="h-4 w-4" /> Account Details
          </button>
          <button className="w-full text-left p-3 rounded-2xl bg-cream-100 hover:bg-white text-slate-muted font-medium text-xs flex items-center gap-2 transition-colors">
            <Shield className="h-4 w-4" /> Privacy & Visibility
          </button>
          <button className="w-full text-left p-3 rounded-2xl bg-cream-100 hover:bg-white text-slate-muted font-medium text-xs flex items-center gap-2 transition-colors">
            <Bell className="h-4 w-4" /> Notifications
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-2 transition-colors mt-4"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Right Form Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Student Profile Information</CardTitle>
              <CardDescription>Update your campus representation</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">Campus City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} className="text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">College Email</label>
                  <Input disabled value={currentUser?.email || "aarav.sharma@cse.iitb.ac.in"} className="text-xs bg-cream-100 cursor-not-allowed" />
                  <p className="text-[10px] text-slate-muted mt-1">Collegiate email cannot be changed once verified.</p>
                </div>

                {/* Privacy Toggles */}
                <div className="pt-4 border-t border-cream-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-heading">Privacy & Discoverability</h4>
                  <label className="flex items-center gap-2 text-xs text-slate-heading cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPublicSearch}
                      onChange={(e) => setAllowPublicSearch(e.target.checked)}
                      className="rounded text-burgundy-600"
                    />
                    <span>Show my profile in the Explore Mentors directory</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-heading cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="rounded text-burgundy-600"
                    />
                    <span>Email me when a peer proposes a skill swap</span>
                  </label>
                </div>

                {savedSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Preferences successfully saved!
                  </div>
                )}

                <Button type="submit" variant="primary" size="sm" className="gap-1.5 mt-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Code, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Sprout,
  HeartPulse,
  Palette,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

interface TeachingSkillItem {
  name: string;
  pillar: "TECH_PROFESSIONAL" | "HEALTH_WELLNESS" | "CREATIVE_PRACTICAL" | "ACADEMIC_LANGUAGES";
  category: string;
  proficiency: "BEGINNER" | "INTERMEDIATE" | "EXPERIENCED";
  yearsExperience: number;
}

interface LearningSkillItem {
  name: string;
  pillar: "TECH_PROFESSIONAL" | "HEALTH_WELLNESS" | "CREATIVE_PRACTICAL" | "ACADEMIC_LANGUAGES";
  category: string;
  targetProficiency: "BEGINNER" | "INTERMEDIATE" | "EXPERIENCED";
}

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, updateUserSkills, refreshUser } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1: Teaching Skills
  const [teachingSkills, setTeachingSkills] = useState<TeachingSkillItem[]>(
    currentUser?.teachingSkills || []
  );
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newTeachPillar, setNewTeachPillar] = useState<TeachingSkillItem["pillar"]>("CREATIVE_PRACTICAL");
  const [newTeachCategory, setNewTeachCategory] = useState("Drawing & Fine Arts");
  const [newTeachLevel, setNewTeachLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "EXPERIENCED">("EXPERIENCED");

  // Step 2: Learning Skills
  const [learningSkills, setLearningSkills] = useState<LearningSkillItem[]>(
    currentUser?.learningSkills || []
  );
  const [newLearnSkill, setNewLearnSkill] = useState("");
  const [newLearnPillar, setNewLearnPillar] = useState<LearningSkillItem["pillar"]>("HEALTH_WELLNESS");
  const [newLearnCategory, setNewLearnCategory] = useState("Health & Fitness");
  const [newLearnLevel, setNewLearnLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "EXPERIENCED">("BEGINNER");

  // Step 3: Availability & Mode
  const [mode, setMode] = useState<"ONLINE" | "HYBRID" | "IN_PERSON">("HYBRID");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Saturday", "Sunday", "Wednesday"]);

  // Step 4: Languages & Bio
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Hindi", "Marathi"]);
  const [bio, setBio] = useState(
    currentUser?.bio || "Passionate about sharing my skills and learning practical crafts from neighbors!"
  );

  // Sync with currentUser once loaded from database
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.teachingSkills && currentUser.teachingSkills.length > 0) {
        setTeachingSkills(currentUser.teachingSkills);
      }
      if (currentUser.learningSkills && currentUser.learningSkills.length > 0) {
        setLearningSkills(currentUser.learningSkills);
      }
      if (currentUser.bio) {
        setBio(currentUser.bio);
      }
      if (currentUser.modePreference) {
        setMode(currentUser.modePreference);
      }
    }
  }, [currentUser]);

  const addTeachingSkill = () => {
    if (!newTeachSkill.trim()) return;
    setTeachingSkills((prev) => [
      ...prev,
      {
        name: newTeachSkill.trim(),
        pillar: newTeachPillar,
        category: newTeachCategory,
        proficiency: newTeachLevel,
        yearsExperience: 2,
      },
    ]);
    setNewTeachSkill("");
  };

  const removeTeachingSkill = (idx: number) => {
    setTeachingSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const addLearningSkill = () => {
    if (!newLearnSkill.trim()) return;
    setLearningSkills((prev) => [
      ...prev,
      {
        name: newLearnSkill.trim(),
        pillar: newLearnPillar,
        category: newLearnCategory,
        targetProficiency: newLearnLevel,
      },
    ]);
    setNewLearnSkill("");
  };

  const removeLearningSkill = (idx: number) => {
    setLearningSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Safe navigation that automatically commits typed skills
  const handleNextStep = () => {
    if (step === 1 && newTeachSkill.trim()) {
      addTeachingSkill();
    } else if (step === 2 && newLearnSkill.trim()) {
      addLearningSkill();
    }
    setStep(step + 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Auto-commit any pending learning skill entered in step 2
      let finalLearningSkills = [...learningSkills];
      if (newLearnSkill.trim()) {
        finalLearningSkills.push({
          name: newLearnSkill.trim(),
          pillar: newLearnPillar,
          category: newLearnCategory,
          targetProficiency: newLearnLevel,
        });
      }

      let finalTeachingSkills = [...teachingSkills];
      if (newTeachSkill.trim()) {
        finalTeachingSkills.push({
          name: newTeachSkill.trim(),
          pillar: newTeachPillar,
          category: newTeachCategory,
          proficiency: newTeachLevel,
          yearsExperience: 2,
        });
      }

      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          email: currentUser?.email,
          bio,
          modePreference: mode,
          availability: selectedDays.map((day) => ({
            day,
            timeSlots: ["10:00 - 13:00", "16:00 - 19:00"],
          })),
          spokenLanguages: selectedLanguages,
          teachingSkills: finalTeachingSkills,
          learningSkills: finalLearningSkills,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      // Explicitly update React context skills immediately
      updateUserSkills(finalTeachingSkills, finalLearningSkills);
      // And refresh profile from database
      await refreshUser();

      // Invalidate Next.js client router cache and navigate
      router.refresh();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Failed to persist onboarding profile:", err);
      alert("Error saving profile: " + (err.message || "Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Progress Bar & Header */}
      <div className="mb-8 text-center">
        <Badge variant="burgundy" className="mb-2">
          Step {step} of 4: Community Profile Calibration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-heading">
          {step === 1 && "What Can You Teach or Share?"}
          {step === 2 && "What Do You Want to Learn?"}
          {step === 3 && "Availability & Exchange Mode"}
          {step === 4 && "Spoken Languages & Introduction"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-muted">
          {step === 1 && "Share your crafts, hobbies, wellness habits, or professional skills."}
          {step === 2 && "Pick what you want to discover through 1-on-1 swaps with neighbors."}
          {step === 3 && "Choose whether you prefer virtual video or local neighborhood meetups."}
          {step === 4 && "Finalize your profile and claim your 50 Community Skill Points."}
        </p>

        {/* 4-Step Progress Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 max-w-xs mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? "bg-burgundy-600" : "bg-cream-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Content per Step */}
      <Card className="p-6 sm:p-8">
        {/* STEP 1: Teaching Skills */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block">
                Active Skills You Can Share ({teachingSkills.length})
              </label>

              {teachingSkills.length === 0 && (
                <div className="py-4 px-3 rounded-2xl bg-cream-100 border border-dashed border-cream-300 text-center text-xs text-slate-muted">
                  No skills added yet. Use the form below to add a skill you can share with neighbors!
                </div>
              )}

              {teachingSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-100 border border-cream-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-burgundy-100 text-burgundy-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-heading">{sk.name}</p>
                      <p className="text-xs text-slate-muted">{sk.category} • {sk.proficiency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTeachingSkill(idx)}
                    className="p-1.5 text-slate-muted hover:text-red-600 rounded-lg hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Skill Form */}
            <div className="p-4 rounded-2xl border border-dashed border-burgundy-300 bg-burgundy-50/30 space-y-3">
              <span className="text-xs font-bold text-burgundy-800 block">
                + Add A Skill You Can Teach
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="e.g. Yoga, Sourdough Baking, Excel, Guitar"
                  value={newTeachSkill}
                  onChange={(e) => setNewTeachSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTeachingSkill();
                    }
                  }}
                  className="sm:col-span-1 text-xs"
                />
                <select
                  value={newTeachPillar}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNewTeachPillar(val);
                    if (val === "TECH_PROFESSIONAL") setNewTeachCategory("Productivity & Tech");
                    if (val === "HEALTH_WELLNESS") setNewTeachCategory("Fitness & Mindfulness");
                    if (val === "CREATIVE_PRACTICAL") setNewTeachCategory("Culinary, Craft & Garden");
                    if (val === "ACADEMIC_LANGUAGES") setNewTeachCategory("Languages & Communication");
                  }}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="CREATIVE_PRACTICAL">Pillar: Creative & Practical</option>
                  <option value="HEALTH_WELLNESS">Pillar: Health & Wellness</option>
                  <option value="TECH_PROFESSIONAL">Pillar: Tech & Professional</option>
                  <option value="ACADEMIC_LANGUAGES">Pillar: Academic & Languages</option>
                </select>
                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value as any)}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="BEGINNER">Proficiency: Beginner</option>
                  <option value="INTERMEDIATE">Proficiency: Intermediate</option>
                  <option value="EXPERIENCED">Proficiency: Experienced</option>
                </select>
              </div>
              <Button
                type="button"
                variant="peach"
                size="sm"
                onClick={addTeachingSkill}
                className="w-full justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Skill to My Profile
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Learning Skills */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block">
                Skills You Want to Learn ({learningSkills.length})
              </label>

              {learningSkills.length === 0 && (
                <div className="py-4 px-3 rounded-2xl bg-emerald-50/40 border border-dashed border-emerald-200 text-center text-xs text-slate-muted">
                  No learning goals added yet. Use the form below to add skills you want to learn!
                </div>
              )}

              {learningSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-heading">{sk.name}</p>
                      <p className="text-xs text-slate-muted">{sk.category} • Target: {sk.targetProficiency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeLearningSkill(idx)}
                    className="p-1.5 text-slate-muted hover:text-red-600 rounded-lg hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Learning Skill */}
            <div className="p-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 space-y-3">
              <span className="text-xs font-bold text-emerald-800 block">
                + Add What You Wish to Learn
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="e.g. Spanish, First Aid, Gardening, Python"
                  value={newLearnSkill}
                  onChange={(e) => setNewLearnSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLearningSkill();
                    }
                  }}
                  className="sm:col-span-1 text-xs"
                />
                <select
                  value={newLearnPillar}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNewLearnPillar(val);
                    if (val === "TECH_PROFESSIONAL") setNewLearnCategory("Productivity & Tech");
                    if (val === "HEALTH_WELLNESS") setNewLearnCategory("Fitness & Mindfulness");
                    if (val === "CREATIVE_PRACTICAL") setNewLearnCategory("Culinary, Craft & Garden");
                    if (val === "ACADEMIC_LANGUAGES") setNewLearnCategory("Languages & Communication");
                  }}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="TECH_PROFESSIONAL">Pillar: Tech & Professional</option>
                  <option value="HEALTH_WELLNESS">Pillar: Health & Wellness</option>
                  <option value="CREATIVE_PRACTICAL">Pillar: Creative & Practical</option>
                  <option value="ACADEMIC_LANGUAGES">Pillar: Academic & Languages</option>
                </select>
                <select
                  value={newLearnLevel}
                  onChange={(e) => setNewLearnLevel(e.target.value as any)}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="BEGINNER">Target: Beginner</option>
                  <option value="INTERMEDIATE">Target: Intermediate</option>
                  <option value="EXPERIENCED">Target: Experienced</option>
                </select>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addLearningSkill}
                className="w-full justify-center gap-1.5 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4" />
                Add to Learning Wishlist
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Mode & Availability */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block mb-2">
                Preferred Exchange Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "IN_PERSON", title: "In-Person", desc: "Local Neighborhood / Parks / Cafes" },
                  { id: "HYBRID", title: "Hybrid", desc: "Online or In-Person as mutually agreed" },
                  { id: "ONLINE", title: "Online", desc: "Virtual Room Video & Audio" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      mode === m.id
                        ? "border-burgundy-600 bg-burgundy-50/50 shadow-xs"
                        : "border-cream-300 bg-white hover:bg-cream-100"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-heading">{m.title}</div>
                    <div className="text-[11px] text-slate-muted">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block mb-2">
                Days Available for Skill Swapping
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-burgundy-600 text-white border-burgundy-600 shadow-xs"
                          : "bg-white text-slate-heading border-[#EDE7DE] hover:bg-cream-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Spoken Languages & Bio */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block mb-2">
                Spoken Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "English",
                  "Hindi",
                  "Marathi",
                  "Gujarati",
                  "Tamil",
                  "Telugu",
                  "Bengali",
                  "Spanish",
                  "French",
                  "German",
                ].map((l) => {
                  const isSelected = selectedLanguages.includes(l);
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleLanguage(l)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-peach-300 text-burgundy-800 border-peach-400 font-bold"
                          : "bg-white text-slate-heading border-[#EDE7DE] hover:bg-cream-100"
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block mb-1.5">
                Neighborhood Introduction Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a little about yourself, your hobbies, and what kind of exchanges excite you..."
                className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs sm:text-sm text-slate-heading focus:border-burgundy-600 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-800">Ready to activate your profile?</p>
                <p className="text-[11px] text-emerald-700">50 Community Skill Points will be deposited to your wallet.</p>
              </div>
              <Badge variant="success">+50 Points</Badge>
            </div>
          </div>
        )}

        {/* Nav Controls */}
        <div className="mt-8 pt-6 border-t border-cream-200 flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(step - 1)}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNextStep}
              className="gap-1.5"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="gap-2 bg-burgundy-600"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-peach-200" />
                  Finish Setup & Open Community Dashboard
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

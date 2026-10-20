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
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

interface TeachingSkillItem {
  name: string;
  category: string;
  proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  yearsExperience: number;
}

interface LearningSkillItem {
  name: string;
  category: string;
  targetProficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, updateUserSkills } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1: Teaching Skills
  const [teachingSkills, setTeachingSkills] = useState<TeachingSkillItem[]>([
    { name: "Next.js & React", category: "Web Dev", proficiency: "ADVANCED", yearsExperience: 2 },
  ]);
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newTeachCategory, setNewTeachCategory] = useState("Web Dev");
  const [newTeachLevel, setNewTeachLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("INTERMEDIATE");

  // Step 2: Learning Skills
  const [learningSkills, setLearningSkills] = useState<LearningSkillItem[]>([
    { name: "C++ Data Structures & Algorithms", category: "DSA", targetProficiency: "ADVANCED" },
  ]);
  const [newLearnSkill, setNewLearnSkill] = useState("");
  const [newLearnCategory, setNewLearnCategory] = useState("DSA");
  const [newLearnLevel, setNewLearnLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("ADVANCED");

  // Step 3: Availability & Mode
  const [mode, setMode] = useState<"ONLINE" | "HYBRID" | "OFFLINE">("HYBRID");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Tuesday", "Thursday", "Saturday"]);

  // Step 4: Languages & Bio
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Hindi"]);
  const [bio, setBio] = useState(
    currentUser?.bio || "Excited to share my knowledge and collaborate on cool engineering projects!"
  );

  const addTeachingSkill = () => {
    if (!newTeachSkill.trim()) return;
    setTeachingSkills([
      ...teachingSkills,
      {
        name: newTeachSkill.trim(),
        category: newTeachCategory,
        proficiency: newTeachLevel,
        yearsExperience: 1,
      },
    ]);
    setNewTeachSkill("");
  };

  const removeTeachingSkill = (idx: number) => {
    setTeachingSkills(teachingSkills.filter((_, i) => i !== idx));
  };

  const addLearningSkill = () => {
    if (!newLearnSkill.trim()) return;
    setLearningSkills([
      ...learningSkills,
      {
        name: newLearnSkill.trim(),
        category: newLearnCategory,
        targetProficiency: newLearnLevel,
      },
    ]);
    setNewLearnSkill("");
  };

  const removeLearningSkill = (idx: number) => {
    setLearningSkills(learningSkills.filter((_, i) => i !== idx));
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

  const handleFinish = () => {
    updateUserSkills(teachingSkills, learningSkills);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Progress Bar & Header */}
      <div className="mb-8 text-center">
        <Badge variant="burgundy" className="mb-2">
          Step {step} of 4: Profile Calibration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-heading">
          {step === 1 && "What Skills Can You Teach?"}
          {step === 2 && "What Do You Want to Learn?"}
          {step === 3 && "Availability & Learning Mode"}
          {step === 4 && "Languages & Peer Introduction"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-muted">
          {step === 1 && "List the technologies, concepts, or tools you feel confident mentoring peers in."}
          {step === 2 && "Pick the topics you want to conquer this semester through 1-on-1 exchanges."}
          {step === 3 && "Help our matching algorithm propose compatible meeting slots."}
          {step === 4 && "Finalize your profile details and claim your 50 Welcome Skill Points."}
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
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block">
                Active Skills You Can Teach ({teachingSkills.length})
              </label>

              {teachingSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-cream-100 border border-cream-200"
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
                + Add Another Teaching Skill
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="e.g. Docker, Python, Figma"
                  value={newTeachSkill}
                  onChange={(e) => setNewTeachSkill(e.target.value)}
                  className="sm:col-span-1 text-xs"
                />
                <select
                  value={newTeachCategory}
                  onChange={(e) => setNewTeachCategory(e.target.value)}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="Web Dev">Web Dev</option>
                  <option value="DSA">DSA / Algorithms</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Design">UI/UX & Design</option>
                  <option value="Core Eng">Core Eng / Systems</option>
                  <option value="DevOps">DevOps / Cloud</option>
                </select>
                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value as any)}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="BEGINNER">Proficiency: Beginner</option>
                  <option value="INTERMEDIATE">Proficiency: Intermediate</option>
                  <option value="ADVANCED">Proficiency: Advanced</option>
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
                Add Skill to Portfolio
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block">
                Skills You Want to Master ({learningSkills.length})
              </label>

              {learningSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200"
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
                + Add Target Learning Topic
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="e.g. Graph Algorithms, Three.js"
                  value={newLearnSkill}
                  onChange={(e) => setNewLearnSkill(e.target.value)}
                  className="sm:col-span-1 text-xs"
                />
                <select
                  value={newLearnCategory}
                  onChange={(e) => setNewLearnCategory(e.target.value)}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="DSA">DSA / Algorithms</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Design">UI/UX & Design</option>
                  <option value="Core Eng">Core Eng / Systems</option>
                </select>
                <select
                  value={newLearnLevel}
                  onChange={(e) => setNewLearnLevel(e.target.value as any)}
                  className="h-11 rounded-xl border border-[#EDE7DE] bg-white px-3 text-xs text-slate-heading"
                >
                  <option value="BEGINNER">Target: Beginner</option>
                  <option value="INTERMEDIATE">Target: Intermediate</option>
                  <option value="ADVANCED">Target: Advanced</option>
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
                Add to Learning Goals
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block mb-2">
                Preferred Learning Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "ONLINE", title: "Online", desc: "Virtual Room & Video" },
                  { id: "HYBRID", title: "Hybrid", desc: "Online or In-Person" },
                  { id: "OFFLINE", title: "On-Campus", desc: "Library / College Canteen" },
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
                Your Free Days for 1:1 Sessions
              </label>
              <div className="flex flex-wrap gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => {
                  const isSelected = selectedDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-burgundy-600 text-white shadow-xs"
                          : "bg-cream-200 text-slate-heading hover:bg-cream-300"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-muted mt-2">
                You can specify specific hour blocks later in individual exchange requests.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-heading block mb-2">
                Spoken Languages (For smooth communication)
              </label>
              <div className="flex flex-wrap gap-2">
                {["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Bengali"].map((l) => {
                  const isSelected = selectedLanguages.includes(l);
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleLanguage(l)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-peach-200 text-burgundy-800 font-bold border border-peach-300"
                          : "bg-white border border-cream-300 text-slate-muted hover:bg-cream-100"
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
                Peer Bio & What Excites You
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your engineering interests and what you're currently building..."
                className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs sm:text-sm text-slate-heading focus:border-burgundy-600 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-800">Ready to activate your profile?</p>
                <p className="text-[11px] text-emerald-700">50 Free Welcome Skill Points will be deposited immediately.</p>
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
              onClick={() => setStep(step + 1)}
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
              className="gap-2 bg-burgundy-600"
            >
              <Sparkles className="h-4 w-4 text-peach-200" />
              Finish Setup & Launch Dashboard
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

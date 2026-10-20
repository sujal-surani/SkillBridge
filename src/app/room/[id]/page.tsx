"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share2, 
  PhoneOff, 
  Clock, 
  MessageSquare, 
  Edit3, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Send,
  Coins,
  ShieldCheck,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

export default function LearningRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, addSkillPoints } = useAuth();
  const roomId = params?.id || "SB-482";

  // Media Controls State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Timer: 60:00 countdown
  const [secondsLeft, setSecondsLeft] = useState(58 * 60 + 24); // 58:24 remaining
  const [timerRunning, setTimerRunning] = useState(true);

  // Collaborative Notes
  const [notes, setNotes] = useState(
    `# SkillBridge Session Notes: C++ DP & Next.js\n\n**Mentors:** Aarav Sharma & Priya Patel\n\n### Key Concepts Covered:\n1. Recursive State Definition:\n   - dp(i, j) = number of unique paths from (i, j) to (m-1, n-1)\n2. Base Case:\n   - When i == m-1 and j == n-1 -> return 1\n3. Next.js Server Action Tip:\n   - Always validate payload on server using zod!\n   - Use revalidatePath("/dashboard") to refresh UI cache.`
  );

  // In-room chat
  const [roomChat, setRoomChat] = useState([
    { sender: "Priya Patel", text: "Audio and video are crystal clear!", time: "5:01 PM" },
    { sender: "Aarav Sharma", text: "Great! Let's start with the grid recurrence relation.", time: "5:02 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Post-Session Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Clear Explanations",
    "Patient Mentor",
    "Great Code Examples",
  ]);
  const [reviewText, setReviewText] = useState(
    "Priya was exceptional! She demystified Dynamic Programming grid tabulation in 30 minutes with visual sketches."
  );
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendRoomChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setRoomChat([
      ...roomChat,
      {
        sender: currentUser?.fullName || "Aarav Sharma",
        text: chatInput.trim(),
        time: "Just now",
      },
    ]);
    setChatInput("");
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleEndSession = () => {
    setTimerRunning(false);
    setFeedbackModalOpen(true);
  };

  const handleCompleteReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    addSkillPoints(25); // Award +25 points
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      {/* Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle">
        <div className="flex items-center gap-3">
          <Badge variant="match">Room #{roomId}</Badge>
          <div>
            <h1 className="text-sm font-bold text-slate-heading">
              1-on-1 Peer Session: C++ Dynamic Programming ⇄ Next.js App Router
            </h1>
            <p className="text-xs text-slate-muted">
              Aarav Sharma (IIT Bombay) & Priya Patel (VJTI Mumbai)
            </p>
          </div>
        </div>

        {/* Live Timer Pill & End Session */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 border border-cream-200 text-xs font-mono font-bold text-burgundy-700">
            <Clock className="h-4 w-4 text-burgundy-600 animate-pulse" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleEndSession}
            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 gap-1.5"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            End & Review Session
          </Button>
        </div>
      </div>

      {/* Main Grid: Video Streams & Collaborative Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Video Feeds & Media Bar */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Simulated Video Feeds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Peer Video Card (Priya) */}
            <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden shadow-card border border-slate-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                alt="Priya Patel"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Priya Patel (VJTI)
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[10px]">
                Host • Screen Active
              </div>
            </div>

            {/* Self Video Card (Aarav) */}
            <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden shadow-card border border-slate-800 flex items-center justify-center">
              {camOn ? (
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800"
                  alt="Aarav Sharma"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <VideoOff className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Camera is turned off</p>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${micOn ? "bg-emerald-400" : "bg-red-500"}`} />
                You ({currentUser?.fullName.split(" ")[0]})
              </div>
            </div>
          </div>

          {/* Media Control Bar */}
          <div className="p-3 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle flex items-center justify-center gap-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-xl transition-all ${
                micOn ? "bg-cream-200 text-slate-heading hover:bg-cream-300" : "bg-red-100 text-red-600"
              }`}
              title={micOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setCamOn(!camOn)}
              className={`p-3 rounded-xl transition-all ${
                camOn ? "bg-cream-200 text-slate-heading hover:bg-cream-300" : "bg-red-100 text-red-600"
              }`}
              title={camOn ? "Stop Camera" : "Start Camera"}
            >
              {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-3 rounded-xl transition-all ${
                screenSharing ? "bg-burgundy-600 text-white" : "bg-cream-200 text-slate-heading hover:bg-cream-300"
              }`}
              title="Share Screen"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Collaborative Notes Area */}
          <div className="p-5 rounded-3xl bg-white border border-[#EDE7DE] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-burgundy-600" />
                <h3 className="text-xs font-bold text-slate-heading uppercase tracking-wider">
                  Shared Session Scratchpad (Markdown)
                </h3>
              </div>
              <Badge variant="success">Auto-Saving</Badge>
            </div>
            <textarea
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full font-mono text-xs text-slate-heading p-3 rounded-xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-burgundy-600 leading-relaxed"
            />
          </div>
        </div>

        {/* Right 1 Column: In-Room Live Chat */}
        <div className="flex flex-col h-[700px] rounded-3xl bg-white border border-[#EDE7DE] shadow-card overflow-hidden">
          <div className="p-4 border-b border-cream-200 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-burgundy-600" />
            <h3 className="text-xs font-bold text-slate-heading uppercase tracking-wider">
              In-Room Live Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {roomChat.map((msg, i) => (
              <div key={i} className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-heading">{msg.sender}</span>
                  <span className="text-[10px] text-slate-muted">{msg.time}</span>
                </div>
                <p className="p-2.5 rounded-xl bg-cream-100 border border-cream-200 text-slate-body">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendRoomChat} className="p-3 border-t border-cream-200 flex gap-2">
            <Input
              type="text"
              placeholder="Ask a doubt or share a link..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="h-9 text-xs"
            />
            <Button type="submit" size="sm" variant="primary" className="h-9 px-3">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Post-Session Feedback & Points Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#EDE7DE] space-y-5 animate-scale-up">
            <div className="text-center space-y-1">
              <Badge variant="peach" className="mb-1">Session Completed</Badge>
              <h2 className="text-xl font-bold text-slate-heading">
                Rate & Review Your Exchange with Priya
              </h2>
              <p className="text-xs text-slate-muted">
                Your feedback calibrates our matching algorithm and awards points.
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-slate-heading">Review Submitted!</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-burgundy-800 text-xs font-bold border border-peach-200">
                  <Coins className="h-4 w-4 text-burgundy-600" />
                  +25 Skill Points Credited to Your Account
                </div>
                <p className="text-xs text-slate-muted">Returning to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleCompleteReview} className="space-y-4">
                {/* 5-Star Rating */}
                <div className="text-center">
                  <label className="text-xs font-semibold text-slate-heading block mb-2">
                    How was the clarity and learning experience?
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Peer Compliment Tags */}
                <div>
                  <label className="text-xs font-semibold text-slate-heading block mb-2">
                    Select Peer Badges to Award:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Clear Explanations",
                      "Patient Mentor",
                      "Great Code Examples",
                      "Strong Conceptual Depth",
                      "Punctual & Prepared",
                    ].map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-burgundy-600 text-white font-semibold shadow-xs"
                              : "bg-cream-100 text-slate-muted border border-cream-200 hover:bg-cream-200"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Written Review */}
                <div>
                  <label className="text-xs font-semibold text-slate-heading block mb-1">
                    Written Feedback (Visible on Priya&apos;s Profile):
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                  />
                </div>

                {/* Reward Banner */}
                <div className="p-3 rounded-2xl bg-peach-50 border border-peach-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-burgundy-800 font-bold">
                    <Sparkles className="h-4 w-4 text-burgundy-600" />
                    <span>Reward for session completion:</span>
                  </div>
                  <Badge variant="peach">+25 Skill Points</Badge>
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center gap-2">
                  Submit Review & Claim Points
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

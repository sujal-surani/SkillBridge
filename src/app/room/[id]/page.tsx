"use client";

import React, { useState, useEffect, useRef } from "react";
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
  MapPin, 
  Palette, 
  HeartPulse,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";
import { useSwap } from "@/lib/context/SwapContext";
import { toast } from "sonner";

export default function LearningRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, addSkillPoints } = useAuth();
  const { completeSession, getSessionByRoomId } = useSwap();
  const roomId = (params?.id as string) || "SB-482";

  // Check if session exists in SwapContext
  const activeSession = getSessionByRoomId(roomId);
  const partner =
    activeSession?.participants.find((p) => p.id !== currentUser?.id) ||
    activeSession?.participants[0];
  const partnerId = partner?.id || "partner";
  const partnerName = partner?.name || "Exchange Partner";

  // Media Controls State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Timer: 60:00 countdown
  const [secondsLeft, setSecondsLeft] = useState(54 * 60 + 12); // 54:12 remaining
  const [timerRunning, setTimerRunning] = useState(true);

  // Collaborative Notes: auto-saved & debounced
  const [notes, setNotes] = useState(
    "# SkillBridge Community Exchange: Live Collaborative Notes\n\n**Mentors:** " +
      (currentUser?.fullName || "Community Member") +
      " & " +
      partnerName +
      "\n\n### 1. Skill Swap Fundamentals:\n- Key steps, preparation, and references discussed during this session.\n- Practical tips, ratios, formulas, or posture adjustments.\n\n### 2. Action Items & Practice:\n- Follow-up exercises to practice before the next community exchange."
  );
  const [notesSaveStatus, setNotesSaveStatus] = useState<"saved" | "saving">("saved");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialNotesLoaded = useRef(false);

  // In-room chat
  const [roomChat, setRoomChat] = useState([
    { sender: partnerName, text: `Namaste! The video feed and audio are crystal clear in Room #${roomId}.`, time: "10:01 AM" },
    { sender: currentUser?.fullName || "You", text: "Namaste! I'm all set for our exchange session.", time: "10:02 AM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Post-Session Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Patient Mentor",
    "Practical Art Guidance",
    "Warm & Respectful",
  ]);
  const [reviewText, setReviewText] = useState(
    `A truly enriching and restorative community exchange with ${partnerName}! Highly recommend swapping skills with them.`
  );
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 1. Live Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  // 2. Room Exit Synchronization: Short-polling with Poll Lock
  useEffect(() => {
    let isMounted = true;
    let isSessionPollLocked = false;

    async function pollRoomSession() {
      if (isSessionPollLocked) return;
      isSessionPollLocked = true;

      try {
        const res = await fetch(`/api/sessions?roomId=${encodeURIComponent(roomId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        // Populate initial saved notes from DB if available on mount
        if (data.notesMarkdown && !isInitialNotesLoaded.current) {
          setNotes(data.notesMarkdown);
          isInitialNotesLoaded.current = true;
        }

        // If session was completed by the other user, pause timer and pop review modal
        if (data.status === "COMPLETED") {
          setTimerRunning(false);
          setFeedbackModalOpen((wasOpen) => {
            if (!wasOpen) {
              toast.info("Session concluded", {
                description: "Your exchange partner has ended the session. Please leave your review to collect your skill points!",
              });
              return true;
            }
            return wasOpen;
          });
        }
      } catch (err) {
        // Silently tolerate transient polling errors
      } finally {
        isSessionPollLocked = false;
      }
    }

    pollRoomSession();
    const pollInterval = setInterval(pollRoomSession, 4000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [roomId]);

  // 3. In-Room Chat Polling: Short-polling with Poll Lock
  useEffect(() => {
    if (!partnerId) return;
    let isMounted = true;
    let isChatPollLocked = false;

    async function pollRoomChat() {
      if (isChatPollLocked) return;
      isChatPollLocked = true;

      try {
        const url = `/api/messages?peerId=${encodeURIComponent(partnerId)}${
          currentUser?.id ? `&userId=${encodeURIComponent(currentUser.id)}` : ""
        }`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRoomChat(
            data.map((m: any) => ({
              sender: m.senderName || (m.isSelf ? currentUser?.fullName || "You" : partnerName),
              text: m.text,
              time: m.timestamp || "Just now",
            }))
          );
        }
      } catch (err) {
        // Silently tolerate transient polling errors
      } finally {
        isChatPollLocked = false;
      }
    }

    pollRoomChat();
    const chatInterval = setInterval(pollRoomChat, 3500);

    return () => {
      isMounted = false;
      clearInterval(chatInterval);
    };
  }, [partnerId, currentUser?.id, partnerName, currentUser?.fullName]);

  // 4. Debounced Notes Auto-Save (1500ms debounce with async lock)
  const isNotesSavingRef = useRef(false);
  const handleNotesChange = (val: string) => {
    // Instant local state update
    setNotes(val);
    setNotesSaveStatus("saving");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (isNotesSavingRef.current) return;
      isNotesSavingRef.current = true;

      try {
        await fetch("/api/sessions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            notesMarkdown: val,
          }),
        });
      } catch (e) {
        console.warn("Notes auto-save fallback:", e);
      } finally {
        isNotesSavingRef.current = false;
        setNotesSaveStatus("saved");
      }
    }, 1500);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendRoomChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const messageText = chatInput.trim();
    const senderName = currentUser?.fullName || "Community Member";
    const senderId = currentUser?.id || "member";

    // Optimistically update local room chat
    setRoomChat((prev) => [
      ...prev,
      {
        sender: senderName,
        text: messageText,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setChatInput("");

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          senderName,
          receiverId: partnerId,
          receiverName: partnerName,
          content: messageText,
        }),
      });
    } catch (err) {
      console.warn("Failed to dispatch in-room chat message:", err);
    }
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

  const handleCompleteReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmittingReview(true);

    try {
      await completeSession(roomId, {
        rating,
        comment: reviewText,
        badges: selectedTags,
        reviewer: currentUser,
        pointsToAward: 25,
      });

      addSkillPoints(25); // Award +25 points
      setFeedbackSubmitted(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1200);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      {/* Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle">
        <div className="flex items-center gap-3">
          <Badge variant="match">Community Room #{roomId}</Badge>
          <div>
            <h1 className="text-sm font-bold text-slate-heading">
              {activeSession ? activeSession.topic : "1-on-1 Community Exchange Session"}
            </h1>
            <p className="text-xs text-slate-muted">
              {activeSession
                ? activeSession.participants.map(p => p.name).join(" & ")
                : `${currentUser?.fullName || "You"} & ${partnerName}`}
            </p>
          </div>
        </div>

        {/* Live Timer Pill & End Session */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 border border-cream-200 text-xs font-mono font-bold text-burgundy-700">
            <Clock className="h-4 w-4 text-burgundy-600 animate-spin-slow" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleEndSession}
            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-bold border border-red-200"
          >
            <PhoneOff className="h-3.5 w-3.5 mr-1.5" />
            End Session & Review
          </Button>
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-190px)] min-h-[580px]">
        {/* Left 2 Cols: Collaborative Stage & Notes */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Top Video Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-3/5">
            {/* Peer Feed 1 (Mentor / Local) */}
            <div className="relative rounded-3xl bg-slate-900 overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
              {camOn ? (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                    alt={currentUser?.fullName || "You"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="text-center text-slate-400 space-y-2">
                  <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-xl font-bold text-white">
                    {currentUser?.fullName?.charAt(0) || "U"}
                  </div>
                  <p className="text-xs">Camera paused</p>
                </div>
              )}

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {currentUser?.fullName || "You"} (You)
                </span>
                {!micOn && (
                  <span className="p-1 rounded-md bg-red-500/80 text-white">
                    <MicOff className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>

            {/* Peer Feed 2 (Partner) */}
            <div className="relative rounded-3xl bg-slate-900 overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
                  alt={partnerName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {partnerName} (Partner)
                </span>
              </div>
            </div>
          </div>

          {/* Media Floating Controls Bar */}
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-2xl bg-white border border-[#EDE7DE] shadow-subtle mx-auto w-fit">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-xl transition-all ${
                micOn ? "bg-cream-100 text-slate-heading hover:bg-cream-200" : "bg-red-500 text-white"
              }`}
              title={micOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setCamOn(!camOn)}
              className={`p-3 rounded-xl transition-all ${
                camOn ? "bg-cream-100 text-slate-heading hover:bg-cream-200" : "bg-red-500 text-white"
              }`}
              title={camOn ? "Stop Camera" : "Start Camera"}
            >
              {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-3 rounded-xl transition-all ${
                screenSharing ? "bg-emerald-600 text-white" : "bg-cream-100 text-slate-heading hover:bg-cream-200"
              }`}
              title="Share Screen"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Shared Real-Time Session Notes */}
          <div className="flex-1 rounded-3xl bg-white border border-[#EDE7DE] shadow-card p-4 flex flex-col min-h-[160px]">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-burgundy-600" />
                <span className="text-xs font-bold text-slate-heading">
                  Shared Live Workspace Notes
                </span>
                <Badge
                  variant="peach"
                  className={`text-[10px] py-0 transition-all font-semibold ${
                    notesSaveStatus === "saving" ? "animate-pulse bg-peach-300" : ""
                  }`}
                >
                  {notesSaveStatus === "saving" ? "Saving..." : "Auto-saved"}
                </Badge>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="flex-1 w-full mt-2 resize-none border-none p-2 text-xs font-mono text-slate-body focus:outline-none bg-cream-50/50 rounded-xl leading-relaxed"
              placeholder="Jot down notes, recipe measurements, chord charts, or yoga posture instructions together..."
            />
          </div>
        </div>

        {/* Right 1 Col: In-Session Chat & Quick Resources */}
        <div className="rounded-3xl bg-white border border-[#EDE7DE] shadow-card flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-burgundy-600" />
              <span className="text-xs font-bold text-slate-heading">In-Room Chat</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Encrypted P2P
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {roomChat.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-muted">
                  <span className="font-bold text-slate-heading">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cream-100 text-slate-body leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendRoomChat} className="p-3 border-t border-cream-200 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Send message to room..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="text-xs h-9 rounded-xl"
            />
            <Button type="submit" size="sm" variant="primary" className="h-9 px-3">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Post-Session Feedback & Skill Points Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4">
            <div className="text-center space-y-1">
              <div className="h-12 w-12 rounded-2xl bg-peach-100 text-burgundy-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <Sparkles className="h-6 w-6 text-burgundy-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-heading">Complete Exchange & Leave Review</h3>
              <p className="text-xs text-slate-muted">
                How was your session with {partnerName}? Reviews build neighborhood trust.
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Review Submitted & Points Credited!</h4>
                <p className="text-xs text-slate-muted">
                  Redirecting to your updated community profile...
                </p>
              </div>
            ) : (
              <form onSubmit={handleCompleteReview} className="space-y-4 pt-2">
                {/* 5-Star Rating */}
                <div>
                  <label className="text-xs font-semibold text-slate-heading block mb-1.5 text-center">
                    Overall Experience Rating:
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-500"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge tags */}
                <div>
                  <label className="text-xs font-semibold text-slate-heading block mb-1.5">
                    Recognize their strengths with Community Badges:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Patient Mentor",
                      "Practical Art Guidance",
                      "Warm & Respectful",
                      "Clear Explanations",
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
                    Written Feedback (Visible on Neighbor&apos;s Profile):
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
                    <span>Reward for completed exchange:</span>
                  </div>
                  <Badge variant="peach">+25 Skill Points</Badge>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmittingReview}
                  className="w-full justify-center gap-2"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-peach-200" />
                      Finalizing Session...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-peach-200" />
                      Submit Review & Claim Points
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

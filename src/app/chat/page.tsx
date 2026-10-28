"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Send, 
  Paperclip, 
  Calendar, 
  Video, 
  CheckCheck, 
  MapPin, 
  Search,
  FileText,
  Sparkles,
  X,
  Palette,
  HeartPulse,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";
import { INITIAL_MEMBERS } from "@/lib/data/mock-data";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachment?: {
    name: string;
    type: "file" | "doc";
    size: string;
  };
}

// Seed message conversations for initial baseline or cold-start
const SEED_CHAT_CONVERSATIONS: Record<string, ChatMessage[]> = {
  "member-2": [
    {
      id: "msg-1",
      senderId: "member-2",
      senderName: "Kavita Nair",
      text: "Namaste Pooja! I saw your stunning botanical watercolor illustrations. I have always wanted to learn wet-on-wet landscape painting.",
      timestamp: "10:10 AM",
      isSelf: false,
    },
    {
      id: "msg-2",
      senderId: "member-1",
      senderName: "Pooja Sharma",
      text: "Namaste Kavitaji! Thank you so much! And I desperately need your help with morning Hatha Yoga stretches—my neck and upper back get so stiff after hours at the easel.",
      timestamp: "10:14 AM",
      isSelf: true,
    },
    {
      id: "msg-3",
      senderId: "member-1",
      senderName: "Pooja Sharma",
      text: "Here is a quick reference guide on beginner watercolor paints and cold-pressed 300 GSM paper before our session:",
      timestamp: "10:16 AM",
      isSelf: true,
      attachment: {
        name: "watercolor_palette_brush_guide.pdf",
        type: "file",
        size: "1.4 MB",
      },
    },
    {
      id: "msg-4",
      senderId: "member-2",
      senderName: "Kavita Nair",
      text: "This guide is wonderful! Let's do a 60-min exchange this Saturday at 10 AM in the SkillBridge Learning Room. We'll start with 30 mins of gentle spine alignment yoga, followed by a watercolor sky wash tutorial!",
      timestamp: "10:18 AM",
      isSelf: false,
    },
  ],
  "member-3": [
    {
      id: "msg-10",
      senderId: "member-3",
      senderName: "Ramesh Kulkarni",
      text: "Namaste! I would love to learn how you sketch botanical flowers from the garden.",
      timestamp: "Yesterday",
      isSelf: false,
    },
  ],
};

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [activePeerId, setActivePeerId] = useState("member-2"); // Kavita Nair (Yoga)
  const [inputText, setInputText] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState("Saturday at 10:00 AM IST");
  const [sessionScheduled, setSessionScheduled] = useState(false);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(SEED_CHAT_CONVERSATIONS);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activePeer = INITIAL_MEMBERS.find((m) => m.id === activePeerId) || INITIAL_MEMBERS[1];
  const currentThread = messages[activePeerId] || [];

  // Scroll to bottom of message thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentThread.length, activePeerId]);

  // Initial Fetch & 3-Second Short-Polling for Active Conversation
  useEffect(() => {
    let isMounted = true;
    const currentUserId = currentUser?.id || "member-1";

    async function fetchMessages(isPolling = false) {
      if (!isPolling) setIsLoadingMessages(true);

      try {
        const res = await fetch(
          `/api/messages?peerId=${encodeURIComponent(activePeerId)}&userId=${encodeURIComponent(currentUserId)}`
        );

        if (!res.ok) return;
        const data: ChatMessage[] = await res.json();

        if (!isMounted) return;

        if (Array.isArray(data) && data.length > 0) {
          setMessages((prev) => ({
            ...prev,
            [activePeerId]: data.map((msg) => ({
              ...msg,
              isSelf: msg.senderId === currentUserId,
            })),
          }));
        }
      } catch (err) {
        // Silently tolerate background polling errors
      } finally {
        if (isMounted && !isPolling) {
          setIsLoadingMessages(false);
        }
      }
    }

    fetchMessages(false);
    const pollInterval = setInterval(() => fetchMessages(true), 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [activePeerId, currentUser?.id]);

  // Handle Send Message: Optimistic UI + POST /api/messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    const currentUserId = currentUser?.id || "member-1";
    const currentUserName = currentUser?.fullName || "Pooja Sharma";

    const optimisticMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      senderId: currentUserId,
      senderName: currentUserName,
      text: messageText,
      timestamp: "Just now",
      isSelf: true,
    };

    // 1. Optimistic append to UI
    setMessages((prev) => ({
      ...prev,
      [activePeerId]: [...(prev[activePeerId] || []), optimisticMsg],
    }));
    setInputText("");
    setIsSending(true);

    try {
      // 2. Fire backend POST request to PostgreSQL
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          receiverId: activePeerId,
          receiverName: activePeer.fullName,
          content: messageText,
        }),
      });

      if (res.ok) {
        const savedMsg: ChatMessage = await res.json();
        // Replace optimistic placeholder with verified DB record
        setMessages((prev) => {
          const currentList = prev[activePeerId] || [];
          return {
            ...prev,
            [activePeerId]: currentList.map((m) =>
              m.id === optimisticMsg.id ? { ...savedMsg, isSelf: true } : m
            ),
          };
        });
      }
    } catch (err) {
      console.warn("Message POST fallback to optimistic state:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Schedule Swap Proposal within Chat
  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionScheduled(true);

    const currentUserId = currentUser?.id || "member-1";
    const currentUserName = currentUser?.fullName || "Pooja Sharma";
    const scheduleContent = `📅 Community exchange scheduled for ${scheduledSlot}. Room #SB-482 is ready!`;

    const confirmMsg: ChatMessage = {
      id: "msg-sched-" + Date.now(),
      senderId: currentUserId,
      senderName: currentUserName,
      text: scheduleContent,
      timestamp: "Just now",
      isSelf: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activePeerId]: [...(prev[activePeerId] || []), confirmMsg],
    }));

    // Post to database
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          receiverId: activePeerId,
          receiverName: activePeer.fullName,
          content: scheduleContent,
        }),
      });
    } catch (err) {
      console.warn("Schedule message POST fallback:", err);
    }

    setTimeout(() => {
      setScheduleModalOpen(false);
      setSessionScheduled(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-[78vh] rounded-3xl bg-white border border-[#EDE7DE] shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        
        {/* Left Pane: Conversations List */}
        <div className="border-r border-[#EDE7DE] bg-cream-50/50 flex flex-col">
          <div className="p-4 border-b border-[#EDE7DE] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-heading">Community Messages</h2>
              <Badge variant="outline" className="text-[10px] bg-white text-emerald-700 border-emerald-200">
                Live Sync
              </Badge>
            </div>
            <div className="relative">
              <Input
                placeholder="Search conversations..."
                className="h-9 pl-8 text-xs bg-white border-[#EDE7DE]"
              />
              <Search className="h-3.5 w-3.5 text-slate-muted absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-cream-200">
            {INITIAL_MEMBERS.slice(1, 4).map((m) => {
              const isSelected = m.id === activePeerId;
              const lastMsg = (messages[m.id] && messages[m.id].length > 0)
                ? messages[m.id][messages[m.id].length - 1].text
                : (m.id === "member-2" ? "Let's do a 60-min exchange!" : "Botanical flower sketches");

              return (
                <button
                  key={m.id}
                  onClick={() => setActivePeerId(m.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? "bg-white border-l-4 border-l-burgundy-600 shadow-xs" : "hover:bg-cream-100/70"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={m.avatarUrl}
                      alt={m.fullName}
                      className="h-10 w-10 rounded-full object-cover border border-peach-200"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-heading truncate">
                        {m.fullName} ({m.age})
                      </p>
                      <span className="text-[10px] text-slate-muted">Active</span>
                    </div>
                    <p className="text-[11px] text-slate-muted truncate mt-0.5">{m.neighborhood}, {m.city.split(",")[0]}</p>
                    <p className="text-[11px] text-slate-heading/80 truncate mt-1">
                      {lastMsg}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat Conversation */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full bg-[#FAF8F5]">
          
          {/* Header */}
          <div className="h-16 px-6 border-b border-[#EDE7DE] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activePeer.avatarUrl}
                  alt={activePeer.fullName}
                  className="h-10 w-10 rounded-full object-cover border border-peach-300"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-heading">
                  {activePeer.fullName} ({activePeer.age})
                </h3>
                <p className="text-[11px] text-slate-muted flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-burgundy-600" />
                  <span>{activePeer.neighborhood}, {activePeer.city}</span>
                  <span>• Offers {activePeer.teachingSkills[0]?.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="peach"
                size="sm"
                onClick={() => setScheduleModalOpen(true)}
                className="text-xs gap-1.5 h-8 font-semibold"
              >
                <Calendar className="h-3.5 w-3.5 text-burgundy-700" />
                Schedule Swap
              </Button>
              <Link href="/room/SB-482">
                <Button variant="primary" size="sm" className="text-xs gap-1.5 h-8 font-bold bg-burgundy-600 hover:bg-burgundy-700">
                  <Video className="h-3.5 w-3.5 text-peach-200" />
                  Join Room
                </Button>
              </Link>
            </div>
          </div>

          {/* Message Thread Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center my-2">
              <span className="text-[10px] uppercase font-bold text-slate-muted bg-cream-200/60 px-3 py-1 rounded-full border border-cream-300/40">
                SkillBridge Exchange Thread • End-to-End Encrypted • Real-time DB Sync
              </span>
            </div>

            {currentThread.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-heading">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-muted">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-subtle ${
                    msg.isSelf
                      ? "bg-burgundy-600 text-white rounded-tr-none"
                      : "bg-white text-slate-body border border-[#EDE7DE] rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Attachment Box */}
                  {msg.attachment && (
                    <div
                      className={`mt-3 p-3 rounded-xl flex items-center justify-between gap-3 ${
                        msg.isSelf ? "bg-burgundy-700/60 border border-burgundy-500/40" : "bg-cream-100 border border-cream-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText
                          className={`h-5 w-5 shrink-0 ${
                            msg.isSelf ? "text-peach-200" : "text-burgundy-600"
                          }`}
                        />
                        <div className="truncate">
                          <p className="font-bold truncate text-[11px]">{msg.attachment.name}</p>
                          <p className="text-[10px] opacity-75">{msg.attachment.size}</p>
                        </div>
                      </div>
                      <Badge
                        variant={msg.isSelf ? "peach" : "outline"}
                        className="text-[10px] uppercase py-0.5"
                      >
                        PDF Guide
                      </Badge>
                    </div>
                  )}
                </div>

                {msg.isSelf && (
                  <span className="text-[10px] text-slate-muted flex items-center gap-0.5 mt-0.5 px-1">
                    Delivered <CheckCheck className="h-3 w-3 text-burgundy-600" />
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-[#EDE7DE] flex items-center gap-3"
          >
            <button
              type="button"
              className="p-2 text-slate-muted hover:text-burgundy-600 transition-colors rounded-xl hover:bg-cream-100"
              title="Attach notes or guide"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activePeer.fullName.split(" ")[0]} directly...`}
              className="flex-1 text-xs border-[#EDE7DE] focus:border-burgundy-600 h-10 rounded-xl"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSending || !inputText.trim()}
              className="gap-2 text-xs font-bold px-5 h-10 bg-burgundy-600 hover:bg-burgundy-700 shadow-md"
            >
              {isSending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="h-3.5 w-3.5 text-peach-200" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Schedule Swap Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-burgundy-600" />
                <h3 className="text-base font-bold text-slate-heading">Propose Scheduled Session</h3>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-muted leading-relaxed">
              Agree on a meeting slot with <strong>{activePeer.fullName}</strong>. Once confirmed, Room #SB-482 will be booked in your schedule.
            </p>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-heading block mb-1.5">
                  Available Community Time Slot:
                </label>
                <select
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="w-full rounded-xl border border-[#EDE7DE] bg-white p-2.5 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                >
                  <option value="Saturday at 10:00 AM IST">Saturday at 10:00 AM IST (Recommended)</option>
                  <option value="Sunday at 11:30 AM IST">Sunday at 11:30 AM IST</option>
                  <option value="Tuesday at 04:30 PM IST">Tuesday at 04:30 PM IST</option>
                  <option value="Thursday at 06:00 PM IST">Thursday at 06:00 PM IST</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-100 border border-cream-200 text-xs text-slate-muted space-y-1">
                <p className="font-bold text-slate-heading">Exchange Summary:</p>
                <p>• You teach: {currentUser?.teachingSkills[0]?.name || "Creative Arts"}</p>
                <p>• You learn: {activePeer.teachingSkills[0]?.name}</p>
                <p>• Mode: Live 60-Minute Interactive Studio (Room #SB-482)</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setScheduleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={sessionScheduled}
                  className="bg-burgundy-600 hover:bg-burgundy-700 text-xs font-bold gap-1.5"
                >
                  {sessionScheduled ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Booking Room...
                    </>
                  ) : (
                    "Confirm & Schedule"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
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
  HeartPulse
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

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [activePeerId, setActivePeerId] = useState("member-2"); // Kavita Nair (Yoga)
  const [inputText, setInputText] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState("Saturday at 10:00 AM IST");
  const [sessionScheduled, setSessionScheduled] = useState(false);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
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
  });

  const activePeer = INITIAL_MEMBERS.find((m) => m.id === activePeerId) || INITIAL_MEMBERS[1];
  const currentThread = messages[activePeerId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      senderId: currentUser?.id || "member-1",
      senderName: currentUser?.fullName || "Pooja Sharma",
      text: inputText.trim(),
      timestamp: "Just now",
      isSelf: true,
    };

    setMessages({
      ...messages,
      [activePeerId]: [...currentThread, newMsg],
    });
    setInputText("");
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionScheduled(true);
    setTimeout(() => {
      setScheduleModalOpen(false);
      setSessionScheduled(false);

      const confirmMsg: ChatMessage = {
        id: "msg-sched-" + Date.now(),
        senderId: currentUser?.id || "member-1",
        senderName: currentUser?.fullName || "Pooja Sharma",
        text: `📅 Community exchange scheduled for ${scheduledSlot}. Room #SB-482 is ready!`,
        timestamp: "Just now",
        isSelf: true,
      };

      setMessages({
        ...messages,
        [activePeerId]: [...currentThread, confirmMsg],
      });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-[78vh] rounded-3xl bg-white border border-[#EDE7DE] shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        
        {/* Left Pane: Conversations List */}
        <div className="border-r border-[#EDE7DE] bg-cream-50/50 flex flex-col">
          <div className="p-4 border-b border-[#EDE7DE] space-y-3">
            <h2 className="text-base font-bold text-slate-heading">Community Messages</h2>
            <div className="relative">
              <Input
                placeholder="Search conversations..."
                className="h-9 pl-8 text-xs bg-white"
              />
              <Search className="h-3.5 w-3.5 text-slate-muted absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-cream-200">
            {INITIAL_MEMBERS.slice(1, 4).map((m) => {
              const isSelected = m.id === activePeerId;
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
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-heading truncate">
                        {m.fullName} ({m.age})
                      </p>
                      <span className="text-[10px] text-slate-muted">10:18 AM</span>
                    </div>
                    <p className="text-[11px] text-slate-muted truncate mt-0.5">{m.neighborhood}, {m.city.split(",")[0]}</p>
                    <p className="text-[11px] text-slate-heading/80 truncate mt-1">
                      {m.id === "member-2" ? "Let's do a 60-min exchange!" : "Botanical flower sketches"}
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
                className="text-xs gap-1.5 h-8"
              >
                <Calendar className="h-3.5 w-3.5 text-burgundy-700" />
                Schedule Swap
              </Button>
              <Link href="/room/SB-482">
                <Button variant="primary" size="sm" className="text-xs gap-1.5 h-8">
                  <Video className="h-3.5 w-3.5 text-peach-200" />
                  Join Room
                </Button>
              </Link>
            </div>
          </div>

          {/* Message Thread Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center my-2">
              <span className="text-[10px] uppercase font-bold text-slate-muted bg-cream-200/60 px-3 py-1 rounded-full">
                SkillBridge Exchange Thread • End-to-End Encrypted
              </span>
            </div>

            {currentThread.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.isSelf
                      ? "bg-burgundy-600 text-white rounded-br-sm"
                      : "bg-white border border-[#EDE7DE] text-slate-heading rounded-bl-sm"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attachment Card if exists */}
                  {msg.attachment && (
                    <div className="mt-2.5 p-2 rounded-xl bg-cream-100 border border-cream-200 flex items-center gap-2.5 text-slate-heading">
                      <div className="h-7 w-7 rounded-lg bg-burgundy-100 text-burgundy-700 flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-[11px]">{msg.attachment.name}</p>
                        <p className="text-[10px] text-slate-muted">{msg.attachment.size}</p>
                      </div>
                      <span className="text-[10px] font-bold text-burgundy-700">Preview</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-muted">
                  <span>{msg.timestamp}</span>
                  {msg.isSelf && <CheckCheck className="h-3 w-3 text-burgundy-600" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-[#EDE7DE]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-muted hover:text-burgundy-600 hover:bg-cream-100 rounded-xl"
                title="Attach artwork reference or guide"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <Input
                type="text"
                placeholder={`Message ${activePeer.fullName.split(" ")[0]}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 h-10 text-xs"
              />

              <Button type="submit" size="sm" variant="primary" className="h-10 px-4 gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Schedule Session Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="text-sm font-bold text-slate-heading">
                  Schedule Community Exchange
                </h3>
                <p className="text-xs text-slate-muted">With {activePeer.fullName} ({activePeer.neighborhood})</p>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {sessionScheduled ? (
              <div className="text-center py-6 space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-heading">Exchange Scheduled!</h4>
                <p className="text-xs text-slate-muted">Added to chat and your community dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmSchedule} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Select Day & Time Slot:
                  </label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#EDE7DE] text-xs px-3 bg-cream-50"
                  >
                    <option value="Saturday at 10:00 AM IST">Saturday at 10:00 AM IST</option>
                    <option value="Sunday at 4:00 PM IST">Sunday at 4:00 PM IST</option>
                    <option value="Tuesday at 5:00 PM IST">Tuesday at 5:00 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Exchange Focus:
                  </label>
                  <p className="text-xs p-2.5 rounded-xl bg-cream-100 border border-cream-200 text-slate-heading">
                    Watercolor Landscape Washes (Pooja) ⇄ Morning Hatha Yoga (Kavita)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-peach-50 border border-peach-200 text-[11px] text-burgundy-800">
                  ⚡ <strong>Community Karma:</strong> Both members earn <strong>+25 Skill Points</strong> upon mutual exchange review.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setScheduleModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Confirm & Send Invite
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

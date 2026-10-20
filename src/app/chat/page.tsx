"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Send, 
  Paperclip, 
  Calendar, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  Clock, 
  GraduationCap, 
  Search,
  FileCode,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";
import { INITIAL_STUDENTS } from "@/lib/data/mock-data";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachment?: {
    name: string;
    type: "code" | "file";
    size: string;
  };
}

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [activePeerId, setActivePeerId] = useState("student-2"); // Priya Patel
  const [inputText, setInputText] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState("Tomorrow at 5:00 PM IST");
  const [sessionScheduled, setSessionScheduled] = useState(false);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "student-2": [
      {
        id: "msg-1",
        senderId: "student-2",
        senderName: "Priya Patel",
        text: "Hey Aarav! Thanks for connecting on SkillBridge. I saw you're building with Next.js 14 Server Actions.",
        timestamp: "2:10 PM",
        isSelf: false,
      },
      {
        id: "msg-2",
        senderId: "student-1",
        senderName: "Aarav Sharma",
        text: "Hey Priya! Yes, I love App Router. And I saw your LeetCode profile—450+ solved in C++ is incredible! I'm struggling with Grid Dynamic Programming.",
        timestamp: "2:14 PM",
        isSelf: true,
      },
      {
        id: "msg-3",
        senderId: "student-2",
        senderName: "Priya Patel",
        text: "I can totally help you with DP recurrence relations! Here's a quick cheat-sheet snippet I made for my VJTI batchmates:",
        timestamp: "2:16 PM",
        isSelf: false,
        attachment: {
          name: "dp_state_transitions.cpp",
          type: "code",
          size: "3.4 KB",
        },
      },
      {
        id: "msg-4",
        senderId: "student-2",
        senderName: "Priya Patel",
        text: "Should we hop on a 60-min session tomorrow in the SkillBridge Learning Room?",
        timestamp: "2:18 PM",
        isSelf: false,
      },
    ],
    "student-3": [
      {
        id: "msg-10",
        senderId: "student-3",
        senderName: "Rohan Verma",
        text: "Hi Aarav, quick question about your Docker deployment on AWS ECS?",
        timestamp: "Yesterday",
        isSelf: false,
      },
    ],
  });

  const activePeer = INITIAL_STUDENTS.find((s) => s.id === activePeerId) || INITIAL_STUDENTS[1];
  const currentThread = messages[activePeerId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      senderId: currentUser?.id || "student-1",
      senderName: currentUser?.fullName || "Aarav Sharma",
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

      // Append confirmation message to chat
      const confirmMsg: ChatMessage = {
        id: "msg-sched-" + Date.now(),
        senderId: currentUser?.id || "student-1",
        senderName: currentUser?.fullName || "Aarav Sharma",
        text: `📅 Session proposed for ${scheduledSlot}. Once accepted, meeting room #SB-482 will be active!`,
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
            <h2 className="text-base font-bold text-slate-heading">Direct Peer Messages</h2>
            <div className="relative">
              <Input
                placeholder="Search conversations..."
                className="h-9 pl-8 text-xs bg-white"
              />
              <Search className="h-3.5 w-3.5 text-slate-muted absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-cream-200">
            {INITIAL_STUDENTS.slice(1, 4).map((st) => {
              const isSelected = st.id === activePeerId;
              return (
                <button
                  key={st.id}
                  onClick={() => setActivePeerId(st.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? "bg-white border-l-4 border-l-burgundy-600 shadow-xs" : "hover:bg-cream-100/70"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={st.avatarUrl}
                      alt={st.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-heading truncate">{st.fullName}</p>
                      <span className="text-[10px] text-slate-muted">2:18 PM</span>
                    </div>
                    <p className="text-[11px] text-slate-muted truncate mt-0.5">{st.collegeName}</p>
                    <p className="text-[11px] text-slate-heading/80 truncate mt-1">
                      {st.id === "student-2" ? "Should we hop on a session?" : "Let's swap notes!"}
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
                <h3 className="text-sm font-bold text-slate-heading">{activePeer.fullName}</h3>
                <p className="text-[11px] text-slate-muted flex items-center gap-1">
                  <span>{activePeer.collegeName}</span>
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
                Schedule Session
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
                Knowledge Swap Thread • End-to-End Encrypted
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
                        <FileCode className="h-4 w-4" />
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
                title="Attach code snippet or file"
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
                  Schedule 1-on-1 Learning Session
                </h3>
                <p className="text-xs text-slate-muted">With {activePeer.fullName} ({activePeer.collegeName})</p>
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
                <h4 className="text-sm font-bold text-slate-heading">Session Scheduled!</h4>
                <p className="text-xs text-slate-muted">Invitation added to chat and your student dashboard.</p>
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
                    <option value="Tomorrow at 5:00 PM IST">Tomorrow at 5:00 PM IST</option>
                    <option value="Saturday at 11:00 AM IST">Saturday at 11:00 AM IST</option>
                    <option value="Sunday at 4:00 PM IST">Sunday at 4:00 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-heading mb-1">
                    Exchange Focus:
                  </label>
                  <p className="text-xs p-2.5 rounded-xl bg-cream-100 border border-cream-200 text-slate-heading">
                    Next.js Server Actions (Aarav) ⇄ C++ Dynamic Programming (Priya)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-peach-50 border border-peach-200 text-[11px] text-burgundy-800">
                  ⚡ <strong>Note:</strong> Both peers will earn <strong>+25 Skill Points</strong> upon completion and review submission.
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

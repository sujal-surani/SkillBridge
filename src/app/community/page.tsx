"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  ThumbsUp, 
  Plus, 
  Search, 
  Sparkles, 
  Share2, 
  Tag, 
  Check,
  X,
  MapPin,
  Sprout,
  HeartPulse,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { INITIAL_COMMUNITY_QUESTIONS, CommunityQuestion } from "@/lib/data/mock-data";
import { useAuth } from "@/lib/context/AuthContext";

export default function CommunityPage() {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState<CommunityQuestion[]>(INITIAL_COMMUNITY_QUESTIONS);
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [postModalOpen, setPostModalOpen] = useState(false);

  // New question form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("Gardening, Terrace, Plant Care");

  // Reply drawer state
  const [replyQuestionId, setReplyQuestionId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const allTags = ["ALL", "Gardening", "Organic", "Plant Care", "Excel", "Budgeting", "Yoga", "First Aid", "Baking"];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === "ALL" ||
      q.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const handleUpvote = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newQ: CommunityQuestion = {
      id: "q-" + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      authorName: currentUser?.fullName || "Ramesh Kulkarni",
      authorAge: currentUser?.age || 45,
      authorOccupation: currentUser?.occupationOrInterest || "Community Member",
      authorNeighborhood: `${currentUser?.neighborhood || "Koregaon Park"}, ${currentUser?.city || "Pune"}`,
      authorAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
      pillar: "CREATIVE_PRACTICAL",
      tags: newTags.split(",").map((t) => t.trim()),
      createdAt: "Just now",
      upvotes: 1,
      isSolved: false,
      repliesCount: 0,
      replies: [],
    };

    setQuestions([newQ, ...questions]);
    setNewTitle("");
    setNewContent("");
    setPostModalOpen(false);
  };

  const handleAddReply = (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newReply = {
            id: "reply-" + Date.now(),
            authorName: currentUser?.fullName || "Ramesh Kulkarni",
            authorOccupation: `${currentUser?.occupationOrInterest} (${currentUser?.age}, ${currentUser?.city.split(",")[0]})`,
            authorAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
            content: replyContent.trim(),
            createdAt: "Just now",
            isSolution: false,
            upvotes: 0,
          };
          return {
            ...q,
            repliesCount: q.repliesCount + 1,
            replies: [...q.replies, newReply],
          };
        }
        return q;
      })
    );
    setReplyContent("");
  };

  const handleMarkSolution = (questionId: string, replyId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            isSolved: true,
            replies: q.replies.map((r) => ({
              ...r,
              isSolution: r.id === replyId,
            })),
          };
        }
        return q;
      })
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="peach" className="mb-1">Community Problem Board</Badge>
          <h1 className="text-3xl font-extrabold text-slate-heading">
            Neighborhood Q&A & Skill Advice
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-1">
            Need guidance on gardening, first aid, Excel budgeting, sourdough, or public speaking? Ask your neighbors.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setPostModalOpen(true)}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Ask the Community
        </Button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            placeholder="Search neighborhood questions, hobbies, or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 text-xs sm:text-sm rounded-2xl"
          />
          <Search className="h-4 w-4 text-slate-muted absolute left-3.5 top-3.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? "bg-burgundy-600 text-white shadow-xs"
                  : "bg-white text-slate-muted border border-cream-300 hover:bg-cream-100"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <Card key={q.id} className="p-6 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {q.isSolved ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Solved by Neighbor
                    </Badge>
                  ) : (
                    <Badge variant="peach">Open Question</Badge>
                  )}
                  {q.tags.map((t) => (
                    <span key={t} className="text-[11px] text-slate-muted bg-cream-200 px-2 py-0.5 rounded-md font-medium">
                      #{t}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-muted">• {q.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-slate-heading">
                  {q.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-body leading-relaxed">
                  {q.content}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-2 pt-2 text-xs">
                  <img
                    src={q.authorAvatar}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-heading">{q.authorName} ({q.authorAge})</span>
                  <span className="text-slate-muted flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-burgundy-600" />
                    {q.authorNeighborhood}
                  </span>
                </div>
              </div>

              {/* Upvote Pill */}
              <button
                onClick={() => handleUpvote(q.id)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-cream-100 border border-cream-200 hover:bg-cream-200 transition-colors min-w-[48px]"
              >
                <ThumbsUp className="h-4 w-4 text-burgundy-600 mb-0.5" />
                <span className="text-xs font-bold text-slate-heading">{q.upvotes}</span>
              </button>
            </div>

            {/* Replies Section */}
            <div className="mt-5 pt-4 border-t border-cream-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-heading">
                <span>{q.replies.length} Neighbor Advice & Answers</span>
                <button
                  onClick={() => setReplyQuestionId(replyQuestionId === q.id ? null : q.id)}
                  className="text-burgundy-600 hover:underline"
                >
                  {replyQuestionId === q.id ? "Close" : "+ Share Advice"}
                </button>
              </div>

              {/* Render Existing Replies */}
              {q.replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-2xl text-xs space-y-2 ${
                    reply.isSolution
                      ? "bg-emerald-50/70 border border-emerald-300 shadow-xs"
                      : "bg-cream-100 border border-cream-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={reply.authorAvatar}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-heading">{reply.authorName}</span>
                      <span className="text-[10px] text-slate-muted">({reply.authorOccupation})</span>
                    </div>

                    {reply.isSolution ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Verified Solution
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkSolution(q.id, reply.id)}
                        className="text-[10px] text-slate-muted hover:text-emerald-700 underline"
                      >
                        Mark as Solution
                      </button>
                    )}
                  </div>

                  <p className="text-slate-body leading-relaxed">{reply.content}</p>
                </div>
              ))}

              {/* Inline Write Reply Form */}
              {replyQuestionId === q.id && (
                <form
                  onSubmit={(e) => handleAddReply(e, q.id)}
                  className="mt-3 space-y-2"
                >
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a kind, practical, and helpful answer for your neighbor..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyQuestionId(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Submit Advice
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Ask Question Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#EDE7DE] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="text-base font-bold text-slate-heading">Ask the Community</h3>
                <p className="text-xs text-slate-muted">Seek advice or tips from your neighborhood</p>
              </div>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1">
                  Question Summary:
                </label>
                <Input
                  required
                  placeholder="e.g. How to prepare clay soil for terrace spinach planting?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1">
                  Details & What You&apos;ve Tried:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain your situation so neighbors can give the best advice..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1">
                  Topic Tags (Comma separated):
                </label>
                <Input
                  placeholder="e.g. Gardening, Soil, Terrace, Organic"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPostModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish to Board
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

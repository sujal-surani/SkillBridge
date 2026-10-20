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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { INITIAL_DOUBTS, CommunityDoubt } from "@/lib/data/mock-data";
import { useAuth } from "@/lib/context/AuthContext";

export default function CommunityPage() {
  const { currentUser } = useAuth();
  const [doubts, setDoubts] = useState<CommunityDoubt[]>(INITIAL_DOUBTS);
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [postModalOpen, setPostModalOpen] = useState(false);

  // New question form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("DSA, Recursion, C++");

  // Reply drawer state
  const [replyDoubtId, setReplyDoubtId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const allTags = ["ALL", "Dynamic Programming", "Next.js", "C++", "DSA", "Web Dev", "Full-Stack", "Recursion"];

  const filteredDoubts = doubts.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === "ALL" ||
      d.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const handleUpvote = (id: string) => {
    setDoubts(
      doubts.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d))
    );
  };

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newQuestion: CommunityDoubt = {
      id: "doubt-" + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      authorName: currentUser?.fullName || "Aarav Sharma",
      authorCollege: currentUser?.collegeName || "IIT Bombay",
      authorAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
      tags: newTags.split(",").map((t) => t.trim()),
      createdAt: "Just now",
      upvotes: 1,
      isSolved: false,
      repliesCount: 0,
      replies: [],
    };

    setDoubts([newQuestion, ...doubts]);
    setNewTitle("");
    setNewContent("");
    setPostModalOpen(false);
  };

  const handleAddReply = (e: React.FormEvent, doubtId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setDoubts(
      doubts.map((d) => {
        if (d.id === doubtId) {
          const newReply = {
            id: "reply-" + Date.now(),
            authorName: currentUser?.fullName || "Aarav Sharma",
            authorCollege: currentUser?.collegeName || "IIT Bombay",
            authorAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
            content: replyContent.trim(),
            createdAt: "Just now",
            isSolution: false,
            upvotes: 0,
          };
          return {
            ...d,
            repliesCount: d.repliesCount + 1,
            replies: [...d.replies, newReply],
          };
        }
        return d;
      })
    );
    setReplyContent("");
  };

  const handleMarkSolution = (doubtId: string, replyId: string) => {
    setDoubts(
      doubts.map((d) => {
        if (d.id === doubtId) {
          return {
            ...d,
            isSolved: true,
            replies: d.replies.map((r) => ({
              ...r,
              isSolution: r.id === replyId,
            })),
          };
        }
        return d;
      })
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="peach" className="mb-1">Campus Problem Board</Badge>
          <h1 className="text-3xl font-extrabold text-slate-heading">
            Doubt & Solution Exchange
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-1">
            Stuck on recursion, dynamic programming, or docker deployment? Ask your engineering peers.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setPostModalOpen(true)}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Ask a Question
        </Button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            placeholder="Search problems, concepts, or algorithms..."
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

      {/* Doubts List */}
      <div className="space-y-4">
        {filteredDoubts.map((doubt) => (
          <Card key={doubt.id} className="p-6 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {doubt.isSolved ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Solved
                    </Badge>
                  ) : (
                    <Badge variant="peach">Open Doubt</Badge>
                  )}
                  {doubt.tags.map((t) => (
                    <span key={t} className="text-[11px] text-slate-muted bg-cream-200 px-2 py-0.5 rounded-md font-medium">
                      #{t}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-muted">• {doubt.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-slate-heading">
                  {doubt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-body leading-relaxed">
                  {doubt.content}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-2 pt-2 text-xs">
                  <img
                    src={doubt.authorAvatar}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-heading">{doubt.authorName}</span>
                  <span className="text-slate-muted">({doubt.authorCollege})</span>
                </div>
              </div>

              {/* Upvote Pill */}
              <button
                onClick={() => handleUpvote(doubt.id)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-cream-100 border border-cream-200 hover:bg-cream-200 transition-colors min-w-[48px]"
              >
                <ThumbsUp className="h-4 w-4 text-burgundy-600 mb-0.5" />
                <span className="text-xs font-bold text-slate-heading">{doubt.upvotes}</span>
              </button>
            </div>

            {/* Replies Section */}
            <div className="mt-5 pt-4 border-t border-cream-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-heading">
                <span>{doubt.replies.length} Solutions & Explanations</span>
                <button
                  onClick={() => setReplyDoubtId(replyDoubtId === doubt.id ? null : doubt.id)}
                  className="text-burgundy-600 hover:underline"
                >
                  {replyDoubtId === doubt.id ? "Close Reply" : "+ Write Solution"}
                </button>
              </div>

              {/* Render Existing Replies */}
              {doubt.replies.map((reply) => (
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
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-heading">{reply.authorName}</span>
                      <span className="text-[10px] text-slate-muted">({reply.authorCollege})</span>
                    </div>

                    {reply.isSolution ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Verified Solution
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkSolution(doubt.id, reply.id)}
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
              {replyDoubtId === doubt.id && (
                <form
                  onSubmit={(e) => handleAddReply(e, doubt.id)}
                  className="mt-3 space-y-2"
                >
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a clear, step-by-step conceptual answer..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyDoubtId(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Submit Explanation
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
                <h3 className="text-base font-bold text-slate-heading">Post a Technical Doubt</h3>
                <p className="text-xs text-slate-muted">Ask your peer community for guidance</p>
              </div>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-slate-muted hover:text-slate-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoubt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1">
                  Question Title (Concise & Specific):
                </label>
                <Input
                  required
                  placeholder="e.g. How to handle cycle detection in a directed graph using DFS?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1">
                  Detailed Explanation & Code Snippet:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain what you have attempted so far and where you are stuck..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-2xl border border-[#EDE7DE] p-3 text-xs text-slate-heading focus:border-burgundy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-heading mb-1">
                  Tags (Comma separated):
                </label>
                <Input
                  placeholder="e.g. Graphs, DFS, C++, Algorithms"
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
                  Publish Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

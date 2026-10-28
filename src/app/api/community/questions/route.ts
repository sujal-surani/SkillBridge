import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CommunityQuestion } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const questions = await prisma.communityQuestion.findMany({
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted: CommunityQuestion[] = questions.map((q) => {
      let tags: string[] = ["General"];
      try {
        if (q.tags) {
          const parsed = JSON.parse(q.tags);
          if (Array.isArray(parsed)) tags = parsed;
        }
      } catch {
        if (q.tags) tags = [q.tags];
      }

      const replies = q.replies.map((r) => {
        const authorCity = r.author.city?.split(",")[0] || "Community";
        return {
          id: r.id,
          authorName: r.author.fullName || r.author.name || "Community Member",
          authorOccupation: `${r.author.occupationOrInterest || "Member"} (${r.author.age || 30}, ${authorCity})`,
          authorAvatar:
            r.author.avatarUrl ||
            r.author.image ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
          content: r.content,
          createdAt: r.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          isSolution: r.isSolution,
          upvotes: r.upvotes,
        };
      });

      return {
        id: q.id,
        title: q.title,
        content: q.content,
        authorName: q.author.fullName || q.author.name || "Community Member",
        authorAge: q.author.age || 30,
        authorOccupation: q.author.occupationOrInterest || "Community Member",
        authorNeighborhood: `${q.author.neighborhood || "Resident"}, ${q.author.city || "Community Hub"}`,
        authorAvatar:
          q.author.avatarUrl ||
          q.author.image ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
        pillar: (q.pillar as any) || "CREATIVE_PRACTICAL",
        tags,
        createdAt: q.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        upvotes: q.upvotes,
        isSolved: q.isSolved,
        repliesCount: replies.length,
        replies,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/community/questions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch community questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const authorId = session?.user?.id || body.authorId;
    if (!authorId || !body.title?.trim()) {
      return NextResponse.json(
        { error: "Missing authorId or question title" },
        { status: 400 }
      );
    }

    // Ensure author exists in DB
    await prisma.user.upsert({
      where: { id: authorId },
      update: {},
      create: {
        id: authorId,
        email: session?.user?.email || body.authorEmail || `${authorId}@skillbridge.local`,
        fullName: body.authorName || session?.user?.name || "Community Member",
        avatarUrl:
          body.authorAvatar ||
          session?.user?.image ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
        neighborhood: body.authorNeighborhood || "Resident",
        city: body.authorCity || "Community Hub",
      },
    });

    const tagsArray = Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
      ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : ["General"];

    const question = await prisma.communityQuestion.create({
      data: {
        authorId,
        title: body.title.trim(),
        content: body.content?.trim() || "",
        pillar: body.pillar || "CREATIVE_PRACTICAL",
        tags: JSON.stringify(tagsArray),
        upvotes: 1,
        isSolved: false,
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });

    const formatted: CommunityQuestion = {
      id: question.id,
      title: question.title,
      content: question.content,
      authorName: question.author.fullName || question.author.name || "Community Member",
      authorAge: question.author.age || 30,
      authorOccupation: question.author.occupationOrInterest || "Community Member",
      authorNeighborhood: `${question.author.neighborhood || "Resident"}, ${question.author.city || "Community Hub"}`,
      authorAvatar:
        question.author.avatarUrl ||
        question.author.image ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
      pillar: question.pillar as any,
      tags: tagsArray,
      createdAt: "Just now",
      upvotes: question.upvotes,
      isSolved: question.isSolved,
      repliesCount: 0,
      replies: [],
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("POST /api/community/questions error:", error);
    return NextResponse.json(
      { error: "Failed to create community question" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const questionId = body.id || body.questionId;

    if (!questionId) {
      return NextResponse.json(
        { error: "Missing questionId" },
        { status: 400 }
      );
    }

    const updated = await prisma.communityQuestion.update({
      where: { id: questionId },
      data: {
        upvotes: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      upvotes: updated.upvotes,
    });
  } catch (error) {
    console.error("PATCH /api/community/questions error:", error);
    return NextResponse.json(
      { error: "Failed to upvote question" },
      { status: 500 }
    );
  }
}

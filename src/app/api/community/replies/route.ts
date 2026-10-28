import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const { questionId, content } = body;
    const authorId = session?.user?.id || body.authorId;

    if (!questionId || !content?.trim() || !authorId) {
      return NextResponse.json(
        { error: "Missing questionId, content, or authorId" },
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
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
        neighborhood: body.authorNeighborhood || "Resident",
        city: body.authorCity || "Community Hub",
      },
    });

    const reply = await prisma.questionReply.create({
      data: {
        questionId,
        authorId,
        content: content.trim(),
        isSolution: false,
        upvotes: 0,
      },
      include: {
        author: true,
      },
    });

    const authorCity = reply.author.city?.split(",")[0] || "Community";
    const formattedReply = {
      id: reply.id,
      authorName: reply.author.fullName || reply.author.name || "Community Member",
      authorOccupation: `${reply.author.occupationOrInterest || "Member"} (${reply.author.age || 28}, ${authorCity})`,
      authorAvatar:
        reply.author.avatarUrl ||
        reply.author.image ||
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
      content: reply.content,
      createdAt: "Just now",
      isSolution: reply.isSolution,
      upvotes: reply.upvotes,
    };

    return NextResponse.json(formattedReply);
  } catch (error) {
    console.error("POST /api/community/replies error:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { replyId, questionId } = body;

    if (!replyId) {
      return NextResponse.json(
        { error: "Missing replyId" },
        { status: 400 }
      );
    }

    // Atomic transaction: mark reply as solution, mark question as solved, award +15 Karma points
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Mark reply as solution
      const updatedReply = await tx.questionReply.update({
        where: { id: replyId },
        data: { isSolution: true },
        include: { author: true },
      });

      // 2. Mark parent question as solved
      const targetQuestionId = questionId || updatedReply.questionId;
      await tx.communityQuestion.update({
        where: { id: targetQuestionId },
        data: { isSolved: true },
      });

      // 3. Award +15 Karma points to reply author
      await tx.user.update({
        where: { id: updatedReply.authorId },
        data: {
          skillPointsBalance: { increment: 15 },
        },
      });

      // 4. Record ledger transaction
      await tx.pointTransaction.create({
        data: {
          userId: updatedReply.authorId,
          amount: 15,
          type: "EARNED_SOLVING_QNA",
          description: "Earned +15 Community Points for solution marked in Q&A board",
        },
      });

      return updatedReply;
    });

    return NextResponse.json({
      success: true,
      reply: transactionResult,
    });
  } catch (error) {
    console.error("PATCH /api/community/replies error:", error);
    return NextResponse.json(
      { error: "Failed to mark solution and credit karma" },
      { status: 500 }
    );
  }
}

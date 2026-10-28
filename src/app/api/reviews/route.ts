import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const targetMemberId = req.nextUrl.searchParams.get("targetMemberId");
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    const whereClause: any = {};
    if (targetMemberId) whereClause.targetMemberId = targetMemberId;
    if (sessionId) whereClause.sessionId = sessionId;

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = reviews.map((r) => {
      let badgesArray: string[] = [];
      try {
        badgesArray = JSON.parse(r.badges);
      } catch {
        badgesArray = [];
      }

      return {
        id: r.id,
        sessionId: r.sessionId,
        authorId: r.authorId,
        authorName: r.author.fullName || r.author.name || "Member",
        authorAvatar: r.author.avatarUrl || r.author.image || "",
        authorLocation: r.author.neighborhood
          ? `${r.author.neighborhood}, ${r.author.city}`
          : "Community Member",
        targetMemberId: r.targetMemberId,
        rating: r.rating,
        comment: r.comment,
        badges: badgesArray,
        date: r.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.warn("GET /api/reviews warning (returning fallback []):", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const body = await req.json();
    const {
      sessionId,
      targetMemberId,
      authorId,
      authorName,
      authorAvatar,
      authorLocation,
      rating,
      comment,
      badges,
    } = body;

    const effectiveAuthorId = currentUserId || authorId;

    if (!sessionId || !targetMemberId || !effectiveAuthorId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields (sessionId, targetMemberId, rating)" },
        { status: 400 }
      );
    }

    // Ensure session exists or resolve by roomId
    let sessionRecord = await prisma.swapSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { roomId: sessionId }],
      },
    });

    if (!sessionRecord) {
      // Auto-create session placeholder if called from mock room
      sessionRecord = await prisma.swapSession.create({
        data: {
          roomId: sessionId.startsWith("SB-") ? sessionId : `SB-${Math.floor(200 + Math.random() * 700)}`,
          topic: "Community Exchange",
          offeredSkill: "Skill Sharing",
          requestedSkill: "Skill Sharing",
          scheduledFor: "Completed",
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    }

    // Ensure author exists in DB
    await prisma.user.upsert({
      where: { id: effectiveAuthorId },
      update: {},
      create: {
        id: effectiveAuthorId,
        email: session?.user?.email || `${effectiveAuthorId}@skillbridge.local`,
        fullName: authorName || "Community Member",
        avatarUrl: authorAvatar || "",
        neighborhood: authorLocation ? authorLocation.split(",")[0]?.trim() || "" : "",
        city: authorLocation ? authorLocation.split(",")[1]?.trim() || "" : "",
      },
    });

    // Ensure target exists in DB
    await prisma.user.upsert({
      where: { id: targetMemberId },
      update: {},
      create: {
        id: targetMemberId,
        email: `${targetMemberId}@skillbridge.local`,
        fullName: "Community Member",
      },
    });

    const badgesString = Array.isArray(badges) ? JSON.stringify(badges) : "[]";

    const newReview = await prisma.review.create({
      data: {
        sessionId: sessionRecord.id,
        authorId: effectiveAuthorId,
        targetMemberId,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment || "",
        badges: badgesString,
      },
      include: {
        author: true,
      },
    });

    // Recalculate target member average rating
    const allReviewsForTarget = await prisma.review.findMany({
      where: { targetMemberId },
      select: { rating: true },
    });

    if (allReviewsForTarget.length > 0) {
      const avg =
        allReviewsForTarget.reduce((acc, r) => acc + r.rating, 0) /
        allReviewsForTarget.length;
      await prisma.user.update({
        where: { id: targetMemberId },
        data: {
          averageRating: Math.round(avg * 10) / 10,
          totalSessions: { increment: 1 },
        },
      });
    }

    return NextResponse.json(
      {
        id: newReview.id,
        sessionId: sessionRecord.roomId || sessionRecord.id,
        authorId: newReview.authorId,
        authorName: newReview.author.fullName || newReview.author.name || "Member",
        authorAvatar: newReview.author.avatarUrl || newReview.author.image || "",
        authorLocation: newReview.author.neighborhood
          ? `${newReview.author.neighborhood}, ${newReview.author.city}`
          : "Community Member",
        targetMemberId: newReview.targetMemberId,
        rating: newReview.rating,
        comment: newReview.comment,
        badges: Array.isArray(badges) ? badges : [],
        date: "Just now",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

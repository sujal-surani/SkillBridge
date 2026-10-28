import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const queryUserId = req.nextUrl.searchParams.get("userId");
    let userId: string | null = queryUserId;

    if (!userId) {
      try {
        const session = await auth();
        userId = session?.user?.id || null;
      } catch {}
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [transactions, user] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { skillPointsBalance: true },
      }),
    ]);

    const formatted = transactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      type: t.type as "EARNED" | "SPENT" | "BONUS",
      description: t.description,
      timestamp: t.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

    return NextResponse.json({
      balance: user?.skillPointsBalance ?? 50,
      transactions: formatted,
    });
  } catch (error) {
    console.warn("GET /api/karma warning (returning fallback):", error);
    return NextResponse.json({
      balance: 50,
      transactions: [],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const body = await req.json();
    const { userId, amount, type, description } = body;

    const effectiveUserId = currentUserId || userId;

    if (!effectiveUserId || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Invalid user ID or point amount" },
        { status: 400 }
      );
    }

    // Ensure user exists before applying transaction
    await prisma.user.upsert({
      where: { id: effectiveUserId },
      update: {},
      create: {
        id: effectiveUserId,
        email: session?.user?.email || `${effectiveUserId}@skillbridge.local`,
        fullName: "Community Member",
        skillPointsBalance: 50,
      },
    });

    // Execute ledger record creation and user balance update atomically
    const [transaction, updatedUser] = await prisma.$transaction([
      prisma.pointTransaction.create({
        data: {
          userId: effectiveUserId,
          amount,
          type: type || (amount >= 0 ? "EARNED" : "SPENT"),
          description: description || "Community Skill Exchange Credit",
        },
      }),
      prisma.user.update({
        where: { id: effectiveUserId },
        data: {
          skillPointsBalance: {
            increment: amount,
          },
        },
        select: {
          id: true,
          skillPointsBalance: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.type as "EARNED" | "SPENT" | "BONUS",
          description: transaction.description,
          timestamp: "Just now",
        },
        newBalance: updatedUser.skillPointsBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/karma error:", error);
    return NextResponse.json(
      { error: "Failed to record karma transaction" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposals = await prisma.exchangeProposal.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = proposals.map((p) => ({
      id: p.id,
      senderId: p.senderId,
      senderName: p.senderName,
      senderAvatar: p.senderAvatar,
      senderLocation: p.senderLocation,
      senderAge: p.senderAge ?? undefined,
      receiverId: p.receiverId,
      receiverName: p.receiverName,
      receiverAvatar: p.receiverAvatar,
      offeredSkill: p.offeredSkill,
      requestedSkill: p.requestedSkill,
      proposedTime: p.proposedTime,
      status: p.status as "PENDING" | "ACCEPTED" | "DECLINED",
      timestamp: p.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      message: p.message,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/proposals error:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const body = await req.json();
    const {
      senderId,
      senderName,
      senderAvatar,
      senderLocation,
      senderAge,
      receiverId,
      receiverName,
      receiverAvatar,
      offeredSkill,
      requestedSkill,
      proposedTime,
      message,
    } = body;

    const effectiveSenderId = currentUserId || senderId;

    if (!effectiveSenderId || !receiverId || !offeredSkill || !requestedSkill) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure sender and receiver records exist in User table to satisfy FK constraints
    await prisma.user.upsert({
      where: { id: effectiveSenderId },
      update: {},
      create: {
        id: effectiveSenderId,
        email: session?.user?.email || `${effectiveSenderId}@skillbridge.local`,
        fullName: senderName || "Community Member",
        avatarUrl: senderAvatar || "",
        neighborhood: senderLocation ? senderLocation.split(",")[0]?.trim() || "" : "",
        city: senderLocation ? senderLocation.split(",")[1]?.trim() || "" : "",
      },
    });

    await prisma.user.upsert({
      where: { id: receiverId },
      update: {},
      create: {
        id: receiverId,
        email: `${receiverId}@skillbridge.local`,
        fullName: receiverName || "Community Member",
        avatarUrl: receiverAvatar || "",
      },
    });

    const proposal = await prisma.exchangeProposal.create({
      data: {
        senderId: effectiveSenderId,
        senderName: senderName || "Community Member",
        senderAvatar: senderAvatar || "",
        senderLocation: senderLocation || "",
        senderAge: senderAge ? Number(senderAge) : null,
        receiverId,
        receiverName: receiverName || "Community Member",
        receiverAvatar: receiverAvatar || "",
        offeredSkill,
        requestedSkill,
        proposedTime: proposedTime || "Saturday at 10:00 AM IST",
        status: "PENDING",
        message: message || "",
      },
    });

    return NextResponse.json(
      {
        id: proposal.id,
        senderId: proposal.senderId,
        senderName: proposal.senderName,
        senderAvatar: proposal.senderAvatar,
        senderLocation: proposal.senderLocation,
        senderAge: proposal.senderAge ?? undefined,
        receiverId: proposal.receiverId,
        receiverName: proposal.receiverName,
        receiverAvatar: proposal.receiverAvatar,
        offeredSkill: proposal.offeredSkill,
        requestedSkill: proposal.requestedSkill,
        proposedTime: proposal.proposedTime,
        status: proposal.status as "PENDING" | "ACCEPTED" | "DECLINED",
        timestamp: "Just now",
        message: proposal.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/proposals error:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status || !["ACCEPTED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid proposal id or status" },
        { status: 400 }
      );
    }

    const existing = await prisma.exchangeProposal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // If session is present, ensure caller is a participant
    if (userId && existing.senderId !== userId && existing.receiverId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: Not a proposal participant" },
        { status: 403 }
      );
    }

    const updated = await prisma.exchangeProposal.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
    });
  } catch (error) {
    console.error("PATCH /api/proposals error:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}

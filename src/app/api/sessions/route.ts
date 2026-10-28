import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || req.nextUrl.searchParams.get("userId");
    const roomId = req.nextUrl.searchParams.get("roomId");

    // If query by roomId (e.g. in /room/[id])
    if (roomId) {
      const roomSession = await prisma.swapSession.findFirst({
        where: {
          OR: [{ roomId }, { id: roomId }],
        },
        include: {
          participants: {
            include: { user: true },
          },
        },
      });

      if (!roomSession) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: roomSession.id,
        proposalId: roomSession.proposalId || undefined,
        roomId: roomSession.roomId,
        topic: roomSession.topic,
        offeredSkill: roomSession.offeredSkill,
        requestedSkill: roomSession.requestedSkill,
        participants: roomSession.participants.map((p) => ({
          id: p.user.id,
          name: p.user.fullName || p.user.name || "Member",
          avatar: p.user.avatarUrl || p.user.image || "",
          location: p.user.neighborhood ? `${p.user.neighborhood}, ${p.user.city}` : undefined,
          role: (p.role as "mentor" | "learner" | "peer") || "peer",
        })),
        scheduledFor: roomSession.scheduledFor,
        durationMinutes: roomSession.durationMinutes,
        status: roomSession.status as "UPCOMING" | "COMPLETED" | "CANCELLED",
        notesMarkdown: roomSession.notesMarkdown || undefined,
        createdAt: roomSession.createdAt.toISOString(),
        completedAt: roomSession.completedAt ? roomSession.completedAt.toISOString() : undefined,
      });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.swapSession.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      proposalId: s.proposalId || undefined,
      roomId: s.roomId,
      topic: s.topic,
      offeredSkill: s.offeredSkill,
      requestedSkill: s.requestedSkill,
      participants: s.participants.map((p) => ({
        id: p.user.id,
        name: p.user.fullName || p.user.name || "Member",
        avatar: p.user.avatarUrl || p.user.image || "",
        location: p.user.neighborhood ? `${p.user.neighborhood}, ${p.user.city}` : undefined,
        role: (p.role as "mentor" | "learner" | "peer") || "peer",
      })),
      scheduledFor: s.scheduledFor,
      durationMinutes: s.durationMinutes,
      status: s.status as "UPCOMING" | "COMPLETED" | "CANCELLED",
      notesMarkdown: s.notesMarkdown || undefined,
      createdAt: s.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      completedAt: s.completedAt ? s.completedAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const {
      proposalId,
      roomId,
      topic,
      offeredSkill,
      requestedSkill,
      scheduledFor,
      durationMinutes,
      participants,
    } = body;

    const finalRoomId = roomId || `SB-${Math.floor(200 + Math.random() * 700)}`;

    // Ensure all participant users exist in DB
    if (Array.isArray(participants)) {
      for (const p of participants) {
        if (p.id) {
          await prisma.user.upsert({
            where: { id: p.id },
            update: {},
            create: {
              id: p.id,
              email: `${p.id}@skillbridge.local`,
              fullName: p.name || "Community Member",
              avatarUrl: p.avatar || "",
              neighborhood: p.location ? p.location.split(",")[0]?.trim() || "" : "",
              city: p.location ? p.location.split(",")[1]?.trim() || "" : "",
            },
          });
        }
      }
    }

    // Create session and participants transactionally
    const newSession = await prisma.swapSession.create({
      data: {
        proposalId: proposalId || null,
        roomId: finalRoomId,
        topic: topic || `${offeredSkill} ⇄ ${requestedSkill}`,
        offeredSkill: offeredSkill || "Skills",
        requestedSkill: requestedSkill || "Skills",
        scheduledFor: scheduledFor || "Saturday at 10:00 AM IST",
        durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
        status: "UPCOMING",
        participants: {
          create: (participants || []).map((p: any) => ({
            userId: p.id,
            role: p.role || "peer",
          })),
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    // If session was generated from a proposal, update proposal to ACCEPTED
    if (proposalId) {
      await prisma.exchangeProposal.updateMany({
        where: { id: proposalId },
        data: { status: "ACCEPTED" },
      });
    }

    return NextResponse.json(
      {
        id: newSession.id,
        proposalId: newSession.proposalId || undefined,
        roomId: newSession.roomId,
        topic: newSession.topic,
        offeredSkill: newSession.offeredSkill,
        requestedSkill: newSession.requestedSkill,
        participants: newSession.participants.map((p) => ({
          id: p.user.id,
          name: p.user.fullName || p.user.name || "Member",
          avatar: p.user.avatarUrl || p.user.image || "",
          location: p.user.neighborhood ? `${p.user.neighborhood}, ${p.user.city}` : undefined,
          role: (p.role as "mentor" | "learner" | "peer") || "peer",
        })),
        scheduledFor: newSession.scheduledFor,
        durationMinutes: newSession.durationMinutes,
        status: "UPCOMING",
        createdAt: "Just now",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { id, roomId, status, notesMarkdown } = body;

    const targetIdentifier = id || roomId;
    if (!targetIdentifier) {
      return NextResponse.json(
        { error: "Session id or roomId required" },
        { status: 400 }
      );
    }

    const existing = await prisma.swapSession.findFirst({
      where: {
        OR: [{ id: targetIdentifier }, { roomId: targetIdentifier }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.swapSession.update({
      where: { id: existing.id },
      data: {
        status: status || undefined,
        notesMarkdown: notesMarkdown !== undefined ? notesMarkdown : undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      id: updated.id,
      roomId: updated.roomId,
      status: updated.status,
      notesMarkdown: updated.notesMarkdown,
      completedAt: updated.completedAt?.toISOString(),
    });
  } catch (error) {
    console.error("PATCH /api/sessions error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

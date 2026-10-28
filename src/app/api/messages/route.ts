import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || req.nextUrl.searchParams.get("userId");
    const peerId = req.nextUrl.searchParams.get("peerId");

    if (!userId || !peerId) {
      return NextResponse.json(
        { error: "Both userId and peerId are required" },
        { status: 400 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: peerId },
          { senderId: peerId, receiverId: userId },
        ],
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.fullName || m.sender.name || "Member",
      text: m.content,
      timestamp: m.createdAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isSelf: m.senderId === userId,
      attachment: m.attachmentName
        ? {
            name: m.attachmentName,
            type: (m.attachmentType as "file" | "doc") || "file",
            size: m.attachmentSize || "1.2 MB",
          }
        : undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
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
      receiverId,
      receiverName,
      content,
      attachment,
    } = body;

    const effectiveSenderId = currentUserId || senderId;

    if (!effectiveSenderId || !receiverId || !content?.trim()) {
      return NextResponse.json(
        { error: "Missing senderId, receiverId, or message content" },
        { status: 400 }
      );
    }

    // Ensure sender exists in DB
    await prisma.user.upsert({
      where: { id: effectiveSenderId },
      update: {},
      create: {
        id: effectiveSenderId,
        email: session?.user?.email || `${effectiveSenderId}@skillbridge.local`,
        fullName: senderName || "Community Member",
      },
    });

    // Ensure receiver exists in DB
    await prisma.user.upsert({
      where: { id: receiverId },
      update: {},
      create: {
        id: receiverId,
        email: `${receiverId}@skillbridge.local`,
        fullName: receiverName || "Community Member",
      },
    });

    const newMsg = await prisma.chatMessage.create({
      data: {
        senderId: effectiveSenderId,
        receiverId,
        content: content.trim(),
        attachmentName: attachment?.name || null,
        attachmentType: attachment?.type || null,
        attachmentSize: attachment?.size || null,
      },
      include: {
        sender: true,
      },
    });

    return NextResponse.json(
      {
        id: newMsg.id,
        senderId: newMsg.senderId,
        senderName: newMsg.sender.fullName || newMsg.sender.name || "Member",
        text: newMsg.content,
        timestamp: newMsg.createdAt.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        isSelf: newMsg.senderId === effectiveSenderId,
        attachment: newMsg.attachmentName
          ? {
              name: newMsg.attachmentName,
              type: (newMsg.attachmentType as "file" | "doc") || "file",
              size: newMsg.attachmentSize || "1.2 MB",
            }
          : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

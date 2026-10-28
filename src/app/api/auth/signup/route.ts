import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateMembersCache } from "@/lib/membersCache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, age, neighborhood, city, occupation, password } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Full Name and Email are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // Clean monogram avatar generated from user's name matching SkillBridge's burgundy brand
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=7A1C2E&color=fff&rounded=true&bold=true`;

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: normalizedEmail,
        age: age ? parseInt(String(age), 10) : 28,
        avatarUrl,
        image: avatarUrl,
        neighborhood: neighborhood || "Resident",
        city: city || "Community Hub",
        occupationOrInterest: occupation || "Community Member & Lifelong Learner",
        passwordHash: password || null,
        skillPointsBalance: 50,
        averageRating: 5.0,
        totalSessions: 0,
        role: "MEMBER",
        spokenLanguages: JSON.stringify(["English", "Hindi"]),
        availability: JSON.stringify([
          { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
          { day: "Sunday", timeSlots: ["10:00 - 13:00"] },
        ]),
      },
    });

    // Invalidate member cache so directory updates immediately
    invalidateMembersCache();

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.fullName,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user account. Please try again." },
      { status: 500 }
    );
  }
}

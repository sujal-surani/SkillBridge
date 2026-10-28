import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { invalidateMembersCache } from "@/lib/membersCache";
import { CommunityMember } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("userId");
    const queryEmail = searchParams.get("email");

    let sessionUserId = null;
    let sessionEmail = null;

    if (!queryUserId && !queryEmail) {
      try {
        const session = await auth();
        sessionUserId = session?.user?.id;
        sessionEmail = session?.user?.email?.toLowerCase();
      } catch {
        sessionUserId = null;
        sessionEmail = null;
      }
    }

    const effectiveUserId = queryUserId || sessionUserId;
    const effectiveEmail = queryEmail?.toLowerCase() || sessionEmail;

    if (!effectiveUserId && !effectiveEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user identifier" },
        { status: 401 }
      );
    }

    const user = effectiveUserId
      ? await prisma.user.findUnique({
          where: { id: effectiveUserId },
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        })
      : effectiveEmail
      ? await prisma.user.findUnique({
          where: { email: effectiveEmail },
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        })
      : null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Safely parse JSON metadata
    let spokenLanguages: string[] = ["English", "Hindi"];
    try {
      if (user.spokenLanguages) {
        const parsed = JSON.parse(user.spokenLanguages);
        if (Array.isArray(parsed)) spokenLanguages = parsed;
      }
    } catch {
      if (user.spokenLanguages) spokenLanguages = [user.spokenLanguages];
    }

    let availability: CommunityMember["availability"] = [
      { day: "Saturday", timeSlots: ["10:00 - 13:00"] },
      { day: "Sunday", timeSlots: ["10:00 - 13:00"] },
    ];
    try {
      if (user.availability) {
        const parsed = JSON.parse(user.availability);
        if (Array.isArray(parsed)) availability = parsed;
      }
    } catch {}

    const teachingSkills: CommunityMember["teachingSkills"] = user.skills
      .filter((us) => us.type === "TEACHING")
      .map((us) => ({
        name: us.skill.name,
        pillar: (us.skill.pillar as any) || "TECH_PROFESSIONAL",
        category: us.skill.category || "General",
        proficiency: (us.proficiency as any) || "INTERMEDIATE",
        yearsExperience: us.yearsExperience || 1,
        portfolioNote: us.portfolioNote || undefined,
      }));

    const learningSkills: CommunityMember["learningSkills"] = user.skills
      .filter((us) => us.type === "LEARNING")
      .map((us) => ({
        name: us.skill.name,
        pillar: (us.skill.pillar as any) || "HEALTH_WELLNESS",
        category: us.skill.category || "General",
        targetProficiency: (us.proficiency as any) || "BEGINNER",
      }));

    const profile: CommunityMember = {
      id: user.id,
      fullName: user.fullName || user.name || "Community Member",
      age: user.age || 28,
      avatarUrl:
        user.avatarUrl ||
        user.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.name || "Member")}&background=7A1C2E&color=fff&rounded=true&bold=true`,
      email: user.email,
      occupationOrInterest:
        user.occupationOrInterest || "Community Member & Lifelong Learner",
      neighborhood: user.neighborhood || "Resident",
      city: user.city || "Community Hub",
      modePreference:
        (user.modePreference as "ONLINE" | "HYBRID" | "IN_PERSON") || "HYBRID",
      spokenLanguages,
      bio:
        user.bio ||
        "Passionate about exchanging skills, hands-on crafts, and neighborly learning!",
      skillPointsBalance: user.skillPointsBalance ?? 50,
      averageRating: user.averageRating || 5.0,
      totalSessions: user.totalSessions || 0,
      teachingSkills,
      learningSkills,
      availability,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/users/profile error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user profile", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }
    const body = await req.json();

    let effectiveUserId = session?.user?.id || body.userId;
    const effectiveEmail = session?.user?.email?.toLowerCase() || body.email?.toLowerCase();

    // Secondary fallback lookup if ID wasn't provided directly
    if (!effectiveUserId && effectiveEmail) {
      const dbUser = await prisma.user.findUnique({
        where: { email: effectiveEmail },
        select: { id: true },
      });
      effectiveUserId = dbUser?.id;
    }

    if (!effectiveUserId) {
      return NextResponse.json(
        { error: "Unauthorized or missing user identifier" },
        { status: 401 }
      );
    }

    const {
      fullName,
      bio,
      neighborhood,
      city,
      modePreference,
      availability,
      spokenLanguages,
      teachingSkills,
      learningSkills,
    } = body;

    // Prepare profile updates
    const userUpdateData: Record<string, any> = {};

    if (typeof fullName === "string" && fullName.trim()) userUpdateData.fullName = fullName.trim();
    if (typeof bio === "string") userUpdateData.bio = bio;
    if (typeof neighborhood === "string") userUpdateData.neighborhood = neighborhood;
    if (typeof city === "string") userUpdateData.city = city;
    if (typeof modePreference === "string") userUpdateData.modePreference = modePreference;

    if (spokenLanguages !== undefined) {
      userUpdateData.spokenLanguages = Array.isArray(spokenLanguages)
        ? JSON.stringify(spokenLanguages)
        : String(spokenLanguages);
    }

    if (availability !== undefined) {
      userUpdateData.availability = Array.isArray(availability)
        ? JSON.stringify(availability)
        : String(availability);
    }

    // 1. Update base user record and clear old skills in parallel
    const userUpdatePromise = prisma.user.upsert({
      where: { id: effectiveUserId },
      update: userUpdateData,
      create: {
        id: effectiveUserId,
        email: effectiveEmail || `${effectiveUserId}@skillbridge.local`,
        fullName: fullName || session?.user?.name || "Community Member",
        ...userUpdateData,
      },
    });

    const deleteSkillsPromises: Promise<any>[] = [];
    if (Array.isArray(teachingSkills)) {
      deleteSkillsPromises.push(
        prisma.userSkill.deleteMany({
          where: { userId: effectiveUserId, type: "TEACHING" },
        })
      );
    }
    if (Array.isArray(learningSkills)) {
      deleteSkillsPromises.push(
        prisma.userSkill.deleteMany({
          where: { userId: effectiveUserId, type: "LEARNING" },
        })
      );
    }

    const [updatedUser] = await Promise.all([
      userUpdatePromise,
      ...deleteSkillsPromises,
    ]);

    // 2. Synchronize Skills in parallel without blocking interactive transaction locks
    const skillOperations: Promise<any>[] = [];

    if (Array.isArray(teachingSkills)) {
      for (const item of teachingSkills) {
        if (!item.name || !item.name.trim()) continue;
        const skillName = item.name.trim();

        skillOperations.push(
          (async () => {
            const skill = await prisma.skill.upsert({
              where: { name: skillName },
              update: {},
              create: {
                name: skillName,
                pillar: item.pillar || "TECH_PROFESSIONAL",
                category: item.category || "General",
                iconName: "Sparkles",
              },
            });

            return prisma.userSkill.create({
              data: {
                userId: effectiveUserId,
                skillId: skill.id,
                type: "TEACHING",
                proficiency: item.proficiency || "INTERMEDIATE",
                yearsExperience: Number(item.yearsExperience) || 1,
                portfolioNote: item.portfolioNote || null,
              },
            });
          })()
        );
      }
    }

    if (Array.isArray(learningSkills)) {
      for (const item of learningSkills) {
        if (!item.name || !item.name.trim()) continue;
        const skillName = item.name.trim();

        skillOperations.push(
          (async () => {
            const skill = await prisma.skill.upsert({
              where: { name: skillName },
              update: {},
              create: {
                name: skillName,
                pillar: item.pillar || "HEALTH_WELLNESS",
                category: item.category || "General",
                iconName: "BookOpen",
              },
            });

            return prisma.userSkill.create({
              data: {
                userId: effectiveUserId,
                skillId: skill.id,
                type: "LEARNING",
                proficiency: item.targetProficiency || item.proficiency || "BEGINNER",
                yearsExperience: 0,
              },
            });
          })()
        );
      }
    }

    if (skillOperations.length > 0) {
      await Promise.all(skillOperations);
    }

    invalidateMembersCache();

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/users/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: String(error) },
      { status: 500 }
    );
  }
}

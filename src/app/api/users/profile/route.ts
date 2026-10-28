import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const effectiveUserId = session?.user?.id || body.userId;

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

    if (typeof fullName === "string") userUpdateData.fullName = fullName;
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

    // Execute atomic transaction for user profile and skill relation synchronization
    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Upsert base user record
      const user = await tx.user.upsert({
        where: { id: effectiveUserId },
        update: userUpdateData,
        create: {
          id: effectiveUserId,
          email: session?.user?.email || body.email || `${effectiveUserId}@skillbridge.local`,
          fullName: fullName || session?.user?.name || "Community Member",
          ...userUpdateData,
        },
      });

      // 2. Synchronize Teaching Skills if provided
      if (Array.isArray(teachingSkills)) {
        await tx.userSkill.deleteMany({
          where: {
            userId: effectiveUserId,
            type: "TEACHING",
          },
        });

        for (const item of teachingSkills) {
          if (!item.name || !item.name.trim()) continue;
          const skillName = item.name.trim();

          const skill = await tx.skill.upsert({
            where: { name: skillName },
            update: {},
            create: {
              name: skillName,
              pillar: item.pillar || "TECH_PROFESSIONAL",
              category: item.category || "General",
              iconName: "Sparkles",
            },
          });

          await tx.userSkill.create({
            data: {
              userId: effectiveUserId,
              skillId: skill.id,
              type: "TEACHING",
              proficiency: item.proficiency || "INTERMEDIATE",
              yearsExperience: Number(item.yearsExperience) || 1,
              portfolioNote: item.portfolioNote || null,
            },
          });
        }
      }

      // 3. Synchronize Learning Skills if provided
      if (Array.isArray(learningSkills)) {
        await tx.userSkill.deleteMany({
          where: {
            userId: effectiveUserId,
            type: "LEARNING",
          },
        });

        for (const item of learningSkills) {
          if (!item.name || !item.name.trim()) continue;
          const skillName = item.name.trim();

          const skill = await tx.skill.upsert({
            where: { name: skillName },
            update: {},
            create: {
              name: skillName,
              pillar: item.pillar || "HEALTH_WELLNESS",
              category: item.category || "General",
              iconName: "BookOpen",
            },
          });

          await tx.userSkill.create({
            data: {
              userId: effectiveUserId,
              skillId: skill.id,
              type: "LEARNING",
              proficiency: item.targetProficiency || item.proficiency || "BEGINNER",
              yearsExperience: 0,
            },
          });
        }
      }

      // Return user with populated skills
      return await tx.user.findUnique({
        where: { id: effectiveUserId },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
    });

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

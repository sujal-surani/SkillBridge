import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CommunityMember } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedMembers: CommunityMember[] = users.map((user) => {
      // Parse JSON fields safely
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

      // Map UserSkills to teaching and learning arrays
      const teachingSkills: CommunityMember["teachingSkills"] = user.skills
        .filter((us) => us.type === "TEACHING")
        .map((us) => ({
          name: us.skill.name,
          pillar: (us.skill.pillar as any) || "TECH_PROFESSIONAL",
          category: us.skill.category || "General",
          proficiency: (us.proficiency as any) || "INTERMEDIATE",
          yearsExperience: us.yearsExperience || 1,
        }));

      const learningSkills: CommunityMember["learningSkills"] = user.skills
        .filter((us) => us.type === "LEARNING")
        .map((us) => ({
          name: us.skill.name,
          pillar: (us.skill.pillar as any) || "HEALTH_WELLNESS",
          category: us.skill.category || "General",
          targetProficiency: (us.proficiency as any) || "BEGINNER",
        }));

      return {
        id: user.id,
        fullName: user.fullName || user.name || "Community Member",
        age: user.age || 28,
        avatarUrl:
          user.avatarUrl ||
          user.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
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
        averageRating: user.averageRating ?? 5.0,
        totalSessions: user.totalSessions ?? 0,
        teachingSkills:
          teachingSkills.length > 0
            ? teachingSkills
            : [
                {
                  name: "Community Skill Sharing",
                  pillar: "TECH_PROFESSIONAL",
                  category: "General",
                  proficiency: "INTERMEDIATE",
                  yearsExperience: 1,
                },
              ],
        learningSkills:
          learningSkills.length > 0
            ? learningSkills
            : [
                {
                  name: "Practical Neighbor Craft",
                  pillar: "CREATIVE_PRACTICAL",
                  category: "General",
                  targetProficiency: "BEGINNER",
                },
              ],
        availability,
      };
    });

    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error("GET /api/members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch community members" },
      { status: 500 }
    );
  }
}

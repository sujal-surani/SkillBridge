import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CommunityMember } from "@/lib/types";
import {
  getCachedMembers,
  setCachedMembers,
  getInFlightPromise,
  setInFlightPromise,
} from "@/lib/membersCache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = getCachedMembers();
    if (cached) {
      return NextResponse.json(cached);
    }

    const inFlight = getInFlightPromise();
    if (inFlight) {
      const data = await inFlight;
      return NextResponse.json(data);
    }

    const fetchPromise = (async () => {
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
          averageRating: user.averageRating ?? 5.0,
          totalSessions: user.totalSessions ?? 0,
          teachingSkills,
          learningSkills,
          availability,
        };
      });

      setCachedMembers(formattedMembers);
      return formattedMembers;
    })();

    setInFlightPromise(fetchPromise);
    const result = await fetchPromise;
    setInFlightPromise(null);
    return NextResponse.json(result);
  } catch (error) {
    setInFlightPromise(null);
    console.warn("GET /api/members warning (returning fallback):", error);
    const stale = getCachedMembers();
    if (stale) {
      return NextResponse.json(stale);
    }
    return NextResponse.json([]);
  }
}

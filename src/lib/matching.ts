import { CommunityMember } from "./data/mock-data";

export interface MatchScoreBreakdown {
  totalScore: number; // 0 - 100
  skillScore: number; // max 50
  availabilityScore: number; // max 15
  languageScore: number; // max 10
  levelScore: number; // max 10
  modeGeoScore: number; // max 10
  reputationScore: number; // max 5
  mutualTeachSkill?: string;
  mutualLearnSkill?: string;
  breakdown: { dimension: string; points: number; max: number }[];
}

export function calculateMatchScore(
  currentUser: CommunityMember,
  candidate: CommunityMember
): MatchScoreBreakdown {
  let skillScore = 0;
  let mutualTeachSkill = "";
  let mutualLearnSkill = "";

  // 1. Skill Compatibility (Max 50)
  // Check if candidate teaches something currentUser wants to learn
  const candidateCanTeachMe = candidate.teachingSkills.find((t) =>
    currentUser.learningSkills.some(
      (l) =>
        l.name.toLowerCase() === t.name.toLowerCase() ||
        l.category.toLowerCase() === t.category.toLowerCase() ||
        l.pillar === t.pillar
    )
  );

  // Check if currentUser teaches something candidate wants to learn
  const meCanTeachCandidate = currentUser.teachingSkills.find((t) =>
    candidate.learningSkills.some(
      (l) =>
        l.name.toLowerCase() === t.name.toLowerCase() ||
        l.category.toLowerCase() === t.category.toLowerCase() ||
        l.pillar === t.pillar
    )
  );

  if (candidateCanTeachMe && meCanTeachCandidate) {
    // Exact mutual swap
    const exact1 = currentUser.learningSkills.some(
      (l) => l.name.toLowerCase() === candidateCanTeachMe.name.toLowerCase()
    );
    const exact2 = candidate.learningSkills.some(
      (l) => l.name.toLowerCase() === meCanTeachCandidate.name.toLowerCase()
    );

    skillScore = exact1 && exact2 ? 50 : 44;
    mutualTeachSkill = meCanTeachCandidate.name;
    mutualLearnSkill = candidateCanTeachMe.name;
  } else if (candidateCanTeachMe) {
    skillScore = 32;
    mutualLearnSkill = candidateCanTeachMe.name;
    mutualTeachSkill = currentUser.teachingSkills[0]?.name || "Skills";
  } else {
    skillScore = 15;
    mutualLearnSkill = candidate.teachingSkills[0]?.name || "General Knowledge";
    mutualTeachSkill = currentUser.teachingSkills[0]?.name || "General Knowledge";
  }

  // 2. Availability Overlap (Max 15)
  let matchingDays = 0;
  currentUser.availability.forEach((userSlot) => {
    const candidateHasDay = candidate.availability.some(
      (cSlot) => cSlot.day.toLowerCase() === userSlot.day.toLowerCase()
    );
    if (candidateHasDay) {
      matchingDays++;
    }
  });
  const availabilityScore = Math.min(15, matchingDays * 5 || 5);

  // 3. Language Match (Max 10)
  const sharedLanguages = currentUser.spokenLanguages.filter((lang) =>
    candidate.spokenLanguages.some((cLang) => cLang.toLowerCase() === lang.toLowerCase())
  );
  const languageScore = sharedLanguages.length > 0 ? 10 : 0;

  // 4. Level Compatibility (Max 10)
  const levelScore = candidate.teachingSkills.some(
    (s) => s.proficiency === "EXPERIENCED" || s.proficiency === "INTERMEDIATE"
  )
    ? 10
    : 7;

  // 5. Mode & Geographical Proximity (Max 10)
  let modeGeoScore = 0;
  const sameCity =
    currentUser.city.toLowerCase().split(",")[0] ===
    candidate.city.toLowerCase().split(",")[0];

  if (sameCity && (currentUser.modePreference === "IN_PERSON" || candidate.modePreference === "IN_PERSON")) {
    modeGeoScore = 10; // Perfect local neighborhood match
  } else if (currentUser.modePreference === candidate.modePreference) {
    modeGeoScore = 10;
  } else if (
    currentUser.modePreference === "HYBRID" ||
    candidate.modePreference === "HYBRID"
  ) {
    modeGeoScore = 8;
  } else {
    modeGeoScore = 6;
  }

  // 6. Community Reputation & Momentum (Max 5)
  let reputationScore = 2;
  if (candidate.averageRating >= 4.9 && candidate.totalSessions >= 12) {
    reputationScore = 5;
  } else if (candidate.averageRating >= 4.6) {
    reputationScore = 4;
  } else {
    reputationScore = 3;
  }

  const totalScore = Math.min(
    100,
    skillScore +
      availabilityScore +
      languageScore +
      levelScore +
      modeGeoScore +
      reputationScore
  );

  return {
    totalScore,
    skillScore,
    availabilityScore,
    languageScore,
    levelScore,
    modeGeoScore,
    reputationScore,
    mutualTeachSkill: mutualTeachSkill || currentUser.teachingSkills[0]?.name,
    mutualLearnSkill: mutualLearnSkill || candidate.teachingSkills[0]?.name,
    breakdown: [
      { dimension: "Mutual Skill Complementarity", points: skillScore, max: 50 },
      { dimension: "Schedule Overlap", points: availabilityScore, max: 15 },
      { dimension: "Language Alignment", points: languageScore, max: 10 },
      { dimension: "Proficiency Pairing", points: levelScore, max: 10 },
      { dimension: "Proximity & Mode", points: modeGeoScore, max: 10 },
      { dimension: "Community Reputation", points: reputationScore, max: 5 },
    ],
  };
}

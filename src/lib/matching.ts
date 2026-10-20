import { StudentProfile } from "./data/mock-data";

export interface MatchScoreBreakdown {
  totalScore: number; // 0 - 100
  skillScore: number; // max 50
  availabilityScore: number; // max 15
  languageScore: number; // max 10
  levelScore: number; // max 10
  modeScore: number; // max 10
  reputationScore: number; // max 5
  mutualTeachSkill?: string;
  mutualLearnSkill?: string;
}

export function calculateMatchScore(
  currentUser: StudentProfile,
  candidate: StudentProfile
): MatchScoreBreakdown {
  let skillScore = 0;
  let mutualTeachSkill = "";
  let mutualLearnSkill = "";

  // 1. Skill Compatibility (Max 50)
  // Check if candidate teaches something currentUser wants to learn
  const candidateCanTeachMe = candidate.teachingSkills.find((t) =>
    currentUser.learningSkills.some(
      (l) => l.name.toLowerCase() === t.name.toLowerCase() ||
             l.category.toLowerCase() === t.category.toLowerCase()
    )
  );

  // Check if currentUser teaches something candidate wants to learn
  const meCanTeachCandidate = currentUser.teachingSkills.find((t) =>
    candidate.learningSkills.some(
      (l) => l.name.toLowerCase() === t.name.toLowerCase() ||
             l.category.toLowerCase() === t.category.toLowerCase()
    )
  );

  if (candidateCanTeachMe && meCanTeachCandidate) {
    // Perfect 2-way mutual skill swap
    skillScore = 50;
    mutualTeachSkill = meCanTeachCandidate.name;
    mutualLearnSkill = candidateCanTeachMe.name;
  } else if (candidateCanTeachMe) {
    // 1-way match
    skillScore = 35;
    mutualLearnSkill = candidateCanTeachMe.name;
  } else {
    // Category proximity
    skillScore = 15;
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
  const sharedLanguages = currentUser.languages.filter((lang) =>
    candidate.languages.some((cLang) => cLang.toLowerCase() === lang.toLowerCase())
  );
  const languageScore = sharedLanguages.length > 0 ? 10 : 0;

  // 4. Level Compatibility (Max 10)
  // Candidate's proficiency is ADVANCED or INTERMEDIATE
  const levelScore = candidate.teachingSkills.some(
    (s) => s.proficiency === "ADVANCED" || s.proficiency === "INTERMEDIATE"
  )
    ? 10
    : 6;

  // 5. Mode / Location Match (Max 10)
  let modeScore = 0;
  if (currentUser.modePreference === candidate.modePreference) {
    modeScore = 10;
  } else if (
    currentUser.modePreference === "HYBRID" ||
    candidate.modePreference === "HYBRID"
  ) {
    modeScore = 8;
  } else {
    modeScore = 4;
  }

  // 6. Reputation & Points (Max 5)
  let reputationScore = 2;
  if (candidate.averageRating >= 4.8 && candidate.totalSessions >= 10) {
    reputationScore = 5;
  } else if (candidate.averageRating >= 4.5) {
    reputationScore = 4;
  }

  const totalScore = Math.min(
    100,
    skillScore +
      availabilityScore +
      languageScore +
      levelScore +
      modeScore +
      reputationScore
  );

  return {
    totalScore,
    skillScore,
    availabilityScore,
    languageScore,
    levelScore,
    modeScore,
    reputationScore,
    mutualTeachSkill: mutualTeachSkill || currentUser.teachingSkills[0]?.name,
    mutualLearnSkill: mutualLearnSkill || candidate.teachingSkills[0]?.name,
  };
}

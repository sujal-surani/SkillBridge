// ─────────────────────────────────────────────────────────────────────────────
// SkillBridge — Central Platform Type Definitions
// Phase 2 / Sprint 4: Unified Domain Types (Replaces mock-data.ts)
// ─────────────────────────────────────────────────────────────────────────────

export type SkillPillar =
  | "TECH_PROFESSIONAL"
  | "HEALTH_WELLNESS"
  | "CREATIVE_PRACTICAL"
  | "ACADEMIC_LANGUAGES";

export type ProficiencyLevel = "BEGINNER" | "INTERMEDIATE" | "EXPERIENCED";

export type ModePreference = "ONLINE" | "HYBRID" | "IN_PERSON";

export interface TeachingSkillItem {
  name: string;
  pillar: SkillPillar;
  category: string;
  proficiency: ProficiencyLevel;
  yearsExperience: number;
  portfolioNote?: string;
}

export interface LearningSkillItem {
  name: string;
  pillar: SkillPillar;
  category: string;
  targetProficiency: ProficiencyLevel;
}

export interface AvailabilitySlot {
  day: string;
  timeSlots: string[];
}

export interface CommunityMember {
  id: string;
  fullName: string;
  age: number;
  avatarUrl: string;
  email: string;
  occupationOrInterest: string;
  neighborhood: string;
  city: string;
  modePreference: ModePreference;
  spokenLanguages: string[];
  bio: string;
  skillPointsBalance: number;
  averageRating: number;
  totalSessions: number;
  teachingSkills: TeachingSkillItem[];
  learningSkills: LearningSkillItem[];
  availability: AvailabilitySlot[];
}

export interface QuestionReplyItem {
  id: string;
  authorName: string;
  authorOccupation: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  isSolution: boolean;
  upvotes: number;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAge: number;
  authorOccupation: string;
  authorNeighborhood: string;
  authorAvatar: string;
  pillar: SkillPillar;
  tags: string[];
  createdAt: string;
  upvotes: number;
  isSolved: boolean;
  repliesCount: number;
  replies: QuestionReplyItem[];
}

export interface SwapProposal {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLocation: string;
  senderAge?: number;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  offeredSkill: string;
  requestedSkill: string;
  proposedTime: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  timestamp: string;
  message: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  location?: string;
  role: "mentor" | "learner" | "peer";
}

export interface SwapSession {
  id: string;
  proposalId?: string;
  roomId: string;
  topic: string;
  offeredSkill: string;
  requestedSkill: string;
  participants: Participant[];
  scheduledFor: string;
  durationMinutes: number;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  notesMarkdown?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SessionReview {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  targetMemberId: string;
  rating: number;
  comment: string;
  badges: string[];
  date: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  type: "EARNED" | "SPENT" | "BONUS";
  description: string;
  timestamp: string;
}

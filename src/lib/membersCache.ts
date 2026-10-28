import { CommunityMember } from "@/lib/types";

let cachedMembers: { data: CommunityMember[]; timestamp: number } | null = null;
let inFlightPromise: Promise<CommunityMember[]> | null = null;
const CACHE_TTL_MS = 15_000; // 15 seconds cache

export function getCachedMembers(): CommunityMember[] | null {
  const now = Date.now();
  if (cachedMembers && now - cachedMembers.timestamp < CACHE_TTL_MS) {
    return cachedMembers.data;
  }
  return null;
}

export function setCachedMembers(data: CommunityMember[]) {
  cachedMembers = { data, timestamp: Date.now() };
}

export function getInFlightPromise(): Promise<CommunityMember[]> | null {
  return inFlightPromise;
}

export function setInFlightPromise(promise: Promise<CommunityMember[]> | null) {
  inFlightPromise = promise;
}

export function invalidateMembersCache() {
  cachedMembers = null;
}

import type { UserRole } from "@stability/types";

export const USER_ROLES = [
  "parent",
  "caregiver",
  "therapist",
] as const satisfies readonly UserRole[];

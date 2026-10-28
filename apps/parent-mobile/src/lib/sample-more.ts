/**
 * ILLUSTRATIVE SAMPLE DATA for the More area (profile and notifications).
 * Invented details; replace with the signed-in caregiver's account.
 */
export const sampleProfile = {
  name: "Tamar Levi",
  givenName: "Tamar",
  relation: "mother",
  email: "tamar.levi@example.com",
  phone: "050-000-0000",
  memberSince: "2026-09-02",
} as const;

export const sampleNotificationDefaults = {
  guidance: true,
  routine: true,
  checkIn: true,
  sessions: true,
  quietHours: false,
} as const;

import Constants from "expo-constants";

import type { FamilyContent } from "@/lib/sample-family";

/** Places Ask AI may send a parent. Must match the server's list. */
export const askDestinations = [
  "home",
  "routine",
  "log_now",
  "log_earlier",
  "messages",
  "checkin",
  "appointments",
  "resources",
  "family",
  "profile",
] as const;
export type AskDestination = (typeof askDestinations)[number];

export const destinationHref: Record<AskDestination, string> = {
  home: "/",
  routine: "/routine",
  log_now: "/log?start=support",
  log_earlier: "/log?start=earlier",
  messages: "/messages",
  checkin: "/surveys",
  appointments: "/appointments",
  resources: "/resources",
  family: "/family",
  profile: "/profile",
};

export interface AskTurn {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface AskReply {
  readonly answer: string;
  readonly action: AskDestination | null;
  readonly askTherapist: boolean;
}

export type AskFailure = "not_configured" | "unreachable";

export class AskError extends Error {
  constructor(readonly reason: AskFailure) {
    super(reason);
  }
}

/**
 * The Ask AI endpoint lives on the therapist web server, which holds the
 * OpenAI key. In development it defaults to the same machine Metro runs on.
 */
function endpoint(): string | null {
  const configured = process.env["EXPO_PUBLIC_ASK_AI_URL"];
  if (configured) return configured;
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return host ? `http://${host}:3000/api/ask` : null;
}

export async function askAi(
  body: { language: string; messages: readonly AskTurn[]; context: string },
  signal: AbortSignal,
): Promise<AskReply> {
  const url = endpoint();
  if (!url) throw new AskError("not_configured");
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new AskError("unreachable");
  }
  if (response.status === 503) throw new AskError("not_configured");
  if (!response.ok) throw new AskError("unreachable");
  const data = (await response.json()) as Partial<AskReply>;
  if (typeof data.answer !== "string") throw new AskError("unreachable");
  return {
    answer: data.answer,
    action: askDestinations.includes(data.action as AskDestination)
      ? (data.action as AskDestination)
      : null,
    askTherapist: data.askTherapist === true,
  };
}

/** A compact, plain-text picture of the family for the model to ground on. */
export function buildAskContext(
  content: FamilyContent,
  done: ReadonlySet<string>,
  checkinSent: boolean,
): string {
  const { family, schedule, strategies, recentLogs, therapistNotes, visits } =
    content;
  const now = content.SAMPLE_NOW;
  const clock = now.slice(11, 16);
  const lines = [
    `Now: ${now.replace("T", " ")}`,
    `Child: ${family.child.givenName}, age ${family.child.age}. Goal: ${family.child.goal}`,
    `Therapist: ${family.therapist.name} (${family.therapist.givenName}), ${family.therapist.credential}.`,
    `Caregivers: ${family.caregivers.map((c) => `${c.givenName} (${c.relation}${c.you ? ", the person asking" : ""})`).join(", ")}.`,
    `Weekly check-in: ${checkinSent ? "done this week" : "not done yet this week"}.`,
    "",
    "Today's routine:",
    ...schedule.map((step) => {
      const state = done.has(step.id)
        ? "done"
        : step.time <= clock
          ? "now or earlier, not ticked"
          : "later";
      const extra = step.adjusted
        ? ` (adjusted by ${step.adjusted.by}: ${step.adjusted.note})`
        : "";
      return `- ${step.time}${step.endTime ? `-${step.endTime}` : ""} ${step.title} [${state}]: ${step.detail}${extra}`;
    }),
    "",
    "Therapist's approved strategies:",
    ...strategies
      .filter((s) => s.approved)
      .map(
        (s) =>
          `- ${s.id}: when ${s.when}. Steps: ${s.steps.join("; ")}. Helped ${s.worked} of ${s.tried} times.`,
      ),
    "",
    "Therapist's notes (newest first):",
    ...therapistNotes
      .slice(0, 4)
      .map(
        (n) =>
          `- [${n.category}${n.isRead ? "" : ", unread"}] ${n.title}: ${n.preview}`,
      ),
    "",
    "Recently logged moments:",
    ...recentLogs
      .slice(0, 8)
      .map(
        (l) =>
          `- ${l.at.replace("T", " ")} ${l.type}, ${l.intensity} intensity, helped: ${l.helped ?? "nothing noted"}, by ${l.by}`,
      ),
    "",
    "Upcoming sessions:",
    ...visits
      .slice(0, 2)
      .map(
        (v) =>
          `- ${v.at.replace("T", " ")}, ${v.durationMin} min, ${v.mode} at ${v.place}. Focus: ${v.focus}. Bring: ${v.bring.join(", ") || "nothing"}.`,
      ),
  ];
  return lines.join("\n").slice(0, 6000);
}

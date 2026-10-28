import type { Tone } from "@/components/case-file/primitives";
import type { MessageKind } from "@/lib/sample-data/types";

export type GuidanceKind = Exclude<MessageKind, "reply">;

export const guidanceKinds: readonly GuidanceKind[] = ["recommendation", "observation", "reminder", "routineAdjustment"];

/** Gold is reserved for action, so it never marks a message kind. */
export const kindTone: Record<GuidanceKind, Exclude<Tone, "gold" | "ruby">> = {
  recommendation: "moss",
  observation: "cobalt",
  reminder: "clay",
  routineAdjustment: "ink",
};

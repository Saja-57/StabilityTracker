import type { TranslationKey } from "@stability/i18n";

export type EventLogMode = "quick" | "detailed";

export type EventType =
  "behavioralEvent" | "meltdown" | "sensoryOverload" | "other";

export type EventIntensity = "low" | "moderate" | "high";
export type EventTimingMode = "now" | "earlier";
export type EventMediaKind = "photo" | "video" | "audio" | "gallery";
export type DetailedLogStep = "basics" | "before" | "during" | "response";

export interface EventLogChoice<TValue extends string> {
  readonly labelKey: TranslationKey;
  readonly value: TValue;
}

export interface EventLogDraft {
  readonly behavior: string;
  readonly before: string;
  readonly date: string;
  readonly duration: string;
  readonly environment: string;
  readonly eventType: EventType | null;
  readonly helped: string;
  readonly intensity: EventIntensity | null;
  readonly notes: string;
  readonly recovery: string;
  readonly time: string;
  readonly timingMode: EventTimingMode | null;
  readonly trigger: string;
}

export type EventLogDraftChange = <TKey extends keyof EventLogDraft>(
  key: TKey,
  value: EventLogDraft[TKey],
) => void;

export function createEmptyEventLogDraft(): EventLogDraft {
  return {
    behavior: "",
    before: "",
    date: "",
    duration: "",
    environment: "",
    eventType: null,
    helped: "",
    intensity: null,
    notes: "",
    recovery: "",
    time: "",
    timingMode: null,
    trigger: "",
  };
}

import type { TranslationKey } from "@stability/i18n";

import type { PictogramName } from "@/components/icons/pictograms";

/** Where the parent is in the Log tab. */
export type EventLogStage =
  "entry" | "support" | "quick" | "detailed" | "review" | "saved";
export type EventLogMode = "quick" | "detailed";

export type EventType =
  "behavioralEvent" | "meltdown" | "sensoryOverload" | "other";
export type EventIntensity = "low" | "moderate" | "high";
export type EventTimingMode = "now" | "hour" | "today" | "yesterday";
export type EventTrigger =
  | "transition"
  | "noise"
  | "demand"
  | "denied"
  | "tired"
  | "crowd"
  | "screenOff"
  | "unknown";
export type EventSetting =
  "home" | "school" | "car" | "store" | "outdoors" | "bedtime";
export type EventSupport =
  | "deepPressure"
  | "quietSpace"
  | "visualTimer"
  | "choices"
  | "movementBreak"
  | "music"
  | "countdown"
  | "headphones";
export type EventDuration = "short" | "medium" | "long" | "longer";
export type EventMediaKind = "photo" | "video" | "audio" | "gallery";

/** A photo, clip, or voice note attached to a logged moment. */
export interface EventMediaAttachment {
  readonly id: string;
  readonly kind: "photo" | "video" | "audio";
  /** A file on this device until uploads are connected. */
  readonly uri: string;
  readonly durationMs?: number;
}
export type DetailedLogStep = "basics" | "before" | "during" | "response";

/** Picture art for a choice: a shared pictogram or one drawn for the log. */
export type LogPictureName = PictogramName | LocalPictureName;
export type LocalPictureName =
  | "home"
  | "car"
  | "store"
  | "outdoors"
  | "transition"
  | "denied"
  | "tired"
  | "crowd"
  | "screenOff"
  | "slip";

export interface EventLogChoice<TValue extends string> {
  readonly labelKey: TranslationKey;
  readonly value: TValue;
  readonly picture?: LogPictureName;
}

export interface EventLogDraft {
  readonly eventType: EventType | null;
  readonly intensity: EventIntensity | null;
  readonly timingMode: EventTimingMode | null;
  readonly triggers: readonly EventTrigger[];
  readonly beforeNote: string;
  readonly setting: EventSetting | null;
  readonly duration: EventDuration | null;
  readonly duringNote: string;
  readonly supports: readonly EventSupport[];
  readonly helpedNote: string;
  readonly media: readonly EventMediaAttachment[];
}

export type EventLogDraftChange = <TKey extends keyof EventLogDraft>(
  key: TKey,
  value: EventLogDraft[TKey],
) => void;

export function createEmptyEventLogDraft(
  timingMode: EventTimingMode | null = null,
): EventLogDraft {
  return {
    eventType: null,
    intensity: null,
    timingMode,
    triggers: [],
    beforeNote: "",
    setting: null,
    duration: null,
    duringNote: "",
    supports: [],
    helpedNote: "",
    media: [],
  };
}

/* ---------------------------------------------------------- view models */

/** A therapist-approved calming strategy, ready for the support screen. */
export interface EventLogStrategyViewModel {
  readonly id: string;
  readonly support: EventSupport;
  readonly when: string;
  readonly steps: readonly string[];
  readonly worked: number;
  readonly tried: number;
}

/** One logged moment in the recent list. */
export interface EventLogEntryViewModel {
  readonly id: string;
  /** Local wall-clock "YYYY-MM-DDTHH:mm". */
  readonly at: string;
  readonly type: EventType;
  readonly intensity: EventIntensity | null;
  readonly helped: EventSupport | null;
  readonly by: string;
  /** Everything the caregiver filled in; absent on sample entries. */
  readonly details?: EventLogDraft;
}

export interface EventLogScreenProps {
  /** Open straight into a stage, e.g. "support" from Home's help action. */
  readonly initialStage?: EventLogStage;
  readonly childName: string;
  readonly therapistName: string;
  readonly caregiverName: string;
  /** The current local wall-clock time, "YYYY-MM-DDTHH:mm". */
  readonly now: string;
  readonly strategies: readonly EventLogStrategyViewModel[];
  readonly recentLogs: readonly EventLogEntryViewModel[];
  readonly onSave: (entry: EventLogEntryViewModel) => void;
  readonly onGoHome: () => void;
}

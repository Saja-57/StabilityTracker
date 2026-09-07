import type { TranslationKey } from "@stability/i18n";

import type {
  EventIntensity,
  EventLogChoice,
  EventTimingMode,
  EventType,
} from "./types";

export const eventTypeLabelKeys: Record<EventType, TranslationKey> = {
  behavioralEvent: "eventLog.type.behavioralEvent",
  meltdown: "eventLog.type.meltdown",
  sensoryOverload: "eventLog.type.sensoryOverload",
  other: "eventLog.type.other",
};

export const eventIntensityLabelKeys: Record<EventIntensity, TranslationKey> = {
  low: "eventLog.intensity.low",
  moderate: "eventLog.intensity.moderate",
  high: "eventLog.intensity.high",
};

export const eventTimingLabelKeys: Record<EventTimingMode, TranslationKey> = {
  now: "eventLog.timing.now",
  earlier: "eventLog.timing.earlier",
};

export const eventTypeOptions = [
  {
    labelKey: eventTypeLabelKeys.behavioralEvent,
    value: "behavioralEvent",
  },
  { labelKey: eventTypeLabelKeys.meltdown, value: "meltdown" },
  {
    labelKey: eventTypeLabelKeys.sensoryOverload,
    value: "sensoryOverload",
  },
  { labelKey: eventTypeLabelKeys.other, value: "other" },
] as const satisfies readonly EventLogChoice<EventType>[];

export const eventIntensityOptions = [
  { labelKey: eventIntensityLabelKeys.low, value: "low" },
  { labelKey: eventIntensityLabelKeys.moderate, value: "moderate" },
  { labelKey: eventIntensityLabelKeys.high, value: "high" },
] as const satisfies readonly EventLogChoice<EventIntensity>[];

export const eventTimingOptions = [
  { labelKey: eventTimingLabelKeys.now, value: "now" },
  { labelKey: eventTimingLabelKeys.earlier, value: "earlier" },
] as const satisfies readonly EventLogChoice<EventTimingMode>[];

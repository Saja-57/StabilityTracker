import type { TranslationKey } from "@stability/i18n";

import type {
  DetailedLogStep,
  EventDuration,
  EventIntensity,
  EventLogChoice,
  EventMediaKind,
  EventSetting,
  EventSupport,
  EventTimingMode,
  EventTrigger,
  EventType,
} from "./types";

export const eventTypeLabelKeys: Record<EventType, TranslationKey> = {
  behavioralEvent: "eventLog.type.behavioralEvent",
  meltdown: "eventLog.type.meltdown",
  sensoryOverload: "eventLog.type.sensoryOverload",
  other: "eventLog.type.other",
};

export const eventIntensityLabelKeys: Record<EventIntensity, TranslationKey> = {
  low: "vocab.intensity.low",
  moderate: "vocab.intensity.moderate",
  high: "vocab.intensity.high",
};

export const eventTimingLabelKeys: Record<EventTimingMode, TranslationKey> = {
  now: "eventLog.timing.now",
  hour: "logFlow.timing.hour",
  today: "logFlow.timing.today",
  yesterday: "common.yesterday",
};

/** Minutes before "now" each timing chip stands for, for the saved slip. */
export const eventTimingOffsetMinutes: Record<EventTimingMode, number> = {
  now: 0,
  hour: -30,
  today: -180,
  yesterday: -1440,
};

export const eventTypeOptions = [
  {
    labelKey: eventTypeLabelKeys.behavioralEvent,
    value: "behavioralEvent",
    picture: "behavioralEvent",
  },
  {
    labelKey: eventTypeLabelKeys.meltdown,
    value: "meltdown",
    picture: "meltdown",
  },
  {
    labelKey: eventTypeLabelKeys.sensoryOverload,
    value: "sensoryOverload",
    picture: "sensoryOverload",
  },
  { labelKey: eventTypeLabelKeys.other, value: "other", picture: "other" },
] as const satisfies readonly EventLogChoice<EventType>[];

export const eventIntensityOptions = [
  { labelKey: eventIntensityLabelKeys.low, value: "low" },
  { labelKey: eventIntensityLabelKeys.moderate, value: "moderate" },
  { labelKey: eventIntensityLabelKeys.high, value: "high" },
] as const satisfies readonly EventLogChoice<EventIntensity>[];

export const eventTimingOptions = [
  { labelKey: eventTimingLabelKeys.now, value: "now" },
  { labelKey: eventTimingLabelKeys.hour, value: "hour" },
  { labelKey: eventTimingLabelKeys.today, value: "today" },
  { labelKey: eventTimingLabelKeys.yesterday, value: "yesterday" },
] as const satisfies readonly EventLogChoice<EventTimingMode>[];

export const eventTriggerOptions = [
  {
    labelKey: "vocab.trigger.transition",
    value: "transition",
    picture: "transition",
  },
  {
    labelKey: "vocab.trigger.noise",
    value: "noise",
    picture: "sensoryOverload",
  },
  { labelKey: "vocab.trigger.demand", value: "demand", picture: "homework" },
  { labelKey: "vocab.trigger.denied", value: "denied", picture: "denied" },
  { labelKey: "vocab.trigger.tired", value: "tired", picture: "tired" },
  { labelKey: "vocab.trigger.crowd", value: "crowd", picture: "crowd" },
  {
    labelKey: "vocab.trigger.screenOff",
    value: "screenOff",
    picture: "screenOff",
  },
  { labelKey: "vocab.trigger.unknown", value: "unknown", picture: "other" },
] as const satisfies readonly EventLogChoice<EventTrigger>[];

export const eventSettingOptions = [
  { labelKey: "vocab.setting.home", value: "home", picture: "home" },
  { labelKey: "vocab.setting.school", value: "school", picture: "school" },
  { labelKey: "vocab.setting.car", value: "car", picture: "car" },
  { labelKey: "vocab.setting.store", value: "store", picture: "store" },
  {
    labelKey: "vocab.setting.outdoors",
    value: "outdoors",
    picture: "outdoors",
  },
  { labelKey: "vocab.setting.bedtime", value: "bedtime", picture: "bedtime" },
] as const satisfies readonly EventLogChoice<EventSetting>[];

export const eventDurationOptions = [
  { labelKey: "logFlow.duration.short", value: "short" },
  { labelKey: "logFlow.duration.medium", value: "medium" },
  { labelKey: "logFlow.duration.long", value: "long" },
  { labelKey: "logFlow.duration.longer", value: "longer" },
] as const satisfies readonly EventLogChoice<EventDuration>[];

export const eventSupportOptions = [
  {
    labelKey: "vocab.support.deepPressure",
    value: "deepPressure",
    picture: "deepPressure",
  },
  {
    labelKey: "vocab.support.quietSpace",
    value: "quietSpace",
    picture: "quietSpace",
  },
  {
    labelKey: "vocab.support.headphones",
    value: "headphones",
    picture: "headphones",
  },
  {
    labelKey: "vocab.support.countdown",
    value: "countdown",
    picture: "countdown",
  },
  {
    labelKey: "vocab.support.visualTimer",
    value: "visualTimer",
    picture: "visualTimer",
  },
  { labelKey: "vocab.support.choices", value: "choices", picture: "choices" },
  {
    labelKey: "vocab.support.movementBreak",
    value: "movementBreak",
    picture: "movementBreak",
  },
  { labelKey: "vocab.support.music", value: "music", picture: "music" },
] as const satisfies readonly EventLogChoice<EventSupport>[];

export const eventSupportLabelKeys = Object.fromEntries(
  eventSupportOptions.map((option) => [option.value, option.labelKey]),
) as Record<EventSupport, TranslationKey>;

export function isEventSupport(value: string): value is EventSupport {
  return eventSupportOptions.some((option) => option.value === value);
}

export function isEventType(value: string): value is EventType {
  return eventTypeOptions.some((option) => option.value === value);
}

export function labelFor<TValue extends string>(
  options: readonly EventLogChoice<TValue>[],
  value: TValue,
): TranslationKey | undefined {
  return options.find((option) => option.value === value)?.labelKey;
}

export const eventMediaOptions = [
  { labelKey: "eventLog.media.photo", value: "photo", glyph: "camera" },
  { labelKey: "eventLog.media.video", value: "video", glyph: "video" },
  { labelKey: "eventLog.media.audio", value: "audio", glyph: "mic" },
  { labelKey: "eventLog.media.gallery", value: "gallery", glyph: "image" },
] as const satisfies readonly {
  labelKey: TranslationKey;
  value: EventMediaKind;
  glyph: "camera" | "video" | "mic" | "image";
}[];

export const detailedSteps = [
  { value: "basics", labelKey: "eventLog.sections.basics" },
  { value: "before", labelKey: "eventLog.sections.before" },
  { value: "during", labelKey: "eventLog.sections.during" },
  { value: "response", labelKey: "eventLog.sections.helped" },
] as const satisfies readonly {
  value: DetailedLogStep;
  labelKey: TranslationKey;
}[];

import { StyleSheet, View } from "react-native";

import { Paper, Row, Stamp } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill, isolate } from "@/lib/format";
import { formatDay, formatTime } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { cf, space, surface } from "@/theme/case-file";

import {
  eventDurationOptions,
  eventIntensityLabelKeys,
  eventSettingOptions,
  eventSupportLabelKeys,
  eventTriggerOptions,
  eventTypeLabelKeys,
  labelFor,
} from "../options";
import type { EventLogDraft } from "../types";
import { IntensityMark } from "./intensity-selector";
import { LogPicture } from "./log-picture";

/**
 * The event as a paper slip, in the order a therapist reads it:
 * before, behavior, what helped.
 */
export function EventReview({
  draft,
  at,
  caregiverName,
  stamped = false,
}: {
  draft: EventLogDraft;
  at: string;
  caregiverName: string;
  stamped?: boolean;
}) {
  const { language, t } = useLanguage();
  const notNoted = t("logFlow.review.notNoted");
  const join = (parts: readonly (string | undefined)[]) =>
    parts.filter(Boolean).join(", ");

  const before = join(
    draft.triggers.map((value) => {
      const key = labelFor(eventTriggerOptions, value);
      return key ? t(key) : undefined;
    }),
  );
  const settingKey = draft.setting
    ? labelFor(eventSettingOptions, draft.setting)
    : undefined;
  const durationKey = draft.duration
    ? labelFor(eventDurationOptions, draft.duration)
    : undefined;
  const behavior = join([
    draft.intensity ? t(eventIntensityLabelKeys[draft.intensity]) : undefined,
    settingKey ? t(settingKey) : undefined,
    durationKey ? t(durationKey) : undefined,
  ]);
  const helped = join(
    draft.supports.map((value) => t(eventSupportLabelKeys[value])),
  );
  const type = draft.eventType
    ? t(eventTypeLabelKeys[draft.eventType])
    : notNoted;

  return (
    <View style={styles.wrap}>
      <Paper style={styles.slip}>
        <Row style={styles.between} align="center">
          <Stamp
            label={`${formatDay(at, language)} ${formatTime(at, language)}`}
            tilt={-2}
          />
          {draft.intensity ? (
            <IntensityMark value={draft.intensity} size={22} />
          ) : null}
        </Row>

        <Row gap={space.md} align="center">
          <View style={styles.picture}>
            {draft.eventType ? (
              <LogPicture
                name={draft.eventType}
                size={44}
                color={cf.pressboard.base}
                tintColor={cf.tab.mossWash}
              />
            ) : null}
          </View>
          <Type variant="title" style={styles.flex}>
            {type}
          </Type>
        </Row>

        <SlipPart
          label={t("vocab.abc.before")}
          value={before}
          note={draft.beforeNote}
          empty={notNoted}
        />
        <SlipPart
          label={t("vocab.abc.behavior")}
          value={behavior}
          note={draft.duringNote}
          empty={notNoted}
        />
        <SlipPart
          label={t("vocab.abc.helped")}
          value={helped}
          note={draft.helpedNote}
          empty={notNoted}
          moss
        />

        <Type variant="caption" color="muted">
          {fill(t("logFlow.review.by"), { name: isolate(caregiverName) })}
        </Type>
      </Paper>
      {stamped ? (
        <View style={styles.stamp} pointerEvents="none">
          <Stamp label={t("logFlow.saved.stamp")} tone="moss" tilt={-8} />
        </View>
      ) : null}
    </View>
  );
}

function SlipPart({
  label,
  value,
  note,
  empty,
  moss = false,
}: {
  label: string;
  value: string;
  note: string;
  empty: string;
  moss?: boolean;
}) {
  const trimmed = note.trim();
  return (
    <View style={styles.part}>
      <Type variant="label" color="secondary">
        {label}
      </Type>
      {value || !trimmed ? (
        <Type
          variant="body"
          color={value ? (moss ? "moss" : "primary") : "muted"}
        >
          {value || empty}
        </Type>
      ) : null}
      {trimmed ? (
        <Type variant="body" color="secondary" style={styles.note}>
          {isolate(trimmed)}
        </Type>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 6 },
  slip: {
    borderRadius: 6,
    gap: space.lg,
    padding: 20,
    paddingTop: 18,
    transform: [{ rotate: "-0.8deg" }],
  },
  between: { justifyContent: "space-between" },
  flex: { flex: 1 },
  picture: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  part: {
    borderTopColor: surface.rule,
    borderTopWidth: 1,
    borderStyle: "dashed",
    gap: 4,
    paddingTop: space.md,
  },
  note: { fontStyle: "italic" },
  stamp: {
    end: 14,
    position: "absolute",
    top: 58,
    transform: [{ scale: 1.6 }],
  },
});

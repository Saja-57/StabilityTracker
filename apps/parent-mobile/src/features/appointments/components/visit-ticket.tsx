import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import {
  PenTickButton,
  Row,
  Stamp,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { fill, isolate } from "@/lib/format";
import { addMinutes, formatTime, formatWeekday } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

import type { VisitMode, VisitViewModel } from "../types";

export const modeGlyph: Record<VisitMode, GlyphName> = {
  clinic: "clinic",
  video: "video",
  home: "home",
};

/** The rubber-stamped date block: weekday, day, month. */
export function DateStamp({
  at,
  size = "large",
}: {
  at: string;
  size?: "large" | "small";
}) {
  const { language } = useLanguage();
  const large = size === "large";
  const day = String(Number(at.slice(8, 10)));
  const month = new Intl.DateTimeFormat(
    { en: "en-GB", he: "he-IL", ar: "ar-EG" }[language],
    {
      month: "short",
      timeZone: "UTC",
    },
  ).format(new Date(`${at.slice(0, 10)}T12:00:00Z`));
  return (
    <View
      style={[
        styles.dateStamp,
        large ? styles.dateStampLarge : styles.dateStampSmall,
      ]}
    >
      <Type variant="stamp" style={styles.stampInk} numberOfLines={1}>
        {formatWeekday(at, language)}
      </Type>
      <Type
        variant={large ? "figureLarge" : "figure"}
        style={[styles.stampInk, large ? styles.dayLarge : styles.daySmall]}
      >
        {day}
      </Type>
      <Type variant="stamp" style={styles.stampInk} numberOfLines={1}>
        {month}
      </Type>
    </View>
  );
}

/**
 * The next visit as a ticket stub: stamped date and time above the
 * perforation, what to bring below it, ticked with the pen.
 */
export function VisitTicket({
  visit,
  isToday,
  rescheduleRequested,
}: {
  visit: VisitViewModel;
  isToday: boolean;
  rescheduleRequested: boolean;
}) {
  const { language, t } = useLanguage();
  const [packed, setPacked] = useState<readonly string[]>([]);
  const toggle = (item: string) =>
    setPacked((current) =>
      current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item],
    );
  const allPacked =
    visit.bring.length > 0 && packed.length === visit.bring.length;

  return (
    <Animated.View
      layout={LinearTransition.duration(320).easing(paperEase)}
      style={styles.ticket}
    >
      <View style={styles.top}>
        <Row align="flex-start" gap={space.lg}>
          <DateStamp at={visit.at} />
          <View style={[styles.flex, styles.when]}>
            {isToday ? (
              <TabLabel tone="cobalt" label={t("common.today")} />
            ) : null}
            <Type variant="figureLarge" style={styles.time}>
              {formatTime(visit.at, language)}
            </Type>
            <Type variant="small" color="muted">
              {fill(t("more.appointments.duration"), {
                minutes: visit.durationMin,
                end: formatTime(
                  addMinutes(visit.at, visit.durationMin),
                  language,
                ),
              })}
            </Type>
          </View>
        </Row>
        {rescheduleRequested ? (
          <Animated.View
            entering={FadeIn.duration(260)}
            style={styles.requestStamp}
          >
            <Stamp
              label={t("more.appointments.requestSent")}
              tone="pen"
              tilt={-6}
            />
          </Animated.View>
        ) : null}
        <Type variant="title">{isolate(visit.focus)}</Type>
        <Row gap={space.md} align="flex-start">
          <View style={styles.modeTile}>
            <Glyph
              name={modeGlyph[visit.mode]}
              color={cf.tab.cobaltInk}
              size={22}
              tint={0.25}
            />
          </View>
          <View style={styles.flex}>
            <Type variant="label">{t(`vocab.mode.${visit.mode}`)}</Type>
            <Type variant="small" color="secondary">
              {isolate(visit.place)}
            </Type>
          </View>
        </Row>
      </View>

      <View style={styles.perforation} aria-hidden>
        <View style={[styles.notch, styles.notchStart]} />
        <View style={styles.dashes} />
        <View style={[styles.notch, styles.notchEnd]} />
      </View>

      <View style={styles.bottom}>
        <Row style={styles.between}>
          <Type variant="headline" accessibilityRole="header">
            {t("more.appointments.bring")}
          </Type>
          {visit.bring.length > 0 ? (
            <Type
              variant="figure"
              color={allPacked ? "moss" : "muted"}
              style={styles.count}
            >
              {fill(t("more.appointments.packed"), {
                done: packed.length,
                total: visit.bring.length,
              })}
            </Type>
          ) : null}
        </Row>
        {visit.bring.length === 0 ? (
          <Type variant="body" color="secondary">
            {t("more.appointments.bringNothing")}
          </Type>
        ) : (
          visit.bring.map((item, index) => {
            const checked = packed.includes(item);
            return (
              <Row
                key={item}
                gap={space.md}
                style={[styles.bringRow, index > 0 ? styles.ruled : null]}
              >
                <PenTickButton
                  checked={checked}
                  onToggle={() => toggle(item)}
                  label={item}
                />
                <Type
                  variant="body"
                  color={checked ? "muted" : "primary"}
                  style={styles.flex}
                >
                  {isolate(item)}
                </Type>
              </Row>
            );
          })
        )}
        {allPacked ? (
          <Animated.View entering={FadeIn.duration(260)}>
            <Row gap={6}>
              <Glyph name="tick" color={cf.tab.mossInk} size={16} />
              <Type variant="small" color="moss">
                {t("more.appointments.allPacked")}
              </Type>
            </Row>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const NOTCH = 22;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  between: { justifyContent: "space-between" },
  ticket: {
    backgroundColor: surface.raised,
    borderRadius: corner.xl,
    ...elevation.lift,
  },
  top: { gap: space.lg, padding: 20 },
  when: { gap: 4, paddingTop: 2 },
  time: { fontSize: 40, lineHeight: 44 },
  requestStamp: { end: 18, position: "absolute", top: 20 },
  modeTile: {
    alignItems: "center",
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  perforation: { alignItems: "center", flexDirection: "row", height: NOTCH },
  notch: {
    backgroundColor: surface.ground,
    borderRadius: NOTCH / 2,
    height: NOTCH,
    position: "absolute",
    width: NOTCH,
  },
  notchStart: { start: -NOTCH / 2 },
  notchEnd: { end: -NOTCH / 2 },
  dashes: {
    borderColor: surface.ruleStrong,
    borderStyle: "dashed",
    borderTopWidth: 1.5,
    flex: 1,
    marginHorizontal: NOTCH / 2 + 6,
  },
  bottom: { gap: space.sm, padding: 20, paddingTop: space.md },
  count: { fontSize: 13 },
  bringRow: { minHeight: 56, paddingVertical: 4 },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
  dateStamp: {
    alignItems: "center",
    borderColor: ink.stamp,
    borderWidth: 1.5,
    justifyContent: "center",
    transform: [{ rotate: "-3deg" }],
  },
  dateStampLarge: { borderRadius: 12, gap: 2, height: 96, width: 80 },
  dateStampSmall: {
    borderRadius: 10,
    height: 60,
    transform: [{ rotate: "-2deg" }],
    width: 52,
  },
  stampInk: { color: ink.stamp },
  dayLarge: { fontSize: 34, lineHeight: 38 },
  daySmall: { fontSize: 20, lineHeight: 24 },
});

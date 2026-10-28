import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import {
  Action,
  Paper,
  Row,
  SectionTitle,
  Stamp,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { ScreenContainer } from "@/components/ui";
import { StackHeader } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { formatStampDate, formatTime } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { cf, ink, space, surface } from "@/theme/case-file";

import { DateStamp, VisitTicket, modeGlyph } from "./components/visit-ticket";
import type { AppointmentsScreenProps } from "./types";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

/** Visits with Lena: the next one as a ticket to pack for, then what is coming and what happened. */
export function AppointmentsScreen({
  now,
  therapistGivenName,
  visits,
  pastVisits,
}: AppointmentsScreenProps) {
  const { language, t } = useLanguage();
  const [calendared, setCalendared] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);
  const lena = isolate(therapistGivenName);
  const today = now.slice(0, 10);
  const [next, ...upcoming] = visits;

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <Animated.View entering={enter(0)}>
        <StackHeader
          title={t("more.appointments.title")}
          lede={fill(t("more.appointments.lede"), { name: lena })}
        />
      </Animated.View>

      {next ? (
        <Animated.View entering={enter(1)} style={styles.section}>
          <VisitTicket
            visit={next}
            isToday={next.at.startsWith(today)}
            rescheduleRequested={rescheduled}
          />
          <Animated.View
            layout={LinearTransition.duration(300).easing(paperEase)}
            style={styles.actions}
          >
            <Row gap={space.md}>
              <View style={styles.flex}>
                <Action
                  label={
                    calendared
                      ? t("more.appointments.calendarAdded")
                      : t("more.appointments.calendar")
                  }
                  glyph={calendared ? "tick" : "calendar"}
                  variant={calendared ? "outline" : "ink"}
                  onPress={() => setCalendared((value) => !value)}
                  style={styles.half}
                />
              </View>
              <View style={styles.flex}>
                <Action
                  label={
                    rescheduled
                      ? t("more.appointments.requestSentShort")
                      : t("more.appointments.reschedule")
                  }
                  glyph={rescheduled ? "send" : "clock"}
                  variant="outline"
                  disabled={rescheduled}
                  onPress={() => setRescheduled(true)}
                  style={styles.half}
                />
              </View>
            </Row>
            {calendared ? (
              <Animated.View entering={FadeIn.duration(240)}>
                <Type variant="small" color="muted">
                  {t("more.appointments.calendarNote")}
                </Type>
              </Animated.View>
            ) : null}
            {rescheduled ? (
              <Animated.View entering={FadeIn.duration(240)}>
                <Paper tone="sunk" style={styles.requestNote}>
                  <Row gap={space.sm} align="flex-start">
                    <Glyph name="send" color={ink.pen} size={18} />
                    <View style={styles.flex}>
                      <Type variant="label">
                        {fill(t("more.appointments.requestTitle"), {
                          name: lena,
                        })}
                      </Type>
                      <Type variant="small" color="secondary">
                        {fill(t("more.appointments.requestDetail"), {
                          name: lena,
                        })}
                      </Type>
                    </View>
                  </Row>
                  <Action
                    label={t("more.appointments.requestUndo")}
                    variant="quiet"
                    size="small"
                    onPress={() => setRescheduled(false)}
                    style={styles.undo}
                  />
                </Paper>
              </Animated.View>
            ) : null}
          </Animated.View>
        </Animated.View>
      ) : (
        <Paper>
          <Type variant="body" color="secondary">
            {fill(t("more.hub.appointments.none"), { name: lena })}
          </Type>
        </Paper>
      )}

      {upcoming.length > 0 ? (
        <Animated.View entering={enter(2)} style={styles.section}>
          <SectionTitle title={t("more.appointments.upcoming")} />
          {upcoming.map((visit) => (
            <Paper key={visit.id} style={styles.rowCard}>
              <Row gap={space.lg} align="flex-start">
                <DateStamp at={visit.at} size="small" />
                <View style={[styles.flex, styles.rowCopy]}>
                  <Row gap={space.sm} style={styles.between}>
                    <Type variant="figure">
                      {formatTime(visit.at, language)}
                    </Type>
                    <Row gap={4}>
                      <Glyph
                        name={modeGlyph[visit.mode]}
                        color={cf.tab.cobaltInk}
                        size={17}
                      />
                      <Type variant="caption" color="cobalt">
                        {t(`vocab.mode.${visit.mode}`)}
                      </Type>
                    </Row>
                  </Row>
                  <Type variant="label">{isolate(visit.focus)}</Type>
                  <Type variant="small" color="muted">
                    {isolate(visit.place)}
                  </Type>
                  {visit.bring.length > 0 ? (
                    <Type variant="caption" color="muted">
                      {fill(t("more.appointments.bringList"), {
                        items: visit.bring
                          .map(isolate)
                          .join(t("more.listSeparator")),
                      })}
                    </Type>
                  ) : null}
                </View>
              </Row>
            </Paper>
          ))}
        </Animated.View>
      ) : null}

      {pastVisits.length > 0 ? (
        <Animated.View entering={enter(3)} style={styles.section}>
          <SectionTitle title={t("more.appointments.past")} />
          <View style={styles.past}>
            {pastVisits.map((visit, index) => (
              <View
                key={visit.id}
                style={[styles.pastRow, index > 0 ? styles.ruled : null]}
              >
                <Stamp
                  label={formatStampDate(visit.at, language)}
                  tilt={-1.5}
                />
                <Type variant="label">{isolate(visit.focus)}</Type>
                <Type variant="body" color="secondary">
                  {isolate(visit.summary)}
                </Type>
              </View>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  half: { paddingHorizontal: space.md },
  between: { justifyContent: "space-between" },
  section: { gap: space.md },
  actions: { gap: space.md },
  requestNote: { gap: space.sm, padding: 14 },
  undo: { alignSelf: "flex-start", paddingHorizontal: 0 },
  rowCard: { padding: 14 },
  rowCopy: { gap: 2 },
  past: {
    borderColor: surface.rule,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: space.lg,
  },
  pastRow: { gap: 6, paddingVertical: space.lg },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
});

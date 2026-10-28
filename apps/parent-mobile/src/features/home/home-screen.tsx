import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

import {
  Action,
  EventBarcode,
  Magnet,
  Paper,
  PenMark,
  PenTickButton,
  PressCard,
  Row,
  SectionTitle,
  Stamp,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { ScreenContainer } from "@/components/ui";
import { fill, isolate } from "@/lib/format";
import { SAMPLE_NOW, type ScheduleStep } from "@/lib/sample-family";
import { formatDay, formatLongDay, formatTime } from "@/lib/time";
import { useFamilyContent } from "@/lib/use-family-content";
import { useRoutineDay } from "@/lib/use-routine-day";
import { useTherapistNotes } from "@/providers/family-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";
import { getDirectionalRowStyle } from "@/theme/direction";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

const NOW_WIDTH = 296;
const PEEK_WIDTH = 132;

/**
 * Home is the fridge door: the day as a row of picture cards starting at
 * now, the therapist's latest note held by a magnet, and help always within
 * thumb reach.
 */
export function HomeScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { family, schedule, therapistNotes: sampleNotes, visits, fortnight, sinceSessionIndex } = useFamilyContent();
  const therapistNotes = useTherapistNotes(sampleNotes);
  const { completions, complete } = useRoutineDay();
  const go = (href: string) => router.push(href as Href);
  const isDone = (step: ScheduleStep) => step.id in completions;
  const ahead = schedule.filter((step) => !isDone(step));
  const done = schedule.length - ahead.length;
  const [current, ...later] = ahead;
  const adjustedNext = later.find((step) => step.adjusted);
  const note = therapistNotes.find((entry) => !entry.isRead) ?? therapistNotes[0];
  const session = visits.find((visit) => visit.at.startsWith(SAMPLE_NOW.slice(0, 10)));
  const loggedSince = fortnight.slice(sinceSessionIndex).reduce((sum, day) => sum + day.length, 0);
  const you = family.caregivers.find((caregiver) => caregiver.you);

  return (
    <View style={styles.root}>
      <ScreenContainer contentContainerStyle={styles.content} scrollProps={{ showsVerticalScrollIndicator: false }}>
        <Animated.View entering={enter(0)} style={styles.header}>
          <Type variant="hero" accessibilityRole="header">
            {fill(t("home.greeting.morning"), { name: you?.givenName ?? "" })}
          </Type>
          <Row wrap gap={space.md} style={styles.between}>
            <Stamp label={formatLongDay(SAMPLE_NOW, language)} tilt={-2} />
            <Row gap={6} style={styles.childChip}>
              <View style={styles.childMonogram}>
                <Type variant="label" style={styles.childInitial}>
                  {family.child.givenName.slice(0, 1)}
                </Type>
              </View>
              <Type variant="label">{family.child.givenName}</Type>
            </Row>
          </Row>
          <Row gap={space.sm}>
            <Row gap={3} style={styles.tally}>
              {schedule.map((step) => (
                <View key={step.id} style={[styles.tallyBox, isDone(step) ? styles.tallyBoxDone : null]}>
                  {isDone(step) ? <PenMark visible size={14} /> : null}
                </View>
              ))}
            </Row>
            <Type variant="small" color="secondary">
              {fill(t("home.tally"), { done, total: schedule.length })}
            </Type>
          </Row>
        </Animated.View>

        {current ? (
          <Animated.View entering={enter(1)} style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToAlignment="start"
              contentContainerStyle={[getDirectionalRowStyle(language), styles.pager]}
              style={styles.pagerScroll}
            >
              <NowCard
                step={current}
                onDone={() => complete(current.id)}
                onOpen={() => go("/routine")}
              />
              {later.map((step, index) => (
                <PeekCard key={step.id} step={step} first={index === 0} onOpen={() => go("/routine")} />
              ))}
            </ScrollView>
            {adjustedNext?.adjusted ? (
              <Row align="flex-start" gap={8} style={styles.adjusted}>
                <Glyph name="edit" color={cf.tab.cobaltInk} size={16} />
                <View style={styles.flex}>
                  <Type variant="caption" color="cobalt">
                    {fill(t("home.adjustedStep"), {
                      name: isolate(adjustedNext.adjusted.by),
                      time: adjustedNext.time,
                    })}
                  </Type>
                  <Type variant="caption" color="secondary">
                    {isolate(adjustedNext.adjusted.note)}
                  </Type>
                </View>
              </Row>
            ) : null}
          </Animated.View>
        ) : (
          <Paper tone="sunk" style={styles.allDone}>
            <PenMark visible size={40} />
            <Type variant="title">{t("home.allDone")}</Type>
          </Paper>
        )}

        {note ? (
          <Animated.View entering={enter(2)}>
            <PressCard
              accessibilityRole="button"
              accessibilityLabel={`${fill(t("home.note.from"), { name: family.therapist.givenName })}. ${isolate(note.title)}`}
              onPress={() => go("/messages")}
              style={styles.noteWrap}
            >
              <View style={styles.magnetPin}>
                <Magnet unread={!note.isRead} />
              </View>
              <Paper style={styles.note}>
                <Type variant="title">{isolate(note.title)}</Type>
                <Row wrap gap={space.sm}>
                  <TabLabel tone="ink" label={t(`vocab.messageKind.${note.category}`)} />
                  <Type variant="caption" color="muted" style={styles.figures}>
                    {note.sentAt ? formatTime(note.sentAt, language) : ""}
                  </Type>
                </Row>
                <Type variant="body" color="secondary" numberOfLines={3}>
                  {isolate(note.preview)}
                </Type>
                <Row style={styles.between}>
                  <Type variant="small" color="muted" style={styles.flex}>
                    {fill(t("home.note.from"), { name: isolate(family.therapist.name) })}
                  </Type>
                  <Row gap={2}>
                    <Type variant="label">{t("home.note.read")}</Type>
                    <Glyph name="chevron" color={ink.primary} size={17} />
                  </Row>
                </Row>
              </Paper>
            </PressCard>
          </Animated.View>
        ) : null}

        <Animated.View entering={enter(3)} style={styles.section}>
          <PressCard accessibilityRole="button" accessibilityLabel={t("home.checkin.title")} onPress={() => go("/surveys")} style={styles.slipWrap}>
            <View style={styles.slipMagnet}>
              <Magnet unread />
            </View>
            <Paper style={styles.slip}>
              <Pictogram name="choices" size={34} color={cf.tab.goldInk} tint={0.22} />
              <View style={styles.flex}>
                <Type variant="label">{t("home.checkin.title")}</Type>
                <Type variant="small" color="muted">
                  {t("home.checkin.detail")}
                </Type>
              </View>
              <Glyph name="chevron" color={ink.muted} size={18} />
            </Paper>
          </PressCard>

          {session ? (
            <PressCard
              accessibilityRole="button"
              accessibilityLabel={fill(t("home.session.title"), { time: formatTime(session.at, language) })}
              onPress={() => go("/appointments")}
            >
              <View style={styles.ticket}>
                <View style={styles.ticketStub}>
                  <Type variant="figureLarge" style={styles.ticketTime}>
                    {formatTime(session.at, language)}
                  </Type>
                  <Type variant="caption" color="boardMuted">
                    {t("common.today")}
                  </Type>
                </View>
                <View style={[styles.flex, styles.ticketBody]}>
                  <Type variant="label">{fill(t("home.session.with"), { name: isolate(family.therapist.givenName) })}</Type>
                  <Type variant="small" color="muted" numberOfLines={2}>
                    {isolate(session.focus)}
                  </Type>
                </View>
                <View style={styles.ticketChevron}>
                  <Glyph name="chevron" color={ink.muted} size={18} />
                </View>
              </View>
            </PressCard>
          ) : null}
        </Animated.View>

        <Animated.View entering={enter(4)} style={styles.section}>
          <SectionTitle title={t("home.week.title")} />
          <Paper style={styles.weekCard}>
            <EventBarcode days={fortnight} height={48} sinceIndex={sinceSessionIndex} />
            <Row style={styles.between}>
              <Type variant="caption" color="muted">
                {formatDay("2026-10-01", language)}
              </Type>
              <Type variant="caption" color="muted">
                {t("common.today")}
              </Type>
            </Row>
            <Type variant="body" color="secondary">
              {fill(t("home.week.summary"), {
                count: loggedSince,
                date: formatDay("2026-10-07", language),
                support: t("vocab.support.deepPressure"),
              })}
            </Type>
          </Paper>
        </Animated.View>
      </ScreenContainer>

      <View pointerEvents="box-none" style={styles.dock}>
        <Action
          label={t("home.help.action")}
          accessibilityHint={t("home.help.hint")}
          glyph="heart"
          variant="ink"
          size="large"
          onPress={() => go("/log?start=support")}
          style={styles.dockAction}
        />
      </View>
    </View>
  );
}

function NowCard({ step, onDone, onOpen }: { step: ScheduleStep; onDone: () => void; onOpen: () => void }) {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(false);
  return (
    <Animated.View layout={LinearTransition.duration(380).easing(paperEase)}>
      <Paper style={styles.now}>
        <Row align="flex-start" gap={space.md}>
          <PressCard
            accessibilityRole="button"
            accessibilityLabel={`${t("home.now")}: ${isolate(step.title)}`}
            onPress={onOpen}
            style={styles.nowPicture}
          >
            <Pictogram name={step.pictogram} size={50} color={cf.pressboard.base} tintColor={cf.tab.mossWash} />
          </PressCard>
          <View style={[styles.flex, styles.nowText]}>
            <Type variant="title" numberOfLines={3}>
              {isolate(step.title)}
            </Type>
            <Row wrap gap={space.sm}>
              <Type variant="figure" color="secondary">
                {step.endTime ? fill(t("home.until"), { start: step.time, end: step.endTime }) : step.time}
              </Type>
              <TabLabel tone="cobalt" label={t("home.now")} />
            </Row>
          </View>
          <PenTickButton
            checked={checked}
            label={fill(t("home.markDone"), { step: isolate(step.title) })}
            onToggle={() => {
              if (checked) return;
              setChecked(true);
              setTimeout(onDone, 520);
            }}
          />
        </Row>
        <Type variant="small" color="secondary" numberOfLines={2}>
          {isolate(step.detail)}
        </Type>
      </Paper>
    </Animated.View>
  );
}

function PeekCard({ step, first, onOpen }: { step: ScheduleStep; first: boolean; onOpen: () => void }) {
  const { language, t } = useLanguage();
  return (
    <PressCard
      accessibilityRole="button"
      accessibilityLabel={`${step.time} ${isolate(step.title)}`}
      onPress={onOpen}
      style={styles.peek}
    >
      <Row style={styles.between}>
        <Type variant="figure" color={first ? "primary" : "muted"} style={styles.peekTime}>
          {formatTime(`2026-10-14T${step.time}`, language)}
        </Type>
        {step.adjusted ? <Glyph name="edit" color={cf.tab.cobaltInk} size={15} /> : null}
      </Row>
      <View style={styles.peekPicture}>
        <Pictogram name={step.pictogram} size={44} color={cf.pressboard.base} tint={0.2} />
      </View>
      <Type variant="caption" numberOfLines={2} style={styles.peekLabel}>
        {first ? `${t("home.nextShort")} ` : ""}
        {isolate(step.title)}
      </Type>
    </PressCard>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: surface.ground },
  content: { gap: 24, paddingBottom: 128 },
  flex: { flex: 1 },
  between: { justifyContent: "space-between" },
  figures: { fontVariant: ["tabular-nums"] },
  header: { gap: space.md },
  section: { gap: space.md },
  childChip: {
    backgroundColor: surface.raised,
    borderColor: surface.rule,
    borderRadius: corner.pill,
    borderWidth: 1,
    paddingEnd: 12,
    paddingStart: 4,
    paddingVertical: 4,
  },
  childMonogram: {
    alignItems: "center",
    backgroundColor: cf.pressboard.base,
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  childInitial: { color: cf.pressboard.ink, fontSize: 13 },
  tally: { pointerEvents: "none" },
  tallyBox: {
    alignItems: "center",
    borderColor: surface.ruleStrong,
    borderRadius: 4,
    borderWidth: 1.2,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  tallyBoxDone: { backgroundColor: cf.tab.cobaltWash, borderColor: cf.tab.cobaltWash },
  pagerScroll: { marginHorizontal: -20 },
  pager: { alignItems: "stretch", gap: 10, paddingHorizontal: 20, paddingVertical: 8 },
  now: {
    borderColor: cf.pressboard.base,
    borderRadius: corner.xl,
    borderWidth: 2,
    gap: space.md,
    padding: 16,
    width: NOW_WIDTH,
    ...elevation.lift,
  },
  nowPicture: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: corner.lg,
    height: 70,
    justifyContent: "center",
    width: 70,
  },
  nowText: { gap: 6 },
  peek: {
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    gap: 8,
    padding: 12,
    width: PEEK_WIDTH,
    ...elevation.tile,
  },
  peekTime: { fontSize: 13 },
  peekPicture: { alignItems: "center", flex: 1, justifyContent: "center", minHeight: 52 },
  peekLabel: { minHeight: 34 },
  adjusted: {
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: corner.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  allDone: { alignItems: "center", gap: space.sm, paddingVertical: space.xxl },
  noteWrap: { paddingTop: 12, transform: [{ rotate: "-1.2deg" }] },
  magnetPin: { alignItems: "center", end: 0, position: "absolute", start: 0, top: 0, zIndex: 2 },
  note: { borderRadius: 6, gap: space.sm, padding: 20, paddingTop: 22 },
  slipWrap: { paddingTop: 10, transform: [{ rotate: "0.8deg" }] },
  slipMagnet: { end: 28, position: "absolute", top: 0, zIndex: 2 },
  slip: { alignItems: "center", borderRadius: 6, flexDirection: "row", gap: space.md, padding: 16 },
  ticket: {
    backgroundColor: surface.raised,
    borderRadius: corner.md,
    flexDirection: "row",
    overflow: "hidden",
    ...elevation.tile,
  },
  ticketStub: {
    alignItems: "center",
    backgroundColor: cf.pressboard.base,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ticketTime: { color: cf.pressboard.ink, fontSize: 22, lineHeight: 26 },
  ticketBody: { gap: 2, justifyContent: "center", paddingHorizontal: 14, paddingVertical: 12 },
  ticketChevron: { alignSelf: "center", paddingEnd: 10 },
  weekCard: { gap: space.md },
  dock: { bottom: 14, end: 20, position: "absolute", start: 20 },
  dockAction: { borderRadius: corner.lg, boxShadow: cf.shadow.lift },
});

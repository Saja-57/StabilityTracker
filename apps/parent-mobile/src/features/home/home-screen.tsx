import { useRouter, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Action,
  Magnet,
  Paper,
  PenMark,
  PressCard,
  Row,
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
import { formatLongDay, formatTime } from "@/lib/time";
import { useFamilyContent } from "@/lib/use-family-content";
import { useRoutineDay } from "@/lib/use-routine-day";
import {
  useFamilyStore,
  useTherapistNotes,
} from "@/providers/family-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

/** Keeps times like 08:15–15:30 in reading order inside RTL text. */
const ltr = (text: string) => `\u2066${text}\u2069`;

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

/**
 * Home is the fridge door: the day as a row of picture cards starting at
 * now, the therapist's latest note held by a magnet, and help always within
 * thumb reach.
 */
export function HomeScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const {
    family,
    weeklySurvey,
    schedule,
    therapistNotes: sampleNotes,
    visits,
  } = useFamilyContent();
  const therapistNotes = useTherapistNotes(sampleNotes);
  const { completions, complete, undo } = useRoutineDay();
  const { record } = useFamilyStore();
  const checkinSent = weeklySurvey.id in record.surveys;
  const go = (href: string) => router.push(href as Href);
  const isDone = (step: ScheduleStep) => step.id in completions;
  const ahead = schedule.filter((step) => !isDone(step));
  const done = schedule.length - ahead.length;
  // The card follows the clock, not the ticks: Now is the step whose time has
  // started, Next is the one after it.
  const clock = SAMPLE_NOW.slice(11, 16);
  const currentIndex = schedule.filter((step) => step.time <= clock).length - 1;
  const current = currentIndex >= 0 ? schedule[currentIndex] : undefined;
  const next = schedule[currentIndex + 1];
  const note =
    therapistNotes.find((entry) => !entry.isRead) ?? therapistNotes[0];
  const session = visits.find((visit) =>
    visit.at.startsWith(SAMPLE_NOW.slice(0, 10)),
  );
  const you = family.caregivers.find((caregiver) => caregiver.you);

  return (
    <View style={styles.root}>
      <ScreenContainer
        contentContainerStyle={styles.content}
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
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
                <View
                  key={step.id}
                  style={[
                    styles.tallyBox,
                    isDone(step) ? styles.tallyBoxDone : null,
                  ]}
                >
                  {isDone(step) ? <PenMark visible size={14} /> : null}
                </View>
              ))}
            </Row>
            <Type variant="small" color="secondary">
              {fill(t("home.tally"), { done, total: schedule.length })}
            </Type>
          </Row>
        </Animated.View>

        <Animated.View entering={enter(1)}>
          <PressCard
            accessibilityRole="button"
            accessibilityLabel={`${t("home.checkin.title")}. ${t(checkinSent ? "home.checkin.done" : "home.checkin.detail")}`}
            onPress={() => go("/surveys")}
            style={[
              styles.checkin,
              checkinSent ? styles.checkinDone : styles.checkinDue,
            ]}
          >
            <View
              style={[
                styles.checkinIcon,
                {
                  backgroundColor: checkinSent
                    ? cf.tab.mossWash
                    : cf.tab.goldWash,
                },
              ]}
            >
              {checkinSent ? (
                <Glyph name="tick" color={cf.tab.mossInk} size={22} />
              ) : (
                <Pictogram
                  name="choices"
                  size={26}
                  color={cf.tab.goldInk}
                  tint={0.3}
                />
              )}
            </View>
            <View style={[styles.flex, styles.checkinText]}>
              <Type variant="label">{t("home.checkin.title")}</Type>
              <Type
                variant="small"
                color={checkinSent ? "moss" : "secondary"}
                numberOfLines={1}
              >
                {t(checkinSent ? "home.checkin.done" : "home.checkin.detail")}
              </Type>
            </View>
            {checkinSent ? null : (
              <View style={styles.checkinPill}>
                <Type variant="caption" style={styles.checkinPillText}>
                  {t("home.checkin.start")}
                </Type>
              </View>
            )}
          </PressCard>
        </Animated.View>

        <Animated.View entering={enter(2)}>
          {current || next ? (
            <View
              style={[
                styles.nowCard,
                current && isDone(current) ? styles.nowCardDone : null,
              ]}
            >
              {current ? (
                <NowMission
                  step={current}
                  done={isDone(current)}
                  onToggle={() =>
                    isDone(current) ? undo(current.id) : complete(current.id)
                  }
                  onOpen={() => go("/routine")}
                />
              ) : null}
              {current && next ? <View style={styles.missionRule} /> : null}
              {next ? (
                <NextMission step={next} onOpen={() => go("/routine")} />
              ) : null}
            </View>
          ) : null}
        </Animated.View>

        {note ? (
          <Animated.View entering={enter(3)}>
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
                  <TabLabel
                    tone="ink"
                    label={t(`vocab.messageKind.${note.category}`)}
                  />
                  <Type variant="caption" color="muted" style={styles.figures}>
                    {note.sentAt ? formatTime(note.sentAt, language) : ""}
                  </Type>
                </Row>
                <Type variant="body" color="secondary" numberOfLines={3}>
                  {isolate(note.preview)}
                </Type>
                <Row style={styles.between}>
                  <Type variant="small" color="muted" style={styles.flex}>
                    {fill(t("home.note.from"), {
                      name: isolate(family.therapist.name),
                    })}
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

        <Animated.View entering={enter(4)} style={styles.section}>
          {session ? (
            <PressCard
              accessibilityRole="button"
              accessibilityLabel={fill(t("home.session.title"), {
                time: formatTime(session.at, language),
              })}
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
                  <Type variant="label">
                    {fill(t("home.session.with"), {
                      name: isolate(family.therapist.givenName),
                    })}
                  </Type>
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
      </ScreenContainer>

      <View pointerEvents="box-none" style={styles.dock}>
        <Action
          label={t("home.help.action")}
          accessibilityHint={t("home.help.hint")}
          glyph="heart"
          variant="alert"
          size="large"
          onPress={() => go("/log?start=support")}
          style={styles.dockAction}
        />
      </View>
    </View>
  );
}

function NowMission({
  step,
  done,
  onToggle,
  onOpen,
}: {
  step: ScheduleStep;
  done: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  return (
    <View style={styles.nowBlock}>
      <Row gap={space.md} style={styles.between}>
        <Row gap={space.sm} style={styles.flex}>
          <TabLabel tone={done ? "moss" : "cobalt"} label={t("home.now")} />
          <Type variant="figure" color="secondary" style={styles.figures}>
            {ltr(
              step.endTime
                ? fill(t("home.until"), { start: step.time, end: step.endTime })
                : step.time,
            )}
          </Type>
        </Row>
        <PressCard
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={fill(t("home.markDone"), {
            step: isolate(step.title),
          })}
          hitSlop={8}
          pressedScale={0.9}
          onPress={onToggle}
          style={[styles.check, done ? styles.checkOn : null]}
        >
          {done ? (
            <Glyph name="tick" color={cf.pressboard.ink} size={22} />
          ) : null}
        </PressCard>
      </Row>
      <PressCard
        accessibilityRole="button"
        accessibilityLabel={`${t("home.now")}: ${isolate(step.title)}`}
        onPress={onOpen}
        style={styles.missionBody}
      >
        <View
          style={[
            styles.missionPicture,
            { backgroundColor: done ? cf.tab.mossWash : cf.tab.cobaltWash },
          ]}
        >
          <Pictogram
            name={step.pictogram}
            size={44}
            color={cf.pressboard.base}
            tint={0.25}
          />
        </View>
        <View style={[styles.flex, styles.missionText]}>
          <Type variant="title" numberOfLines={2}>
            {isolate(step.title)}
          </Type>
          <Type variant="small" color="secondary" numberOfLines={3}>
            {isolate(step.detail)}
          </Type>
        </View>
      </PressCard>
    </View>
  );
}

function NextMission({
  step,
  onOpen,
}: {
  step: ScheduleStep;
  onOpen: () => void;
}) {
  const { language, t } = useLanguage();
  return (
    <PressCard
      accessibilityRole="button"
      accessibilityLabel={`${t("home.nextShort")} ${step.time} ${isolate(step.title)}`}
      onPress={onOpen}
      style={styles.nextRow}
    >
      <View style={styles.nextPicture}>
        <Pictogram
          name={step.pictogram}
          size={28}
          color={cf.pressboard.base}
          tint={0.15}
        />
      </View>
      <View style={[styles.flex, styles.missionText]}>
        <Type variant="caption" color="muted">
          {`${t("home.nextShort")} `}
          <Type variant="caption" color="muted" style={styles.figures}>
            {ltr(formatTime(`2026-10-14T${step.time}`, language))}
          </Type>
        </Type>
        <Type variant="label" numberOfLines={1}>
          {isolate(step.title)}
        </Type>
        <Type variant="caption" color="secondary" numberOfLines={1}>
          {isolate(step.detail)}
        </Type>
      </View>
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
  tallyBoxDone: {
    backgroundColor: cf.tab.cobaltWash,
    borderColor: cf.tab.cobaltWash,
  },
  nowCard: {
    backgroundColor: surface.raised,
    borderColor: cf.tab.cobalt,
    borderRadius: corner.xl,
    borderWidth: 1.5,
    gap: space.md,
    padding: space.lg,
    ...elevation.lift,
  },
  nowCardDone: { borderColor: cf.tab.moss },
  check: {
    alignItems: "center",
    borderColor: surface.ruleStrong,
    borderRadius: corner.pill,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  checkOn: { backgroundColor: cf.tab.moss, borderColor: cf.tab.moss },
  missionBody: { alignItems: "center", flexDirection: "row", gap: space.md },
  missionPicture: {
    alignItems: "center",
    borderRadius: corner.lg,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  missionText: { gap: 4 },
  nextRow: { alignItems: "center", flexDirection: "row", gap: space.md },
  nowBlock: { gap: space.md },
  missionRule: { backgroundColor: surface.rule, height: 1 },
  nextPicture: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: corner.md,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  noteWrap: { paddingTop: 12, transform: [{ rotate: "-1.2deg" }] },
  magnetPin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 2,
  },
  note: { borderRadius: 6, gap: space.sm, padding: 20, paddingTop: 22 },
  checkin: {
    alignItems: "center",
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    borderStartWidth: 4,
    flexDirection: "row",
    gap: space.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...elevation.tile,
  },
  checkinDue: { borderStartColor: cf.tab.gold },
  checkinDone: { borderStartColor: cf.tab.moss },
  checkinIcon: {
    alignItems: "center",
    borderRadius: corner.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  checkinText: { gap: 2 },
  checkinPill: {
    backgroundColor: cf.tab.gold,
    borderRadius: corner.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  checkinPillText: { color: cf.pressboard.deep, fontWeight: "600" },
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
  ticketBody: {
    gap: 2,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ticketChevron: { alignSelf: "center", paddingEnd: 10 },
  dock: { bottom: 14, end: 20, position: "absolute", start: 20 },
  dockAction: {
    borderColor: cf.tab.rubyWash,
    borderRadius: corner.lg,
    borderWidth: 2,
    boxShadow: `0 6px 18px ${cf.tab.ruby}59`,
  },
});

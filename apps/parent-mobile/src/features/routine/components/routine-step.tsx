import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import {
  Action,
  PenMark,
  PenTickButton,
  PressCard,
  Row,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

import type { RoutineStepViewModel } from "../types";
import { RoutineCompletionMeta } from "./routine-completion-meta";
import { RoutineStepStatus, routineStatusKeys } from "./routine-step-status";

export interface RoutineStepProps {
  readonly completionDisabled?: boolean;
  readonly expanded?: boolean;
  /** Position in the list; staggers the first pen draw. */
  readonly index?: number;
  readonly onComplete?: (stepId: string) => void;
  readonly onToggleExpanded?: (stepId: string) => void;
  readonly onUndo?: (stepId: string) => void;
  readonly step: RoutineStepViewModel;
}

/** Height of the folder tab that marks the current card. */
export const NOW_TAB_HEIGHT = 26;
/** Card padding plus half the pictogram tile, for aligning the timeline node. */
export const STEP_TILE_CENTER = { current: 18 + 42, other: 14 + 28 } as const;

/** Time the pen needs to draw before the card settles into done. */
const PEN_DRAW_MS = 460;

const settle = LinearTransition.duration(340).easing(paperEase);

export function RoutineStep({
  completionDisabled = false,
  expanded = false,
  index = 0,
  onComplete,
  onToggleExpanded,
  onUndo,
  step,
}: RoutineStepProps) {
  const { language, t } = useLanguage();
  const isCompleted = step.status === "completed";
  const isCurrent = step.status === "current";
  const title = isolate(step.title);

  // The pen draws on screen: once on arrival for steps already done, and
  // before a newly ticked card settles.
  const [drawn, setDrawn] = useState(false);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const arrival = setTimeout(() => setDrawn(true), 520 + index * 80);
    return () => {
      clearTimeout(arrival);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
    // Only on mount: later changes come from the parent's taps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canTick =
    !completionDisabled && Boolean(isCompleted ? onUndo : onComplete);

  const tick = () => {
    if (completionDisabled || pending || !onComplete) {
      return;
    }
    setDrawn(true);
    setPending(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setPending(false);
      onComplete(step.id);
    }, PEN_DRAW_MS);
  };

  const undo = () => {
    if (completionDisabled || !onUndo) {
      return;
    }
    setDrawn(false);
    onUndo(step.id);
  };

  const checked = isCompleted ? drawn : pending;
  const toggle = isCompleted ? undo : tick;
  const tickLabel = fill(
    t(isCompleted ? "routineDay.untick" : "routineDay.tick"),
    { step: title },
  );

  const time = step.scheduledAt
    ? step.endsAt
      ? fill(t("routineDay.until"), {
          start: step.scheduledAt,
          end: step.endsAt,
        })
      : step.scheduledAt
    : undefined;

  const statusLabel = t(routineStatusKeys[step.status]);
  const summaryLabel = [time, step.title, statusLabel]
    .filter(Boolean)
    .join(", ");

  const tile = (
    <View
      style={[
        isCurrent ? styles.tileCurrent : styles.tile,
        isCompleted ? styles.tileDone : null,
      ]}
    >
      {step.pictogram ? (
        <Pictogram
          name={step.pictogram}
          size={isCurrent ? 58 : 40}
          color={isCompleted ? cf.sheet.inkMuted : cf.pressboard.base}
          {...(isCurrent
            ? { tintColor: cf.tab.mossWash }
            : { tint: isCompleted ? 0.1 : 0.2 })}
        />
      ) : (
        <Glyph
          name="routine"
          color={isCompleted ? ink.muted : cf.pressboard.base}
          size={isCurrent ? 34 : 24}
          tint={0.2}
        />
      )}
    </View>
  );

  const heading = (
    <View
      style={[styles.flex, isCurrent ? styles.headingCurrent : styles.heading]}
    >
      {time ? (
        <Type
          variant="figure"
          color={isCurrent ? "secondary" : isCompleted ? "muted" : "secondary"}
        >
          {time}
        </Type>
      ) : null}
      <Type
        variant={isCurrent ? "display" : "label"}
        color={isCompleted ? "secondary" : "primary"}
        {...(expanded || isCurrent ? {} : { numberOfLines: 2 })}
      >
        {title}
      </Type>
      {isCompleted && !expanded ? (
        <RoutineCompletionMeta completion={step.completion ?? {}} />
      ) : null}
      <RoutineStepStatus status={step.status} />
    </View>
  );

  const notes =
    step.adjusted || step.support ? (
      <View style={[styles.notes, isCurrent ? null : styles.notesIndented]}>
        {step.adjusted ? (
          <Row gap={6} align="flex-start">
            <View style={styles.noteGlyph}>
              <Glyph name="edit" color={cf.tab.cobaltInk} size={15} />
            </View>
            <Type
              variant="caption"
              color="cobalt"
              style={styles.flex}
              {...(expanded || isCurrent ? {} : { numberOfLines: 2 })}
            >
              {fill(t("routineDay.adjustedBy"), {
                name: isolate(step.adjusted.byDisplayName),
              })}
              {step.adjusted.note ? `: ${isolate(step.adjusted.note)}` : ""}
            </Type>
          </Row>
        ) : null}
        {step.support ? (
          <View
            accessible
            accessibilityLabel={fill(t("routineDay.suggestion"), {
              support: t(`vocab.support.${step.support}`),
            })}
            style={styles.supportChip}
          >
            <Row gap={6}>
              <Pictogram
                name={step.support}
                size={20}
                color={cf.tab.mossInk}
                tint={0.25}
              />
              <Type
                variant="caption"
                style={styles.supportText}
                numberOfLines={1}
              >
                {t(`vocab.support.${step.support}`)}
              </Type>
            </Row>
          </View>
        ) : null}
      </View>
    ) : null;

  const detail = (
    <Animated.View
      entering={FadeIn.duration(260).easing(paperEase)}
      exiting={FadeOut.duration(140)}
      style={[styles.detail, isCurrent ? null : styles.notesIndented]}
    >
      {step.description ? (
        <Type variant="body" color="secondary">
          {isolate(step.description)}
        </Type>
      ) : null}
      {isCompleted && step.completion ? (
        <RoutineCompletionMeta completion={step.completion} withMark />
      ) : null}
      {canTick && isCompleted ? (
        <Action
          label={t("routineDay.undo")}
          variant="outline"
          size="medium"
          onPress={undo}
          style={styles.action}
        />
      ) : null}
    </Animated.View>
  );

  const tickButton = canTick ? (
    <PenTickButton
      checked={checked}
      onToggle={toggle}
      label={tickLabel}
      size={44}
    />
  ) : isCompleted ? (
    <View style={styles.tickStatic}>
      <PenMark visible={drawn} size={34} />
    </View>
  ) : null;

  if (isCurrent) {
    return (
      <Animated.View layout={settle}>
        <Animated.View entering={FadeIn.duration(260)} style={styles.nowTab}>
          <Type
            variant="stamp"
            color="board"
            style={language === "en" ? null : styles.stampScript}
          >
            {t("routineDay.now")}
          </Type>
        </Animated.View>
        <View accessible={false} style={styles.currentCard}>
          <Row align="flex-start" gap={space.lg}>
            <View
              accessible
              accessibilityLabel={summaryLabel}
              style={[styles.flex, styles.currentHead]}
            >
              {tile}
              {heading}
            </View>
            {tickButton}
          </Row>
          {notes}
          {detail}
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      layout={settle}
      style={[styles.card, isCompleted ? styles.cardDone : null]}
    >
      <Row align="flex-start" gap={space.md}>
        <View style={styles.flex}>
          <PressCard
            accessibilityRole="button"
            accessibilityLabel={summaryLabel}
            accessibilityHint={t(
              expanded ? "routineDay.collapseHint" : "routineDay.expandHint",
            )}
            accessibilityState={{ expanded }}
            onPress={() => onToggleExpanded?.(step.id)}
            pressedScale={0.985}
            style={styles.flex}
          >
            <Row align="flex-start" gap={space.md}>
              {tile}
              {heading}
            </Row>
          </PressCard>
        </View>
        {tickButton}
      </Row>
      {notes}
      {expanded ? detail : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stampScript: { letterSpacing: 0, fontSize: 12 },
  flex: { flex: 1 },
  card: {
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    gap: space.md,
    padding: 14,
    ...elevation.tile,
  },
  cardDone: { backgroundColor: surface.sunk, boxShadow: "none" },
  tile: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: corner.md,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  tileDone: { backgroundColor: surface.raised },
  tileCurrent: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: corner.lg,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  heading: { gap: 3, paddingTop: 2 },
  headingCurrent: { gap: 6, paddingTop: 2 },
  nowTab: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: cf.pressboard.base,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: NOW_TAB_HEIGHT,
    justifyContent: "center",
    marginStart: 18,
    paddingHorizontal: 14,
  },
  currentCard: {
    backgroundColor: surface.raised,
    borderColor: cf.pressboard.base,
    borderRadius: corner.xl,
    borderWidth: 2,
    gap: space.lg,
    padding: 16,
    ...elevation.lift,
  },
  currentHead: { gap: space.lg },
  notes: { alignItems: "flex-start", gap: space.sm },
  notesIndented: { marginStart: 56 + space.md },
  noteGlyph: { paddingTop: 1 },
  supportChip: {
    backgroundColor: cf.tab.mossWash,
    borderRadius: corner.pill,
    paddingEnd: 10,
    paddingStart: 5,
    paddingVertical: 3,
  },
  supportText: { color: cf.tab.mossInk, fontWeight: "500" },
  detail: { gap: space.md },
  action: { alignSelf: "flex-start" },
  actionWide: { alignSelf: "stretch" },
  tickStatic: {
    alignItems: "center",
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});

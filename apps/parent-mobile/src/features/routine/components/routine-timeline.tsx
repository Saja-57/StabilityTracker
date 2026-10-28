import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import { Row, paperEase } from "@/components/case-file/primitives";
import { cf } from "@/theme/case-file";

import type { RoutineStepViewModel } from "../types";
import { NOW_TAB_HEIGHT, RoutineStep, STEP_TILE_CENTER } from "./routine-step";
import { ROUTINE_NODE_SIZE, RoutineStepStatus } from "./routine-step-status";

export interface RoutineTimelineProps {
  readonly completionDisabled?: boolean;
  /** Stagger offset so the list enters after the header. */
  readonly enterDelay?: number;
  readonly onComplete?: (stepId: string) => void;
  readonly onUndo?: (stepId: string) => void;
  readonly steps: readonly RoutineStepViewModel[];
}

const GAP = 12;
const settle = LinearTransition.duration(340).easing(paperEase);

/** The day as a column of picture cards, joined by a quiet rail. */
export function RoutineTimeline({
  completionDisabled = false,
  enterDelay = 0,
  onComplete,
  onUndo,
  steps,
}: RoutineTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) =>
    setExpandedId((open) => (open === id ? null : id));

  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;
        const isCurrent = step.status === "current";
        const nodeTop =
          (isCurrent
            ? NOW_TAB_HEIGHT + STEP_TILE_CENTER.current
            : STEP_TILE_CENTER.other) -
          ROUTINE_NODE_SIZE / 2;
        const done = step.status === "completed";
        const nextDone = steps[index + 1]?.status === "completed";

        return (
          <Animated.View
            key={step.id}
            entering={FadeInDown.duration(520)
              .delay(enterDelay + Math.min(index, 8) * 55)
              .easing(paperEase)}
            layout={settle}
          >
            <Row align="stretch" gap={10}>
              <View style={styles.rail}>
                {isFirst ? null : (
                  <View
                    style={[
                      styles.line,
                      styles.lineAbove,
                      { height: nodeTop },
                      done ? styles.lineDone : null,
                    ]}
                  />
                )}
                {isLast ? null : (
                  <View
                    style={[
                      styles.line,
                      { top: nodeTop + ROUTINE_NODE_SIZE, bottom: -GAP },
                      nextDone ? styles.lineDone : null,
                    ]}
                  />
                )}
                <View style={{ marginTop: nodeTop }}>
                  <RoutineStepStatus compact status={step.status} />
                </View>
              </View>
              <View style={styles.card}>
                <RoutineStep
                  completionDisabled={completionDisabled}
                  expanded={expandedId === step.id}
                  index={index}
                  onToggleExpanded={toggle}
                  step={step}
                  {...(onComplete ? { onComplete } : {})}
                  {...(onUndo ? { onUndo } : {})}
                />
              </View>
            </Row>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: { gap: GAP },
  rail: { alignItems: "center", width: ROUTINE_NODE_SIZE },
  line: {
    backgroundColor: cf.sheet.ruleStrong,
    position: "absolute",
    width: 2,
  },
  lineAbove: { top: 0 },
  lineDone: { backgroundColor: cf.pen },
  card: { flex: 1 },
});

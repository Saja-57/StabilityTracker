import { StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { PenMark, Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, space } from "@/theme/case-file";

import type { RoutineSummaryViewModel } from "../types";

export interface RoutineProgressCardProps {
  readonly summary?: RoutineSummaryViewModel;
}

const SQUARE = 18;

/**
 * The calm progress line: one small square per card on the fridge, ticked in
 * pen as the day goes. Never a percentage bar.
 */
export function RoutineProgressCard({ summary }: RoutineProgressCardProps) {
  const { t } = useLanguage();
  if (!summary || summary.totalSteps === 0) {
    return null;
  }
  const { completedSteps: done, totalSteps: total } = summary;
  const allDone = done >= total;
  const label = fill(t("routineDay.progressA11y"), { done, total });

  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: done }}
      style={styles.container}
    >
      <Row gap={5} wrap>
        {Array.from({ length: total }, (_, index) => {
          const ticked = index < done;
          return (
            <Animated.View
              key={index}
              layout={LinearTransition.duration(280).easing(paperEase)}
              style={[
                styles.square,
                ticked ? styles.squareTicked : styles.squareOpen,
              ]}
            >
              <PenMark visible={ticked} size={SQUARE + 2} />
            </Animated.View>
          );
        })}
      </Row>
      <Type variant="label" color="secondary">
        {allDone
          ? t("routineDay.allDone")
          : fill(t("routineDay.progress"), { done, total })}
      </Type>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  square: {
    alignItems: "center",
    borderRadius: 5,
    height: SQUARE,
    justifyContent: "center",
    overflow: "visible",
    width: SQUARE,
  },
  squareOpen: { borderColor: cf.sheet.ruleStrong, borderWidth: 1.5 },
  squareTicked: { backgroundColor: cf.tab.cobaltWash },
});

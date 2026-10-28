import { StyleSheet, View } from "react-native";

import { PenMark, Row } from "@/components/case-file/primitives";
import { fill } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, surface } from "@/theme/case-file";

export interface SurveyProgressProps {
  /** One-based current question; 0 shows no current square. */
  readonly current: number;
  readonly total: number;
  /** Which questions already carry an answer (by position). */
  readonly answered?: readonly boolean[];
  readonly size?: number;
}

/** Pen-tick progress squares: ticked when answered, framed when current. */
export function SurveyProgress({
  answered = [],
  current,
  size = 22,
  total,
}: SurveyProgressProps) {
  const { t } = useLanguage();
  const label = `${t("surveys.progress.accessibility")}. ${fill(t("checkin.progress"), { current, total })}`;

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      <Row gap={6}>
        {Array.from({ length: total }, (_, index) => {
          const done = answered[index] === true;
          const isCurrent = index + 1 === current;
          return (
            <View
              key={index}
              style={[
                styles.square,
                { height: size, width: size, borderRadius: size / 3.6 },
                done ? styles.done : styles.open,
                isCurrent ? styles.current : null,
              ]}
            >
              {done ? <PenMark visible size={size - 2} /> : null}
            </View>
          );
        })}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  square: { alignItems: "center", justifyContent: "center" },
  open: { borderColor: cf.sheet.ruleStrong, borderWidth: 1.5 },
  done: { backgroundColor: cf.tab.cobaltWash },
  current: { borderColor: surface.board, borderWidth: 2 },
});

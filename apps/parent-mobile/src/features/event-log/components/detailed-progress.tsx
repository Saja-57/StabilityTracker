import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { PenMark, PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { useLanguage } from "@/providers/language-provider";
import { cf, space, surface } from "@/theme/case-file";

import { detailedSteps } from "../options";
import type { DetailedLogStep } from "../types";

/** Pen-tick progress: finished pages carry a tick; the open page is ringed in pen. */
export function DetailedProgress({
  step,
  onJump,
}: {
  step: DetailedLogStep;
  onJump: (step: DetailedLogStep) => void;
}) {
  const { t } = useLanguage();
  const current = detailedSteps.findIndex((item) => item.value === step);
  const total = detailedSteps.length;
  const currentLabel = detailedSteps[current]
    ? t(detailedSteps[current].labelKey)
    : "";
  const counter = `${t("eventLog.progress.step")} ${current + 1} ${t("eventLog.progress.of")} ${total}`;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${t("eventLog.progress.accessibility")}. ${counter}. ${currentLabel}`}
      accessibilityValue={{ min: 1, max: total, now: current + 1 }}
      style={styles.wrap}
    >
      <Row gap={0} align="center">
        {detailedSteps.map((item, index) => {
          const done = index < current;
          const open = index === current;
          return (
            <Fragment key={item.value}>
              {index > 0 ? (
                <View
                  style={[
                    styles.line,
                    index <= current ? styles.lineDone : null,
                  ]}
                />
              ) : null}
              <PressCard
                accessibilityRole="button"
                accessibilityLabel={t(item.labelKey)}
                accessibilityState={{ disabled: !done, selected: open }}
                disabled={!done}
                hitSlop={6}
                onPress={() => onJump(item.value)}
                pressedScale={0.9}
                style={[
                  styles.box,
                  done
                    ? styles.boxDone
                    : open
                      ? styles.boxOpen
                      : styles.boxLater,
                ]}
              >
                {done ? (
                  <PenMark visible size={28} />
                ) : (
                  <Type variant="figure" color={open ? "pen" : "muted"}>
                    {index + 1}
                  </Type>
                )}
              </PressCard>
            </Fragment>
          );
        })}
      </Row>
      <Row style={styles.between}>
        <Type variant="label">{currentLabel}</Type>
        <Type variant="caption" color="muted">
          {counter}
        </Type>
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  between: { justifyContent: "space-between" },
  line: {
    backgroundColor: surface.rule,
    flex: 1,
    height: 2,
    marginHorizontal: 6,
  },
  lineDone: { backgroundColor: cf.pen, opacity: 0.45 },
  box: {
    alignItems: "center",
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  boxDone: { backgroundColor: cf.tab.cobaltWash },
  boxOpen: {
    backgroundColor: surface.raised,
    borderColor: cf.pen,
    borderWidth: 2,
  },
  boxLater: {
    borderColor: cf.sheet.ruleStrong,
    borderStyle: "dashed",
    borderWidth: 1.5,
  },
});

import { getDirection } from "@stability/i18n";
import { StyleSheet, View } from "react-native";

import { PenMark, PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, space, surface } from "@/theme/case-file";

import type { ScaleSurveyQuestion } from "../types";
import { SurveyQuestionFrame } from "./survey-question-frame";

export interface ScaleQuestionProps {
  readonly onChange: (value: number) => void;
  readonly question: ScaleSurveyQuestion;
  readonly value?: number;
}

/**
 * Big rising steps, one per value, with words at each end. Every step is the
 * same neutral paper: no value is coloured as good or bad.
 */
export function ScaleQuestion({
  onChange,
  question,
  value,
}: ScaleQuestionProps) {
  const { language, t } = useLanguage();
  const endAlign = {
    textAlign: getDirection(language) === "rtl" ? "left" : "right",
  } as const;
  const values = Array.from(
    { length: Math.max(0, question.maximum - question.minimum + 1) },
    (_, index) => question.minimum + index,
  );
  const span = Math.max(1, values.length - 1);
  const low = question.minimumLabel
    ? isolate(question.minimumLabel)
    : t("checkin.scale.low");
  const high = question.maximumLabel
    ? isolate(question.maximumLabel)
    : t("checkin.scale.high");

  return (
    <SurveyQuestionFrame
      hint={t("checkin.hint.scale")}
      isOptional={question.isOptional}
      {...(question.language ? { language: question.language } : {})}
      prompt={question.prompt}
    >
      <View style={styles.wrap}>
        <View
          accessibilityLabel={t("surveys.types.scale")}
          accessibilityRole="radiogroup"
        >
          <Row gap={8} align="flex-end" style={styles.steps}>
            {values.map((option, index) => {
              const selected = value === option;
              const edge =
                index === 0
                  ? `, ${low}`
                  : index === values.length - 1
                    ? `, ${high}`
                    : "";
              return (
                <View key={option} style={styles.stepSlot}>
                  <PressCard
                    accessibilityLabel={`${t("surveys.scale.value")} ${fill(
                      t("checkin.scale.step"),
                      {
                        value: option,
                        max: question.maximum,
                      },
                    )}${edge}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => onChange(option)}
                    pressedScale={0.94}
                    style={[
                      styles.step,
                      { height: 76 + (index / span) * 56 },
                      selected ? styles.stepOn : styles.stepOff,
                    ]}
                  >
                    <View style={styles.tick}>
                      {selected ? (
                        <PenMark visible size={26} color={cf.pressboard.ink} />
                      ) : null}
                    </View>
                    <Type
                      variant="figureLarge"
                      style={selected ? styles.numberOn : styles.numberOff}
                    >
                      {option}
                    </Type>
                  </PressCard>
                </View>
              );
            })}
          </Row>
        </View>
        <Row style={styles.ends} align="flex-start">
          <Type variant="small" color="secondary" style={styles.endText}>
            {low}
          </Type>
          <Type
            variant="small"
            color="secondary"
            style={[styles.endText, endAlign]}
          >
            {high}
          </Type>
        </Row>
      </View>
    </SurveyQuestionFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  stepSlot: { flex: 1 },
  steps: { height: 140 },
  step: {
    alignItems: "center",
    borderRadius: corner.md,
    justifyContent: "space-between",
    paddingBottom: 12,
    paddingTop: 8,
  },
  stepOff: { backgroundColor: surface.raised, ...elevation.tile },
  stepOn: { backgroundColor: surface.board, ...elevation.lift },
  tick: { height: 26, justifyContent: "center" },
  numberOff: { color: cf.sheet.ink },
  numberOn: { color: cf.pressboard.ink },
  ends: { justifyContent: "space-between" },
  endText: { maxWidth: "45%" },
});

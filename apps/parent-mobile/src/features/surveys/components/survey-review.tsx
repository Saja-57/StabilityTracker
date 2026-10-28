import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  PenMark,
  PressCard,
  Row,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { elevation, ink, space, surface } from "@/theme/case-file";

import { answerSegments } from "../survey-answers";
import type { CaregiverSurveyViewModel, SurveyResponseMap } from "../types";

export interface SurveyReviewProps {
  /** Leaves review for the last question. */
  readonly onBack: () => void;
  /** Opens one question to change its answer. */
  readonly onEdit?: (index: number) => void;
  readonly responses: SurveyResponseMap;
  readonly survey: CaregiverSurveyViewModel;
}

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 60)
    .easing(paperEase);

/** Every answer on its own paper slip; tap a slip to change it. */
export function SurveyReview({ onEdit, responses, survey }: SurveyReviewProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.root}>
      <Animated.View entering={enter(0)} style={styles.heading}>
        <Type variant="hero" accessibilityRole="header">
          {t("checkin.review.title")}
        </Type>
        <Type variant="lede" color="secondary">
          {t("checkin.review.detail")}
        </Type>
      </Animated.View>

      <View style={styles.slips}>
        {survey.questions.map((question, index) => {
          const answers = answerSegments(question, responses[question.id]);
          const skipped = answers.length === 0;
          const isScale = question.type === "scale";
          return (
            <Animated.View key={question.id} entering={enter(index + 1)}>
              <PressCard
                accessibilityHint={t("checkin.review.edit")}
                accessibilityLabel={`${question.prompt}. ${
                  skipped
                    ? t("checkin.review.skipped")
                    : answers.map((answer) => answer.text).join(", ")
                }`}
                accessibilityRole="button"
                {...(onEdit
                  ? { onPress: () => onEdit(index) }
                  : { disabled: true })}
                style={styles.slip}
              >
                <Row align="flex-start" gap={space.md}>
                  <Type variant="figure" color="muted" style={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </Type>
                  <View style={styles.flex}>
                    <Type
                      variant="small"
                      color="muted"
                      {...(question.language
                        ? { language: question.language }
                        : {})}
                    >
                      {isolate(question.prompt)}
                    </Type>
                    {skipped ? (
                      <Type
                        variant="label"
                        color="muted"
                        style={styles.skipped}
                      >
                        {t("checkin.review.skipped")}
                      </Type>
                    ) : isScale ? (
                      <Row gap={6} style={styles.answerRow}>
                        <Type variant="figureLarge" color="pen">
                          {answers[0]?.text}
                        </Type>
                        <Type variant="small" color="muted">
                          / {"maximum" in question ? question.maximum : ""}
                        </Type>
                      </Row>
                    ) : (
                      <View style={styles.answerList}>
                        {answers.map((answer, answerIndex) => (
                          <Row key={answerIndex} gap={6} align="flex-start">
                            {question.type === "longText" ||
                            question.type === "shortText" ? null : (
                              <View style={styles.answerTick}>
                                <PenMark visible size={18} />
                              </View>
                            )}
                            <Type
                              variant={
                                question.type === "longText" ||
                                question.type === "shortText"
                                  ? "lede"
                                  : "headline"
                              }
                              style={styles.answer}
                              {...(answer.language
                                ? { language: answer.language }
                                : {})}
                            >
                              {isolate(answer.text)}
                            </Type>
                          </Row>
                        ))}
                      </View>
                    )}
                  </View>
                  {onEdit ? (
                    <Glyph name="edit" color={ink.muted} size={18} />
                  ) : null}
                </Row>
              </PressCard>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 28 },
  flex: { flex: 1, gap: 6 },
  heading: { gap: space.md },
  slips: { gap: space.md },
  slip: {
    backgroundColor: surface.raised,
    borderRadius: 6,
    padding: 18,
    ...elevation.tile,
  },
  number: { fontSize: 13, paddingTop: 1 },
  skipped: { fontStyle: "italic" },
  answerRow: { alignItems: "baseline" },
  answerList: { gap: 4 },
  answerTick: { paddingTop: 2 },
  answer: { color: ink.pen, flex: 1, fontSize: 17, lineHeight: 23 },
});

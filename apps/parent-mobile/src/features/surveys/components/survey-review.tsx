import { colors, spacing } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import { ClipboardCheck } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  Button,
  Card,
  Divider,
  getIconSize,
  iconStrokeWidth,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type {
  CaregiverSurveyViewModel,
  SurveyQuestion,
  SurveyResponseMap,
  SurveyResponseValue,
} from "../types";

export interface SurveyReviewProps {
  readonly onBack: () => void;
  readonly responses: SurveyResponseMap;
  readonly survey: CaregiverSurveyViewModel;
}

interface ReviewAnswer {
  readonly answers: readonly ReviewAnswerSegment[];
  readonly question: SurveyQuestion;
}

interface ReviewAnswerSegment {
  readonly language?: SupportedLanguage;
  readonly text: string;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs,
  },
  answer: {
    gap: spacing.xs,
  },
  centered: {
    textAlign: "center",
  },
});

function getReviewAnswers(
  question: SurveyQuestion,
  response: SurveyResponseValue | undefined,
  language: SupportedLanguage,
): readonly ReviewAnswerSegment[] {
  if (response === undefined) {
    return [];
  }

  switch (question.type) {
    case "singleChoice": {
      const option =
        typeof response === "string"
          ? question.options.find((item) => item.id === response)
          : undefined;
      return option
        ? [
            {
              text: option.label,
              ...(option.language ? { language: option.language } : {}),
            },
          ]
        : [];
    }
    case "multiChoice":
      return Array.isArray(response)
        ? question.options
            .filter((option) => response.includes(option.id))
            .map((option) => ({
              text: option.label,
              ...(option.language ? { language: option.language } : {}),
            }))
        : [];
    case "scale":
      return typeof response === "number"
        ? [
            {
              text: response.toLocaleString(language),
              ...(question.language ? { language: question.language } : {}),
            },
          ]
        : [];
    case "shortText":
    case "longText":
      return typeof response === "string" && response.trim()
        ? [
            {
              text: response.trim(),
              ...(question.language ? { language: question.language } : {}),
            },
          ]
        : [];
  }
}

export function SurveyReview({ onBack, responses, survey }: SurveyReviewProps) {
  const { language, t } = useLanguage();
  const answers: ReviewAnswer[] = survey.questions.flatMap((question) => {
    const questionAnswers = getReviewAnswers(
      question,
      responses[question.id],
      language,
    );
    return questionAnswers.length > 0
      ? [{ answers: questionAnswers, question }]
      : [];
  });

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <AppText accessibilityRole="header" variant="sectionTitle">
          {t("surveys.review.title")}
        </AppText>
        <AppText color="secondary">{t("surveys.review.description")}</AppText>
      </View>
      <Card style={styles.container}>
        <ClipboardCheck
          accessibilityElementsHidden
          color={colors.brand.primary}
          size={getIconSize("medium")}
          strokeWidth={iconStrokeWidth}
        />
        {answers.length > 0 ? (
          answers.map((item, index) => (
            <View key={item.question.id} style={styles.answer}>
              <AppText
                {...(item.question.language
                  ? { language: item.question.language }
                  : {})}
                variant="label"
              >
                {item.question.prompt}
              </AppText>
              {item.answers.map((answer, answerIndex) => (
                <AppText
                  key={`${item.question.id}-${answerIndex}`}
                  {...(answer.language ? { language: answer.language } : {})}
                >
                  {answer.text}
                </AppText>
              ))}
              {index < answers.length - 1 ? <Divider /> : null}
            </View>
          ))
        ) : (
          <AppText color="muted">{t("surveys.review.unanswered")}</AppText>
        )}
      </Card>
      <Card style={styles.container} variant="subtle">
        <Button
          accessibilityLabel={t("surveys.actions.submitUnavailable")}
          disabled
          fullWidth
        >
          {t("surveys.actions.submitUnavailable")}
        </Button>
        <AppText color="muted" style={styles.centered} variant="helper">
          {t("surveys.actions.submitUnavailableDescription")}
        </AppText>
      </Card>
      <Button
        accessibilityLabel={t("surveys.actions.back")}
        fullWidth
        onPress={onBack}
        variant="ghost"
      >
        {t("surveys.actions.back")}
      </Button>
    </View>
  );
}

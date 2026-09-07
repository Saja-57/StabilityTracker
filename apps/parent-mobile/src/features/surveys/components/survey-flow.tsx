import { colors, spacing } from "@stability/design-tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, Button } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type {
  CaregiverSurveyViewModel,
  SurveyResponseMap,
  SurveyResponseValue,
} from "../types";
import { SurveyEmptyState } from "./survey-feedback-states";
import { SurveyProgress } from "./survey-progress";
import { SurveyQuestion } from "./survey-question";
import { SurveyReview } from "./survey-review";

export interface SurveyFlowProps {
  readonly survey: CaregiverSurveyViewModel;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  heading: {
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
  },
  validation: {
    color: colors.status.danger,
    textAlign: "center",
  },
});

function hasResponse(value: SurveyResponseValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return typeof value === "string" ? value.trim().length > 0 : true;
}

export function SurveyFlow({ survey }: SurveyFlowProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponseMap>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const currentQuestion = survey.questions[currentIndex];

  if (!currentQuestion) {
    return <SurveyEmptyState />;
  }

  const currentResponse = responses[currentQuestion.id];

  const updateResponse = (value: SurveyResponseValue) => {
    setResponses((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
    setShowValidation(false);
  };

  const goForward = () => {
    if (
      !currentQuestion.isOptional &&
      !hasResponse(responses[currentQuestion.id])
    ) {
      setShowValidation(true);
      return;
    }

    if (currentIndex === survey.questions.length - 1) {
      setIsReviewing(true);
      return;
    }

    setCurrentIndex((current) => current + 1);
    setShowValidation(false);
  };

  if (isReviewing) {
    return (
      <SurveyReview
        onBack={() => setIsReviewing(false)}
        responses={responses}
        survey={survey}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <AppText
          accessibilityRole="header"
          {...(survey.contentLanguage
            ? { language: survey.contentLanguage }
            : {})}
          variant="sectionTitle"
        >
          {survey.title}
        </AppText>
        {survey.description ? (
          <AppText
            color="secondary"
            {...(survey.contentLanguage
              ? { language: survey.contentLanguage }
              : {})}
          >
            {survey.description}
          </AppText>
        ) : null}
      </View>
      <SurveyProgress
        current={currentIndex + 1}
        total={survey.questions.length}
      />
      <SurveyQuestion
        onChange={updateResponse}
        question={currentQuestion}
        {...(currentResponse !== undefined ? { value: currentResponse } : {})}
      />
      {showValidation ? (
        <AppText
          accessibilityLiveRegion="assertive"
          color="secondary"
          style={styles.validation}
          variant="helper"
        >
          {t("surveys.validation.required")}
        </AppText>
      ) : null}
      <View style={styles.actions}>
        <Button
          accessibilityLabel={t(
            currentIndex === survey.questions.length - 1
              ? "surveys.actions.review"
              : "surveys.actions.next",
          )}
          fullWidth
          onPress={goForward}
          size="large"
        >
          {t(
            currentIndex === survey.questions.length - 1
              ? "surveys.actions.review"
              : "surveys.actions.next",
          )}
        </Button>
        {currentIndex > 0 ? (
          <Button
            accessibilityLabel={t("surveys.actions.back")}
            fullWidth
            onPress={() => {
              setCurrentIndex((current) => current - 1);
              setShowValidation(false);
            }}
            variant="ghost"
          >
            {t("surveys.actions.back")}
          </Button>
        ) : null}
      </View>
    </View>
  );
}

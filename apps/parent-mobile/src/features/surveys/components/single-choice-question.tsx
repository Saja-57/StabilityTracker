import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { useLanguage } from "@/providers/language-provider";

import type { SingleChoiceSurveyQuestion } from "../types";
import { SurveyChoiceOption } from "./survey-choice-option";
import { SurveyQuestionFrame } from "./survey-question-frame";

export interface SingleChoiceQuestionProps {
  readonly onChange: (value: string) => void;
  readonly question: SingleChoiceSurveyQuestion;
  readonly value?: string;
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.sm,
  },
});

export function SingleChoiceQuestion({
  onChange,
  question,
  value,
}: SingleChoiceQuestionProps) {
  const { t } = useLanguage();

  return (
    <SurveyQuestionFrame
      isOptional={question.isOptional}
      {...(question.language ? { language: question.language } : {})}
      prompt={question.prompt}
    >
      <View
        accessibilityLabel={t("surveys.types.singleChoice")}
        accessibilityRole="radiogroup"
        style={styles.options}
      >
        {question.options.map((option) => (
          <SurveyChoiceOption
            key={option.id}
            label={option.label}
            {...(option.language ? { language: option.language } : {})}
            mode="single"
            onPress={() => onChange(option.id)}
            selected={value === option.id}
          />
        ))}
      </View>
    </SurveyQuestionFrame>
  );
}

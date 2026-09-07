import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { useLanguage } from "@/providers/language-provider";

import type { MultiChoiceSurveyQuestion } from "../types";
import { SurveyChoiceOption } from "./survey-choice-option";
import { SurveyQuestionFrame } from "./survey-question-frame";

export interface MultiChoiceQuestionProps {
  readonly onChange: (value: readonly string[]) => void;
  readonly question: MultiChoiceSurveyQuestion;
  readonly value: readonly string[];
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.sm,
  },
});

export function MultiChoiceQuestion({
  onChange,
  question,
  value,
}: MultiChoiceQuestionProps) {
  const { t } = useLanguage();
  const toggle = (optionId: string) => {
    onChange(
      value.includes(optionId)
        ? value.filter((id) => id !== optionId)
        : [...value, optionId],
    );
  };

  return (
    <SurveyQuestionFrame
      isOptional={question.isOptional}
      {...(question.language ? { language: question.language } : {})}
      prompt={question.prompt}
    >
      <View
        accessibilityLabel={t("surveys.types.multiChoice")}
        style={styles.options}
      >
        {question.options.map((option) => (
          <SurveyChoiceOption
            key={option.id}
            label={option.label}
            {...(option.language ? { language: option.language } : {})}
            mode="multiple"
            onPress={() => toggle(option.id)}
            selected={value.includes(option.id)}
          />
        ))}
      </View>
    </SurveyQuestionFrame>
  );
}

import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText, getIconSize, iconStrokeWidth } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { ScaleSurveyQuestion } from "../types";
import { SurveyQuestionFrame } from "./survey-question-frame";

export interface ScaleQuestionProps {
  readonly onChange: (value: number) => void;
  readonly question: ScaleSurveyQuestion;
  readonly value?: number;
}

const styles = StyleSheet.create({
  options: {
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  option: {
    alignItems: "center",
    borderColor: colors.border.default,
    borderRadius: radius.small,
    borderWidth: 1,
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: sizing.touchTarget,
    minWidth: sizing.touchTarget,
  },
  selected: {
    backgroundColor: colors.brand.subtle,
    borderColor: colors.brand.primary,
  },
  pressed: {
    backgroundColor: colors.surface.interactive,
  },
});

export function ScaleQuestion({
  onChange,
  question,
  value,
}: ScaleQuestionProps) {
  const { language, t } = useLanguage();
  const values = Array.from(
    { length: Math.max(0, question.maximum - question.minimum + 1) },
    (_, index) => question.minimum + index,
  );

  return (
    <SurveyQuestionFrame
      isOptional={question.isOptional}
      {...(question.language ? { language: question.language } : {})}
      prompt={question.prompt}
    >
      <View
        accessibilityLabel={t("surveys.types.scale")}
        accessibilityRole="radiogroup"
        style={[styles.options, getDirectionalRowStyle(language)]}
      >
        {values.map((option) => {
          const optionLabel = option.toLocaleString(language);
          const selected = value === option;

          return (
            <Pressable
              key={option}
              accessibilityLabel={`${t("surveys.scale.value")} ${optionLabel}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.option,
                selected ? styles.selected : undefined,
                pressed ? styles.pressed : undefined,
              ]}
            >
              {selected ? (
                <Check
                  color={colors.brand.primary}
                  size={getIconSize("small")}
                  strokeWidth={iconStrokeWidth}
                />
              ) : null}
              <AppText variant="bodyStrong">{optionLabel}</AppText>
            </Pressable>
          );
        })}
      </View>
    </SurveyQuestionFrame>
  );
}

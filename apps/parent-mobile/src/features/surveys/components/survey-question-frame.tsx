import { spacing } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, Badge, Card } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export interface SurveyQuestionFrameProps extends PropsWithChildren {
  readonly isOptional: boolean;
  readonly language?: SupportedLanguage;
  readonly prompt: string;
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  heading: {
    gap: spacing.sm,
  },
});

export function SurveyQuestionFrame({
  children,
  isOptional,
  language,
  prompt,
}: SurveyQuestionFrameProps) {
  const { t } = useLanguage();

  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <Badge tone={isOptional ? "neutral" : "brand"}>
          {t(isOptional ? "surveys.optional" : "surveys.required")}
        </Badge>
        <AppText
          accessibilityRole="header"
          {...(language ? { language } : {})}
          variant="sectionTitle"
        >
          {prompt}
        </AppText>
      </View>
      {children}
    </Card>
  );
}

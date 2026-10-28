import type { SupportedLanguage } from "@stability/i18n";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { Row, TabLabel } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { space } from "@/theme/case-file";

export interface SurveyQuestionFrameProps extends PropsWithChildren {
  readonly hint?: string;
  readonly isOptional: boolean;
  readonly language?: SupportedLanguage;
  readonly prompt: string;
}

/** One question per screen: the prompt large, a quiet hint, then the answer. */
export function SurveyQuestionFrame({
  children,
  hint,
  isOptional,
  language,
  prompt,
}: SurveyQuestionFrameProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.frame}>
      <View style={styles.heading}>
        <Type
          variant="display"
          accessibilityRole="header"
          {...(language ? { language } : {})}
        >
          {isolate(prompt)}
        </Type>
        <Row gap={space.sm} wrap>
          {isOptional ? (
            <TabLabel tone="ink" label={t("checkin.optional")} />
          ) : null}
          {hint ? (
            <Type variant="small" color="muted">
              {hint}
            </Type>
          ) : null}
        </Row>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { gap: space.xl },
  heading: { gap: space.md },
});

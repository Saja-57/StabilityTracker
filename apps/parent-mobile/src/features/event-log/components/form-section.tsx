import { colors, spacing } from "@stability/design-tokens";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  Card,
  Divider,
  getIconSize,
  iconStrokeWidth,
  type IconComponent,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface FormSectionProps extends PropsWithChildren {
  readonly description?: string;
  readonly icon: IconComponent;
  readonly title: string;
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  heading: {
    flex: 1,
    gap: spacing.xs,
  },
});

export function FormSection({
  children,
  description,
  icon: Icon,
  title,
}: FormSectionProps) {
  const { language } = useLanguage();

  return (
    <Card style={styles.section}>
      <View style={[styles.header, getDirectionalRowStyle(language)]}>
        <Icon
          color={colors.brand.primary}
          size={getIconSize("medium")}
          strokeWidth={iconStrokeWidth}
        />
        <View style={styles.heading}>
          <AppText accessibilityRole="header" variant="cardTitle">
            {title}
          </AppText>
          {description ? (
            <AppText color="muted" variant="helper">
              {description}
            </AppText>
          ) : null}
        </View>
      </View>
      <Divider />
      {children}
    </Card>
  );
}

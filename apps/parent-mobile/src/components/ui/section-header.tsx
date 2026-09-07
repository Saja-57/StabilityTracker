import { spacing } from "@stability/design-tokens";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "./app-text";
import { useLanguage } from "../../providers/language-provider";
import { getDirectionalRowStyle } from "../../theme/direction";

export interface SectionHeaderProps {
  action?: ReactNode;
  description?: string;
  title: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});

export function SectionHeader({
  action,
  description,
  title,
}: SectionHeaderProps) {
  const { language } = useLanguage();

  return (
    <View style={[styles.container, getDirectionalRowStyle(language)]}>
      <View style={styles.copy}>
        <AppText variant="sectionTitle">{title}</AppText>
        {description ? (
          <AppText color="secondary">{description}</AppText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

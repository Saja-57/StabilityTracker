import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { AppText, getIconSize, iconStrokeWidth } from "@/components/ui";
import type { IconComponent } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

interface HomeCardHeaderProps {
  readonly icon: IconComponent;
  readonly title: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.brand.subtle,
    borderRadius: radius.small,
    height: sizing.control.small,
    justifyContent: "center",
    width: sizing.control.small,
  },
  title: {
    flex: 1,
  },
});

export function HomeCardHeader({ icon: Icon, title }: HomeCardHeaderProps) {
  const { language } = useLanguage();

  return (
    <View style={[styles.container, getDirectionalRowStyle(language)]}>
      <View style={styles.icon}>
        <Icon
          color={colors.brand.primary}
          size={getIconSize("medium")}
          strokeWidth={iconStrokeWidth}
        />
      </View>
      <AppText style={styles.title} variant="cardTitle">
        {title}
      </AppText>
    </View>
  );
}

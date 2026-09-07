import { colors, spacing } from "@stability/design-tokens";
import { CircleMinus } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, getIconSize, iconStrokeWidth } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

interface HomeUnavailableStateProps {
  readonly description: string;
  readonly title: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  icon: {
    marginBlockStart: spacing.xxs,
  },
});

export function HomeUnavailableState({
  description,
  title,
}: HomeUnavailableStateProps) {
  const { language } = useLanguage();

  return (
    <View style={[styles.container, getDirectionalRowStyle(language)]}>
      <CircleMinus
        color={colors.text.muted}
        size={getIconSize("small")}
        strokeWidth={iconStrokeWidth}
        style={styles.icon}
      />
      <View style={styles.copy}>
        <AppText color="secondary" variant="bodyStrong">
          {title}
        </AppText>
        <AppText color="muted" variant="helper">
          {description}
        </AppText>
      </View>
    </View>
  );
}

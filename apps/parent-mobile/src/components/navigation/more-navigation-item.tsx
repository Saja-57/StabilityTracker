import { colors, spacing } from "@stability/design-tokens";
import { getDirection } from "@stability/i18n";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import {
  getIconSize,
  iconStrokeWidth,
  type IconComponent,
} from "@/components/ui/icon";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface MoreNavigationItemProps {
  href: MoreRouteHref;
  icon: IconComponent;
  label: string;
}

export type MoreRouteHref =
  "/ai" | "/appointments" | "/family" | "/profile" | "/resources" | "/surveys";

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: {
    flex: 1,
  },
  pressed: {
    backgroundColor: colors.surface.interactive,
  },
});

export function MoreNavigationItem({
  href,
  icon: Icon,
  label,
}: MoreNavigationItemProps) {
  const { language } = useLanguage();
  const ForwardIcon =
    getDirection(language) === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="link"
      onPress={() => router.push(href as Href)}
      style={({ pressed }) => [
        styles.item,
        getDirectionalRowStyle(language),
        pressed ? styles.pressed : undefined,
      ]}
    >
      <Icon
        color={colors.brand.primary}
        size={getIconSize("medium")}
        strokeWidth={iconStrokeWidth}
      />
      <View style={styles.label}>
        <AppText variant="bodyStrong">{label}</AppText>
      </View>
      <ForwardIcon
        color={colors.text.muted}
        size={getIconSize("small")}
        strokeWidth={iconStrokeWidth}
      />
    </Pressable>
  );
}

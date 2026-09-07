import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import type { TranslationKey } from "@stability/i18n";
import {
  Bot,
  BookOpenText,
  ClipboardPenLine,
  ListChecks,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  Card,
  getIconSize,
  iconStrokeWidth,
  SectionHeader,
} from "@/components/ui";
import type { IconComponent } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export type HomeActionHref = "/ai" | "/log" | "/resources" | "/routine";

interface QuickActionDefinition {
  readonly href: HomeActionHref;
  readonly icon: IconComponent;
  readonly titleKey: TranslationKey;
}

interface QuickActionsProps {
  readonly onNavigate: (href: HomeActionHref) => void;
}

const quickActionRows = [
  [
    {
      href: "/routine",
      icon: ListChecks,
      titleKey: "home.actions.routine",
    },
    {
      href: "/log",
      icon: ClipboardPenLine,
      titleKey: "home.actions.log",
    },
  ],
  [
    { href: "/ai", icon: Bot, titleKey: "home.actions.askAI" },
    {
      href: "/resources",
      icon: BookOpenText,
      titleKey: "home.actions.resources",
    },
  ],
] as const satisfies readonly (readonly QuickActionDefinition[])[];

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  grid: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
  actionPressed: {
    opacity: 0.72,
  },
  card: {
    gap: spacing.md,
    minHeight: sizing.control.large * 2,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.brand.subtle,
    borderRadius: radius.small,
    height: sizing.control.small,
    justifyContent: "center",
    width: sizing.control.small,
  },
});

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const { language, t } = useLanguage();

  return (
    <View style={styles.section}>
      <SectionHeader title={t("home.quickActions.title")} />
      <View style={styles.grid}>
        {quickActionRows.map((actionRow, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.row, getDirectionalRowStyle(language)]}
          >
            {actionRow.map((action) => {
              const label = t(action.titleKey);
              const Icon = action.icon;

              return (
                <Pressable
                  key={action.href}
                  accessibilityLabel={label}
                  accessibilityRole="link"
                  onPress={() => onNavigate(action.href)}
                  style={({ pressed }) => [
                    styles.action,
                    pressed ? styles.actionPressed : undefined,
                  ]}
                >
                  <Card style={styles.card} variant="interactive">
                    <View style={styles.icon}>
                      <Icon
                        color={colors.brand.primary}
                        size={getIconSize("medium")}
                        strokeWidth={iconStrokeWidth}
                      />
                    </View>
                    <AppText variant="bodyStrong">{label}</AppText>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

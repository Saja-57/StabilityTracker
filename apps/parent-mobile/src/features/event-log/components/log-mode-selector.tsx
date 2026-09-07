import { colors, radius, spacing } from "@stability/design-tokens";
import { ClipboardList, Zap } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  Card,
  getIconSize,
  iconStrokeWidth,
  type IconComponent,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { EventLogMode } from "../types";

export interface LogModeSelectorProps {
  readonly onSelect: (mode: EventLogMode) => void;
}

interface ModeOption {
  readonly description: string;
  readonly icon: IconComponent;
  readonly title: string;
  readonly value: EventLogMode;
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs,
  },
  options: {
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.72,
  },
  card: {
    alignItems: "center",
    gap: spacing.md,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.brand.subtle,
    borderRadius: radius.small,
    height: spacing.xxxl,
    justifyContent: "center",
    width: spacing.xxxl,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});

export function LogModeSelector({ onSelect }: LogModeSelectorProps) {
  const { language, t } = useLanguage();
  const options: readonly ModeOption[] = [
    {
      description: t("eventLog.mode.quickDescription"),
      icon: Zap,
      title: t("eventLog.mode.quick"),
      value: "quick",
    },
    {
      description: t("eventLog.mode.detailedDescription"),
      icon: ClipboardList,
      title: t("eventLog.mode.detailed"),
      value: "detailed",
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <AppText accessibilityRole="header" variant="sectionTitle">
          {t("eventLog.entry.title")}
        </AppText>
        <AppText color="secondary">{t("eventLog.entry.description")}</AppText>
      </View>
      <View style={styles.options}>
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <Pressable
              key={option.value}
              accessibilityHint={option.description}
              accessibilityLabel={option.title}
              accessibilityRole="button"
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <Card
                style={[styles.card, getDirectionalRowStyle(language)]}
                variant="interactive"
              >
                <View style={styles.icon}>
                  <Icon
                    color={colors.brand.primary}
                    size={getIconSize("large")}
                    strokeWidth={iconStrokeWidth}
                  />
                </View>
                <View style={styles.copy}>
                  <AppText variant="cardTitle">{option.title}</AppText>
                  <AppText color="secondary">{option.description}</AppText>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

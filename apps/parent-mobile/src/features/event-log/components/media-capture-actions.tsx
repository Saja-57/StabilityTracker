import { colors, radius, spacing } from "@stability/design-tokens";
import type { TranslationKey } from "@stability/i18n";
import { Camera, Image, Mic, Video } from "lucide-react-native";
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

import type { EventMediaKind } from "../types";

interface MediaAction {
  readonly icon: IconComponent;
  readonly labelKey: TranslationKey;
  readonly value: EventMediaKind;
}

const mediaRows = [
  [
    { icon: Camera, labelKey: "eventLog.media.photo", value: "photo" },
    { icon: Video, labelKey: "eventLog.media.video", value: "video" },
  ],
  [
    { icon: Mic, labelKey: "eventLog.media.audio", value: "audio" },
    { icon: Image, labelKey: "eventLog.media.gallery", value: "gallery" },
  ],
] as const satisfies readonly (readonly MediaAction[])[];

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs,
  },
  grid: {
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    opacity: 0.56,
  },
  card: {
    alignItems: "center",
    gap: spacing.sm,
    minHeight: spacing.huge * 2,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.background.subtle,
    borderRadius: radius.small,
    height: spacing.xxxl,
    justifyContent: "center",
    width: spacing.xxxl,
  },
});

export function MediaCaptureActions() {
  const { language, t } = useLanguage();
  const unavailable = t("eventLog.media.unavailable");

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <AppText variant="label">{t("eventLog.media.title")}</AppText>
        <AppText color="muted" variant="helper">
          {t("eventLog.media.description")}
        </AppText>
      </View>
      <View style={styles.grid}>
        {mediaRows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.row, getDirectionalRowStyle(language)]}
          >
            {row.map((action) => {
              const Icon = action.icon;
              const label = t(action.labelKey);

              return (
                <Pressable
                  key={action.value}
                  accessibilityLabel={`${label}. ${unavailable}`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: true }}
                  disabled
                  style={styles.action}
                >
                  <Card style={styles.card} variant="subtle">
                    <View style={styles.icon}>
                      <Icon
                        color={colors.text.secondary}
                        size={getIconSize("medium")}
                        strokeWidth={iconStrokeWidth}
                      />
                    </View>
                    <AppText
                      style={{ textAlign: "center" }}
                      variant="bodyStrong"
                    >
                      {label}
                    </AppText>
                    <AppText
                      color="muted"
                      style={{ textAlign: "center" }}
                      variant="helper"
                    >
                      {unavailable}
                    </AppText>
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

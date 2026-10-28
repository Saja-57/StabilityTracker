import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Paper,
  Row,
  SectionTitle,
  Stamp,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { ScreenContainer } from "@/components/ui";
import { Monogram } from "@/features/more/components/monogram";
import { StackHeader } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { formatDay } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

import { PaperSwitch } from "./components/paper-switch";
import type { NotificationKey, ProfileScreenProps } from "./types";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

const notificationOrder: readonly NotificationKey[] = [
  "guidance",
  "routine",
  "checkIn",
  "sessions",
  "quietHours",
];

/** The caregiver's own page: who they are here, what reaches their phone, and how their data is held. */
export function ProfileScreen({
  caregiver,
  childGivenName,
  therapistGivenName,
  notificationDefaults,
  onNotificationsChange,
}: ProfileScreenProps) {
  const { language, t } = useLanguage();
  const [prefs, setPrefs] = useState(notificationDefaults);
  const lena = isolate(therapistGivenName);
  const child = isolate(childGivenName);
  const values = { name: lena, child };

  const details: { glyph: GlyphName; label: string; value: string }[] = [
    {
      glyph: "messages",
      label: t("more.profile.email"),
      value: isolate(caregiver.email),
    },
    {
      glyph: "bell",
      label: t("more.profile.phone"),
      value: isolate(caregiver.phone),
    },
    {
      glyph: "calendar",
      label: t("more.profile.since"),
      value: formatDay(caregiver.memberSince, language),
    },
  ];

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <Animated.View entering={enter(0)}>
        <StackHeader
          title={t("more.profile.title")}
          lede={t("more.profile.lede")}
        />
      </Animated.View>

      <Animated.View entering={enter(1)} style={styles.card}>
        <Row gap={space.lg}>
          <Monogram name={caregiver.givenName} size={64} tone="moss" />
          <View style={styles.flex}>
            <Type variant="title">{isolate(caregiver.name)}</Type>
            <Type variant="small" color="secondary">
              {fill(t("more.profile.role"), {
                relation: t(`vocab.relation.${caregiver.relation}`),
                child,
              })}
            </Type>
          </View>
        </Row>
        <View>
          {details.map((detail) => (
            <Row
              key={detail.label}
              gap={space.md}
              style={[styles.detail, styles.ruled]}
            >
              <Glyph name={detail.glyph} color={ink.muted} size={18} />
              <Type variant="small" color="muted" style={styles.detailLabel}>
                {detail.label}
              </Type>
              <Type variant="label" style={styles.flex} numberOfLines={1}>
                {detail.value}
              </Type>
            </Row>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={enter(2)} style={styles.section}>
        <SectionTitle title={t("more.profile.notifications")} />
        <Paper style={styles.list}>
          {notificationOrder.map((key, index) => (
            <View key={key} style={index > 0 ? styles.ruled : null}>
              <PaperSwitch
                label={fill(t(`more.profile.notify.${key}`), values)}
                detail={fill(t(`more.profile.notify.${key}.detail`), values)}
                value={prefs[key]}
                onChange={(next) => {
                  const updated = { ...prefs, [key]: next };
                  setPrefs(updated);
                  onNotificationsChange?.(updated);
                }}
              />
            </View>
          ))}
        </Paper>
        <Type variant="caption" color="muted">
          {t("more.profile.notifications.note")}
        </Type>
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.section}>
        <SectionTitle title={t("common.language")} />
        <LanguageSwitcher />
      </Animated.View>

      <Animated.View entering={enter(4)} style={styles.section}>
        <SectionTitle title={t("more.profile.privacy")} />
        <View style={styles.privacy}>
          <Row gap={space.md} align="flex-start">
            <View style={styles.shield}>
              <Glyph
                name="shield"
                color={cf.tab.mossInk}
                size={26}
                tint={0.3}
              />
            </View>
            <View style={[styles.flex, styles.privacyCopy]}>
              <Type variant="headline">{t("more.profile.privacy.title")}</Type>
              <Type variant="small" color="secondary">
                {fill(t("more.profile.privacy.share"), values)}
              </Type>
            </View>
          </Row>
          {(["one", "two", "three"] as const).map((point) => (
            <Row key={point} gap={space.sm} align="flex-start">
              <View style={styles.bulletTick}>
                <Glyph name="tick" color={cf.tab.mossInk} size={16} />
              </View>
              <Type variant="small" color="secondary" style={styles.flex}>
                {fill(t(`more.profile.privacy.${point}`), values)}
              </Type>
            </Row>
          ))}
          <View style={styles.sample}>
            <Stamp label={t("more.sampleData")} tilt={-2} />
            <Type variant="small" color="secondary">
              {t("more.profile.privacy.sample")}
            </Type>
          </View>
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: space.md },
  card: {
    backgroundColor: surface.raised,
    borderRadius: corner.xl,
    gap: space.lg,
    padding: 20,
    ...elevation.lift,
  },
  detail: { minHeight: 48, paddingVertical: space.sm },
  detailLabel: { minWidth: 88 },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
  list: { paddingVertical: 0 },
  privacy: {
    backgroundColor: surface.sunk,
    borderRadius: corner.lg,
    gap: space.md,
    padding: 20,
  },
  privacyCopy: { gap: 4 },
  shield: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  bulletTick: { paddingTop: 2 },
  sample: {
    borderTopColor: surface.rule,
    borderTopWidth: 1,
    gap: space.sm,
    marginTop: space.xs,
    paddingTop: space.md,
  },
});

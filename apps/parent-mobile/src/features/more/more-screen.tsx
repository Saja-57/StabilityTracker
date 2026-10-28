import { router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Magnet,
  Paper,
  PressCard,
  Row,
  SectionTitle,
  Stamp,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { ScreenContainer } from "@/components/ui";
import { fill, isolate } from "@/lib/format";
import { formatStampDate, formatTime } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { corner, elevation, ink, space, surface } from "@/theme/case-file";

import { Monogram } from "./components/monogram";
import type { MoreHubViewModel } from "./types";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

const go = (href: string) => router.push(href as Href);

interface Drawer {
  readonly href: string;
  readonly glyph: GlyphName;
  readonly title: string;
  readonly detail: string;
  readonly tag?: string;
}

/**
 * More is the fridge door itself: the family's name card, the check-in slip
 * held up by a magnet, today's visit as a ticket stub, and the quieter drawers
 * written as a ruled list beneath them.
 */
export function MoreScreen({
  child,
  caregivers,
  therapistGivenName,
  checkInWaiting,
  nextVisit,
}: MoreHubViewModel) {
  const { language, t } = useLanguage();
  const lena = isolate(therapistGivenName);
  const names = caregivers
    .map((caregiver) =>
      caregiver.you
        ? fill(t("more.youSuffix"), { name: isolate(caregiver.givenName) })
        : isolate(caregiver.givenName),
    )
    .join(t("more.listSeparator"));

  const drawers: Drawer[] = [
    {
      href: "/ai",
      glyph: "notes",
      title: t("more.hub.ask.title"),
      detail: fill(t("more.hub.ask.detail"), { name: lena }),
      tag: t("more.preview"),
    },
    {
      href: "/resources",
      glyph: "leaf",
      title: t("more.hub.resources.title"),
      detail: fill(t("more.hub.resources.detail"), { name: lena }),
    },
    {
      href: "/profile",
      glyph: "person",
      title: t("more.hub.profile.title"),
      detail: t("more.hub.profile.detail"),
    },
  ];

  const visitLine = nextVisit
    ? (nextVisit.focus ?? t("more.hub.appointments.title"))
    : fill(t("more.hub.appointments.none"), { name: lena });

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <Animated.View entering={enter(0)}>
        <PressCard
          accessibilityRole="link"
          accessibilityLabel={`${child.name}, ${fill(t("more.age"), { age: child.age })}. ${t("more.hub.family.title")}: ${names}`}
          onPress={() => go("/family")}
          style={styles.header}
        >
          <Row gap={space.lg} align="center">
            <Monogram name={child.givenName} size={76} tone="board" />
            <View style={styles.flex}>
              <Type variant="display" accessibilityRole="header">
                {isolate(child.name)}
              </Type>
              <Type variant="lede" color="secondary">
                {fill(t("more.age"), { age: child.age })}
              </Type>
            </View>
          </Row>
          <Row gap={space.md} style={styles.strip}>
            <Row gap={0}>
              {caregivers.map((caregiver, index) => (
                <View
                  key={caregiver.name}
                  style={index > 0 ? styles.overlap : null}
                >
                  <Monogram
                    name={caregiver.givenName}
                    size={34}
                    tone={caregiver.you ? "moss" : "sheet"}
                    ring
                  />
                </View>
              ))}
            </Row>
            <View style={styles.flex}>
              <Type variant="label" numberOfLines={1}>
                {t("more.hub.family.title")}
              </Type>
              <Type variant="caption" color="secondary" numberOfLines={1}>
                {names}
              </Type>
            </View>
            <Glyph name="chevron" color={ink.muted} size={18} />
          </Row>
        </PressCard>
      </Animated.View>

      <Animated.View entering={enter(1)} style={styles.door}>
        <PressCard
          accessibilityRole="link"
          accessibilityLabel={[
            t("more.hub.checkin.title"),
            checkInWaiting ? t("more.hub.checkin.waiting") : null,
            t("more.hub.checkin.detail"),
          ]
            .filter(Boolean)
            .join(". ")}
          onPress={() => go("/surveys")}
          pressedScale={0.985}
          style={styles.slipPlacement}
        >
          <View style={styles.slipTilt}>
            <View style={styles.magnetPin}>
              <Magnet unread={checkInWaiting} />
            </View>
            <Paper style={styles.slip}>
              <Type variant="title">{t("more.hub.checkin.title")}</Type>
              <Type variant="body" color="secondary">
                {t("more.hub.checkin.detail")}
              </Type>
              <Row style={styles.between}>
                {checkInWaiting ? (
                  <TabLabel tone="gold" label={t("more.hub.checkin.waiting")} />
                ) : (
                  <View />
                )}
                <Glyph name="chevron" color={ink.primary} size={18} />
              </Row>
            </Paper>
          </View>
        </PressCard>

        <PressCard
          accessibilityRole="link"
          accessibilityLabel={[
            t("more.hub.appointments.title"),
            nextVisit
              ? nextVisit.isToday
                ? fill(t("more.hub.appointments.today"), {
                    time: formatTime(nextVisit.at, language),
                  })
                : formatStampDate(nextVisit.at, language)
              : null,
            visitLine,
          ]
            .filter(Boolean)
            .join(". ")}
          onPress={() => go("/appointments")}
          pressedScale={0.985}
          style={styles.ticketPlacement}
        >
          <Row gap={0} align="stretch" style={styles.ticket}>
            {nextVisit ? (
              <View style={styles.stub}>
                <Stamp
                  label={
                    nextVisit.isToday
                      ? t("common.today")
                      : formatStampDate(nextVisit.at, language)
                  }
                  tilt={-4}
                />
                <Type variant="figureLarge" style={styles.time}>
                  {formatTime(nextVisit.at, language)}
                </Type>
              </View>
            ) : (
              <View style={styles.stub}>
                <Glyph name="calendar" color={ink.stamp} size={26} />
              </View>
            )}
            <View style={styles.perforation} aria-hidden>
              <View style={[styles.notch, styles.notchTop]} />
              <View style={styles.dashes} />
              <View style={[styles.notch, styles.notchBottom]} />
            </View>
            <Row gap={space.sm} style={styles.ticketBody}>
              <View style={styles.flex}>
                <Type variant="label">{t("more.hub.appointments.title")}</Type>
                <Type variant="small" color="secondary" numberOfLines={2}>
                  {isolate(visitLine)}
                </Type>
              </View>
              <Glyph name="chevron" color={ink.muted} size={18} />
            </Row>
          </Row>
        </PressCard>
      </Animated.View>

      <Animated.View entering={enter(2)} style={styles.drawers}>
        {drawers.map((drawer, index) => (
          <PressCard
            key={drawer.href}
            accessibilityRole="link"
            accessibilityLabel={`${drawer.title}. ${drawer.detail}`}
            onPress={() => go(drawer.href)}
            pressedScale={0.985}
            style={[styles.drawer, index > 0 ? styles.ruled : null]}
          >
            <Row gap={space.md}>
              <View style={styles.drawerGlyph}>
                <Glyph
                  name={drawer.glyph}
                  color={ink.secondary}
                  size={22}
                  tint={0.15}
                />
              </View>
              <View style={styles.flex}>
                <Row gap={space.sm}>
                  <Type variant="label" numberOfLines={1}>
                    {drawer.title}
                  </Type>
                  {drawer.tag ? (
                    <Type variant="caption" color="cobalt">
                      {drawer.tag}
                    </Type>
                  ) : null}
                </Row>
                <Type variant="small" color="muted" numberOfLines={1}>
                  {drawer.detail}
                </Type>
              </View>
              <Glyph name="chevron" color={ink.muted} size={18} />
            </Row>
          </PressCard>
        ))}
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.section}>
        <SectionTitle title={t("common.language")} />
        <LanguageSwitcher />
        <Row gap={space.sm} align="flex-start">
          <Glyph name="globe" color={ink.muted} size={17} />
          <Type variant="small" color="muted" style={styles.flex}>
            {t("more.language.note")}
          </Type>
        </Row>
      </Animated.View>

      <Animated.View entering={enter(4)} style={styles.footer}>
        <View style={styles.stampRow}>
          <Stamp label={t("more.sampleData")} tilt={-2} />
        </View>
        <Type variant="caption" color="muted" style={styles.footerNote}>
          {t("more.sampleData.detail")}
        </Type>
      </Animated.View>
    </ScreenContainer>
  );
}

const NOTCH = 18;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  between: { justifyContent: "space-between" },
  header: { gap: space.lg },
  strip: {
    backgroundColor: surface.sunk,
    borderRadius: corner.pill,
    minHeight: 52,
    paddingEnd: 14,
    paddingStart: 8,
    paddingVertical: 7,
  },
  overlap: { marginStart: -10 },

  door: { gap: space.xl },
  slipPlacement: { marginEnd: space.xl, paddingTop: 12 },
  slipTilt: { transform: [{ rotate: "-1.2deg" }] },
  magnetPin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: -12,
    zIndex: 2,
  },
  slip: {
    borderRadius: 6,
    gap: space.sm,
    padding: 20,
    paddingTop: 24,
    ...elevation.lift,
  },

  ticketPlacement: { marginStart: space.lg },
  ticket: {
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    minHeight: 92,
    overflow: "hidden",
    ...elevation.tile,
  },
  stub: {
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  time: { fontSize: 22, lineHeight: 26, color: ink.stamp },
  perforation: { alignItems: "center", width: NOTCH },
  notch: {
    backgroundColor: surface.ground,
    borderRadius: NOTCH / 2,
    height: NOTCH,
    position: "absolute",
    width: NOTCH,
  },
  notchTop: { top: -NOTCH / 2 },
  notchBottom: { bottom: -NOTCH / 2 },
  dashes: {
    borderColor: surface.ruleStrong,
    borderStyle: "dashed",
    borderStartWidth: 1.5,
    flex: 1,
    marginVertical: NOTCH / 2 + 4,
  },
  ticketBody: {
    flex: 1,
    paddingEnd: space.lg,
    paddingStart: space.sm,
    paddingVertical: space.md,
  },

  drawers: {
    borderBottomColor: surface.rule,
    borderBottomWidth: 1,
    borderTopColor: surface.rule,
    borderTopWidth: 1,
  },
  drawer: { minHeight: 68, justifyContent: "center", paddingVertical: 12 },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
  drawerGlyph: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 32,
  },

  section: { gap: space.md },
  footer: { alignItems: "center", gap: space.sm, paddingTop: space.sm },
  stampRow: { flexDirection: "row", justifyContent: "center" },
  footerNote: { maxWidth: 280, textAlign: "center" },
});

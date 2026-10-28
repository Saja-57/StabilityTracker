import { useEffect, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";
import { getDirectionalRowStyle } from "@/theme/direction";

import { Type } from "./type";

export const paperEase = Easing.bezier(0.16, 1, 0.3, 1);

/* ---------------------------------------------------------------- tone */

export type Tone = "gold" | "ruby" | "cobalt" | "moss" | "clay" | "ink";

export const toneWash: Record<Tone, { background: string; color: string; dot: string }> = {
  gold: { background: cf.tab.goldWash, color: cf.tab.goldInk, dot: cf.tab.gold },
  ruby: { background: cf.tab.rubyWash, color: cf.tab.rubyInk, dot: cf.tab.ruby },
  cobalt: { background: cf.tab.cobaltWash, color: cf.tab.cobaltInk, dot: cf.tab.cobalt },
  moss: { background: cf.tab.mossWash, color: cf.tab.mossInk, dot: cf.tab.moss },
  clay: { background: cf.tab.clayWash, color: cf.sheet.inkSecondary, dot: cf.tab.clay },
  ink: { background: cf.sheet.sunk, color: cf.sheet.inkSecondary, dot: cf.sheet.inkMuted },
};

/* -------------------------------------------------------------- row */

/** A direction-aware row: mirrors under Hebrew and Arabic. */
export function Row({
  children,
  gap = space.sm,
  align = "center",
  wrap = false,
  style,
}: {
  children: ReactNode;
  gap?: number;
  align?: ViewStyle["alignItems"];
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { language } = useLanguage();
  return (
    <View
      style={[
        getDirectionalRowStyle(language),
        { alignItems: align, gap, flexWrap: wrap ? "wrap" : "nowrap" },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ------------------------------------------------------------ press */

/** Pressable that settles under the thumb like a card pressed to the door. */
export function PressCard({
  children,
  style,
  pressedScale = 0.975,
  ...props
}: PressableProps & { children: ReactNode; style?: StyleProp<ViewStyle>; pressedScale?: number }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        scale.set(withTiming(pressedScale, { duration: 120, easing: paperEase }));
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withTiming(1, { duration: 260, easing: paperEase }));
        props.onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, animated]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ----------------------------------------------------------- action */

export type ActionVariant = "ink" | "gold" | "outline" | "quiet" | "board";

const actionSurface: Record<ActionVariant, ViewStyle> = {
  ink: { backgroundColor: surface.board, ...elevation.press },
  gold: { backgroundColor: cf.tab.gold, ...elevation.press },
  outline: { backgroundColor: surface.raised, borderColor: surface.rule, borderWidth: 1 },
  quiet: { backgroundColor: "transparent" },
  board: { backgroundColor: surface.boardRaised },
};

const actionInk: Record<ActionVariant, string> = {
  ink: cf.pressboard.ink,
  gold: cf.pressboard.deep,
  outline: cf.sheet.ink,
  quiet: cf.sheet.inkSecondary,
  board: cf.pressboard.ink,
};

export function Action({
  label,
  glyph,
  trailingGlyph,
  variant = "ink",
  size = "medium",
  onPress,
  disabled = false,
  accessibilityHint,
  style,
}: {
  label: string;
  glyph?: GlyphName;
  trailingGlyph?: GlyphName;
  variant?: ActionVariant;
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const height = size === "large" ? 56 : size === "small" ? 38 : 48;
  const color = actionInk[variant];
  return (
    <PressCard
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      {...(accessibilityHint ? { accessibilityHint } : {})}
      disabled={disabled}
      {...(onPress ? { onPress } : {})}
      style={[
        styles.action,
        actionSurface[variant],
        { height, paddingHorizontal: size === "small" ? space.md : space.xl, opacity: disabled ? 0.45 : 1 },
        style,
      ]}
    >
      <Row gap={space.sm} style={styles.center}>
        {glyph ? <Glyph name={glyph} color={color} size={size === "small" ? 17 : 20} /> : null}
        <Type variant="label" style={{ color }} numberOfLines={1}>
          {label}
        </Type>
        {trailingGlyph ? <Glyph name={trailingGlyph} color={color} size={size === "small" ? 16 : 18} /> : null}
      </Row>
    </PressCard>
  );
}

/* ------------------------------------------------------------ paper */

/** A raised sheet tile: the one container shape in the app. */
export function Paper({
  children,
  style,
  tone = "raised",
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: "raised" | "sunk" | "board";
}) {
  return (
    <View
      style={[
        styles.paper,
        tone === "raised" ? styles.paperRaised : tone === "sunk" ? styles.paperSunk : styles.paperBoard,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* -------------------------------------------------------------- tab */

export function TabLabel({ tone, label }: { tone: Tone; label: string }) {
  const palette = toneWash[tone];
  return (
    <Row gap={6} style={[styles.tabLabel, { backgroundColor: palette.background }]}>
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Type variant="caption" style={{ color: palette.color, fontWeight: "500" }} numberOfLines={1}>
        {label}
      </Type>
    </Row>
  );
}

/* ------------------------------------------------------------ stamp */

export function Stamp({ label, tilt = -3, tone = "stamp" }: { label: string; tilt?: number; tone?: "stamp" | "pen" | "moss" }) {
  const color = tone === "stamp" ? ink.stamp : tone === "pen" ? ink.pen : ink.moss;
  const scale = useSharedValue(1.3);
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.set(withDelay(180, withTiming(1, { duration: 360, easing: paperEase })));
    opacity.set(withDelay(180, withTiming(0.92, { duration: 200 })));
  }, [opacity, scale]);
  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${tilt}deg` }, { scale: scale.value }],
  }));
  return (
    <Animated.View style={[styles.stamp, { borderColor: color }, animated]}>
      <Type variant="stamp" style={{ color }} numberOfLines={1}>
        {label}
      </Type>
    </Animated.View>
  );
}

/* ---------------------------------------------------------- pen tick */

const AnimatedPath = Animated.createAnimatedComponent(Path);
const TICK = "M4.6 15.2c1.3.4 2.7 1.7 3.9 3.3.6.8 1.1 1.7 1.5 2.6.2-.6.9-2.3 2.2-4.6 2.6-4.6 6.4-9.5 12.2-13.4";
const TICK_LENGTH = 40;

/** The ballpoint tick: draws itself when a step is done. */
export function PenMark({ visible, size = 30, color = ink.pen }: { visible: boolean; size?: number; color?: string }) {
  const offset = useSharedValue(visible ? 0 : TICK_LENGTH);
  useEffect(() => {
    offset.set(withTiming(visible ? 0 : TICK_LENGTH, { duration: 420, easing: Easing.bezier(0.65, 0, 0.35, 1) }));
  }, [offset, visible]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <AnimatedPath
        d={TICK}
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={TICK_LENGTH}
        animatedProps={props}
      />
    </Svg>
  );
}

export function PenTickButton({
  checked,
  onToggle,
  label,
  size = 44,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  size?: number;
}) {
  return (
    <PressCard
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onToggle}
      pressedScale={0.9}
      style={[
        styles.tickBox,
        { width: size, height: size },
        checked ? styles.tickBoxChecked : styles.tickBoxOpen,
      ]}
    >
      <PenMark visible={checked} size={size - 10} />
    </PressCard>
  );
}

/* ----------------------------------------------------------- magnet */

/** The pressboard magnet that holds the therapist's note to the door. */
export function Magnet({ unread = false }: { unread?: boolean }) {
  return (
    <View style={styles.magnet}>
      <View style={styles.magnetShine} />
      {unread ? <View style={styles.magnetDot} /> : null}
    </View>
  );
}

/* ------------------------------------------------------------ heading */

export function SectionTitle({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <Row style={styles.sectionTitle}>
      <Type variant="headline" accessibilityRole="header" style={styles.flex}>
        {title}
      </Type>
      {aside}
    </Row>
  );
}

export function TextLink({ label, onPress, glyph = "chevron" }: { label: string; onPress: () => void; glyph?: GlyphName }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={10}>
      <Row gap={2}>
        <Type variant="small" color="secondary">
          {label}
        </Type>
        <Glyph name={glyph} color={ink.secondary} size={16} />
      </Row>
    </Pressable>
  );
}

/* ----------------------------------------------------------- barcode */

export type BarIntensity = "low" | "moderate" | "high";

const barHeight: Record<BarIntensity, number> = { low: 0.4, moderate: 0.7, high: 1 };
const barColor: Record<BarIntensity, string> = {
  low: cf.intensity.low,
  moderate: cf.intensity.moderate,
  high: cf.intensity.high,
};

/** One column per day, one bar per logged moment, height by intensity. */
export function EventBarcode({
  days,
  height = 40,
  sinceIndex,
}: {
  days: readonly (readonly BarIntensity[])[];
  height?: number;
  sinceIndex?: number;
}) {
  const { language } = useLanguage();
  return (
    <View style={[getDirectionalRowStyle(language), { height, gap: 3, alignItems: "flex-end" }]}>
      {days.map((bars, index) => (
        <View
          key={index}
          style={[
            styles.barDay,
            sinceIndex !== undefined && index >= sinceIndex ? { backgroundColor: cf.sheet.sunk } : null,
          ]}
        >
          {bars.length === 0 ? (
            <View style={styles.barEmpty} />
          ) : (
            bars.slice(0, 3).map((intensity, bar) => (
              <View
                key={bar}
                style={[styles.bar, { height: `${barHeight[intensity] * 100}%`, backgroundColor: barColor[intensity] }]}
              />
            ))
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center" },
  action: {
    alignItems: "center",
    borderRadius: corner.md,
    justifyContent: "center",
  },
  paper: {
    borderRadius: corner.lg,
    padding: space.lg,
  },
  paperRaised: { backgroundColor: surface.raised, ...elevation.tile },
  paperSunk: { backgroundColor: surface.sunk },
  paperBoard: { backgroundColor: surface.board },
  tabLabel: {
    alignSelf: "flex-start",
    borderRadius: 8,
    height: 24,
    paddingHorizontal: 8,
  },
  dot: { borderRadius: 3, height: 6, width: 6 },
  stamp: {
    alignSelf: "flex-start",
    borderRadius: 6,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tickBox: {
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
  },
  tickBoxOpen: { borderColor: cf.sheet.ruleStrong, borderWidth: 1.5 },
  tickBoxChecked: { backgroundColor: cf.tab.cobaltWash },
  magnet: {
    backgroundColor: cf.pressboard.raised,
    borderRadius: 13,
    height: 26,
    width: 26,
    ...elevation.press,
  },
  magnetShine: {
    backgroundColor: cf.pressboard.inkFaint,
    borderRadius: 4,
    height: 6,
    marginStart: 6,
    marginTop: 5,
    opacity: 0.6,
    width: 8,
  },
  magnetDot: {
    backgroundColor: cf.tab.gold,
    borderColor: cf.sheet.raised,
    borderRadius: 6,
    borderWidth: 2,
    end: -3,
    height: 12,
    position: "absolute",
    top: -3,
    width: 12,
  },
  sectionTitle: { justifyContent: "space-between" },
  barDay: {
    alignItems: "flex-end",
    borderRadius: 3,
    flex: 1,
    flexDirection: "row",
    gap: 1.5,
    height: "100%",
    justifyContent: "center",
  },
  bar: { borderRadius: 1.5, maxWidth: 4, minWidth: 2, flex: 1 },
  barEmpty: { backgroundColor: cf.sheet.rule, borderRadius: 2, height: 3, width: "100%" },
});

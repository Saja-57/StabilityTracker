import { router, type Href } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  paperEase,
  Row,
  TabLabel,
  type Tone,
  toneWash,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { corner, elevation, ink, space, surface } from "@/theme/case-file";

export type MoreRouteHref =
  "/ai" | "/appointments" | "/family" | "/profile" | "/resources" | "/surveys";

export interface MoreNavigationItemProps {
  readonly href: MoreRouteHref;
  readonly glyph: GlyphName;
  readonly tone: Tone;
  readonly label: string;
  readonly description: string;
  readonly tag?: { readonly tone: Tone; readonly label: string };
  readonly art?: ReactNode;
}

/** One destination on the More door: a raised tile with its own glyph and what is inside. */
export function MoreNavigationItem({
  href,
  glyph,
  tone,
  label,
  description,
  tag,
  art,
}: MoreNavigationItemProps) {
  const palette = toneWash[tone];
  const scale = useSharedValue(1);
  const pressed = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={
        tag
          ? `${label}, ${tag.label}. ${description}`
          : `${label}. ${description}`
      }
      onPress={() => router.push(href as Href)}
      onPressIn={() => {
        scale.set(withTiming(0.975, { duration: 120, easing: paperEase }));
      }}
      onPressOut={() => {
        scale.set(withTiming(1, { duration: 260, easing: paperEase }));
      }}
      style={styles.press}
    >
      <Animated.View style={[styles.tile, pressed]}>
        <Row style={styles.top} align="flex-start">
          <View
            style={[styles.glyphTile, { backgroundColor: palette.background }]}
          >
            {art ?? (
              <Glyph name={glyph} color={palette.color} size={24} tint={0.28} />
            )}
          </View>
          {tag ? (
            <TabLabel tone={tag.tone} label={tag.label} />
          ) : (
            <Glyph name="chevron" color={ink.muted} size={18} />
          )}
        </Row>
        <View style={styles.copy}>
          <Type variant="headline" numberOfLines={2}>
            {label}
          </Type>
          <Type variant="small" color="muted" numberOfLines={2}>
            {description}
          </Type>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1 },
  tile: {
    flex: 1,
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    gap: space.md,
    minHeight: 164,
    padding: space.lg,
    ...elevation.tile,
  },
  top: { justifyContent: "space-between" },
  glyphTile: {
    alignItems: "center",
    borderRadius: 13,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  copy: { flex: 1, gap: 4, justifyContent: "flex-end" },
});

import type { SupportedLanguage } from "@stability/i18n";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { corner, elevation, space, surface } from "@/theme/case-file";

export interface SegmentOption<T extends string> {
  readonly value: T;
  readonly label: string;
  /** Render this label in its own language's face. */
  readonly language?: SupportedLanguage;
  readonly detail?: string;
}

/**
 * A sunk channel with one raised paper tab that slides to the chosen option,
 * like moving a divider tab along the drawer.
 */
export function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}) {
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const segment = options.length > 0 ? width / options.length : 0;
  const offset = useSharedValue(index * segment);
  const measured = useRef(false);

  useEffect(() => {
    if (!measured.current) {
      if (segment > 0) measured.current = true;
      offset.set(index * segment);
      return;
    }
    offset.set(withTiming(index * segment, {
      duration: 340,
      easing: paperEase,
    }));
  }, [index, offset, segment]);

  // The spacer pushes the paper tab along a direction-aware row, so it
  // slides the right way in Hebrew and Arabic without left/right math.
  const spacer = useAnimatedStyle(() => ({ width: offset.value }));

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={styles.track}
    >
      <View
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={styles.inner}
      >
        {width > 0 ? (
          <Row gap={0} style={styles.rail}>
            <Animated.View style={spacer} />
            <View
              pointerEvents="none"
              style={[styles.indicator, { width: segment }]}
            />
          </Row>
        ) : null}
        <Row gap={0} style={styles.fill}>
          {options.map((option) => {
            const active = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={
                  option.detail
                    ? `${option.label}, ${option.detail}`
                    : option.label
                }
                onPress={() => onChange(option.value)}
                style={styles.segment}
              >
                <Row gap={6} style={styles.center}>
                  <Type
                    variant="label"
                    color={active ? "primary" : "secondary"}
                    numberOfLines={1}
                    {...(option.language ? { language: option.language } : {})}
                  >
                    {option.label}
                  </Type>
                  {option.detail ? (
                    <Type variant="figure" color="muted" style={styles.detail}>
                      {option.detail}
                    </Type>
                  ) : null}
                </Row>
              </Pressable>
            );
          })}
        </Row>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: surface.sunk,
    borderRadius: corner.md + 2,
    padding: 4,
  },
  inner: { minHeight: 48 },
  fill: { flex: 1 },
  rail: { bottom: 0, end: 0, position: "absolute", start: 0, top: 0 },
  indicator: {
    alignSelf: "stretch",
    backgroundColor: surface.raised,
    borderRadius: corner.md - 2,
    ...elevation.tile,
  },
  segment: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: space.sm,
  },
  center: { justifyContent: "center" },
  detail: { fontSize: 12.5 },
});

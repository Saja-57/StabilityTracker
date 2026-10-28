import { getDirection } from "@stability/i18n";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { useLanguage } from "@/providers/language-provider";
import { cf, elevation, space, surface } from "@/theme/case-file";

const TRACK_W = 52;
const TRACK_H = 32;
const THUMB = 24;
const TRAVEL = TRACK_W - THUMB - 8;

/** A pressboard switch: the sheet tab slides onto the green board when on. */
export function PaperSwitch({
  label,
  detail,
  value,
  onChange,
}: {
  label: string;
  detail?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { language } = useLanguage();
  const sign = getDirection(language) === "rtl" ? -1 : 1;
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, {
      duration: 260,
      easing: paperEase,
    }));
  }, [progress, value]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [cf.sheet.ruleStrong, cf.pressboard.base],
    ),
  }));
  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL * sign }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      {...(detail ? { accessibilityHint: detail } : {})}
      onPress={() => onChange(!value)}
      style={styles.row}
    >
      <Row gap={space.lg}>
        <View style={styles.copy}>
          <Type variant="label">{label}</Type>
          {detail ? (
            <Type variant="small" color="muted">
              {detail}
            </Type>
          ) : null}
        </View>
        <Animated.View style={[styles.track, track]}>
          <Animated.View style={[styles.thumb, thumb]} />
        </Animated.View>
      </Row>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { justifyContent: "center", minHeight: 64, paddingVertical: space.md },
  copy: { flex: 1, gap: 2 },
  track: {
    borderRadius: TRACK_H / 2,
    height: TRACK_H,
    justifyContent: "center",
    paddingHorizontal: 4,
    width: TRACK_W,
  },
  thumb: {
    backgroundColor: surface.raised,
    borderRadius: THUMB / 2,
    height: THUMB,
    width: THUMB,
    ...elevation.press,
  },
});

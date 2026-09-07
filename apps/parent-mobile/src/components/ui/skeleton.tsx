import { colors, motion, radius, spacing } from "@stability/design-tokens";
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export interface SkeletonProps {
  height?: number;
  style?: StyleProp<ViewStyle>;
  width?: number | `${number}%`;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.background.subtle,
    borderRadius: radius.small,
    overflow: "hidden",
  },
});

export function Skeleton({
  height = spacing.lg,
  style,
  width = "100%",
}: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.55));

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    let active = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!active || reduceMotion) {
        opacity.setValue(0.72);
        return;
      }

      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            duration: motion.duration.slow * 2,
            easing: Easing.inOut(Easing.ease),
            toValue: 0.9,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            duration: motion.duration.slow * 2,
            easing: Easing.inOut(Easing.ease),
            toValue: 0.45,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    });

    return () => {
      active = false;
      animation?.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, { height, opacity, width }, style]}
    />
  );
}

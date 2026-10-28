import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Paper, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Pictogram } from "@/components/icons/pictograms";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, space } from "@/theme/case-file";

type Phase = "in" | "hold" | "out";

const phases: readonly { key: Phase; seconds: number }[] = [
  { key: "in", seconds: 4 },
  { key: "hold", seconds: 4 },
  { key: "out", seconds: 6 },
];

const SMALL = 0.58;
const RING = 232;
const breath = Easing.inOut(Easing.sin);

/**
 * The calm-first breathing guide: a ring that grows for four, rests for
 * four, and settles for six. Tap anywhere on it to pause.
 */
export function CalmingSupportCard() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const [clock, setClock] = useState({
    phaseIndex: 0,
    count: phases[0]?.seconds ?? 4,
  });
  const [running, setRunning] = useState(true);
  const countRef = useRef(clock.count);
  useEffect(() => {
    countRef.current = clock.count;
  }, [clock.count]);

  const scale = useSharedValue(SMALL);
  const phaseIndex = clock.phaseIndex;
  const phase = phases[phaseIndex] ?? { key: "in" as Phase, seconds: 4 };

  // One-second tick: count down, then turn to the next phase.
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setClock((current) => {
        if (current.count > 1) return { ...current, count: current.count - 1 };
        const next = (current.phaseIndex + 1) % phases.length;
        return { phaseIndex: next, count: phases[next]?.seconds ?? 4 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Drive the ring toward this phase's target over what remains of it.
  useEffect(() => {
    if (!running) {
      cancelAnimation(scale);
      return;
    }
    if (reduced) {
      scale.set(phase.key === "out" ? 0.7 : 0.86);
      return;
    }
    const target = phase.key === "out" ? SMALL : 1;
    const seconds = Math.min(Math.max(countRef.current, 1), phase.seconds);
    scale.set(
      withTiming(target, {
        duration: seconds * 1000,
        easing: breath,
      }),
    );
  }, [phase.key, phase.seconds, phaseIndex, reduced, running, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + (scale.value - SMALL) * 0.9,
    transform: [{ scale: 0.12 + scale.value * 0.92 }],
  }));

  const phaseLabel = t(`logFlow.breathe.${phase.key}`);
  const shownCount = clock.count;

  return (
    <Paper tone="board" style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t("logFlow.breathe.label")}. ${running ? phaseLabel : t("logFlow.breathe.paused")}`}
        accessibilityHint={
          running ? t("logFlow.breathe.pause") : t("logFlow.breathe.resume")
        }
        onPress={() => setRunning((value) => !value)}
        style={styles.stage}
      >
        <View style={styles.guide} />
        <Animated.View style={[styles.halo, haloStyle]} />
        <Animated.View style={[styles.ring, ringStyle]}>
          <Pictogram
            name="breathe"
            size={104}
            color={cf.pressboard.ink}
            tintColor={cf.pressboard.line}
          />
        </Animated.View>
      </Pressable>

      <View style={styles.caption} accessibilityLiveRegion="polite">
        <Type variant="display" color="board" style={styles.center}>
          {running ? phaseLabel : t("logFlow.breathe.paused")}
        </Type>
        <Row gap={space.sm} style={styles.centerRow}>
          {phases.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.pip,
                { flex: item.seconds },
                index === phaseIndex ? styles.pipOn : null,
              ]}
            />
          ))}
        </Row>
        <Row gap={space.md} style={styles.centerRow}>
          <Type variant="figureLarge" color="board">
            {shownCount}
          </Type>
          <Type variant="small" color="boardMuted" style={styles.rhythm}>
            {t("logFlow.breathe.rhythm")}
          </Type>
        </Row>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          running ? t("logFlow.breathe.pause") : t("logFlow.breathe.resume")
        }
        onPress={() => setRunning((value) => !value)}
        style={styles.toggle}
      >
        <Type variant="label" color="boardMuted" style={styles.toggleText}>
          {running ? t("logFlow.breathe.pause") : t("logFlow.breathe.resume")}
        </Type>
      </Pressable>
    </Paper>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: corner.xl,
    gap: space.lg,
    paddingVertical: 28,
  },
  stage: {
    alignItems: "center",
    height: RING + 8,
    justifyContent: "center",
    width: RING + 8,
  },
  guide: {
    borderColor: cf.pressboard.line,
    borderRadius: RING / 2,
    borderStyle: "dashed",
    borderWidth: 1.5,
    height: RING,
    position: "absolute",
    width: RING,
  },
  halo: {
    backgroundColor: cf.pressboard.raised,
    borderRadius: RING / 2,
    height: RING,
    position: "absolute",
    width: RING,
  },
  ring: {
    alignItems: "center",
    backgroundColor: cf.pressboard.raised,
    borderColor: cf.pressboard.inkFaint,
    borderRadius: (RING * 0.82) / 2,
    borderWidth: 1.5,
    height: RING * 0.82,
    justifyContent: "center",
    width: RING * 0.82,
  },
  caption: { alignItems: "center", alignSelf: "stretch", gap: space.md },
  center: { textAlign: "center" },
  centerRow: { justifyContent: "center", alignSelf: "stretch" },
  pip: {
    backgroundColor: cf.pressboard.line,
    borderRadius: 2,
    height: 4,
    maxWidth: 60,
  },
  pipOn: { backgroundColor: cf.tab.mossWash },
  rhythm: { flexShrink: 1 },
  toggleText: { textDecorationLine: "underline" },
  toggle: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: space.lg,
  },
});

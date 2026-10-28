import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import {
  Action,
  Paper,
  Row,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, space, surface } from "@/theme/case-file";

const enter = FadeInDown.duration(520).delay(140).easing(paperEase);

/** A blank picture card where today's cards would hang. */
export function RoutineEmptyState() {
  const { t } = useLanguage();

  return (
    <Animated.View entering={enter}>
      <View style={styles.blank}>
        <View style={styles.blankTile}>
          <Glyph
            name="routine"
            color={cf.sheet.inkMuted}
            size={30}
            tint={0.15}
          />
        </View>
        <View style={styles.copy}>
          <Type variant="title" accessibilityRole="header">
            {t("routineDay.empty.title")}
          </Type>
          <Type variant="body" color="secondary">
            {t("routineDay.empty.detail")}
          </Type>
        </View>
      </View>
    </Animated.View>
  );
}

export interface RoutineErrorStateProps {
  readonly onRetry: () => void;
}

/** A calm paper slip, never an alarm. */
export function RoutineErrorState({ onRetry }: RoutineErrorStateProps) {
  const { t } = useLanguage();

  return (
    <Animated.View entering={enter}>
      <Paper style={styles.slip}>
        <View style={styles.slipTile}>
          <Pictogram
            name="breathe"
            size={40}
            color={cf.tab.cobaltInk}
            tint={0.18}
          />
        </View>
        <View style={styles.copy}>
          <Type variant="title" accessibilityRole="header">
            {t("routineDay.error.title")}
          </Type>
          <Type variant="body" color="secondary">
            {t("routineDay.error.detail")}
          </Type>
        </View>
        <Action
          label={t("routineDay.retry")}
          variant="outline"
          onPress={onRetry}
          style={styles.retry}
        />
      </Paper>
    </Animated.View>
  );
}

/** Sunk card outlines breathing softly while the day's cards arrive. */
export function RoutineLoadingState() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!reduceMotion) {
      pulse.set(withRepeat(
        withTiming(0.55, { duration: 900, easing: paperEase }),
        -1,
        true,
      ));
    }
  }, [pulse, reduceMotion]);

  const breathing = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View
      accessibilityLabel={t("routineDay.loading")}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.loading}
    >
      <Row gap={5}>
        {Array.from({ length: 8 }, (_, index) => (
          <View key={index} style={styles.square} />
        ))}
      </Row>
      <Animated.View style={[styles.loadingList, breathing]}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[styles.ghost, index === 1 ? styles.ghostLarge : null]}
          >
            <View
              style={[
                styles.ghostTile,
                index === 1 ? styles.ghostTileLarge : null,
              ]}
            />
            <View style={styles.ghostLines}>
              <View style={[styles.ghostLine, { width: "28%" }]} />
              <View
                style={[
                  styles.ghostLine,
                  { width: index === 1 ? "78%" : "64%" },
                ]}
              />
            </View>
          </View>
        ))}
      </Animated.View>
      <Type variant="small" color="muted">
        {t("routineDay.loading")}
      </Type>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { gap: space.sm },
  blank: {
    borderColor: cf.sheet.ruleStrong,
    borderRadius: corner.lg,
    borderStyle: "dashed",
    borderWidth: 1.5,
    gap: space.lg,
    padding: 20,
  },
  blankTile: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: corner.md,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  slip: { gap: space.lg, padding: 20 },
  slipTile: {
    alignItems: "center",
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: corner.md,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  retry: { alignSelf: "flex-start" },
  loading: { gap: space.lg },
  square: {
    borderColor: cf.sheet.ruleStrong,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 18,
    width: 18,
  },
  loadingList: { gap: 12 },
  ghost: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: corner.lg,
    flexDirection: "row",
    gap: space.md,
    padding: 14,
  },
  ghostLarge: { borderRadius: corner.xl, paddingVertical: 22 },
  ghostTile: {
    backgroundColor: surface.rule,
    borderRadius: corner.md,
    height: 56,
    width: 56,
  },
  ghostTileLarge: { height: 84, width: 84 },
  ghostLines: { flex: 1, gap: space.sm },
  ghostLine: { backgroundColor: surface.rule, borderRadius: 4, height: 10 },
});

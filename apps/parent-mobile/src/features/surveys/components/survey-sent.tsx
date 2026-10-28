import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Action,
  Paper,
  PenMark,
  Stamp,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, elevation, space } from "@/theme/case-file";

export interface SurveySentProps {
  readonly onHome: () => void;
  readonly therapistName?: string;
}

/** The thank-you sheet: stamped as sent, nothing left to do. */
export function SurveySent({ onHome, therapistName }: SurveySentProps) {
  const { t } = useLanguage();
  const name = therapistName ? isolate(therapistName) : "";

  return (
    <View style={styles.root}>
      <Animated.View
        entering={FadeInDown.duration(560).delay(40).easing(paperEase)}
      >
        <Paper style={styles.sheet}>
          <View style={styles.tick}>
            <PenMark visible size={64} />
          </View>
          <Stamp
            label={
              name
                ? fill(t("checkin.sent.stamp"), { name })
                : t("checkin.sent.stampPlain")
            }
            tone="moss"
            tilt={-5}
          />
          <Type
            variant="hero"
            accessibilityRole="header"
            accessibilityLiveRegion="polite"
          >
            {t("checkin.sent.title")}
          </Type>
          <Type variant="lede" color="secondary">
            {name
              ? fill(t("checkin.sent.detail"), { name })
              : t("checkin.sent.detailPlain")}
          </Type>
        </Paper>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(520).delay(200).easing(paperEase)}
      >
        <Action
          label={t("checkin.sent.home")}
          glyph="home"
          variant="ink"
          size="large"
          onPress={onHome}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.xl },
  sheet: {
    alignItems: "flex-start",
    borderRadius: 8,
    gap: 18,
    padding: 26,
    paddingTop: 28,
    ...elevation.lift,
  },
  tick: {
    alignItems: "center",
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: 24,
    height: 88,
    justifyContent: "center",
    width: 88,
  },
});

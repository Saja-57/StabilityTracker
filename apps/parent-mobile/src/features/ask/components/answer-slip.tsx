import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Magnet, Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { cf, ink, space, surface, elevation } from "@/theme/case-file";

/** An answer held to the door like a note: the question, the answer, and where it comes from. */
export function AnswerSlip({
  question,
  answer,
  source,
  children,
  tilt = -0.8,
}: {
  question?: string;
  tilt?: number;
  answer: string;
  source: string;
  children?: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <Animated.View
      entering={FadeInDown.duration(460).easing(paperEase)}
      style={[styles.wrap, { transform: [{ rotate: `${tilt}deg` }] }]}
    >
      <View style={styles.pin}>
        <Magnet />
      </View>
      <View style={styles.slip} accessibilityLiveRegion="polite">
        {question ? (
          <Type variant="small" color="muted">
            {question}
          </Type>
        ) : null}
        <Type variant="lede">{answer}</Type>
        <Row gap={6} align="flex-start" style={styles.source}>
          <Glyph name="files" color={ink.stamp} size={16} />
          <Type variant="caption" color="stamp" style={styles.flex}>
            {t("more.ask.source")} {source}
          </Type>
        </Row>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrap: { paddingTop: 12 },
  pin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 2,
  },
  slip: {
    backgroundColor: surface.raised,
    borderRadius: 6,
    gap: space.md,
    padding: 20,
    paddingTop: 24,
    ...elevation.lift,
  },
  source: {
    borderTopColor: cf.sheet.rule,
    borderTopWidth: 1,
    paddingTop: space.md,
  },
});

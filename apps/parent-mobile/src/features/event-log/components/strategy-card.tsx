import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { PressCard, Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { fill, isolate } from "@/lib/format";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

import { eventSupportLabelKeys } from "../options";
import type { EventLogStrategyViewModel } from "../types";
import { LogPicture } from "./log-picture";

/** One approved strategy as a big picture card that opens to its steps. */
export function StrategyCard({
  strategy,
  expanded,
  onToggle,
}: {
  strategy: EventLogStrategyViewModel;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  const title = t(eventSupportLabelKeys[strategy.support]);

  return (
    <Animated.View layout={LinearTransition.duration(320).easing(paperEase)}>
      <PressCard
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${title}. ${strategy.when}`}
        accessibilityHint={
          expanded ? t("logFlow.strategies.hide") : t("logFlow.strategies.show")
        }
        onPress={onToggle}
        pressedScale={0.985}
        style={[styles.card, expanded ? styles.cardOpen : null]}
      >
        <Row gap={space.lg} align="center">
          <View style={styles.picture}>
            <LogPicture
              name={strategy.support}
              size={54}
              color={cf.pressboard.base}
              tintColor={cf.tab.mossWash}
            />
          </View>
          <View style={styles.text}>
            <Type variant="title">{title}</Type>
            <Type variant="small" color="secondary">
              {isolate(strategy.when)}
            </Type>
          </View>
          <View style={[styles.chevron, expanded ? styles.chevronOpen : null]}>
            <Glyph name="chevronDown" color={ink.secondary} size={20} />
          </View>
        </Row>

        {expanded ? (
          <Animated.View entering={FadeIn.duration(260)} style={styles.steps}>
            {strategy.steps.map((step, index) => (
              <Row
                key={step}
                gap={space.md}
                align="flex-start"
                style={styles.step}
              >
                <View style={styles.number}>
                  <Type variant="figure" color="pen" style={styles.numberText}>
                    {index + 1}
                  </Type>
                </View>
                <Type variant="body" style={styles.stepText}>
                  {isolate(step)}
                </Type>
              </Row>
            ))}
            {strategy.tried > 0 ? (
              <Row gap={6}>
                <View style={styles.mossDot} />
                <Type variant="caption" color="moss">
                  {fill(t("logFlow.strategies.worked"), {
                    worked: strategy.worked,
                    tried: strategy.tried,
                  })}
                </Type>
              </Row>
            ) : null}
          </Animated.View>
        ) : null}
      </PressCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    gap: space.lg,
    padding: space.lg,
    ...elevation.tile,
  },
  cardOpen: { ...elevation.lift },
  picture: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: 18,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  text: { flex: 1, gap: 4 },
  chevron: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 28,
  },
  chevronOpen: { transform: [{ rotate: "180deg" }] },
  steps: {
    borderTopColor: surface.rule,
    borderTopWidth: 1,
    gap: space.md,
    paddingTop: space.lg,
  },
  step: {},
  number: {
    alignItems: "center",
    borderColor: cf.pen,
    borderRadius: 14,
    borderWidth: 1.5,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  numberText: { fontSize: 13, lineHeight: 16 },
  stepText: { flex: 1, paddingTop: 2 },
  mossDot: {
    backgroundColor: cf.tab.moss,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
});

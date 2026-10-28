import { router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Action,
  Paper,
  Row,
  SectionTitle,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { StackHeader } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, space, surface } from "@/theme/case-file";

import type { StrategyViewModel } from "../types";
import { TryTally } from "./strategy-card";

const enter = (index: number) =>
  FadeInDown.duration(480)
    .delay(40 + index * 60)
    .easing(paperEase);

/** One strategy opened up: when to reach for it, the steps in order, and how it has gone so far. */
export function StrategyDetail({
  strategy,
  therapistGivenName,
  onBack,
}: {
  strategy: StrategyViewModel;
  therapistGivenName: string;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  const lena = isolate(therapistGivenName);
  const name = t(`more.resources.name.${strategy.id}`);
  const wash = strategy.approved ? cf.tab.mossWash : cf.tab.cobaltWash;

  return (
    <>
      <Animated.View entering={enter(0)}>
        <StackHeader
          title={name}
          onBack={onBack}
          backLabel={t("more.resources.backToAll")}
        />
      </Animated.View>

      <Animated.View entering={enter(1)} style={styles.hero}>
        <View style={[styles.picture, { backgroundColor: wash }]}>
          <Pictogram
            name={strategy.pictogram}
            size={88}
            color={strategy.approved ? cf.tab.mossInk : cf.tab.cobaltInk}
            tint={0.22}
          />
        </View>
        <TabLabel
          tone={strategy.approved ? "moss" : "cobalt"}
          label={
            strategy.approved
              ? fill(t("more.resources.approvedBy"), { name: lena })
              : t("more.resources.forYou")
          }
        />
      </Animated.View>

      <Animated.View entering={enter(2)} style={styles.section}>
        <SectionTitle title={t("more.resources.when")} />
        <View style={styles.slip}>
          <Type variant="lede">{isolate(strategy.when)}</Type>
        </View>
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.section}>
        <SectionTitle title={t("more.resources.steps")} />
        <Paper style={styles.steps}>
          {strategy.steps.map((step, index) => (
            <Row
              key={step}
              gap={space.md}
              align="flex-start"
              style={[styles.step, index > 0 ? styles.ruled : null]}
            >
              <View style={styles.number}>
                <Type variant="figure" color="board">
                  {index + 1}
                </Type>
              </View>
              <Type variant="body" style={styles.stepText}>
                {isolate(step)}
              </Type>
            </Row>
          ))}
        </Paper>
      </Animated.View>

      <Animated.View entering={enter(4)} style={styles.section}>
        <SectionTitle title={t("more.resources.record")} />
        <Paper tone="sunk" style={styles.record}>
          {strategy.tried > 0 ? (
            <>
              <TryTally
                worked={strategy.worked}
                tried={strategy.tried}
                size={28}
              />
              <Type variant="label" color="moss">
                {fill(t("more.resources.workedLong"), {
                  worked: strategy.worked,
                  tried: strategy.tried,
                })}
              </Type>
              <Type variant="small" color="muted">
                {t("more.resources.recordNote")}
              </Type>
            </>
          ) : (
            <Row gap={space.sm} align="flex-start">
              <Glyph name="pulse" color={cf.sheet.inkMuted} size={18} />
              <Type variant="small" color="secondary" style={styles.flex}>
                {t("more.resources.notTriedLong")}
              </Type>
            </Row>
          )}
        </Paper>
        <Action
          label={fill(t("more.resources.askLena"), { name: lena })}
          glyph="messages"
          variant="outline"
          onPress={() => router.push("/messages" as Href)}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: space.md },
  hero: { gap: space.md },
  picture: {
    alignItems: "center",
    borderRadius: corner.xl,
    height: 168,
    justifyContent: "center",
  },
  slip: {
    backgroundColor: surface.raised,
    borderRadius: 6,
    padding: 20,
    transform: [{ rotate: "-0.8deg" }],
    ...elevation.tile,
  },
  steps: { paddingVertical: space.xs },
  step: { paddingVertical: space.md },
  stepText: { flex: 1, paddingTop: 3 },
  number: {
    alignItems: "center",
    backgroundColor: cf.pressboard.base,
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
  record: { gap: space.sm },
});

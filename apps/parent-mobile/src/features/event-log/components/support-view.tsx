import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Action,
  SectionTitle,
  paperEase,
} from "@/components/case-file/primitives";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { corner, space } from "@/theme/case-file";

import type { EventLogStrategyViewModel } from "../types";
import { CalmingSupportCard } from "./calming-support-card";
import { EventLogHeader } from "./event-log-header";
import { StrategyCard } from "./strategy-card";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

/** "It's happening now": breathe first, Lena's strategies next, logging last. */
export function SupportView({
  childName,
  therapistName,
  strategies,
  onBack,
  onLog,
}: {
  childName: string;
  therapistName: string;
  strategies: readonly EventLogStrategyViewModel[];
  onBack: () => void;
  onLog: () => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<string | null>(strategies[0]?.id ?? null);

  return (
    <>
      <Animated.View entering={enter(0)}>
        <EventLogHeader
          title={t("logFlow.support.title")}
          lede={fill(t("logFlow.support.lede"), { child: isolate(childName) })}
          onBack={onBack}
        />
      </Animated.View>

      <Animated.View entering={enter(1)}>
        <CalmingSupportCard />
      </Animated.View>

      {strategies.length > 0 ? (
        <Animated.View entering={enter(2)} style={styles.section}>
          <SectionTitle
            title={fill(t("logFlow.strategies.title"), {
              child: isolate(childName),
              name: isolate(therapistName),
            })}
          />
          <View style={styles.list}>
            {strategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                expanded={open === strategy.id}
                onToggle={() =>
                  setOpen((current) =>
                    current === strategy.id ? null : strategy.id,
                  )
                }
              />
            ))}
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={enter(3)}>
        <Action
          label={t("logFlow.support.logLater")}
          glyph="edit"
          variant="outline"
          size="large"
          onPress={onLog}
          style={styles.logLater}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md },
  list: { gap: space.md },
  logLater: { borderRadius: corner.lg },
});

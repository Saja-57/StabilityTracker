import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Action,
  PressCard,
  SectionTitle,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, space } from "@/theme/case-file";

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
          aside={
            <PressCard
              accessibilityRole="button"
              accessibilityLabel={`${t("logFlow.reminder.title")}. ${fill(
                t("logFlow.reminder.body"),
                { child: isolate(childName), name: isolate(therapistName) },
              )}`}
              onPress={onLog}
              style={styles.reminder}
            >
              <View style={styles.reminderIcon}>
                <Glyph name="bell" color={cf.pressboard.ink} size={15} />
              </View>
              <Type
                variant="caption"
                style={styles.reminderTitle}
                numberOfLines={1}
              >
                {t("logFlow.reminder.title")}
              </Type>
              <Glyph name="chevron" color={cf.tab.rubyInk} size={14} />
            </PressCard>
          }
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
  reminder: {
    alignItems: "center",
    backgroundColor: cf.tab.rubyWash,
    borderColor: cf.tab.ruby,
    borderRadius: corner.pill,
    borderWidth: 1.5,
    flexDirection: "row",
    flexShrink: 1,
    gap: 6,
    paddingEnd: 12,
    paddingStart: 5,
    paddingVertical: 5,
  },
  reminderIcon: {
    alignItems: "center",
    backgroundColor: cf.tab.ruby,
    borderRadius: corner.pill,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  reminderTitle: { color: cf.tab.rubyInk, flexShrink: 1, fontWeight: "600" },
  section: { gap: space.md },
  list: { gap: space.md },
  logLater: { borderRadius: corner.lg },
});

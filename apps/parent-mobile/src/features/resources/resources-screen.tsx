import { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import { Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { ScreenContainer } from "@/components/ui";
import { SegmentedSwitch } from "@/features/more/components/segmented-switch";
import { StackHeader } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { ink, space } from "@/theme/case-file";

import { StrategyCard } from "./components/strategy-card";
import { StrategyDetail } from "./components/strategy-detail";
import type { ResourcesScreenProps, StrategyId } from "./types";

type Filter = "approved" | "forYou";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

/** The strategies Lena has approved, as picture cards; each opens to its steps. */
export function ResourcesScreen({
  strategies,
  therapistGivenName,
  childGivenName,
}: ResourcesScreenProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>("approved");
  const [openId, setOpenId] = useState<StrategyId | null>(null);
  const lena = isolate(therapistGivenName);
  const open = strategies.find((strategy) => strategy.id === openId);

  const approved = strategies.filter((strategy) => strategy.approved);
  const forYou = strategies.filter((strategy) => !strategy.approved);
  const shown = filter === "approved" ? approved : forYou;
  return (
    <ScreenContainer
      key={open ? open.id : "all"}
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      {open ? (
        <StrategyDetail
          strategy={open}
          therapistGivenName={therapistGivenName}
          onBack={() => setOpenId(null)}
        />
      ) : (
        <>
          <Animated.View entering={enter(0)}>
            <StackHeader
              title={t("more.resources.title")}
              lede={fill(t("more.resources.lede"), {
                name: lena,
                child: isolate(childGivenName),
              })}
            />
          </Animated.View>

          <Animated.View entering={enter(1)}>
            <SegmentedSwitch<Filter>
              accessibilityLabel={t("more.resources.filter")}
              value={filter}
              onChange={setFilter}
              options={[
                {
                  value: "approved",
                  label: fill(t("more.resources.approvedBy"), { name: lena }),
                  detail: String(approved.length),
                },
                {
                  value: "forYou",
                  label: t("more.resources.forYou"),
                  detail: String(forYou.length),
                },
              ]}
            />
          </Animated.View>

          <Animated.View entering={enter(2)} style={styles.section}>
            <Animated.View key={filter} entering={FadeIn.duration(260)}>
              <Row gap={space.sm} align="flex-start">
                <Glyph
                  name={filter === "approved" ? "shield" : "heart"}
                  color={ink.muted}
                  size={17}
                />
                <Type variant="small" color="muted" style={styles.flex}>
                  {filter === "approved"
                    ? fill(t("more.resources.approvedNote"), {
                        name: lena,
                        child: isolate(childGivenName),
                      })
                    : t("more.resources.forYouNote")}
                </Type>
              </Row>
            </Animated.View>
            <Animated.View
              key={`${filter}-grid`}
              layout={LinearTransition.duration(300).easing(paperEase)}
              style={styles.grid}
            >
              {shown.map((strategy, row) => (
                <Animated.View
                  key={strategy.id}
                  entering={FadeInDown.duration(420)
                    .delay(row * 60)
                    .easing(paperEase)}
                >
                  <StrategyCard
                    strategy={strategy}
                    onOpen={() => setOpenId(strategy.id)}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </Animated.View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: space.lg },
  grid: { gap: space.md },
});

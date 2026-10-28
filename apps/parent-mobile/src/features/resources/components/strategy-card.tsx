import { StyleSheet, View } from "react-native";

import { PenMark, PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

import type { StrategyViewModel } from "../types";

/** One square per logged try: a pen tick where it helped, empty where it did not. */
export function TryTally({
  worked,
  tried,
  size = 20,
}: {
  worked: number;
  tried: number;
  size?: number;
}) {
  return (
    <Row gap={4} wrap>
      {Array.from({ length: tried }, (_, index) => (
        <View
          key={index}
          style={[
            styles.square,
            { height: size, width: size },
            index < worked ? styles.squareWorked : styles.squareOpen,
          ]}
        >
          {index < worked ? <PenMark visible size={size - 2} /> : null}
        </View>
      ))}
    </Row>
  );
}

/**
 * A strategy as a picture card, in the routine's own language: the pictogram
 * on its tile, the name, when to reach for it, and a pen tally of how it went.
 */
export function StrategyCard({
  strategy,
  onOpen,
}: {
  strategy: StrategyViewModel;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const name = t(`more.resources.name.${strategy.id}`);
  const triedIt = strategy.tried > 0;
  const record = fill(t("more.resources.workedLong"), {
    worked: strategy.worked,
    tried: strategy.tried,
  });
  return (
    <PressCard
      accessibilityRole="button"
      accessibilityLabel={`${name}. ${isolate(strategy.when)}. ${
        triedIt ? record : t("more.resources.notTried")
      }`}
      onPress={onOpen}
      pressedScale={0.985}
      style={styles.card}
    >
      <Row align="flex-start" gap={space.lg}>
        <View style={styles.tile}>
          <Pictogram
            name={strategy.pictogram}
            size={52}
            color={cf.pressboard.base}
            tint={0.2}
          />
        </View>
        <View style={styles.copy}>
          <Type variant="headline" numberOfLines={2}>
            {name}
          </Type>
          <Type variant="small" color="secondary" numberOfLines={3}>
            {isolate(strategy.when)}
          </Type>
          <View style={styles.tally}>
            {triedIt ? (
              <>
                <TryTally
                  worked={strategy.worked}
                  tried={strategy.tried}
                  size={18}
                />
                <Type variant="figure" color="muted" style={styles.count}>
                  {fill(t("more.resources.worked"), {
                    worked: strategy.worked,
                    tried: strategy.tried,
                  })}
                </Type>
              </>
            ) : (
              <Type variant="caption" color="muted">
                {t("more.resources.notTried")}
              </Type>
            )}
          </View>
        </View>
        <View style={styles.chevron}>
          <Glyph name="chevron" color={ink.muted} size={18} />
        </View>
      </Row>
    </PressCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: surface.raised,
    borderRadius: corner.lg,
    padding: 14,
    ...elevation.tile,
  },
  tile: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: corner.md,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  copy: { flex: 1, gap: 3, paddingTop: 2 },
  tally: { gap: 6, paddingTop: space.sm },
  count: { fontSize: 13 },
  chevron: { alignSelf: "center" },
  square: {
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "center",
  },
  squareWorked: { backgroundColor: cf.tab.cobaltWash },
  squareOpen: { borderColor: cf.sheet.ruleStrong, borderWidth: 1.5 },
});

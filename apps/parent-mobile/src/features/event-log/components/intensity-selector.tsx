import { StyleSheet, View } from "react-native";

import { PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, space, surface } from "@/theme/case-file";

import { eventIntensityOptions } from "../options";
import type { EventIntensity } from "../types";

const levels: readonly EventIntensity[] = ["low", "moderate", "high"];
const barHeights: Record<EventIntensity, number> = {
  low: 52,
  moderate: 84,
  high: 116,
};

/** Intensity as three tall bars of rising height. A neutral signal, never a grade. */
export function IntensitySelector({
  value,
  onChange,
}: {
  value: EventIntensity | null;
  onChange: (value: EventIntensity | null) => void;
}) {
  const { t } = useLanguage();
  return (
    <Row gap={space.md} align="flex-end" style={styles.row}>
      {eventIntensityOptions.map((option) => {
        const on = value === option.value;
        const label = t(option.labelKey);
        const color = cf.intensity[option.value];
        return (
          <View key={option.value} style={styles.cell}>
            <PressCard
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${t("eventLog.intensity.title")}: ${label}`}
              onPress={() => onChange(on ? null : option.value)}
              pressedScale={0.96}
              style={[styles.column, on ? styles.columnOn : null]}
            >
              <View
                style={[styles.track, { height: barHeights[option.value] }]}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: color,
                      opacity: on ? 1 : value ? 0.22 : 0.38,
                    },
                  ]}
                />
              </View>
              <Type
                variant="label"
                style={{ color: on ? ink.primary : ink.secondary }}
              >
                {label}
              </Type>
            </PressCard>
          </View>
        );
      })}
    </Row>
  );
}

/** A small three-step mark: how strong a logged moment was, at a glance. */
export function IntensityMark({
  value,
  size = 18,
}: {
  value: EventIntensity | null;
  size?: number;
}) {
  const filled = value ? levels.indexOf(value) + 1 : 0;
  const color = value ? cf.intensity[value] : surface.rule;
  return (
    <Row gap={2} align="flex-end" style={{ height: size }}>
      {levels.map((level, index) => (
        <View
          key={level}
          style={{
            backgroundColor: index < filled ? color : surface.rule,
            borderRadius: 1.5,
            height: size * (0.45 + index * 0.275),
            width: Math.max(4, size * 0.26),
          }}
        />
      ))}
    </Row>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 170 },
  cell: { flex: 1 },
  column: {
    alignItems: "center",
    backgroundColor: surface.raised,
    borderColor: surface.rule,
    borderRadius: corner.lg,
    borderWidth: 1.5,
    flex: 1,
    gap: 10,
    justifyContent: "flex-end",
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  columnOn: { borderColor: cf.pressboard.base, borderWidth: 2 },
  track: { alignSelf: "stretch", justifyContent: "flex-end" },
  bar: { borderRadius: 10, flex: 1 },
});

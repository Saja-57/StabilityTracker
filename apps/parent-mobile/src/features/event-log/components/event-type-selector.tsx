import { StyleSheet, View } from "react-native";

import { PenMark, PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, space, surface } from "@/theme/case-file";

import { eventTypeOptions } from "../options";
import type { EventType } from "../types";
import { LogPicture } from "./log-picture";

/** Event type as four picture tiles in a 2x2 grid. */
export function EventTypeSelector({
  value,
  onChange,
}: {
  value: EventType | null;
  onChange: (value: EventType) => void;
}) {
  const { t } = useLanguage();
  const rows = [eventTypeOptions.slice(0, 2), eventTypeOptions.slice(2, 4)];

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t("eventLog.type.title")}
      style={styles.grid}
    >
      {rows.map((row, index) => (
        <Row key={index} gap={space.md} align="stretch">
          {row.map((option) => {
            const on = value === option.value;
            const label = t(option.labelKey);
            return (
              <View key={option.value} style={styles.cell}>
                <PressCard
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={label}
                  onPress={() => onChange(option.value)}
                  style={[styles.tile, on ? styles.tileOn : null]}
                >
                  <View style={[styles.picture, on ? styles.pictureOn : null]}>
                    <LogPicture
                      name={option.picture}
                      size={50}
                      color={cf.pressboard.base}
                      tintColor={on ? cf.tab.mossWash : cf.sheet.sunk}
                    />
                  </View>
                  <Type variant="label" style={styles.label} numberOfLines={2}>
                    {label}
                  </Type>
                  {on ? (
                    <View style={styles.tick}>
                      <PenMark visible size={30} />
                    </View>
                  ) : null}
                </PressCard>
              </View>
            );
          })}
        </Row>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.md },
  cell: { flex: 1 },
  tile: {
    alignItems: "center",
    backgroundColor: surface.raised,
    borderColor: "transparent",
    borderRadius: corner.lg,
    borderWidth: 2,
    flex: 1,
    gap: 10,
    minHeight: 136,
    paddingHorizontal: 10,
    paddingVertical: 16,
    ...elevation.tile,
  },
  tileOn: { borderColor: cf.pressboard.base },
  picture: {
    alignItems: "center",
    borderRadius: 18,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  pictureOn: { backgroundColor: cf.tab.mossWash },
  label: { textAlign: "center" },
  tick: { end: 6, position: "absolute", top: 4 },
});

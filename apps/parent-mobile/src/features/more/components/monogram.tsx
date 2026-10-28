import { StyleSheet, View } from "react-native";

import { Type } from "@/components/case-file/type";
import { cf, displayFont, surface } from "@/theme/case-file";

export type MonogramTone = "board" | "sheet" | "moss" | "cobalt" | "clay";

const tones: Record<MonogramTone, { background: string; color: string }> = {
  board: { background: cf.pressboard.base, color: cf.pressboard.ink },
  sheet: { background: cf.sheet.sunk, color: cf.sheet.inkSecondary },
  moss: { background: cf.tab.mossWash, color: cf.tab.mossInk },
  cobalt: { background: cf.tab.cobaltWash, color: cf.tab.cobaltInk },
  clay: { background: cf.tab.clayWash, color: cf.sheet.inkSecondary },
};

/** A person's initial on a soft tile. Large sizes read as the child's name card. */
export function Monogram({
  name,
  size = 40,
  tone = "sheet",
  ring = false,
}: {
  name: string;
  size?: number;
  tone?: MonogramTone;
  ring?: boolean;
}) {
  const palette = tones[tone];
  const radius = size >= 56 ? size * 0.3 : size / 2;
  return (
    <View
      aria-hidden
      style={[
        styles.tile,
        {
          backgroundColor: palette.background,
          borderRadius: radius,
          height: size,
          width: size,
        },
        ring ? styles.ring : null,
      ]}
    >
      <Type
        variant="title"
        style={[
          displayFont("en"),
          {
            color: palette.color,
            fontSize: size * 0.44,
            lineHeight: size * 0.56,
          },
        ]}
      >
        {name.trim().slice(0, 1).toUpperCase()}
      </Type>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: "center", justifyContent: "center" },
  ring: { borderColor: surface.raised, borderWidth: 2 },
});

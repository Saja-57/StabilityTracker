import { StyleSheet, View } from "react-native";

import { Paper, PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space } from "@/theme/case-file";

import { LogPicture } from "./log-picture";

/** The two big doors into the Log: calm support now, or a log from earlier. */
export function LogModeSelector({
  therapistName,
  onNow,
  onEarlier,
}: {
  therapistName: string;
  onNow: () => void;
  onEarlier: () => void;
}) {
  const { t } = useLanguage();
  const nowDetail = fill(t("logFlow.now.detail"), {
    name: isolate(therapistName),
  });

  return (
    <View style={styles.stack}>
      <PressCard
        accessibilityRole="button"
        accessibilityLabel={`${t("logFlow.now.title")}. ${nowDetail}`}
        accessibilityHint={t("logFlow.now.hint")}
        onPress={onNow}
      >
        <Paper tone="board" style={[styles.choice, styles.nowChoice]}>
          <View style={styles.nowPicture}>
            <View style={styles.nowHalo} />
            <Pictogram
              name="breathe"
              size={66}
              color={cf.pressboard.ink}
              tintColor={cf.pressboard.line}
            />
          </View>
          <Row gap={space.md} align="flex-end">
            <View style={styles.text}>
              <Type variant="display" color="board">
                {t("logFlow.now.title")}
              </Type>
              <Type variant="body" color="boardMuted">
                {nowDetail}
              </Type>
            </View>
            <View style={styles.goBoard}>
              <Glyph name="arrow" color={cf.pressboard.deep} size={22} />
            </View>
          </Row>
        </Paper>
      </PressCard>

      <PressCard
        accessibilityRole="button"
        accessibilityLabel={`${t("logFlow.earlier.title")}. ${t("logFlow.earlier.detail")}`}
        onPress={onEarlier}
      >
        <Paper style={styles.choice}>
          <Row gap={space.lg} align="center">
            <View style={styles.earlierPicture}>
              <LogPicture
                name="slip"
                size={54}
                color={cf.pressboard.base}
                tintColor={cf.sheet.raised}
              />
            </View>
            <View style={styles.text}>
              <Type variant="title">{t("logFlow.earlier.title")}</Type>
              <Type variant="small" color="secondary">
                {t("logFlow.earlier.detail")}
              </Type>
            </View>
            <Glyph name="chevron" color={ink.muted} size={20} />
          </Row>
        </Paper>
      </PressCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.md },
  choice: { borderRadius: corner.xl, gap: space.lg, padding: 20 },
  nowChoice: { ...elevation.lift, paddingTop: 22 },
  nowPicture: {
    alignItems: "center",
    backgroundColor: cf.pressboard.raised,
    borderRadius: 48,
    height: 96,
    justifyContent: "center",
    width: 96,
  },
  nowHalo: {
    borderColor: cf.pressboard.line,
    borderRadius: 56,
    borderStyle: "dashed",
    borderWidth: 1.5,
    height: 112,
    position: "absolute",
    width: 112,
  },
  text: { flex: 1, gap: 6 },
  goBoard: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  earlierPicture: {
    alignItems: "center",
    backgroundColor: cf.sheet.sunk,
    borderRadius: 18,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
});

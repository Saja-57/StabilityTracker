import { StyleSheet, View } from "react-native";

import { Action, Paper } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, space, surface } from "@/theme/case-file";

export function SurveyEmptyState() {
  const { t } = useLanguage();

  return (
    <Paper style={styles.sheet}>
      <View style={styles.iconTile}>
        <Glyph name="survey" color={cf.tab.mossInk} size={26} tint={0.25} />
      </View>
      <Type variant="title">{t("surveys.empty.title")}</Type>
      <Type variant="body" color="secondary">
        {t("surveys.empty.description")}
      </Type>
    </Paper>
  );
}

export function SurveyLoadingState() {
  const { t } = useLanguage();

  return (
    <View
      accessibilityLabel={t("surveys.loading")}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.loading}
    >
      <View style={[styles.bar, styles.barTitle]} />
      <View style={[styles.bar, styles.barLine]} />
      <View style={styles.block} />
      <View style={styles.block} />
    </View>
  );
}

export function SurveyErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLanguage();

  return (
    <Paper style={styles.sheet}>
      <Type variant="title">{t("surveys.error.title")}</Type>
      <Type variant="body" color="secondary">
        {t("surveys.error.description")}
      </Type>
      {onRetry ? (
        <Action
          label={t("surveys.retry")}
          variant="outline"
          onPress={onRetry}
          style={styles.retry}
        />
      ) : null}
    </Paper>
  );
}

const styles = StyleSheet.create({
  sheet: { borderRadius: 8, gap: space.md, padding: 24 },
  iconTile: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: corner.sm,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  loading: { gap: space.md },
  bar: { backgroundColor: surface.sunk, borderRadius: 8 },
  barTitle: { height: 34, width: "72%" },
  barLine: { height: 16, width: "46%" },
  block: { backgroundColor: surface.sunk, borderRadius: corner.md, height: 68 },
  retry: { alignSelf: "flex-start" },
});

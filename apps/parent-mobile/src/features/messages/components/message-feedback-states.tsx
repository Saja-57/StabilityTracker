import { StyleSheet, View } from "react-native";

import { Action, Magnet, Paper } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, space, surface } from "@/theme/case-file";

function SlipSkeleton() {
  return (
    <Paper style={styles.slip}>
      <View style={[styles.bar, styles.barShort]} />
      <View style={[styles.bar, styles.barTitle]} />
      <View style={styles.bar} />
      <View style={[styles.bar, styles.barMid]} />
    </Paper>
  );
}

export function MessagesEmptyState() {
  const { t } = useLanguage();

  return (
    <View style={styles.held}>
      <View style={styles.magnetPin}>
        <Magnet />
      </View>
      <Paper style={styles.sheet}>
        <View style={styles.iconTile}>
          <Glyph
            name="messages"
            color={cf.tab.cobaltInk}
            size={26}
            tint={0.25}
          />
        </View>
        <Type variant="title">{t("inbox.empty.title")}</Type>
        <Type variant="body" color="secondary">
          {t("inbox.empty.detail")}
        </Type>
      </Paper>
    </View>
  );
}

export function MessagesLoadingState() {
  const { t } = useLanguage();

  return (
    <View
      accessibilityLabel={t("messages.loading")}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.loading}
    >
      <SlipSkeleton />
      <SlipSkeleton />
    </View>
  );
}

export function MessagesErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLanguage();

  return (
    <Paper style={styles.sheet}>
      <Type variant="title">{t("inbox.error.title")}</Type>
      <Type variant="body" color="secondary">
        {t("inbox.error.detail")}
      </Type>
      {onRetry ? (
        <Action
          label={t("messages.retry")}
          variant="outline"
          glyph="arrow"
          onPress={onRetry}
          style={styles.retry}
        />
      ) : null}
    </Paper>
  );
}

const styles = StyleSheet.create({
  loading: { gap: space.lg },
  slip: { borderRadius: 6, gap: 12, padding: 20 },
  bar: { backgroundColor: surface.sunk, borderRadius: 6, height: 12 },
  barShort: { width: "28%" },
  barTitle: { height: 20, width: "70%" },
  barMid: { width: "52%" },
  held: { paddingTop: 12 },
  magnetPin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 2,
  },
  sheet: { borderRadius: 6, gap: space.md, padding: 24, paddingTop: 28 },
  iconTile: {
    alignItems: "center",
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: corner.sm,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  retry: { alignSelf: "flex-start" },
});

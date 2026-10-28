import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { ink, space, surface } from "@/theme/case-file";

/** A 44pt round sunk back control. */
export function BackButton({
  onPress,
  label,
}: {
  onPress: () => void;
  label?: string;
}) {
  const { t } = useLanguage();
  return (
    <PressCard
      accessibilityRole="button"
      accessibilityLabel={label ?? t("common.back")}
      hitSlop={6}
      onPress={onPress}
      pressedScale={0.92}
      style={styles.back}
    >
      <Glyph name="arrowBack" color={ink.primary} size={22} />
    </PressCard>
  );
}

/** Page heading for every Log stage: optional back control, title, lede. */
export function EventLogHeader({
  title,
  lede,
  onBack,
  aside,
  hero = false,
}: {
  title: string;
  lede?: string;
  onBack?: () => void;
  aside?: ReactNode;
  hero?: boolean;
}) {
  return (
    <View style={styles.header}>
      {onBack || aside ? (
        <Row style={styles.between}>
          {onBack ? <BackButton onPress={onBack} /> : <View />}
          {aside}
        </Row>
      ) : null}
      <Type variant={hero ? "hero" : "display"} accessibilityRole="header">
        {title}
      </Type>
      {lede ? (
        <Type variant="lede" color="secondary">
          {lede}
        </Type>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.md },
  between: { justifyContent: "space-between" },
  back: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});

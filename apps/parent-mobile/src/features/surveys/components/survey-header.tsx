import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Row } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { ink, surface } from "@/theme/case-file";

export interface SurveyHeaderProps {
  /** Content at the far end of the header, such as progress squares. */
  readonly aside?: ReactNode;
  readonly onBack?: () => void;
}

function leave() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/");
}

/** The stack back control, with room for progress at the other end. */
export function SurveyHeader({ aside, onBack = leave }: SurveyHeaderProps) {
  const { t } = useLanguage();

  return (
    <Row style={styles.row}>
      <Pressable
        accessibilityLabel={t("checkin.back")}
        accessibilityRole="button"
        hitSlop={6}
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed ? styles.pressed : null]}
      >
        <Glyph name="arrowBack" color={ink.primary} size={20} />
      </Pressable>
      <View style={styles.aside}>{aside}</View>
    </Row>
  );
}

const styles = StyleSheet.create({
  row: { justifyContent: "space-between", minHeight: 44 },
  back: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  pressed: { opacity: 0.7 },
  aside: { alignItems: "flex-end" },
});

import { router, type Href } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { ink, space, surface } from "@/theme/case-file";

export interface StackHeaderProps {
  readonly title: string;
  readonly lede?: string;
  readonly aside?: ReactNode;
  /** Defaults to router.back(), falling back to the More tab. */
  readonly onBack?: () => void;
  readonly backLabel?: string;
}

export function goBackOrMore() {
  if (router.canGoBack()) router.back();
  else router.replace("/more" as Href);
}

/** The top of every stack screen: a round sunk back control, then the title. */
export function StackHeader({
  title,
  lede,
  aside,
  onBack,
  backLabel,
}: StackHeaderProps) {
  const { t } = useLanguage();
  return (
    <View style={styles.root}>
      <Row style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backLabel ?? t("common.back")}
          hitSlop={6}
          onPress={onBack ?? goBackOrMore}
          style={({ pressed }) => [
            styles.back,
            pressed ? styles.backPressed : null,
          ]}
        >
          <Glyph name="arrowBack" color={ink.primary} size={22} />
        </Pressable>
        {aside}
      </Row>
      <View style={styles.copy}>
        <Type variant="hero" accessibilityRole="header">
          {title}
        </Type>
        {lede ? (
          <Type variant="lede" color="secondary">
            {lede}
          </Type>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.lg },
  bar: { justifyContent: "space-between", minHeight: 44 },
  back: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  backPressed: { backgroundColor: surface.rule },
  copy: { gap: space.sm },
});

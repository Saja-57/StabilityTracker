import { caseFile } from "@stability/design-tokens";
import type { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "../../providers/language-provider";
import { getDirectionalViewStyle } from "../../theme/direction";

export interface ScreenContainerProps extends PropsWithChildren {
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardAware?: boolean;
  scrollProps?: Omit<ScrollViewProps, "contentContainerStyle">;
  scrollable?: boolean;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: caseFile.sheet.base,
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});

export function ScreenContainer({
  children,
  contentContainerStyle,
  keyboardAware = true,
  scrollable = true,
  scrollProps,
}: ScreenContainerProps) {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const directionStyle = getDirectionalViewStyle(language);
  const safePadding = {
    paddingBottom: Math.max(insets.bottom, 16) + 24,
    paddingTop: Math.max(insets.top, 16) + 8,
  };

  const content = scrollable ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      {...scrollProps}
      contentContainerStyle={[
        styles.content,
        directionStyle,
        safePadding,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        directionStyle,
        safePadding,
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={[styles.root, directionStyle]}>
      <KeyboardAvoidingView
        behavior={
          keyboardAware && Platform.OS === "ios" ? "padding" : undefined
        }
        enabled={keyboardAware}
        style={styles.keyboard}
      >
        {content}
      </KeyboardAvoidingView>
    </View>
  );
}

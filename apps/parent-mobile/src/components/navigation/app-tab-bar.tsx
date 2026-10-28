import type { TranslationKey } from "@stability/i18n";
import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Type } from "@/components/case-file/type";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { useFamilyContent } from "@/lib/use-family-content";
import { useTherapistNotes } from "@/providers/family-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { cf, elevation } from "@/theme/case-file";
import { getDirectionalRowStyle } from "@/theme/direction";

type TabsProps = ComponentProps<typeof Tabs>;
type AppTabBarProps = Parameters<NonNullable<TabsProps["tabBar"]>>[0];
type TabRouteName = "index" | "routine" | "log" | "messages" | "more";

interface TabDefinition {
  glyph: GlyphName;
  labelKey: TranslationKey;
}

const tabDefinitions: Record<TabRouteName, TabDefinition> = {
  index: { glyph: "home", labelKey: "navigation.home" },
  routine: { glyph: "routine", labelKey: "navigation.routine" },
  log: { glyph: "pulse", labelKey: "navigation.log" },
  messages: { glyph: "messages", labelKey: "navigation.messages" },
  more: { glyph: "layers", labelKey: "navigation.more" },
};

function isTabRouteName(routeName: string): routeName is TabRouteName {
  return routeName in tabDefinitions;
}

/**
 * The pressboard board the app rests on. The active tab hangs from the sheet
 * above it, the same joined-tab gesture as the therapist workspace's rail.
 */
export function AppTabBar({ state, descriptors, emitter, navigateToTab }: AppTabBarProps) {
  const { language, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const unread = useTherapistNotes(useFamilyContent().therapistNotes).filter((note) => !note.isRead).length;

  return (
    <View
      accessibilityLabel={t("shell.primaryNavigation")}
      accessibilityRole="tablist"
      style={[styles.bar, getDirectionalRowStyle(language), { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {state.routes.map((route, index) => {
        if (!isTabRouteName(route.name)) return null;
        const definition = tabDefinitions[route.name];
        const descriptor = descriptors[route.key];
        if (!descriptor) return null;

        const focused = state.index === index;
        const label = t(definition.labelKey);
        const center = route.name === "log";

        const onPress = () => {
          const event = emitter.emit({ canPreventDefault: true, target: route.key, type: "tabPress" });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityLabel={descriptor.options.tabBarAccessibilityLabel ?? label}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            aria-selected={focused}
            onPress={onPress}
            onLongPress={() => emitter.emit({ target: route.key, type: "tabLongPress" })}
            style={[styles.item, focused && !center ? styles.itemActive : null]}
            testID={descriptor.options.tabBarButtonTestID}
          >
            {center ? (
              <View style={styles.iconSlot}>
                <View style={[styles.logButton, focused ? styles.logButtonActive : null]}>
                  <Glyph name="pulse" color={focused ? cf.pressboard.ink : cf.sheet.ink} size={26} strokeWidth={2} />
                </View>
              </View>
            ) : (
              <View style={styles.iconSlot}>
                <Glyph
                  name={definition.glyph}
                  color={focused ? cf.pressboard.base : cf.pressboard.inkMuted}
                  size={23}
                  tint={focused ? 0.22 : 0.14}
                />
                {route.name === "messages" && unread > 0 ? (
                  <View style={styles.badge}>
                    <Type variant="caption" style={styles.badgeText}>
                      {unread}
                    </Type>
                  </View>
                ) : null}
              </View>
            )}
            <Type
              variant="caption"
              numberOfLines={1}
              style={{
                color: focused && !center ? cf.sheet.ink : focused ? cf.pressboard.ink : cf.pressboard.inkMuted,
                fontWeight: focused ? "600" : "400",
                marginTop: 4,
              }}
            >
              {label}
            </Type>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: cf.pressboard.base,
    paddingHorizontal: 8,
  },
  item: {
    alignItems: "center",
    borderBottomEndRadius: 18,
    borderBottomStartRadius: 18,
    flex: 1,
    justifyContent: "flex-start",
    minHeight: 62,
    paddingBottom: 8,
    paddingTop: 10,
  },
  itemActive: {
    backgroundColor: cf.sheet.base,
  },
  iconSlot: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
  },
  logButton: {
    alignItems: "center",
    position: "absolute",
    top: -34,
    backgroundColor: cf.sheet.raised,
    borderColor: cf.pressboard.base,
    borderRadius: 30,
    borderWidth: 4,
    height: 60,
    justifyContent: "center",
    width: 60,
    ...elevation.lift,
  },
  logButtonActive: {
    backgroundColor: cf.pressboard.raised,
    borderColor: cf.sheet.base,
  },
  badge: {
    alignItems: "center",
    backgroundColor: cf.tab.gold,
    borderColor: cf.pressboard.base,
    borderRadius: 10,
    borderWidth: 2,
    end: -12,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: 3,
    position: "absolute",
    top: -7,
  },
  badgeText: {
    color: cf.pressboard.deep,
    fontSize: 11,
    lineHeight: 13,
  },
});

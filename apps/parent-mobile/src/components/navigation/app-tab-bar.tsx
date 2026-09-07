import {
  colors,
  radius,
  shadows,
  sizing,
  spacing,
} from "@stability/design-tokens";
import type { TranslationKey } from "@stability/i18n";
import {
  Activity,
  Home,
  ListChecks,
  Menu,
  MessageSquare,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Tabs } from "expo-router";

import { AppText } from "@/components/ui";
import {
  getIconSize,
  iconStrokeWidth,
  type IconComponent,
} from "@/components/ui/icon";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

type TabsProps = ComponentProps<typeof Tabs>;
type AppTabBarProps = Parameters<NonNullable<TabsProps["tabBar"]>>[0];
type TabRouteName = "index" | "routine" | "log" | "messages" | "more";

interface TabDefinition {
  icon: IconComponent;
  labelKey: TranslationKey;
}

const tabDefinitions: Record<TabRouteName, TabDefinition> = {
  index: { icon: Home, labelKey: "navigation.home" },
  routine: { icon: ListChecks, labelKey: "navigation.routine" },
  log: { icon: Activity, labelKey: "navigation.log" },
  messages: { icon: MessageSquare, labelKey: "navigation.messages" },
  more: { icon: Menu, labelKey: "navigation.more" },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.primary,
    borderTopColor: colors.border.subtle,
    borderTopWidth: 1,
    elevation: shadows.subtle.elevation,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    shadowColor: shadows.subtle.color,
    shadowOffset: {
      height: -shadows.subtle.offsetY,
      width: shadows.subtle.offsetX,
    },
    shadowOpacity: shadows.subtle.opacity,
    shadowRadius: shadows.subtle.radius,
  },
  item: {
    alignItems: "center",
    borderRadius: radius.small,
    flex: 1,
    gap: spacing.xxs,
    justifyContent: "center",
    minHeight: sizing.control.large,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  itemActive: {
    backgroundColor: colors.brand.subtle,
  },
  itemPressed: {
    opacity: 0.72,
  },
});

function isTabRouteName(routeName: string): routeName is TabRouteName {
  return routeName in tabDefinitions;
}

export function AppTabBar({ state, descriptors, navigation }: AppTabBarProps) {
  const { language, t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityLabel={t("shell.primaryNavigation")}
      accessibilityRole="tablist"
      style={[
        styles.container,
        getDirectionalRowStyle(language),
        { paddingBottom: Math.max(insets.bottom, spacing.sm) },
      ]}
    >
      {state.routes.map((route, index) => {
        if (!isTabRouteName(route.name)) {
          return null;
        }

        const definition = tabDefinitions[route.name];
        const descriptor = descriptors[route.key];

        if (!descriptor) {
          return null;
        }

        const isFocused = state.index === index;
        const label = t(definition.labelKey);
        const Icon = definition.icon;

        const handlePress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: "tabPress",
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const handleLongPress = () => {
          navigation.emit({ target: route.key, type: "tabLongPress" });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityLabel={
              descriptor.options.tabBarAccessibilityLabel ?? label
            }
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            aria-selected={isFocused}
            onLongPress={handleLongPress}
            onPress={handlePress}
            style={({ pressed }) => [
              styles.item,
              isFocused ? styles.itemActive : undefined,
              pressed ? styles.itemPressed : undefined,
            ]}
            testID={descriptor.options.tabBarButtonTestID}
          >
            <Icon
              color={isFocused ? colors.brand.primary : colors.text.muted}
              size={getIconSize("medium")}
              strokeWidth={iconStrokeWidth}
            />
            <AppText
              color={isFocused ? "primary" : "muted"}
              numberOfLines={1}
              variant="caption"
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

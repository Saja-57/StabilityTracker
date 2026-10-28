import { Tabs } from "expo-router";

import { AppTabBar } from "@/components/navigation/app-tab-bar";
import { useReminders } from "@/lib/reminders";
import { useLanguage } from "@/providers/language-provider";

export default function TabLayout() {
  const { t } = useLanguage();
  // The tabs stay mounted under every other screen, so reminders live here.
  useReminders();

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("navigation.home") }} />
      <Tabs.Screen
        name="routine"
        options={{ title: t("navigation.routine") }}
      />
      <Tabs.Screen name="log" options={{ title: t("navigation.log") }} />
      <Tabs.Screen
        name="messages"
        options={{ title: t("navigation.messages") }}
      />
      <Tabs.Screen name="more" options={{ title: t("navigation.more") }} />
    </Tabs>
  );
}

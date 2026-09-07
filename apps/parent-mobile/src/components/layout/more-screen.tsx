import { spacing } from "@stability/design-tokens";
import type { TranslationKey } from "@stability/i18n";
import {
  Bot,
  BookOpen,
  CalendarDays,
  ClipboardList,
  UserRound,
  Users,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import {
  MoreNavigationItem,
  type MoreRouteHref,
} from "@/components/navigation/more-navigation-item";
import {
  AppText,
  Card,
  Divider,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";
import type { IconComponent } from "@/components/ui/icon";
import { useLanguage } from "@/providers/language-provider";

interface MoreDestination {
  href: MoreRouteHref;
  icon: IconComponent;
  labelKey: TranslationKey;
}

const destinations: readonly MoreDestination[] = [
  { href: "/ai", icon: Bot, labelKey: "navigation.askAI" },
  { href: "/resources", icon: BookOpen, labelKey: "navigation.resources" },
  { href: "/surveys", icon: ClipboardList, labelKey: "navigation.surveys" },
  {
    href: "/appointments",
    icon: CalendarDays,
    labelKey: "navigation.appointments",
  },
  { href: "/family", icon: Users, labelKey: "navigation.family" },
  { href: "/profile", icon: UserRound, labelKey: "navigation.profile" },
];

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    padding: spacing.none,
  },
  header: {
    gap: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
});

export function MoreScreen() {
  const { t } = useLanguage();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <AppText variant="pageTitle">{t("navigation.more")}</AppText>
        <AppText color="secondary">{t("shell.more.description")}</AppText>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t("shell.primaryNavigation")} />
        <Card style={styles.card}>
          {destinations.map((destination, index) => (
            <View key={destination.labelKey}>
              {index > 0 ? <Divider spacingSize="none" /> : null}
              <MoreNavigationItem
                href={destination.href}
                icon={destination.icon}
                label={t(destination.labelKey)}
              />
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t("common.language")} />
        <LanguageSwitcher />
      </View>
    </ScreenContainer>
  );
}

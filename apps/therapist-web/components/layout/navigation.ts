import type { TranslationKey } from "@stability/i18n";
import {
  CalendarDays,
  ChartNoAxesCombined,
  FileText,
  LayoutDashboard,
  MessageSquare,
  NotebookPen,
  Settings,
  UsersRound,
} from "lucide-react";

import type { UiIcon } from "@/components/ui/icon";

export type NavigationItemId =
  | "dashboard"
  | "children"
  | "appointments"
  | "messages"
  | "reports"
  | "insights"
  | "notes"
  | "settings";

export interface NavigationItemDefinition {
  readonly id: NavigationItemId;
  readonly href: string;
  readonly icon: UiIcon;
  readonly labelKey: TranslationKey;
}

const dashboardNavigationItem: NavigationItemDefinition = {
  id: "dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
  labelKey: "navigation.dashboard",
};

const navigationItemsById: Readonly<
  Record<NavigationItemId, NavigationItemDefinition>
> = {
  dashboard: dashboardNavigationItem,
  children: {
    id: "children",
    href: "/children",
    icon: UsersRound,
    labelKey: "navigation.children",
  },
  appointments: {
    id: "appointments",
    href: "/appointments",
    icon: CalendarDays,
    labelKey: "navigation.appointments",
  },
  messages: {
    id: "messages",
    href: "/messages",
    icon: MessageSquare,
    labelKey: "navigation.messages",
  },
  reports: {
    id: "reports",
    href: "/reports",
    icon: FileText,
    labelKey: "navigation.reports",
  },
  insights: {
    id: "insights",
    href: "/insights",
    icon: ChartNoAxesCombined,
    labelKey: "navigation.insights",
  },
  notes: {
    id: "notes",
    href: "/notes",
    icon: NotebookPen,
    labelKey: "navigation.notes",
  },
  settings: {
    id: "settings",
    href: "/settings",
    icon: Settings,
    labelKey: "navigation.settings",
  },
};

export const primaryNavigationItems: readonly NavigationItemDefinition[] = [
  navigationItemsById.dashboard,
  navigationItemsById.children,
  navigationItemsById.appointments,
  navigationItemsById.messages,
  navigationItemsById.reports,
];

export const secondaryNavigationItems: readonly NavigationItemDefinition[] = [
  navigationItemsById.insights,
  navigationItemsById.notes,
  navigationItemsById.settings,
];

export const navigationItems = [
  ...primaryNavigationItems,
  ...secondaryNavigationItems,
] as const;

export function isNavigationItemActive(
  pathname: string,
  item: NavigationItemDefinition,
): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getCurrentNavigationItem(
  pathname: string,
): NavigationItemDefinition {
  return (
    navigationItems.find((item) => isNavigationItemActive(pathname, item)) ??
    dashboardNavigationItem
  );
}

export function getNavigationItemById(
  id: NavigationItemId,
): NavigationItemDefinition {
  return navigationItemsById[id];
}

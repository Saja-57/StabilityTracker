import type { TranslationKey } from "@stability/i18n";

import type { GlyphName } from "@/components/icons/glyphs";
import { appointments, children, getThread } from "@/lib/sample-data/fixtures";
import { SAMPLE_TODAY } from "@/lib/sample-data/time";

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
  readonly glyph: GlyphName;
  readonly labelKey: TranslationKey;
  /** Count shown on the index tab; gold when it asks for the therapist's action. */
  readonly count?: { readonly value: number; readonly action: boolean };
}

const unreadFamilies = children.filter((child) =>
  getThread(child.id).some((message) => message.from === "family" && !message.read),
).length;

const navigationItemsById: Readonly<Record<NavigationItemId, NavigationItemDefinition>> = {
  dashboard: {
    id: "dashboard",
    href: "/dashboard",
    glyph: "desk",
    labelKey: "navigation.dashboard",
  },
  children: {
    id: "children",
    href: "/children",
    glyph: "files",
    labelKey: "navigation.children",
    count: {
      value: children.filter((child) => child.status === "needsReview").length,
      action: true,
    },
  },
  appointments: {
    id: "appointments",
    href: "/appointments",
    glyph: "calendar",
    labelKey: "navigation.appointments",
    count: {
      value: appointments.filter((appointment) => appointment.start.startsWith(SAMPLE_TODAY)).length,
      action: false,
    },
  },
  messages: {
    id: "messages",
    href: "/messages",
    glyph: "messages",
    labelKey: "navigation.messages",
    count: { value: unreadFamilies, action: true },
  },
  reports: {
    id: "reports",
    href: "/reports",
    glyph: "reports",
    labelKey: "navigation.reports",
  },
  insights: {
    id: "insights",
    href: "/insights",
    glyph: "insights",
    labelKey: "navigation.insights",
  },
  notes: {
    id: "notes",
    href: "/notes",
    glyph: "notes",
    labelKey: "navigation.notes",
  },
  settings: {
    id: "settings",
    href: "/settings",
    glyph: "settings",
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

export const navigationItems = [...primaryNavigationItems, ...secondaryNavigationItems] as const;

export function isNavigationItemActive(pathname: string, item: NavigationItemDefinition): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getCurrentNavigationItem(pathname: string): NavigationItemDefinition {
  return navigationItems.find((item) => isNavigationItemActive(pathname, item)) ?? navigationItemsById.dashboard;
}

export function getNavigationItemById(id: NavigationItemId): NavigationItemDefinition {
  return navigationItemsById[id];
}

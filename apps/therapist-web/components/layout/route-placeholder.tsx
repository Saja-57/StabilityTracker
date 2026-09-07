"use client";

import { EmptyState, PageHeader } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { getNavigationItemById, type NavigationItemId } from "./navigation";

export interface RoutePlaceholderProps {
  readonly navigationItemId: NavigationItemId;
}

export function RoutePlaceholder({ navigationItemId }: RoutePlaceholderProps) {
  const { t } = useLanguage();
  const navigationItem = getNavigationItemById(navigationItemId);

  return (
    <div className="grid gap-8">
      <PageHeader
        description={t("shell.route.description")}
        title={t(navigationItem.labelKey)}
      />
      <EmptyState
        description={t("shell.route.description")}
        icon={navigationItem.icon}
        title={t("states.empty.title")}
      />
    </div>
  );
}

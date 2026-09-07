"use client";

import { usePathname } from "next/navigation";

import { primaryNavigationItems, secondaryNavigationItems } from "./navigation";
import { NavigationSection } from "./navigation-section";
import { Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export interface SidebarContentProps {
  readonly onNavigate?: (() => void) | undefined;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("shell.navigationDescription")}
      className="grid content-start gap-5"
    >
      <NavigationSection
        activePathname={pathname}
        items={primaryNavigationItems}
        label={t("shell.primaryNavigation")}
        onNavigate={onNavigate}
        translate={t}
      />
      <Divider />
      <NavigationSection
        activePathname={pathname}
        items={secondaryNavigationItems}
        label={t("shell.secondaryNavigation")}
        onNavigate={onNavigate}
        translate={t}
      />
    </nav>
  );
}

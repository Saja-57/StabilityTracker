"use client";

import type { TranslationKey } from "@stability/i18n";
import { Menu } from "lucide-react";

import { CompactLanguageSwitcher, LanguageSwitcher } from "./language-switcher";
import { IconButton, Text } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export interface TopBarProps {
  readonly onOpenNavigation: () => void;
  readonly titleKey: TranslationKey;
}

export function TopBar({ onOpenNavigation, titleKey }: TopBarProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)]/95 backdrop-blur-sm">
      <div className="flex min-h-16 items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <IconButton
          aria-label={t("shell.openNavigation")}
          className="lg:hidden"
          icon={Menu}
          onClick={onOpenNavigation}
          variant="ghost"
        />
        <Text as="h1" className="min-w-0 flex-1 truncate" variant="cardTitle">
          {t(titleKey)}
        </Text>
        <LanguageSwitcher />
        <CompactLanguageSwitcher />
      </div>
    </header>
  );
}

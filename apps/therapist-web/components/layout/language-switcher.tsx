"use client";

import {
  getDirection,
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
} from "@stability/i18n";
import { Languages } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className="hidden flex-wrap gap-2 sm:flex"
    >
      {SUPPORTED_LANGUAGES.map((option) => (
        <Button
          key={option}
          aria-pressed={language === option}
          dir={getDirection(option)}
          lang={option}
          onClick={() => setLanguage(option)}
          size="small"
          variant={language === option ? "primary" : "secondary"}
        >
          {translate(option, getLanguageLabelKey(option))}
        </Button>
      ))}
    </div>
  );
}

export function CompactLanguageSwitcher() {
  const { direction, language, setLanguage, t } = useLanguage();

  return (
    <div className="sm:hidden">
      <DropdownMenu
        align="end"
        direction={direction}
        trigger={
          <IconButton
            aria-label={t("common.language")}
            icon={Languages}
            variant="secondary"
          />
        }
      >
        {SUPPORTED_LANGUAGES.map((option) => (
          <DropdownMenuItem
            key={option}
            aria-current={language === option ? "true" : undefined}
            className={
              language === option
                ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
                : undefined
            }
            dir={getDirection(option)}
            lang={option}
            onSelect={() => setLanguage(option)}
          >
            {translate(option, getLanguageLabelKey(option))}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </div>
  );
}

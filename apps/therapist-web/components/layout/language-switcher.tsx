"use client";

import { getDirection, getLanguageLabelKey, SUPPORTED_LANGUAGES, translate } from "@stability/i18n";

import { cx } from "@/components/ui/styles";
import { useLanguage } from "@/providers/language-provider";

export interface LanguageSwitcherProps {
  readonly tone?: "board" | "sheet";
}

export function LanguageSwitcher({ tone = "board" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className={cx(
        "grid grid-cols-3 gap-0.5 rounded-[10px] p-0.5",
        tone === "board" ? "bg-board-deep/70 ring-1 ring-board-line" : "bg-sheet-sunk ring-1 ring-rule",
      )}
    >
      {SUPPORTED_LANGUAGES.map((option) => {
        const active = language === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            dir={getDirection(option)}
            lang={option}
            onClick={() => setLanguage(option)}
            className={cx(
              "h-8 truncate rounded-[8px] px-1.5 text-[12.5px] transition-[background-color,color,box-shadow] duration-200",
              tone === "board"
                ? active
                  ? "bg-board-raised text-board-ink shadow-press"
                  : "text-board-muted hover:text-board-ink"
                : active
                  ? "bg-sheet-raised text-ink shadow-press"
                  : "text-ink-3 hover:text-ink",
            )}
          >
            {translate(option, getLanguageLabelKey(option))}
          </button>
        );
      })}
    </div>
  );
}

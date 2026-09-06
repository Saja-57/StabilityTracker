"use client";

import {
  getDirection,
  getFontFamilyForLanguage,
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
} from "@stability/i18n";

import { useLanguage } from "@/providers/language-provider";

export default function HomePage() {
  const { direction, language, setLanguage, t } = useLanguage();

  return (
    <main
      lang={language}
      dir={direction}
      className="grid min-h-dvh place-items-center bg-[var(--color-background-primary)] px-6 py-12 text-start text-[var(--color-text-primary)]"
    >
      <section className="grid w-full max-w-xl gap-4 rounded-[var(--radius-medium)] border border-[var(--color-border-default)] bg-[var(--color-surface-primary)] p-6 shadow-[var(--shadow-subtle)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          {t("bootstrap.ready")}
        </p>
        <h1 className="text-2xl font-medium">{t("app.name")}</h1>
        <p className="text-base text-[var(--color-text-muted)]">
          {t("common.language")}
        </p>
        <div
          aria-label={t("common.language")}
          className="flex flex-wrap gap-2"
          role="group"
        >
          {SUPPORTED_LANGUAGES.map((option) => {
            const selected = option === language;
            const label = translate(option, getLanguageLabelKey(option));

            return (
              <button
                key={option}
                type="button"
                lang={option}
                dir={getDirection(option)}
                aria-pressed={selected}
                className="min-h-11 rounded-[var(--radius-small)] border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] ps-4 pe-4 text-start text-base text-[var(--color-text-secondary)] transition-opacity hover:opacity-75 aria-pressed:border-[var(--color-brand-primary)] aria-pressed:bg-[var(--color-background-secondary)] aria-pressed:text-[var(--color-text-primary)]"
                style={{ fontFamily: getFontFamilyForLanguage(option) }}
                onClick={() => setLanguage(option)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

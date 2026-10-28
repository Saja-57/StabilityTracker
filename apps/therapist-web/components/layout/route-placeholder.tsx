"use client";

import { getNavigationItemById, type NavigationItemId } from "./navigation";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";

/** Temporary stand-in while a section is being designed. */
export function RoutePlaceholder({ navigationItemId }: { navigationItemId: NavigationItemId }) {
  const { t } = useLanguage();
  const item = getNavigationItemById(navigationItemId);
  return (
    <div className="grid gap-4 pt-6">
      <Glyph name={item.glyph} size={32} className="text-ink-3" />
      <h1 className="font-display text-[40px] leading-tight text-ink">{t(item.labelKey)}</h1>
      <p className="text-ink-3">{t("shell.route.description")}</p>
    </div>
  );
}

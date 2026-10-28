"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "./language-switcher";
import {
  isNavigationItemActive,
  primaryNavigationItems,
  secondaryNavigationItems,
  type NavigationItemDefinition,
} from "./navigation";
import { initialsOf } from "@/components/case-file/file-monogram";
import { Glyph } from "@/components/icons/glyphs";
import { BrandLogo } from "@/components/ui";
import { cx } from "@/components/ui/styles";
import { therapist } from "@/lib/sample-data/fixtures";
import { useLanguage } from "@/providers/language-provider";

export interface RailProps {
  readonly onNavigate?: () => void;
  /** Inside the mobile drawer the active tab cannot join a sheet. */
  readonly floating?: boolean;
}

export function Rail({ onNavigate, floating = false }: RailProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/dashboard"
        {...(onNavigate ? { onClick: onNavigate } : {})}
        className="mx-5 mt-5 mb-7 flex items-center gap-3 rounded-xl"
      >
        <BrandLogo
          className="size-10 rounded-[11px] shadow-[0_6px_14px_-6px_var(--cf-overlay)]"
          priority
          size="medium"
          variant="mark"
        />
        <span className="grid min-w-0 leading-tight">
          <span dir="auto" className="truncate text-start text-[14px] font-medium text-board-ink">
            {therapist.practice}
          </span>
          <span className="truncate text-[12px] text-board-muted">{t("shell.workspace")}</span>
        </span>
      </Link>

      <nav aria-label={t("shell.navigationDescription")} className="grid min-h-0 flex-1 content-start gap-6 overflow-y-auto pb-6">
        <RailGroup
          floating={floating}
          items={primaryNavigationItems}
          label={t("shell.primaryNavigation")}
          onNavigate={onNavigate}
          pathname={pathname}
        />
        <RailGroup
          floating={floating}
          heading={t("shell.practice")}
          items={secondaryNavigationItems}
          label={t("shell.secondaryNavigation")}
          onNavigate={onNavigate}
          pathname={pathname}
        />
      </nav>

      <div className="mx-4 mb-4 grid gap-3 border-t border-board-line pt-4">
        <div className="flex items-center gap-3 px-1">
          <span
            aria-hidden="true"
            className="font-display grid size-9 shrink-0 place-items-center rounded-full bg-board-raised text-[13px] text-board-ink ring-1 ring-board-line"
          >
            {initialsOf(therapist.name.replace(/^Dr\.\s*/, ""))}
          </span>
          <span className="grid min-w-0 leading-tight">
            <span dir="auto" className="truncate text-start text-[13px] font-medium text-board-ink">{therapist.name}</span>
            <span dir="auto" className="truncate text-start text-[12px] text-board-muted">{therapist.credential}</span>
          </span>
        </div>
        <LanguageSwitcher />
        <p className="stamp px-1 text-[10px] text-board-faint">{t("shell.sampleData")}</p>
      </div>
    </div>
  );
}

interface RailGroupProps {
  readonly items: readonly NavigationItemDefinition[];
  readonly label: string;
  readonly heading?: string;
  readonly pathname: string;
  readonly floating: boolean;
  readonly onNavigate?: (() => void) | undefined;
}

function RailGroup({ items, label, heading, pathname, floating, onNavigate }: RailGroupProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-0.5" role="group" aria-label={label}>
      {heading ? <p className="mb-1.5 px-6 text-[12px] font-medium text-board-faint">{heading}</p> : null}
      {items.map((item) => {
        const active = isNavigationItemActive(pathname, item);
        return (
          <Link
            key={item.id}
            href={item.href}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            aria-current={active ? "page" : undefined}
            className={cx(
              "group relative flex h-11 items-center gap-3 ps-3.5 text-[14.5px] transition-[background-color,color] duration-200",
              floating ? "mx-3 rounded-xl pe-3" : "ms-3 rounded-s-[12px] pe-5",
              active
                ? cx(
                    "bg-sheet font-medium text-ink",
                    !floating && "tab-joined",
                  )
                : cx(
                    "text-board-muted hover:bg-board-raised/70 hover:text-board-ink",
                    !floating && "me-3 rounded-e-[12px]",
                  ),
            )}
          >
            <Glyph
              name={item.glyph}
              size={20}
              className={cx(
                "transition-colors",
                active ? "text-board" : "text-board-faint group-hover:text-board-ink",
              )}
              tint={active ? 0.2 : 0.14}
            />
            <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
            {item.count && item.count.value > 0 ? (
              <span
                className={cx(
                  "font-figures grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11.5px]",
                  item.count.action
                    ? "bg-gold text-board-deep"
                    : active
                      ? "bg-sheet-sunk text-ink-2"
                      : "bg-board-raised text-board-muted",
                )}
              >
                {item.count.value}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

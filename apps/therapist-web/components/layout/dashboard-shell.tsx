"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useEffect, useState, type PropsWithChildren } from "react";

import { CommandPalette } from "./command-palette";
import { Rail } from "./rail";
import { Glyph } from "@/components/icons/glyphs";
import { BrandLogo } from "@/components/ui";
import { cx } from "@/components/ui/styles";
import { useLanguage } from "@/providers/language-provider";

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.getElementById("sheet-scroll")?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="workspace min-h-dvh lg:grid lg:h-dvh lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
      <aside className="hidden min-h-0 lg:block">
        <Rail />
      </aside>

      <header className="flex items-center gap-3 px-4 pt-3 pb-2 lg:hidden">
        <button
          type="button"
          aria-label={t("shell.openNavigation")}
          onClick={() => setNavigationOpen(true)}
          className="grid size-10 place-items-center rounded-[11px] text-board-ink ring-1 ring-board-line"
        >
          <Glyph name="menu" />
        </button>
        <BrandLogo className="size-9 rounded-[10px]" priority size="medium" variant="mark" />
        <span className="flex-1" />
        <button
          type="button"
          aria-label={t("command.open")}
          onClick={() => setCommandOpen(true)}
          className="grid size-10 place-items-center rounded-[11px] text-board-ink ring-1 ring-board-line"
        >
          <Glyph name="search" />
        </button>
      </header>

      <div className="min-w-0 px-2 pb-2 lg:py-3 lg:ps-0 lg:pe-3">
        <div
          id="sheet-scroll"
          onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 8)}
          className="sheet-stock relative min-h-[calc(100dvh-4.75rem)] rounded-[16px] shadow-sheet lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[20px]"
        >
          <div
            className={cx(
              "sticky top-0 z-20 hidden items-center gap-4 px-8 py-3.5 transition-[background-color,box-shadow] duration-300 lg:flex",
              scrolled ? "bg-sheet/95 shadow-[0_1px_0_var(--cf-sheet-rule)]" : "bg-transparent",
            )}
          >
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="group flex h-10 w-full max-w-[25rem] items-center gap-3 rounded-[11px] bg-sheet-raised ps-3 pe-2 text-start text-[14px] text-ink-3 ring-1 ring-rule transition-shadow hover:ring-rule-strong"
            >
              <Glyph name="search" size={18} />
              <span className="flex-1 truncate">{t("command.placeholder")}</span>
              <kbd className="font-figures rounded-md bg-sheet-sunk px-1.5 py-0.5 text-[11px] text-ink-3">
                Ctrl K
              </kbd>
            </button>
          </div>
          <main className="px-4 pt-5 pb-16 sm:px-6 lg:px-8 lg:pt-2">{children}</main>
        </div>
      </div>

      <DialogPrimitive.Root open={navigationOpen} onOpenChange={setNavigationOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[var(--cf-overlay)] lg:hidden" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="workspace fixed inset-y-0 start-0 z-50 w-[min(86vw,18rem)] shadow-lift outline-none data-[state=open]:animate-[sheet-settle_280ms_cubic-bezier(0.16,1,0.3,1)] lg:hidden"
          >
            <DialogPrimitive.Title className="sr-only">{t("shell.navigationDescription")}</DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label={t("common.close")}
              className="absolute end-3 top-6 z-10 grid size-9 place-items-center rounded-[10px] text-board-muted hover:text-board-ink"
            >
              <Glyph name="close" size={18} />
            </DialogPrimitive.Close>
            <Rail floating onNavigate={() => setNavigationOpen(false)} />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}

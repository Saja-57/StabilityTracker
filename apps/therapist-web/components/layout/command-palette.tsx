"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { navigationItems } from "./navigation";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { cx } from "@/components/ui/styles";
import { children } from "@/lib/sample-data/fixtures";
import { useLanguage } from "@/providers/language-provider";

export interface CommandPaletteProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

interface Entry {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly href: string;
  readonly glyph?: GlyphName;
  readonly childId?: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const entries = useMemo<Entry[]>(() => {
    const files: Entry[] = children.map((child) => ({
      id: `file-${child.id}`,
      label: child.name,
      hint: t(`file.status.${child.status}`),
      href: `/children/${child.id}`,
      childId: child.id,
    }));
    const places: Entry[] = navigationItems.map((item) => ({
      id: `go-${item.id}`,
      label: t(item.labelKey),
      hint: t("command.goTo"),
      href: item.href,
      glyph: item.glyph,
    }));
    const needle = query.trim().toLocaleLowerCase();
    return [...files, ...places].filter((entry) => !needle || entry.label.toLocaleLowerCase().includes(needle));
  }, [query, t]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    onOpenChange(false);
    setQuery("");
    router.push(entry.href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => Math.min(entries.length - 1, value + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => Math.max(0, value - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(entries[cursor]);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--cf-overlay)] backdrop-blur-[2px] data-[state=open]:animate-[sheet-settle_220ms_ease-out]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="sheet-stock fixed inset-x-4 top-[12vh] z-50 mx-auto max-w-[36rem] overflow-hidden rounded-[18px] shadow-lift outline-none ring-1 ring-rule data-[state=open]:animate-[sheet-settle_320ms_cubic-bezier(0.16,1,0.3,1)]"
        >
          <DialogPrimitive.Title className="sr-only">{t("command.title")}</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b border-rule px-5">
            <Glyph name="search" className="text-ink-3" />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={t("command.placeholder")}
              aria-label={t("command.placeholder")}
              aria-activedescendant={entries[cursor] ? `cmd-${entries[cursor].id}` : undefined}
              aria-controls="command-results"
              role="combobox"
              aria-expanded="true"
              className="h-14 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-3"
            />
            <kbd className="font-figures rounded-md border border-rule px-1.5 py-0.5 text-[11px] text-ink-3">esc</kbd>
          </div>
          <ul ref={listRef} id="command-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
            {entries.length === 0 ? (
              <li className="px-4 py-8 text-center text-[14px] text-ink-3">{t("command.empty")}</li>
            ) : (
              entries.map((entry, index) => (
                <li
                  key={entry.id}
                  id={`cmd-${entry.id}`}
                  data-index={index}
                  role="option"
                  aria-selected={index === cursor}
                  onMouseMove={() => setCursor(index)}
                  onClick={() => go(entry)}
                  className={cx(
                    "flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5",
                    index === cursor ? "bg-sheet-sunk" : undefined,
                  )}
                >
                  {entry.childId ? (
                    <FileMonogram childId={entry.childId} size="small" />
                  ) : (
                    <span className="grid size-8 place-items-center rounded-[9px] bg-sheet-raised text-ink-2 ring-1 ring-rule">
                      <Glyph name={entry.glyph ?? "arrow"} size={17} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-[14.5px] text-ink">{entry.label}</span>
                  <span className="truncate text-[12.5px] text-ink-3">{entry.hint}</span>
                  {index === cursor ? <Glyph name="arrow" size={16} className="text-ink-3" /> : null}
                </li>
              ))
            )}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

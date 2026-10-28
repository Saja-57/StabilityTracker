"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

import { guidanceKinds, kindTone, type GuidanceKind } from "./kinds";
import { Action, toneSolid, toneWash } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";

export interface SentDraft {
  readonly kind: GuidanceKind;
  readonly body: string;
}

const suggestions = ["log", "thanks", "session", "small"] as const;

export function Composer({
  recipient,
  onSend,
}: {
  recipient: string;
  onSend: (draft: SentDraft) => void;
}) {
  const { t } = useLanguage();
  const [kind, setKind] = useState<GuidanceKind>("recommendation");
  const [body, setBody] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const chipRefs = useRef<Partial<Record<GuidanceKind, HTMLButtonElement | null>>>({});
  const hintId = useId();
  const kindLabelId = useId();
  const canSend = body.trim().length > 0;

  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    area.style.height = "auto";
    area.style.height = `${Math.min(area.scrollHeight, 220)}px`;
  }, [body]);

  function submit() {
    if (!canSend) return;
    onSend({ kind, body: body.trim() });
    setBody("");
    areaRef.current?.focus();
  }

  function insert(text: string) {
    setBody((current) => (current.trim() ? `${current.trimEnd()} ${text}` : text));
    requestAnimationFrame(() => {
      const area = areaRef.current;
      if (!area) return;
      area.focus();
      area.setSelectionRange(area.value.length, area.value.length);
    });
  }

  function onAreaKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  }

  function onChipKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const rtl = document.documentElement.dir === "rtl";
    const forward =
      event.key === "ArrowDown" || (event.key === "ArrowRight" ? !rtl : event.key === "ArrowLeft" ? rtl : false);
    const next = guidanceKinds[(index + (forward ? 1 : -1) + guidanceKinds.length) % guidanceKinds.length];
    if (!next) return;
    setKind(next);
    chipRefs.current[next]?.focus();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      aria-label={fill(t("correspondence.composer.label"), { name: recipient })}
      className="sticky bottom-0 z-10 -mx-4 border-t border-rule bg-sheet px-4 pt-4 pb-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:px-0 lg:pb-0"
    >
      <div className="mx-auto grid w-full max-w-[46rem] min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span id={kindLabelId} className="sr-only">
            {t("correspondence.composer.kind")}
          </span>
          <div role="radiogroup" aria-labelledby={kindLabelId} className="flex flex-wrap gap-1.5">
            {guidanceKinds.map((entry, index) => {
              const active = entry === kind;
              const tone = kindTone[entry];
              return (
                <button
                  key={entry}
                  ref={(node) => {
                    chipRefs.current[entry] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setKind(entry)}
                  onKeyDown={(event) => onChipKey(event, index)}
                  className={cx(
                    "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[12.5px] font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active
                      ? cx(toneWash[tone], "shadow-[inset_0_0_0_1px_currentColor]")
                      : "text-ink-3 ring-1 ring-rule ring-inset hover:bg-sheet-sunk hover:text-ink-2",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cx("size-1.5 rounded-full transition-opacity", toneSolid[tone], active ? "opacity-100" : "opacity-50")}
                  />
                  {t(`vocab.messageKind.${entry}`)}
                </button>
              );
            })}
          </div>
          <p id={hintId} className="text-[12.5px] text-ink-3">
            {t(`correspondence.composer.hint.${kind}`)}
            <span className="sr-only"> {t("correspondence.composer.shortcut")}</span>
          </p>

        </div>

        <div className="rounded-[14px] bg-sheet-raised shadow-folder ring-1 ring-rule transition-shadow duration-200 focus-within:ring-rule-strong">
          <textarea
            ref={areaRef}
            value={body}
            rows={1}
            dir="auto"
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={onAreaKey}
            aria-label={fill(t("correspondence.composer.label"), { name: recipient })}
            aria-describedby={hintId}
            aria-keyshortcuts="Control+Enter Meta+Enter"
            placeholder={fill(t("correspondence.composer.placeholder"), { name: recipient })}
            className="block max-h-[220px] min-h-[3.5rem] w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
          />
          <div className="flex items-end gap-3 px-3 pt-1 pb-3">
            <div
              role="group"
              aria-label={t("correspondence.composer.suggestions")}
              className="-my-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1 pe-6 [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_85%,transparent)] rtl:[mask-image:linear-gradient(to_left,black_85%,transparent)]"
            >
              {suggestions.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => insert(t(`correspondence.suggest.${entry}.text`))}
                  className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-[12.5px] whitespace-nowrap text-ink-3 ring-1 ring-rule ring-inset transition-colors duration-200 hover:bg-sheet-sunk hover:text-ink"
                >
                  <Glyph name="plus" size={13} />
                  {t(`correspondence.suggest.${entry}.label`)}
                </button>
              ))}
            </div>
            <Action
              type="submit"
              variant="ink"
              size="small"
              glyph="send"
              disabled={!canSend}
              title={t("correspondence.composer.shortcut")}
            >
              {t("correspondence.composer.send")}
            </Action>
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

import { FieldLabel, lineField, PaperSelect, Segmented, type SegmentOption } from "./controls";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Action, DateStamp, SheetHeading, TabLabel, type Tone } from "@/components/case-file/primitives";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { children, getChild, getNotes } from "@/lib/sample-data/fixtures";
import { addDays, formatDay, formatTime, SAMPLE_NOW, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { SessionNote } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

type Kind = SessionNote["kind"];
type PromptKey = "observed" | "practiced" | "home";

interface NotebookEntry extends SessionNote {
  readonly childId: string;
  readonly sections?: readonly { readonly prompt: PromptKey; readonly text: string }[];
}

const kinds: readonly Kind[] = ["session", "observation", "plan"];
const prompts: readonly PromptKey[] = ["observed", "practiced", "home"];
const kindTone: Record<Kind, Tone> = { session: "ink", observation: "cobalt", plan: "moss" };
const kindDot: Record<Kind, string> = { session: "bg-ink-3", observation: "bg-cobalt", plan: "bg-moss" };

/* Ruled paper: one hairline per line box, scrolling with the text. */
const ruled32 =
  "leading-8";
const ruled28 =
  "leading-7";

const seedEntries: readonly NotebookEntry[] = children
  .flatMap((child) => getNotes(child.id).map((note) => ({ ...note, childId: child.id })))
  .sort((a, b) => b.at.localeCompare(a.at));

export function NotesView() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<readonly NotebookEntry[]>(seedEntries);
  const [pinned, setPinned] = useState<Record<string, boolean>>({ [`${children[0]?.id ?? ""}-n2`]: true });
  const [childFilter, setChildFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<Kind | "all">("all");
  const [freshId, setFreshId] = useState<string | null>(null);

  const visible = entries.filter(
    (entry) =>
      (childFilter === "all" || entry.childId === childFilter) && (kindFilter === "all" || entry.kind === kindFilter),
  );
  const files = new Set(entries.map((entry) => entry.childId)).size;

  function file(entry: NotebookEntry) {
    setEntries((state) => [entry, ...state]);
    setFreshId(entry.id);
    if (childFilter !== "all" && childFilter !== entry.childId) setChildFilter("all");
    if (kindFilter !== "all" && kindFilter !== entry.kind) setKindFilter("all");
  }

  return (
    <div className="grid max-w-[68rem] gap-12">
      <header className="grid gap-3 pt-4 animate-settle">
        <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">{t("notes.title")}</h1>
        <p className="max-w-[60ch] text-[17px] leading-7 text-ink-2">
          {fill(t("notes.summary"), { count: entries.length, files })}
        </p>
      </header>

      <Composer onFile={file} defaultChild={childFilter === "all" ? "" : childFilter} />

      <section aria-labelledby="notes-entries" className="grid content-start gap-6 animate-settle" style={{ ["--i" as string]: 2 }}>
        <SheetHeading
          title={<span id="notes-entries">{t("notes.filters.title")}</span>}
          aside={
            <span className="font-figures text-[12.5px] text-ink-3" aria-live="polite">
              {fill(t("notes.filters.showing"), { count: visible.length, total: entries.length })}
            </span>
          }
        />
        <Filters
          childFilter={childFilter}
          kindFilter={kindFilter}
          onChild={setChildFilter}
          onKind={setKindFilter}
        />

        {visible.length === 0 ? (
          <EmptyNotebook
            onReset={() => {
              setChildFilter("all");
              setKindFilter("all");
            }}
          />
        ) : (
          <ol aria-label={t("notes.list.label")} className="relative grid border-y border-rule">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-[4.75rem] w-px bg-rule-strong sm:start-[7.25rem]"
            />
            {visible.map((entry, index) => (
              <JournalEntry
                key={entry.id}
                entry={entry}
                index={index}
                firstOfDay={index === 0 || visible[index - 1]?.at.slice(0, 10) !== entry.at.slice(0, 10)}
                fresh={entry.id === freshId}
                pinned={Boolean(pinned[entry.id])}
                onPin={() => setPinned((state) => ({ ...state, [entry.id]: !state[entry.id] }))}
              />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- composer */

function Composer({ onFile, defaultChild }: { onFile: (entry: NotebookEntry) => void; defaultChild: string }) {
  const { t } = useLanguage();
  const titleId = useId();
  const bodyId = useId();
  const [childId, setChildId] = useState(defaultChild);
  const [kind, setKind] = useState<Kind>("session");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sections, setSections] = useState<Record<PromptKey, string>>({ observed: "", practiced: "", home: "" });
  const [count, setCount] = useState(0);

  const child = getChild(childId);
  const hasBody = kind === "session" ? prompts.some((key) => sections[key].trim()) : body.trim().length > 0;
  const ready = Boolean(child) && hasBody;
  const dirty = title.trim() || body.trim() || prompts.some((key) => sections[key].trim());

  const kindOptions: readonly SegmentOption<Kind>[] = kinds.map((value) => ({
    value,
    label: t(`notes.kind.${value}`),
    dot: kindDot[value],
  }));

  function reset() {
    setTitle("");
    setBody("");
    setSections({ observed: "", practiced: "", home: "" });
  }

  function submit() {
    if (!ready || !child) return;
    const filled = prompts
      .filter((key) => sections[key].trim())
      .map((prompt) => ({ prompt, text: sections[prompt].trim() }));
    const next = count + 1;
    setCount(next);
    onFile({
      id: `${child.id}-draft-${next}`,
      childId: child.id,
      at: SAMPLE_NOW,
      kind,
      title: title.trim() || t(`notes.composer.titlePlaceholder.${kind}`),
      body: kind === "session" ? "" : body.trim(),
      ...(kind === "session" ? { sections: filled } : {}),
    });
    reset();
  }

  return (
    <section
      aria-labelledby="notes-composer"
      className="animate-settle rounded-[18px] bg-sheet-raised p-5 shadow-sheet ring-1 ring-rule sm:p-7"
      style={{ ["--i" as string]: 1 }}
    >
      <form
        className="grid gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="notes-composer" className="font-display text-[21px] leading-7 text-ink">
            {t("notes.composer.title")}
          </h2>
          <Segmented label={t("notes.composer.kind")} value={kind} options={kindOptions} onChange={setKind} />
        </div>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-end sm:gap-8">
          <PaperSelect label={t("notes.composer.child")} value={childId} onChange={(event) => setChildId(event.target.value)}>
            <option value="" disabled>
              {t("notes.composer.childPlaceholder")}
            </option>
            {children.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </PaperSelect>
          <div className="grid gap-1.5">
            <FieldLabel htmlFor={titleId}>{t("notes.composer.entryTitle")}</FieldLabel>
            <input
              dir="auto"
              id={titleId}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t(`notes.composer.titlePlaceholder.${kind}`)}
              className={cx(lineField, "font-display text-[19px]")}
              autoComplete="off"
            />
          </div>
        </div>

        {kind === "session" ? (
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {prompts.map((key) => (
              <PromptField
                key={key}
                prompt={key}
                value={sections[key]}
                onChange={(value) => setSections((state) => ({ ...state, [key]: value }))}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-1.5">
            <FieldLabel htmlFor={bodyId}>{t("notes.composer.body")}</FieldLabel>
            <textarea
            dir="auto"
              id={bodyId}
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t(`notes.composer.bodyPlaceholder.${kind}`)}
              className={cx(
                "w-full resize-y border-0 px-0 py-0 text-[15.5px] text-ink placeholder:text-ink-3/80 focus:outline-none focus-visible:outline-none",
                ruled32,
              )}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-rule-strong pt-5">
          <p className="flex items-center gap-2.5 text-[13px] text-ink-3" aria-live="polite">
            {child ? <FileMonogram childId={child.id} size="small" /> : null}
            {child && hasBody ? fill(t("notes.composer.ready"), { name: child.givenName }) : t("notes.composer.needs")}
          </p>
          <div className="flex items-center gap-2">
            <Action variant="quiet" onClick={reset} disabled={!dirty}>
              {t("notes.composer.clear")}
            </Action>
            <Action variant="ink" type="submit" glyph="notes" disabled={!ready}>
              {t("notes.composer.save")}
            </Action>
          </div>
        </div>
      </form>
    </section>
  );
}

function PromptField({
  prompt,
  value,
  onChange,
}: {
  prompt: PromptKey;
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();
  const id = useId();
  return (
    <div className="grid content-start gap-1">
      <FieldLabel htmlFor={id}>{t(`notes.composer.prompt.${prompt}`)}</FieldLabel>
      <textarea
        dir="auto"
        id={id}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t(`notes.composer.promptHint.${prompt}`)}
        className={cx(
          "w-full resize-y border-0 px-0 py-0 text-[15px] text-ink placeholder:text-ink-3/75 focus:outline-none focus-visible:outline-none",
          ruled32,
        )}
      />
    </div>
  );
}

/* -------------------------------------------------------------- filters */

function Filters({
  childFilter,
  kindFilter,
  onChild,
  onKind,
}: {
  childFilter: string;
  kindFilter: Kind | "all";
  onChild: (value: string) => void;
  onKind: (value: Kind | "all") => void;
}) {
  const { t } = useLanguage();
  const kindOptions: readonly SegmentOption<Kind | "all">[] = [
    { value: "all", label: t("notes.filters.allKinds") },
    ...kinds.map((value) => ({ value, label: t(`notes.kind.${value}`), dot: kindDot[value] })),
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div role="group" aria-label={t("notes.filters.children")} className="flex flex-wrap gap-2">
        <Chip active={childFilter === "all"} onClick={() => onChild("all")}>
          {t("notes.filters.allChildren")}
        </Chip>
        {children.map((child) => (
          <Chip key={child.id} active={childFilter === child.id} onClick={() => onChild(child.id)}>
            <FileMonogram childId={child.id} size="small" className="-ms-1.5 size-6! rounded-[7px]! text-[10px]!" />
            <bdi>{child.givenName}</bdi>
          </Chip>
        ))}
      </div>
      <div className="max-w-full overflow-x-auto">
        <Segmented className="w-full lg:w-auto" label={t("notes.filters.kinds")} value={kindFilter} options={kindOptions} onChange={onKind} />
      </div>
    </div>
  );
}

function Chip({ active, onClick, children: label }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[13.5px] transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        active
          ? "bg-board text-board-ink shadow-press"
          : "bg-sheet-raised text-ink-2 ring-1 ring-rule hover:text-ink hover:ring-rule-strong",
      )}
    >
      {label}
    </button>
  );
}

/* ---------------------------------------------------------------- entry */

function JournalEntry({
  entry,
  index,
  firstOfDay,
  fresh,
  pinned,
  onPin,
}: {
  entry: NotebookEntry;
  index: number;
  firstOfDay: boolean;
  fresh: boolean;
  pinned: boolean;
  onPin: () => void;
}) {
  const { language, t } = useLanguage();
  const child = getChild(entry.childId);
  if (!child) return null;
  const day = entry.at.slice(0, 10);
  const dayLabel =
    day === SAMPLE_TODAY
      ? t("common.today")
      : day === addDays(SAMPLE_TODAY, -1)
        ? t("common.yesterday")
        : formatDay(entry.at, language);

  return (
    <li
      className={cx(
        "grid grid-cols-[4.75rem_minmax(0,1fr)] sm:grid-cols-[7.25rem_minmax(0,1fr)]",
        firstOfDay ? "border-t border-rule first:border-t-0" : "",
        index < 12 && !fresh && "animate-settle",
        fresh && "bg-sheet-raised/60",
      )}
      style={{ ["--i" as string]: Math.min(index, 12) + 3 }}
    >
      <div className="grid content-start justify-items-start gap-1 pe-3 pt-6 sm:pe-5">
        <span className={cx("stamp text-[11px] text-stamp", !firstOfDay && "sr-only")}>{dayLabel}</span>
        <span className="font-figures text-[12px] text-ink-3">{formatTime(entry.at, language)}</span>
        {fresh ? (
          <DateStamp tilt={-6} className="mt-2 text-[10.5px]">
            {t("notes.filed")}
          </DateStamp>
        ) : null}
      </div>

      <article className={cx("grid min-w-0 gap-3 ps-4 pt-5 pb-6 sm:ps-7", !firstOfDay && "border-t border-dashed border-rule")}>
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            href={`/children/${child.id}`}
            aria-label={fill(t("notes.list.openFile"), { name: child.name })}
            className="group inline-flex min-w-0 items-center gap-2.5"
          >
            <FileMonogram childId={child.id} size="small" />
            <span className="truncate text-[14.5px] font-medium text-ink group-hover:underline group-hover:decoration-rule-strong group-hover:underline-offset-4">
              <bdi>{child.name}</bdi>
            </span>
          </Link>
          <TabLabel tone={kindTone[entry.kind]}>{t(`notes.kind.${entry.kind}`)}</TabLabel>
          <span className="ms-auto">
            <PinToggle pinned={pinned} onToggle={onPin} />
          </span>
        </header>

        <h3 className="font-display text-[20px] leading-7 text-ink"><bdi>{entry.title}</bdi></h3>

        {entry.sections?.length ? (
          <div className="grid max-w-[66ch] gap-3">
            {entry.sections.map((section) => (
              <div key={section.prompt} className="grid gap-0.5">
                <span className="text-[12.5px] font-medium text-ink-3">{t(`notes.composer.prompt.${section.prompt}`)}</span>
                <p className={cx("text-[15px] whitespace-pre-line text-ink-2", ruled28)}><bdi>{section.text}</bdi></p>
              </div>
            ))}
          </div>
        ) : (
          <p className={cx("max-w-[66ch] text-[15px] whitespace-pre-line text-ink-2", ruled28)}><bdi>{entry.body}</bdi></p>
        )}
      </article>
    </li>
  );
}

/** Pen-drawn tick in a little box, the same gesture as PenTick, with its words beside it. */
function PinToggle({ pinned, onToggle }: { pinned: boolean; onToggle: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      aria-pressed={pinned}
      onClick={onToggle}
      className={cx(
        "group inline-flex h-8 items-center gap-2 rounded-[9px] ps-1.5 pe-2.5 text-[12.5px] transition-[background-color,color] duration-200",
        pinned ? "text-pen" : "text-ink-3 hover:bg-sheet-sunk hover:text-ink",
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "grid size-5 place-items-center rounded-[6px] transition-[box-shadow] duration-200",
          pinned ? "ring-1 ring-pen/40 ring-inset" : "ring-1 ring-rule-strong ring-inset",
        )}
      >
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none">
          {pinned ? (
            <path
              className="pen-draw"
              d="M4.5 12.5c1.6 1.2 3 2.6 4.4 4.6C11.6 11.4 15 7.4 20 4.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              style={{ ["--pen-length" as string]: 30 }}
            />
          ) : null}
        </svg>
      </span>
      {t("notes.pin")}
    </button>
  );
}

/* ---------------------------------------------------------------- empty */

function EmptyNotebook({ onReset }: { onReset: () => void }) {
  const { t } = useLanguage();
  return (
    <div className={cx("grid justify-items-start gap-3 border-y border-rule px-1 py-10 sm:ps-[7.25rem]", ruled28)}>
      <h3 className="font-display text-[19px] text-ink">{t("notes.empty.title")}</h3>
      <p className="max-w-[52ch] text-[15px] text-ink-2">{t("notes.empty.body")}</p>
      <Action variant="outline" size="small" onClick={onReset}>
        {t("notes.empty.reset")}
      </Action>
    </div>
  );
}


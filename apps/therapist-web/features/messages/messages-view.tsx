"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Composer, type SentDraft } from "./composer";
import { kindTone, type GuidanceKind } from "./kinds";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { ActionLink, DateStamp, TabLabel } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { children, getThread, therapist } from "@/lib/sample-data/fixtures";
import {
  addDays,
  addMinutes,
  dayOf,
  formatDay,
  formatLongDay,
  formatTime,
  SAMPLE_NOW,
  SAMPLE_TODAY,
} from "@/lib/sample-data/time";
import type { ChildFile, ThreadMessage } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

type Filter = "all" | "waiting" | "sent";
type Threads = Record<string, readonly ThreadMessage[]>;

const filters: readonly Filter[] = ["all", "waiting", "sent"];

function lastOf(thread: readonly ThreadMessage[]) {
  return thread[thread.length - 1];
}

function isWaiting(thread: readonly ThreadMessage[]) {
  return thread.some((message) => message.from === "family" && !message.read);
}

function caregiverOf(child: ChildFile) {
  return child.caregivers.find((caregiver) => caregiver.primary) ?? child.caregivers[0];
}

export function MessagesView() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const requested = params.get("family");

  const [threads, setThreads] = useState<Threads>(() =>
    Object.fromEntries(children.map((child) => [child.id, getThread(child.id)])),
  );
  const [fresh, setFresh] = useState<ReadonlySet<string>>(() => new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [announcement, setAnnouncement] = useState("");

  const ordered = useMemo(
    () =>
      [...children].sort((a, b) => {
        const waitA = isWaiting(threads[a.id] ?? []);
        const waitB = isWaiting(threads[b.id] ?? []);
        if (waitA !== waitB) return waitA ? -1 : 1;
        const atA = lastOf(threads[a.id] ?? [])?.at ?? "";
        const atB = lastOf(threads[b.id] ?? [])?.at ?? "";
        return atA < atB ? 1 : atA > atB ? -1 : 0;
      }),
    [threads],
  );

  const waitingCount = ordered.filter((child) => isWaiting(threads[child.id] ?? [])).length;
  const counts: Record<Filter, number> = {
    all: ordered.length,
    waiting: waitingCount,
    sent: ordered.filter((child) => lastOf(threads[child.id] ?? [])?.from === "therapist").length,
  };
  const visible = ordered.filter((child) => {
    const thread = threads[child.id] ?? [];
    if (filter === "waiting") return isWaiting(thread);
    if (filter === "sent") return lastOf(thread)?.from === "therapist";
    return true;
  });

  const [defaultId] = useState(
    () => children.find((child) => isWaiting(getThread(child.id)))?.id ?? children[0]?.id ?? "",
  );
  const requestedChild = requested ? children.find((child) => child.id === requested) : undefined;
  const selected = requestedChild ?? children.find((child) => child.id === defaultId);

  function send(child: ChildFile, draft: SentDraft) {
    const thread = threads[child.id] ?? [];
    const sentCount = Object.values(threads)
      .flat()
      .filter((message) => message.id.includes("-sent-")).length;
    const message: ThreadMessage = {
      id: `${child.id}-sent-${sentCount + 1}`,
      at: addMinutes(SAMPLE_NOW, sentCount + 1),
      from: "therapist",
      author: therapist.name,
      kind: draft.kind,
      body: draft.body,
      read: false,
    };
    setThreads((state) => ({
      ...state,
      [child.id]: [...thread.map((entry) => (entry.from === "family" ? { ...entry, read: true } : entry)), message],
    }));
    setFresh((state) => new Set(state).add(message.id));
    setAnnouncement(fill(t("correspondence.composer.sentTo"), { name: caregiverOf(child)?.name ?? child.name }));
  }

  return (
    <div className="grid gap-8">
      <header className={cx("gap-2 pt-2 lg:grid", requestedChild ? "hidden" : "grid")}>
        <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">{t("correspondence.title")}</h1>
        <p className="max-w-[72ch] text-[17px] leading-7 text-ink-2">
          {waitingCount > 0 ? fill(t("correspondence.summary"), { waiting: waitingCount }) : t("correspondence.summaryClear")}
        </p>
      </header>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className="grid border-t border-rule lg:h-[calc(100dvh-15.25rem)] lg:min-h-[36rem] lg:grid-cols-[minmax(19rem,23rem)_minmax(0,1fr)]">
        <section
          aria-label={t("correspondence.list.label")}
          className={cx("min-h-0 flex-col lg:flex lg:pe-5", requestedChild ? "hidden" : "flex")}
        >
          <FilterTabs filter={filter} counts={counts} onChange={setFilter} />
          <ThreadList
            items={visible}
            threads={threads}
            filter={filter}
            selectedId={selected?.id}
            showSelection={Boolean(requestedChild)}
          />
        </section>

        <section
          aria-label={selected ? fill(t("correspondence.thread.label"), { name: caregiverOf(selected)?.name ?? selected.name }) : undefined}
          className={cx(
            "min-h-0 min-w-0 flex-col lg:flex lg:border-s lg:border-rule lg:ps-8",
            requestedChild ? "flex" : "hidden",
          )}
        >
          {selected ? (
            <ThreadPane
              key={selected.id}
              child={selected}
              thread={threads[selected.id] ?? []}
              fresh={fresh}
              onSend={(draft) => send(selected, draft)}
            />
          ) : (
            <p className="m-auto py-16 text-[15px] text-ink-3">{t("correspondence.thread.empty")}</p>
          )}
        </section>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- filter */

function FilterTabs({
  filter,
  counts,
  onChange,
}: {
  filter: Filter;
  counts: Record<Filter, number>;
  onChange: (filter: Filter) => void;
}) {
  const { t } = useLanguage();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    let next = -1;
    if (event.key === "ArrowRight") next = index + dir;
    if (event.key === "ArrowLeft") next = index - dir;
    if (next < 0 && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const target = filters[(next + filters.length) % filters.length];
    if (!target) return;
    onChange(target);
    refs.current[target]?.focus();
  }

  return (
    <div role="tablist" aria-label={t("correspondence.filter.label")} className="flex gap-1 py-3">
      {filters.map((entry, index) => {
        const active = filter === entry;
        return (
          <button
            key={entry}
            ref={(node) => {
              refs.current[entry] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(entry)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cx(
              "inline-flex h-8 items-center gap-1.5 rounded-[9px] px-3 text-[13px] font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              active ? "bg-board text-board-ink shadow-press" : "text-ink-2 hover:bg-sheet-sunk hover:text-ink",
            )}
          >
            {t(`correspondence.filter.${entry}`)}
            <span
              className={cx(
                "font-figures text-[11.5px]",
                active ? "text-board-muted" : entry === "waiting" && counts.waiting > 0 ? "text-gold-ink" : "text-ink-3",
              )}
            >
              {counts[entry]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- list */

function whenLabel(at: string, language: "en" | "he" | "ar", t: (key: "common.yesterday") => string) {
  const day = dayOf(at);
  if (day === SAMPLE_TODAY) return formatTime(at, language);
  if (day === addDays(SAMPLE_TODAY, -1)) return t("common.yesterday");
  return formatDay(at, language);
}

function ThreadList({
  items,
  threads,
  filter,
  selectedId,
  showSelection,
}: {
  items: readonly ChildFile[];
  threads: Threads;
  filter: Filter;
  selectedId: string | undefined;
  showSelection: boolean;
}) {
  const { language, t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="grid flex-1 place-items-center gap-3 border-t border-rule px-6 py-16 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-moss-wash text-moss-ink">
          <Glyph name="tick" size={20} />
        </span>
        <p className="max-w-[26ch] text-[14px] leading-5 text-ink-3">{t(`correspondence.list.empty.${filter}`)}</p>
      </div>
    );
  }

  return (
    <ul className="-mx-2 min-h-0 flex-1 overflow-y-auto border-t border-rule px-2 py-2 lg:pb-6">
      {items.map((child, index) => {
        const thread = threads[child.id] ?? [];
        const last = lastOf(thread);
        const waiting = isWaiting(thread);
        const caregiver = caregiverOf(child);
        const selected = child.id === selectedId;
        return (
          <li key={child.id} className="animate-settle" style={{ ["--i" as string]: index }}>
            <Link
              href={`/messages?family=${child.id}`}
              scroll={false}
              aria-current={selected ? "page" : undefined}
              className={cx(
                "group grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 rounded-[13px] px-3 py-3.5 transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                selected
                  ? cx("bg-sheet-raised shadow-folder", !showSelection && "max-lg:bg-transparent max-lg:shadow-none")
                  : "hover:bg-sheet-sunk",
              )}
            >
              <FileMonogram childId={child.id} size="small" className="mt-0.5" />
              <span className="grid min-w-0 gap-1">
                <span className="flex items-baseline gap-2">
                  <span className={cx("truncate text-[14.5px] text-ink", waiting ? "font-semibold" : "font-medium")}>
                    <bdi>{caregiver?.name ?? child.name}</bdi>
                  </span>
                  <span className="truncate text-[12.5px] text-ink-3">
                    {fill(t("correspondence.list.about"), { name: child.givenName })}
                  </span>
                  <span
                    className={cx(
                      "font-figures ms-auto shrink-0 text-[11.5px]",
                      waiting ? "text-gold-ink" : "text-ink-3",
                    )}
                  >
                    {last ? whenLabel(last.at, language, t) : null}
                  </span>
                </span>
                <span className="flex items-start gap-2">
                  {last?.from === "therapist" ? (
                    <span className="shrink-0 text-[13px] leading-[1.15rem] text-ink-3">
                      {t("correspondence.list.you")}
                    </span>
                  ) : null}
                  <span
                    dir="auto"
                    className={cx(
                      "line-clamp-2 flex-1 text-start text-[13px] leading-[1.15rem]",
                      waiting ? "text-ink-2" : "text-ink-3",
                    )}
                  >
                    {last ? <bdi>{last.body}</bdi> : null}
                  </span>
                  {waiting ? (
                    <span className="mt-1 size-2.5 shrink-0 rounded-full bg-gold ring-[3px] ring-gold-wash">
                      <span className="sr-only">{t("correspondence.list.waiting")}</span>
                    </span>
                  ) : null}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------------------------------------------------- thread */

function ThreadPane({
  child,
  thread,
  fresh,
  onSend,
}: {
  child: ChildFile;
  thread: readonly ThreadMessage[];
  fresh: ReadonlySet<string>;
  onSend: (draft: SentDraft) => void;
}) {
  const { language, t } = useLanguage();
  const caregiver = caregiverOf(child);
  const waitingMessage = thread.find((message) => message.from === "family" && !message.read);
  const answered = !waitingMessage && thread.some((message) => fresh.has(message.id));
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = scrollRef.current;
    if (box && box.scrollHeight > box.clientHeight) {
      box.scrollTo({ top: box.scrollHeight, behavior: thread.length > 0 && fresh.size > 0 ? "smooth" : "auto" });
    }
  }, [thread.length, fresh.size]);

  useEffect(() => {
    if (fresh.size > 0 && window.matchMedia("(max-width: 1023px)").matches) {
      endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [fresh.size]);

  const groups: { day: string; messages: ThreadMessage[] }[] = [];
  for (const message of thread) {
    const day = dayOf(message.at);
    const group = groups[groups.length - 1];
    if (group && group.day === day) group.messages.push(message);
    else groups.push({ day, messages: [message] });
  }

  const dayLabel = (day: string) =>
    day === SAMPLE_TODAY
      ? t("common.today")
      : day === addDays(SAMPLE_TODAY, -1)
        ? t("common.yesterday")
        : formatLongDay(day, language);

  let order = 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-rule py-4">
        <Link
          href="/messages"
          scroll={false}
          className="-ms-1 inline-flex h-9 items-center gap-1.5 rounded-[10px] pe-3 ps-1.5 text-[13.5px] font-medium text-ink-2 hover:bg-sheet-sunk hover:text-ink lg:hidden"
        >
          <Glyph name="arrowBack" size={18} />
          {t("correspondence.thread.back")}
        </Link>
        <div className="flex basis-full items-center gap-3.5 sm:basis-auto sm:flex-1">
          <FileMonogram childId={child.id} size="medium" />
          <div className="grid min-w-0 gap-0.5">
            <h2 className="font-display truncate text-[21px] leading-7 text-ink"><bdi>{child.name}</bdi></h2>
            <p className="flex flex-wrap items-center gap-x-3 text-[13px] text-ink-3">
              {caregiver ? (
                <span className="text-ink-2">
                  {withName(
                    fill(t("correspondence.thread.caregiver"), { relation: t(`vocab.relation.${caregiver.relation}`) }),
                    caregiver.name,
                  )}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Glyph name="calendar" size={14} />
                {child.nextSession
                  ? fill(t("correspondence.thread.nextSession"), {
                      date: `${formatDay(child.nextSession, language)} ${formatTime(child.nextSession, language)}`,
                    })
                  : t("correspondence.thread.noSession")}
              </span>
            </p>
          </div>
        </div>
        <ActionLink href={`/children/${child.id}`} variant="outline" size="small" trailingGlyph="chevron">
          {t("file.open")}
        </ActionLink>
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-label={fill(t("correspondence.thread.label"), { name: caregiver?.name ?? child.name })}
        className="min-h-0 flex-1 overflow-y-auto py-6 lg:pe-2 lg:[mask-image:linear-gradient(to_bottom,transparent,black_1.75rem)]"
      >
        <div className="mx-auto grid max-w-[46rem] gap-6">
          {waitingMessage ? (
            <p className="inline-flex items-center gap-2 justify-self-center text-[12.5px] text-gold-ink">
              <span className="size-2 rounded-full bg-gold" />
              {fill(t("correspondence.thread.waitingSince"), {
                time: `${whenLabel(waitingMessage.at, language, t)} ${dayOf(waitingMessage.at) === SAMPLE_TODAY ? "" : formatTime(waitingMessage.at, language)}`.trim(),
              })}
            </p>
          ) : null}
          {groups.map((group) => (
            <div key={group.day} className="grid gap-4">
              <DaySeparator label={dayLabel(group.day)} />
              {group.messages.map((message) => {
                const index = order++;
                return message.from === "therapist" ? (
                  <TherapistSlip key={message.id} message={message} fresh={fresh.has(message.id)} index={index} />
                ) : (
                  <FamilyNote key={message.id} message={message} index={index} />
                );
              })}
            </div>
          ))}
          {answered ? (
            <p className="inline-flex items-center gap-1.5 justify-self-center text-[12.5px] text-moss-ink">
              <Glyph name="tick" size={15} />
              {t("correspondence.thread.answered")}
            </p>
          ) : null}
          <div ref={endRef} />
        </div>
      </div>

      <Composer
        recipient={caregiver?.name ?? child.name}
        onSend={onSend}
      />
    </>
  );
}

/** Place a Latin-script name inside a translated template without breaking RTL order. */
function withName(template: string, name: string) {
  const [before = "", after = ""] = template.split("{name}");
  return (
    <>
      {before}
      <bdi>{name}</bdi>
      {after}
    </>
  );
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-rule" />
      <span
        className="stamp rounded-[5px] border-[1.5px] border-current px-2 py-[2px] text-[10.5px] text-ink-3 opacity-80"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        {label}
      </span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}

function TherapistSlip({ message, fresh, index }: { message: ThreadMessage; fresh: boolean; index: number }) {
  const { language, t } = useLanguage();
  const kind = message.kind === "reply" ? "recommendation" : (message.kind as GuidanceKind);
  return (
    <article
      className={cx("flex justify-end", fresh ? "animate-rise" : "animate-settle")}
      style={{ ["--i" as string]: fresh ? 0 : index }}
    >
      <div className="relative grid w-full max-w-[min(34rem,92%)] gap-3 rounded-[14px] bg-sheet-raised px-5 pt-4 pb-3.5 shadow-folder">
        <header className="flex items-center gap-3">
          <TabLabel tone={kindTone[kind]}>{t(`vocab.messageKind.${kind}`)}</TabLabel>
          <span className="font-figures ms-auto text-[11.5px] text-ink-3">{formatTime(message.at, language)}</span>
        </header>
        <p dir="auto" className="text-start text-[15px] leading-6 text-ink"><bdi>{message.body}</bdi></p>
        <footer className="flex min-h-7 items-center gap-2 border-t border-dashed border-rule pt-2.5 text-[12px] text-ink-3">
          <bdi className="truncate">{message.author}</bdi>
          <span className="ms-auto inline-flex items-center gap-1">
            {fresh ? (
              <DateStamp tone="pen" tilt={-5} className="text-[10.5px]">
                <Glyph name="send" size={13} />
                {t("correspondence.slip.sent")}
              </DateStamp>
            ) : message.read ? (
              <>
                <Glyph name="tick" size={14} className="text-pen" />
                {t("correspondence.slip.read")}
              </>
            ) : (
              t("correspondence.slip.delivered")
            )}
          </span>
        </footer>
      </div>
    </article>
  );
}

function FamilyNote({ message, index }: { message: ThreadMessage; index: number }) {
  const { language, t } = useLanguage();
  const waiting = !message.read;
  return (
    <article className="animate-settle flex justify-start" style={{ ["--i" as string]: index }}>
      <div className="grid w-full max-w-[min(32rem,88%)] gap-2 rounded-[14px] bg-sheet-sunk/80 px-4 py-3.5 ring-1 ring-rule ring-inset">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-2">
            <Glyph name="family" size={15} />
            <bdi>{message.author}</bdi>
          </span>
          {waiting ? <TabLabel tone="gold">{t("correspondence.slip.needsReply")}</TabLabel> : null}
          <span className="font-figures ms-auto text-[11.5px] text-ink-3">{formatTime(message.at, language)}</span>
        </header>
        <p dir="auto" className="text-start text-[14.5px] leading-6 text-ink-2"><bdi>{message.body}</bdi></p>
      </div>
    </article>
  );
}

"use client";

import { useId, useState, type ReactNode } from "react";

import { FieldLabel, lineField, PaperSelect, Segmented } from "@/features/notes/controls";
import { Action, DateStamp, TabLabel } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { LanguageSwitcher } from "@/components/layout";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { therapist } from "@/lib/sample-data/fixtures";
import { addDays, formatTime, formatWeekday, SAMPLE_TODAY, weekdayIndex } from "@/lib/sample-data/time";
import { useLanguage } from "@/providers/language-provider";

type NotifyKey = "highIntensity" | "familyMessage" | "survey" | "digest";
type DigestTime = "07:00" | "12:00" | "18:00";

interface Preferences {
  readonly name: string;
  readonly credential: string;
  readonly practice: string;
  readonly notify: Readonly<Record<NotifyKey, boolean>>;
  readonly digestTime: DigestTime;
  /** Monday first. */
  readonly days: readonly boolean[];
  readonly start: string;
  readonly end: string;
}

const initial: Preferences = {
  name: therapist.name,
  credential: therapist.credential,
  practice: therapist.practice,
  notify: { highIntensity: true, familyMessage: true, survey: false, digest: true },
  digestTime: "07:00",
  days: [true, true, true, true, true, false, false],
  start: "08:30",
  end: "17:00",
};

const notifyKeys: readonly NotifyKey[] = ["highIntensity", "familyMessage", "survey", "digest"];
const digestTimes: readonly DigestTime[] = ["07:00", "12:00", "18:00"];
const monday = addDays(SAMPLE_TODAY, -weekdayIndex(SAMPLE_TODAY));
const weekDays = Array.from({ length: 7 }, (_, index) => addDays(monday, index));
const slots = Array.from({ length: 31 }, (_, index) => {
  const minutes = 6 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

const same = (a: Preferences, b: Preferences) => JSON.stringify(a) === JSON.stringify(b);

export function SettingsView() {
  const { language, t } = useLanguage();
  const [saved, setSaved] = useState<Preferences>(initial);
  const [draft, setDraft] = useState<Preferences>(initial);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = !same(saved, draft);
  const hoursInvalid = draft.end <= draft.start;
  const at = (slot: string) => formatTime(`${SAMPLE_TODAY}T${slot}`, language);

  function update(patch: Partial<Preferences>) {
    setJustSaved(false);
    setDraft((state) => ({ ...state, ...patch }));
  }

  return (
    <div className="grid max-w-[64rem] gap-10">
      <header className="flex flex-wrap items-end justify-between gap-6 pt-4 animate-settle">
        <div className="grid gap-3">
          <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">{t("settings.title")}</h1>
          <p className="max-w-[56ch] text-[17px] leading-7 text-ink-2">{t("settings.summary")}</p>
        </div>
        {justSaved ? (
          <DateStamp tone="moss" tilt={-4} className="mb-2 text-[12px]">
            {t("settings.save.saved")}
          </DateStamp>
        ) : null}
      </header>

      <div className="grid border-b border-rule">
        <Group index={1} id="settings-profile" title={t("settings.profile.title")} description={t("settings.profile.description")}>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              className="sm:col-span-2"
              label={t("settings.profile.name")}
              value={draft.name}
              onChange={(name) => update({ name })}
              autoComplete="name"
            />
            <TextField
              label={t("settings.profile.credential")}
              value={draft.credential}
              onChange={(credential) => update({ credential })}
            />
            <TextField
              label={t("settings.profile.practice")}
              value={draft.practice}
              onChange={(practice) => update({ practice })}
              autoComplete="organization"
            />
          </div>
        </Group>

        <Group index={2} id="settings-language" title={t("settings.language.title")} description={t("settings.language.description")}>
          <div className="grid gap-4">
            <div className="w-full max-w-[22rem]">
              <LanguageSwitcher tone="sheet" />
            </div>
            <p className="flex max-w-[58ch] items-start gap-2.5 text-[14px] leading-6 text-ink-2">
              <Glyph name="globe" size={18} className="mt-[3px] text-ink-3" />
              {t("settings.language.rtl")}
            </p>
          </div>
        </Group>

        <Group index={3} id="settings-notify" title={t("settings.notify.title")} description={t("settings.notify.description")}>
          <ul className="grid">
            {notifyKeys.map((key) => (
              <li key={key} className="grid gap-3 border-b border-rule py-4 first:pt-0 last:border-b-0 last:pb-0">
                <SwitchRow
                  label={t(`settings.notify.${key}`)}
                  hint={t(`settings.notify.${key}Hint`)}
                  checked={draft.notify[key]}
                  onChange={(value) => update({ notify: { ...draft.notify, [key]: value } })}
                />
                {key === "digest" ? (
                  <div
                    className={cx(
                      "flex flex-wrap items-center gap-3 transition-opacity duration-200",
                      !draft.notify.digest && "opacity-60",
                    )}
                  >
                    <span className="text-[12.5px] font-medium text-ink-3">{t("settings.notify.digestTime")}</span>
                    <Segmented
                      label={t("settings.notify.digestTime")}
                      value={draft.digestTime}
                      disabled={!draft.notify.digest}
                      onChange={(digestTime) => update({ digestTime })}
                      options={digestTimes.map((value) => ({
                        value,
                        label: <span className="font-figures">{at(value)}</span>,
                      }))}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </Group>

        <Group index={4} id="settings-hours" title={t("settings.hours.title")} description={t("settings.hours.description")}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <span id="settings-days" className="text-[12.5px] font-medium text-ink-3">
                {t("settings.hours.days")}
              </span>
              <div role="group" aria-labelledby="settings-days" className="grid grid-cols-7 gap-1.5 sm:flex sm:flex-wrap">
                {weekDays.map((day, index) => {
                  const on = Boolean(draft.days[index]);
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={on}
                      aria-label={formatWeekday(day, language, "long")}
                      onClick={() => update({ days: draft.days.map((value, position) => (position === index ? !value : value)) })}
                      className={cx(
                        "grid h-11 min-w-0 place-items-center rounded-[11px] px-1 text-[13px] transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-14",
                        on
                          ? "bg-board font-medium text-board-ink shadow-press"
                          : "bg-sheet-raised text-ink-3 ring-1 ring-rule hover:text-ink hover:ring-rule-strong",
                      )}
                    >
                      {formatWeekday(day, language, "short")}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:max-w-[26rem]">
              <PaperSelect label={t("settings.hours.start")} value={draft.start} onChange={(event) => update({ start: event.target.value })}>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {at(slot)}
                  </option>
                ))}
              </PaperSelect>
              <PaperSelect
                label={t("settings.hours.end")}
                value={draft.end}
                onChange={(event) => update({ end: event.target.value })}
                aria-invalid={hoursInvalid || undefined}
              >
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {at(slot)}
                  </option>
                ))}
              </PaperSelect>
            </div>
            <p className={cx("text-[13.5px]", hoursInvalid ? "text-ruby-ink" : "text-ink-3")} aria-live="polite">
              {hoursInvalid
                ? t("settings.hours.invalid")
                : fill(t("settings.hours.summary"), {
                    days: draft.days.filter(Boolean).length,
                    start: at(draft.start),
                    end: at(draft.end),
                  })}
            </p>
          </div>
        </Group>

        <Group index={5} id="settings-privacy" title={t("settings.privacy.title")} description={t("settings.privacy.description")}>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-[14px] bg-sheet-sunk p-5 ring-1 ring-rule">
            <span className="grid size-11 place-items-center rounded-[12px] bg-moss-wash text-moss-ink">
              <Glyph name="shield" size={24} />
            </span>
            <div className="grid justify-items-start gap-2">
              <TabLabel tone="clay">{t("settings.privacy.sample")}</TabLabel>
              <p className="max-w-[58ch] text-[14.5px] leading-6 text-ink-2">{t("settings.privacy.body")}</p>
            </div>
          </div>
        </Group>
      </div>

      {dirty ? (
        <div className="sticky bottom-4 z-10 animate-rise" role="region" aria-label={t("settings.save.pending")}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-sheet-raised px-4 py-3 shadow-lift ring-1 ring-rule-strong sm:px-5">
            <p className="flex items-center gap-2.5 text-[14px] text-ink-2">
              <span aria-hidden="true" className="size-2 rounded-full bg-stamp" />
              {t("settings.save.pending")}
            </p>
            <div className="flex items-center gap-2">
              <Action
                variant="quiet"
                onClick={() => {
                  setDraft(saved);
                }}
              >
                {t("settings.save.discard")}
              </Action>
              <Action
                variant="ink"
                glyph="tick"
                disabled={hoursInvalid}
                onClick={() => {
                  setSaved(draft);
                  setJustSaved(true);
                }}
              >
                {t("settings.save.save")}
              </Action>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- pieces */

function Group({
  id,
  index,
  title,
  description,
  children,
}: {
  id: string;
  index: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="animate-settle grid gap-5 border-t border-rule py-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10"
      style={{ ["--i" as string]: index }}
    >
      <div className="grid content-start gap-1">
        <h2 id={id} className="font-display text-[19px] leading-7 text-ink">
          {title}
        </h2>
        <p className="max-w-[44ch] text-[13.5px] leading-5 text-ink-3">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  className,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div className={cx("grid gap-1.5", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        dir="auto"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={lineField}
        {...(autoComplete ? { autoComplete } : {})}
      />
    </div>
  );
}

function SwitchRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const labelId = useId();
  const hintId = useId();
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="grid min-w-0 gap-0.5">
        <span id={labelId} className="text-[15px] font-medium text-ink">
          {label}
        </span>
        <span id={hintId} className="text-[13px] leading-5 text-ink-3">
          {hint}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-[3px] transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          checked ? "bg-board shadow-press" : "bg-sheet-sunk ring-1 ring-rule-strong ring-inset hover:bg-rule",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "grid size-[22px] place-items-center rounded-full shadow-press transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            checked ? "translate-x-5 bg-sheet-raised text-moss-ink rtl:-translate-x-5" : "bg-sheet-raised text-transparent",
          )}
        >
          <svg viewBox="0 0 24 24" width={13} height={13} fill="none">
            <path d="M5 12.5l4.25 4L19 7" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}

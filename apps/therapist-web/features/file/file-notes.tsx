"use client";

import { useState } from "react";

import { Action, DateStamp, TabLabel, type Tone } from "@/components/case-file/primitives";
import { getNotes } from "@/lib/sample-data/fixtures";
import { formatDay, formatTime, SAMPLE_NOW } from "@/lib/sample-data/time";
import type { ChildFile, SessionNote } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const kindTone: Record<SessionNote["kind"], Tone> = { session: "ink", observation: "cobalt", plan: "moss" };

export function FileNotes({ child }: { child: ChildFile }) {
  const { language, t } = useLanguage();
  const [notes, setNotes] = useState<readonly SessionNote[]>(() => getNotes(child.id));
  const [text, setText] = useState("");
  const [filed, setFiled] = useState<string | null>(null);

  const file = () => {
    const body = text.trim();
    if (!body) return;
    const note: SessionNote = {
      id: `local-${notes.length}`,
      at: SAMPLE_NOW,
      kind: "observation",
      title: t("file.notes.quickTitle"),
      body,
    };
    setNotes((current) => [note, ...current]);
    setFiled(note.id);
    setText("");
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-3 rounded-[14px] bg-sheet p-4 ring-1 ring-rule focus-within:ring-pen">
        <label htmlFor="quick-note" className="text-[13px] font-medium text-ink-2">
          {t("file.notes.quickLabel")}
        </label>
        <textarea
          id="quick-note"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") file();
          }}
          rows={3}
          placeholder={t("file.notes.placeholder")}
          className="resize-none bg-transparent text-[15px] leading-6 text-ink outline-none placeholder:text-ink-3"
        />
        <div className="flex justify-end">
          <Action variant="ink" glyph="notes" disabled={!text.trim()} onClick={file}>
            {t("file.notes.file")}
          </Action>
        </div>
      </div>

      <ol className="grid">
        {notes.map((note) => (
          <li key={note.id} className="grid gap-2 border-b border-rule py-5 first:pt-0 last:border-b-0 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
            <p className="stamp pt-0.5 text-[11px] text-ink-3">
              {formatDay(note.at, language)} <span className="font-figures">{formatTime(note.at, language)}</span>
            </p>
            <div className="grid gap-2">
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-[15.5px] font-medium text-ink"><bdi>{note.title}</bdi></span>
                <TabLabel tone={kindTone[note.kind]}>{t(`file.notes.kind.${note.kind}`)}</TabLabel>
                {filed === note.id ? <DateStamp tone="pen">{t("file.notes.filed")}</DateStamp> : null}
              </p>
              <p className="max-w-[70ch] text-[14.5px] leading-6 text-ink-2"><bdi>{note.body}</bdi></p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

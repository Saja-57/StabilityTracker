import { Directory, File, Paths } from "expo-file-system";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { Platform } from "react-native";

import type {
  EventLogEntryViewModel,
  EventMediaAttachment,
} from "@/features/event-log";
import type {
  MessageReply,
  ParentMessageViewModel,
} from "@/features/messages/types";
import type { NotificationKey } from "@/features/profile/types";
import type { SurveyResponseMap } from "@/features/surveys/types";
import { sampleNotificationDefaults } from "@/lib/sample-more";
import { deviceStore, type KeyValueStore } from "@/lib/storage";

export interface RoutineCompletion {
  readonly by: string;
  readonly at: string;
}

export interface SurveySubmission {
  readonly submittedAt: string;
  readonly responses: SurveyResponseMap;
}

/** Everything the family has done in the app, as one saved record. */
interface FamilyRecord {
  readonly events: readonly EventLogEntryViewModel[];
  /** Per day; a day absent here still shows the schedule's own ticks. */
  readonly routine: Readonly<
    Record<string, Readonly<Record<string, RoutineCompletion>>>
  >;
  readonly readNoteIds: readonly string[];
  readonly acknowledgedNoteIds: readonly string[];
  readonly replies: Readonly<Record<string, readonly MessageReply[]>>;
  readonly surveys: Readonly<Record<string, SurveySubmission>>;
  readonly notifications: Readonly<Record<NotificationKey, boolean>>;
}

const emptyRecord: FamilyRecord = {
  events: [],
  routine: {},
  readNoteIds: [],
  acknowledgedNoteIds: [],
  replies: {},
  surveys: {},
  notifications: sampleNotificationDefaults,
};

const recordKey = "family";

interface FamilyStoreValue {
  readonly record: FamilyRecord;
  readonly addEvent: (entry: EventLogEntryViewModel) => void;
  readonly setRoutineDay: (
    date: string,
    completions: Readonly<Record<string, RoutineCompletion>>,
  ) => void;
  readonly markNoteRead: (id: string) => void;
  readonly acknowledgeNote: (id: string) => void;
  readonly replyToNote: (id: string, body: string) => void;
  readonly submitSurvey: (id: string, responses: SurveyResponseMap) => void;
  readonly setNotifications: (
    notifications: Readonly<Record<NotificationKey, boolean>>,
  ) => void;
}

const FamilyStoreContext = createContext<FamilyStoreValue | null>(null);

/**
 * Moves picked or recorded media out of the temporary cache, which iOS may
 * empty at any time, into the app's documents folder.
 */
function keepMedia(
  attachments: readonly EventMediaAttachment[],
): readonly EventMediaAttachment[] {
  if (Platform.OS === "web" || attachments.length === 0) return attachments;
  const folder = new Directory(Paths.document, "event-media");
  if (!folder.exists) folder.create({ intermediates: true, idempotent: true });
  return attachments.map((attachment) => {
    try {
      const source = new File(attachment.uri);
      const extension = source.extension || "";
      const kept = new File(folder, `${attachment.id}${extension}`);
      if (!kept.exists) source.copy(kept);
      return { ...attachment, uri: kept.uri };
    } catch {
      return attachment;
    }
  });
}

const addUnique = (list: readonly string[], id: string) =>
  list.includes(id) ? list : [...list, id];

export function FamilyStoreProvider({
  children,
  store = deviceStore,
}: PropsWithChildren<{ store?: KeyValueStore }>) {
  const [record, setRecord] = useState<FamilyRecord | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;
    void store.read<Partial<FamilyRecord>>(recordKey).then((saved) => {
      if (!active) return;
      loaded.current = true;
      setRecord({
        ...emptyRecord,
        ...saved,
        notifications: {
          ...emptyRecord.notifications,
          ...saved?.notifications,
        },
      });
    });
    return () => {
      active = false;
    };
  }, [store]);

  useEffect(() => {
    if (record && loaded.current) void store.write(recordKey, record);
  }, [record, store]);

  const update = useCallback(
    (change: (current: FamilyRecord) => FamilyRecord) =>
      setRecord((current) => (current ? change(current) : current)),
    [],
  );

  const value = useMemo<FamilyStoreValue | null>(
    () =>
      record && {
        record,
        addEvent: (entry) => {
          const media = entry.details?.media ?? [];
          const kept = {
            ...entry,
            ...(entry.details
              ? { details: { ...entry.details, media: keepMedia(media) } }
              : {}),
          };
          update((current) => ({
            ...current,
            events: [kept, ...current.events],
          }));
        },
        setRoutineDay: (date, completions) =>
          update((current) => ({
            ...current,
            routine: { ...current.routine, [date]: completions },
          })),
        markNoteRead: (id) =>
          update((current) => ({
            ...current,
            readNoteIds: addUnique(current.readNoteIds, id),
          })),
        acknowledgeNote: (id) =>
          update((current) => ({
            ...current,
            acknowledgedNoteIds: addUnique(current.acknowledgedNoteIds, id),
          })),
        replyToNote: (id, body) =>
          update((current) => {
            const thread = current.replies[id] ?? [];
            return {
              ...current,
              replies: {
                ...current.replies,
                [id]: [
                  ...thread,
                  { id: `${id}-reply-${thread.length + 1}`, body },
                ],
              },
            };
          }),
        submitSurvey: (id, responses) =>
          update((current) => ({
            ...current,
            surveys: {
              ...current.surveys,
              [id]: { submittedAt: new Date().toISOString(), responses },
            },
          })),
        setNotifications: (notifications) =>
          update((current) => ({ ...current, notifications })),
      },
    [record, update],
  );

  // Nothing renders until the saved record is back, so no screen flashes
  // the sample state and then jumps.
  if (!value) return null;

  return (
    <FamilyStoreContext.Provider value={value}>
      {children}
    </FamilyStoreContext.Provider>
  );
}

export function useFamilyStore(): FamilyStoreValue {
  const context = useContext(FamilyStoreContext);
  if (!context) {
    throw new Error("useFamilyStore must be used within FamilyStoreProvider.");
  }
  return context;
}

/** The therapist's notes, with the ones opened on this device marked read. */
export function useTherapistNotes(
  notes: readonly ParentMessageViewModel[],
): readonly ParentMessageViewModel[] {
  const { readNoteIds } = useFamilyStore().record;
  return useMemo(
    () =>
      notes.map((note) =>
        !note.isRead && readNoteIds.includes(note.id)
          ? { ...note, isRead: true }
          : note,
      ),
    [notes, readNoteIds],
  );
}

import { MessagesScreen } from "@/features/messages";
import { useFamilyContent } from "@/lib/use-family-content";
import {
  useFamilyStore,
  useTherapistNotes,
} from "@/providers/family-store-provider";

export default function MessagesRoute() {
  const { SAMPLE_TODAY, family, therapistNotes } = useFamilyContent();
  const { record, markNoteRead, acknowledgeNote, replyToNote } =
    useFamilyStore();
  const notes = useTherapistNotes(therapistNotes);
  return (
    <MessagesScreen
      state={{ status: "ready", messages: notes }}
      senderName={family.therapist.givenName}
      today={SAMPLE_TODAY}
      acknowledgedIds={record.acknowledgedNoteIds}
      replies={record.replies}
      onRead={markNoteRead}
      onAcknowledge={acknowledgeNote}
      onReply={replyToNote}
    />
  );
}

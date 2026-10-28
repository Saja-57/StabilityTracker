import { StyleSheet, View } from "react-native";

import { useLanguage } from "@/providers/language-provider";

import { eventSupportOptions } from "../options";
import type {
  EventLogDraft,
  EventLogDraftChange,
  EventSupport,
} from "../types";
import { ChoiceGroup, NoteField } from "./choice-group";
import { toggleIn } from "./event-context-section";
import { FormSection } from "./form-section";
import { MediaCaptureActions } from "./media-capture-actions";

/** Page four: what helped, in moss, plus the media that is still to come. */
export function EventResponseSection({
  draft,
  onChange,
  withMedia = true,
}: {
  draft: EventLogDraft;
  onChange: EventLogDraftChange;
  withMedia?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <View style={styles.page}>
      <FormSection
        title={t("logFlow.helped.question")}
        hint={t("logFlow.chooseAny")}
      >
        <ChoiceGroup<EventSupport>
          label={t("eventLog.sections.helped")}
          tone="moss"
          options={eventSupportOptions}
          selected={draft.supports}
          onToggle={(value) =>
            onChange("supports", toggleIn(draft.supports, value))
          }
        />
        <NoteField
          value={draft.helpedNote}
          onChange={(value) => onChange("helpedNote", value)}
          placeholderKey="eventLog.fields.helpedPlaceholder"
        />
      </FormSection>
      {withMedia ? (
        <MediaCaptureActions
          media={draft.media}
          onChange={(media) => onChange("media", media)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: 28 },
});

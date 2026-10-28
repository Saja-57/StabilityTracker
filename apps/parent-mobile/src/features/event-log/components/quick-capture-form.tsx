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
import { EventTypeSelector } from "./event-type-selector";
import { FlowActions } from "./flow-actions";
import { FormSection } from "./form-section";
import { IntensitySelector } from "./intensity-selector";
import { MediaCaptureActions } from "./media-capture-actions";
import { TimingSelector } from "./timing-selector";

/** Quick capture: the essentials on one page, every answer one tap. */
export function QuickCaptureForm({
  draft,
  onChange,
  onReview,
}: {
  draft: EventLogDraft;
  onChange: EventLogDraftChange;
  onReview: () => void;
}) {
  const { t } = useLanguage();
  return (
    <View style={styles.page}>
      <FormSection title={t("logFlow.basics.question")}>
        <EventTypeSelector
          value={draft.eventType}
          onChange={(value) => onChange("eventType", value)}
        />
      </FormSection>
      <FormSection
        title={t("logFlow.intensity.question")}
        hint={t("eventLog.intensity.description")}
      >
        <IntensitySelector
          value={draft.intensity}
          onChange={(value) => onChange("intensity", value)}
        />
      </FormSection>
      <FormSection title={t("logFlow.timing.question")}>
        <TimingSelector
          value={draft.timingMode}
          onChange={(value) => onChange("timingMode", value)}
        />
      </FormSection>
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
          value={draft.duringNote}
          onChange={(value) => onChange("duringNote", value)}
          placeholderKey="eventLog.fields.quickNotePlaceholder"
        />
      </FormSection>
      <MediaCaptureActions
        media={draft.media}
        onChange={(media) => onChange("media", media)}
      />
      <FlowActions
        nextLabel={t("eventLog.actions.review")}
        onNext={onReview}
        canContinue={draft.eventType !== null}
        hint={t("eventLog.validation.eventType")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: 28 },
});

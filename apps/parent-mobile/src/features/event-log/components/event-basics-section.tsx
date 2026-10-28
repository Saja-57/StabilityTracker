import { View, StyleSheet } from "react-native";

import { useLanguage } from "@/providers/language-provider";

import type { EventLogDraft, EventLogDraftChange } from "../types";
import { EventTypeSelector } from "./event-type-selector";
import { FormSection } from "./form-section";
import { IntensitySelector } from "./intensity-selector";
import { TimingSelector } from "./timing-selector";

/** Page one: what happened, how strong, and when. */
export function EventBasicsSection({
  draft,
  onChange,
}: {
  draft: EventLogDraft;
  onChange: EventLogDraftChange;
}) {
  const { t } = useLanguage();
  return (
    <View style={styles.page}>
      <FormSection
        title={t("logFlow.basics.question")}
        hint={t("eventLog.type.description")}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: 28 },
});

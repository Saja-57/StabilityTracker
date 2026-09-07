import { spacing } from "@stability/design-tokens";
import { Zap } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { TextArea } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { EventLogDraft, EventLogDraftChange } from "../types";
import { EventTypeSelector } from "./event-type-selector";
import { FormSection } from "./form-section";
import { IntensitySelector } from "./intensity-selector";
import { MediaCaptureActions } from "./media-capture-actions";
import { TimingSelector } from "./timing-selector";

export interface QuickCaptureFormProps {
  readonly draft: EventLogDraft;
  readonly eventTypeError?: string;
  readonly onChange: EventLogDraftChange;
}

const styles = StyleSheet.create({
  fields: {
    gap: spacing.lg,
  },
});

export function QuickCaptureForm({
  draft,
  eventTypeError,
  onChange,
}: QuickCaptureFormProps) {
  const { t } = useLanguage();

  return (
    <FormSection
      description={t("eventLog.quick.description")}
      icon={Zap}
      title={t("eventLog.quick.title")}
    >
      <View style={styles.fields}>
        <EventTypeSelector
          onChange={(value) => onChange("eventType", value)}
          value={draft.eventType}
          {...(eventTypeError ? { errorText: eventTypeError } : {})}
        />
        <TimingSelector
          onChange={(value) => onChange("timingMode", value)}
          value={draft.timingMode}
        />
        <IntensitySelector
          onChange={(value) => onChange("intensity", value)}
          value={draft.intensity}
        />
        <TextArea
          helperText={t("eventLog.fields.optional")}
          label={t("eventLog.fields.quickNote")}
          onChangeText={(value) => onChange("notes", value)}
          placeholder={t("eventLog.fields.quickNotePlaceholder")}
          value={draft.notes}
        />
        <MediaCaptureActions />
      </View>
    </FormSection>
  );
}

import { spacing } from "@stability/design-tokens";
import { ClipboardPenLine } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, TextInput } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { EventLogDraft, EventLogDraftChange } from "../types";
import { EventTypeSelector } from "./event-type-selector";
import { FormSection } from "./form-section";
import { IntensitySelector } from "./intensity-selector";
import { TimingSelector } from "./timing-selector";

export interface EventBasicsSectionProps {
  readonly draft: EventLogDraft;
  readonly eventTypeError?: string;
  readonly onChange: EventLogDraftChange;
}

const styles = StyleSheet.create({
  fields: {
    gap: spacing.lg,
  },
  reporter: {
    gap: spacing.xs,
  },
});

export function EventBasicsSection({
  draft,
  eventTypeError,
  onChange,
}: EventBasicsSectionProps) {
  const { t } = useLanguage();
  const optional = t("eventLog.fields.optional");

  return (
    <FormSection icon={ClipboardPenLine} title={t("eventLog.sections.basics")}>
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
        {draft.timingMode === "earlier" ? (
          <>
            <TextInput
              helperText={optional}
              label={t("eventLog.fields.date")}
              onChangeText={(value) => onChange("date", value)}
              placeholder={t("eventLog.fields.datePlaceholder")}
              value={draft.date}
            />
            <TextInput
              helperText={optional}
              label={t("eventLog.fields.time")}
              onChangeText={(value) => onChange("time", value)}
              placeholder={t("eventLog.fields.timePlaceholder")}
              value={draft.time}
            />
          </>
        ) : null}
        <IntensitySelector
          onChange={(value) => onChange("intensity", value)}
          value={draft.intensity}
        />
        <View style={styles.reporter}>
          <AppText variant="label">{t("eventLog.fields.reporter")}</AppText>
          <AppText color="muted" variant="helper">
            {t("eventLog.fields.reporterUnavailable")}
          </AppText>
        </View>
      </View>
    </FormSection>
  );
}

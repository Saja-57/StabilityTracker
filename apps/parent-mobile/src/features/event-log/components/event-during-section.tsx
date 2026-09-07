import { spacing } from "@stability/design-tokens";
import { Activity } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { TextArea, TextInput } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { EventLogDraft, EventLogDraftChange } from "../types";
import { FormSection } from "./form-section";

export interface EventDuringSectionProps {
  readonly draft: EventLogDraft;
  readonly onChange: EventLogDraftChange;
}

const styles = StyleSheet.create({
  fields: {
    gap: spacing.lg,
  },
});

export function EventDuringSection({
  draft,
  onChange,
}: EventDuringSectionProps) {
  const { t } = useLanguage();
  const completeLater = t("eventLog.fields.completeLater");

  return (
    <FormSection icon={Activity} title={t("eventLog.sections.during")}>
      <View style={styles.fields}>
        <TextArea
          helperText={completeLater}
          label={t("eventLog.fields.behavior")}
          onChangeText={(value) => onChange("behavior", value)}
          placeholder={t("eventLog.fields.behaviorPlaceholder")}
          value={draft.behavior}
        />
        <TextInput
          helperText={completeLater}
          label={t("eventLog.fields.duration")}
          onChangeText={(value) => onChange("duration", value)}
          placeholder={t("eventLog.fields.durationPlaceholder")}
          value={draft.duration}
        />
      </View>
    </FormSection>
  );
}

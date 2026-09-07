import { spacing } from "@stability/design-tokens";
import { Search } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { TextArea } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { EventLogDraft, EventLogDraftChange } from "../types";
import { FormSection } from "./form-section";

export interface EventContextSectionProps {
  readonly draft: EventLogDraft;
  readonly onChange: EventLogDraftChange;
}

const styles = StyleSheet.create({
  fields: {
    gap: spacing.lg,
  },
});

export function EventContextSection({
  draft,
  onChange,
}: EventContextSectionProps) {
  const { t } = useLanguage();
  const completeLater = t("eventLog.fields.completeLater");

  return (
    <FormSection icon={Search} title={t("eventLog.sections.before")}>
      <View style={styles.fields}>
        <TextArea
          helperText={completeLater}
          label={t("eventLog.fields.trigger")}
          onChangeText={(value) => onChange("trigger", value)}
          placeholder={t("eventLog.fields.triggerPlaceholder")}
          value={draft.trigger}
        />
        <TextArea
          helperText={completeLater}
          label={t("eventLog.fields.environment")}
          onChangeText={(value) => onChange("environment", value)}
          placeholder={t("eventLog.fields.environmentPlaceholder")}
          value={draft.environment}
        />
        <TextArea
          helperText={completeLater}
          label={t("eventLog.fields.before")}
          onChangeText={(value) => onChange("before", value)}
          placeholder={t("eventLog.fields.beforePlaceholder")}
          value={draft.before}
        />
      </View>
    </FormSection>
  );
}

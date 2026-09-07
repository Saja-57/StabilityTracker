import { spacing } from "@stability/design-tokens";
import { FileText, HeartHandshake } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { TextArea } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { EventLogDraft, EventLogDraftChange } from "../types";
import { FormSection } from "./form-section";
import { MediaCaptureActions } from "./media-capture-actions";

export interface EventResponseSectionProps {
  readonly draft: EventLogDraft;
  readonly onChange: EventLogDraftChange;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  fields: {
    gap: spacing.lg,
  },
});

export function EventResponseSection({
  draft,
  onChange,
}: EventResponseSectionProps) {
  const { t } = useLanguage();
  const completeLater = t("eventLog.fields.completeLater");

  return (
    <View style={styles.container}>
      <FormSection icon={HeartHandshake} title={t("eventLog.sections.helped")}>
        <View style={styles.fields}>
          <TextArea
            helperText={completeLater}
            label={t("eventLog.fields.helped")}
            onChangeText={(value) => onChange("helped", value)}
            placeholder={t("eventLog.fields.helpedPlaceholder")}
            value={draft.helped}
          />
          <TextArea
            helperText={completeLater}
            label={t("eventLog.fields.recovery")}
            onChangeText={(value) => onChange("recovery", value)}
            placeholder={t("eventLog.fields.recoveryPlaceholder")}
            value={draft.recovery}
          />
        </View>
      </FormSection>
      <FormSection icon={FileText} title={t("eventLog.sections.additional")}>
        <View style={styles.fields}>
          <TextArea
            helperText={completeLater}
            label={t("eventLog.fields.notes")}
            onChangeText={(value) => onChange("notes", value)}
            placeholder={t("eventLog.fields.notesPlaceholder")}
            value={draft.notes}
          />
          <MediaCaptureActions />
        </View>
      </FormSection>
    </View>
  );
}

import { StyleSheet, View } from "react-native";

import { Type } from "@/components/case-file/type";
import { useLanguage } from "@/providers/language-provider";
import { space } from "@/theme/case-file";

import { eventDurationOptions, eventSettingOptions } from "../options";
import type {
  EventDuration,
  EventLogDraft,
  EventLogDraftChange,
  EventSetting,
} from "../types";
import { ChoiceGroup, NoteField } from "./choice-group";
import { FormSection } from "./form-section";

/** Page three: where it was and how long it lasted. */
export function EventDuringSection({
  draft,
  onChange,
}: {
  draft: EventLogDraft;
  onChange: EventLogDraftChange;
}) {
  const { t } = useLanguage();
  return (
    <FormSection title={t("logFlow.during.question")}>
      <View style={styles.part}>
        <Type variant="label" color="secondary">
          {t("logFlow.during.where")}
        </Type>
        <ChoiceGroup<EventSetting>
          label={t("logFlow.during.where")}
          options={eventSettingOptions}
          selected={draft.setting}
          onToggle={(value) =>
            onChange("setting", draft.setting === value ? null : value)
          }
        />
      </View>
      <View style={styles.part}>
        <Type variant="label" color="secondary">
          {t("logFlow.during.howLong")}
        </Type>
        <ChoiceGroup<EventDuration>
          label={t("logFlow.during.howLong")}
          options={eventDurationOptions}
          selected={draft.duration}
          onToggle={(value) =>
            onChange("duration", draft.duration === value ? null : value)
          }
        />
      </View>
      <NoteField
        value={draft.duringNote}
        onChange={(value) => onChange("duringNote", value)}
        placeholderKey="eventLog.fields.behaviorPlaceholder"
      />
    </FormSection>
  );
}

const styles = StyleSheet.create({
  part: { gap: space.sm, marginBottom: space.sm },
});

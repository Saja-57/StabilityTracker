import { useLanguage } from "@/providers/language-provider";

import { eventTriggerOptions } from "../options";
import type {
  EventLogDraft,
  EventLogDraftChange,
  EventTrigger,
} from "../types";
import { ChoiceGroup, NoteField } from "./choice-group";
import { FormSection } from "./form-section";

export function toggleIn<TValue>(
  list: readonly TValue[],
  value: TValue,
): readonly TValue[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

/** Page two: what came just before. */
export function EventContextSection({
  draft,
  onChange,
}: {
  draft: EventLogDraft;
  onChange: EventLogDraftChange;
}) {
  const { t } = useLanguage();
  return (
    <FormSection
      title={t("logFlow.before.question")}
      hint={t("logFlow.chooseAny")}
    >
      <ChoiceGroup<EventTrigger>
        label={t("eventLog.sections.before")}
        options={eventTriggerOptions}
        selected={draft.triggers}
        onToggle={(value) =>
          onChange("triggers", toggleIn(draft.triggers, value))
        }
      />
      <NoteField
        value={draft.beforeNote}
        onChange={(value) => onChange("beforeNote", value)}
        placeholderKey="eventLog.fields.beforePlaceholder"
      />
    </FormSection>
  );
}

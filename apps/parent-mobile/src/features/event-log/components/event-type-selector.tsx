import { useLanguage } from "@/providers/language-provider";

import { eventTypeOptions } from "../options";
import type { EventType } from "../types";
import { ChoiceGroup } from "./choice-group";

export interface EventTypeSelectorProps {
  readonly errorText?: string;
  readonly onChange: (value: EventType) => void;
  readonly value: EventType | null;
}

export function EventTypeSelector({
  errorText,
  onChange,
  value,
}: EventTypeSelectorProps) {
  const { t } = useLanguage();

  return (
    <ChoiceGroup
      description={t("eventLog.type.description")}
      label={t("eventLog.type.title")}
      onSelect={onChange}
      options={eventTypeOptions}
      requiredLabel={t("common.required")}
      selectedValue={value}
      {...(errorText ? { errorText } : {})}
    />
  );
}

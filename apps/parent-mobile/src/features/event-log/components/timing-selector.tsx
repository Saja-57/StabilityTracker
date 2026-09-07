import { useLanguage } from "@/providers/language-provider";

import { eventTimingOptions } from "../options";
import type { EventTimingMode } from "../types";
import { ChoiceGroup } from "./choice-group";

export interface TimingSelectorProps {
  readonly onChange: (value: EventTimingMode) => void;
  readonly value: EventTimingMode | null;
}

export function TimingSelector({ onChange, value }: TimingSelectorProps) {
  const { t } = useLanguage();

  return (
    <ChoiceGroup
      compact
      label={t("eventLog.timing.title")}
      onSelect={onChange}
      options={eventTimingOptions}
      selectedValue={value}
    />
  );
}

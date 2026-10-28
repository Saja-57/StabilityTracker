import { useLanguage } from "@/providers/language-provider";

import { eventTimingOptions } from "../options";
import type { EventTimingMode } from "../types";
import { ChoiceGroup } from "./choice-group";

/** When it happened, as four calm chips. */
export function TimingSelector({
  value,
  onChange,
}: {
  value: EventTimingMode | null;
  onChange: (value: EventTimingMode) => void;
}) {
  const { t } = useLanguage();
  return (
    <ChoiceGroup
      label={t("eventLog.timing.title")}
      options={eventTimingOptions}
      selected={value}
      onToggle={onChange}
    />
  );
}

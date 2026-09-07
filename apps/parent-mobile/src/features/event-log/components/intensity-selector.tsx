import { useLanguage } from "@/providers/language-provider";

import { eventIntensityOptions } from "../options";
import type { EventIntensity } from "../types";
import { ChoiceGroup } from "./choice-group";

export interface IntensitySelectorProps {
  readonly onChange: (value: EventIntensity) => void;
  readonly value: EventIntensity | null;
}

export function IntensitySelector({ onChange, value }: IntensitySelectorProps) {
  const { t } = useLanguage();

  return (
    <ChoiceGroup
      compact
      description={t("eventLog.intensity.description")}
      label={t("eventLog.intensity.title")}
      onSelect={onChange}
      options={eventIntensityOptions}
      selectedValue={value}
    />
  );
}

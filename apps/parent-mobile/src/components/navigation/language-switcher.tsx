import {
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
  type SupportedLanguage,
} from "@stability/i18n";

import { SegmentedSwitch } from "@/features/more/components/segmented-switch";
import { useLanguage } from "@/providers/language-provider";

/**
 * English, עברית, العربية: each name is written in its own language and face,
 * so a parent can always find theirs, whatever the app is set to.
 */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const options = SUPPORTED_LANGUAGES.map((option: SupportedLanguage) => ({
    value: option,
    label: translate(option, getLanguageLabelKey(option)),
    language: option,
  }));

  return (
    <SegmentedSwitch
      accessibilityLabel={t("common.language")}
      options={options}
      value={language}
      onChange={setLanguage}
    />
  );
}

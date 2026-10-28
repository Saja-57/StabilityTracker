import { TabLabel } from "@/components/case-file/primitives";
import { useLanguage } from "@/providers/language-provider";

import {
  messageCategoryLabelKeys,
  messageCategoryTones,
} from "../message-options";
import type { MessageCategory } from "../types";

export interface MessageCategoryBadgeProps {
  readonly category: MessageCategory;
}

export function MessageCategoryBadge({ category }: MessageCategoryBadgeProps) {
  const { t } = useLanguage();

  return (
    <TabLabel
      tone={messageCategoryTones[category]}
      label={t(messageCategoryLabelKeys[category])}
    />
  );
}

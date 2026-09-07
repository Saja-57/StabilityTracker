import { Badge } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { messageCategoryLabelKeys } from "../message-options";
import type { MessageCategory } from "../types";

export interface MessageCategoryBadgeProps {
  readonly category: MessageCategory;
}

export function MessageCategoryBadge({ category }: MessageCategoryBadgeProps) {
  const { t } = useLanguage();

  return <Badge tone="brand">{t(messageCategoryLabelKeys[category])}</Badge>;
}

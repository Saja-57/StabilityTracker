import type { TranslationKey } from "@stability/i18n";

import type { MessageCategory } from "./types";

export const messageCategoryLabelKeys: Record<MessageCategory, TranslationKey> =
  {
    observation: "messages.category.observation",
    recommendation: "messages.category.recommendation",
    reminder: "messages.category.reminder",
    routineAdjustment: "messages.category.routineAdjustment",
  };

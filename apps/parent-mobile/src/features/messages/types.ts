import type { SupportedLanguage } from "@stability/i18n";

export type MessageCategory =
  "recommendation" | "observation" | "reminder" | "routineAdjustment";

export interface ParentMessageViewModel {
  readonly body: string;
  readonly category: MessageCategory;
  readonly contentLanguage?: SupportedLanguage;
  readonly id: string;
  readonly isImportant?: boolean;
  readonly isRead: boolean;
  readonly preview?: string;
  readonly senderDisplayName?: string;
  readonly sentAt?: string;
  readonly title: string;
}

export type MessageListState =
  | { readonly status: "empty" }
  | { readonly status: "loading" }
  | { readonly status: "error" }
  | {
      readonly messages: readonly ParentMessageViewModel[];
      readonly status: "ready";
    };

import { spacing } from "@stability/design-tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, ScreenContainer } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { MessageDetail } from "./components/message-detail";
import {
  MessagesEmptyState,
  MessagesErrorState,
  MessagesLoadingState,
} from "./components/message-feedback-states";
import { MessageList } from "./components/message-list";
import type { MessageListState, ParentMessageViewModel } from "./types";

export interface MessagesScreenProps {
  readonly onRetry?: () => void;
  readonly state?: MessageListState;
}

const emptyState: MessageListState = { status: "empty" };

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
});

export function MessagesScreen({
  onRetry,
  state = emptyState,
}: MessagesScreenProps) {
  const { t } = useLanguage();
  const [selectedMessage, setSelectedMessage] =
    useState<ParentMessageViewModel | null>(null);

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <View style={styles.header}>
        <AppText accessibilityRole="header" variant="pageTitle">
          {t("messages.title")}
        </AppText>
        <AppText color="secondary">{t("messages.subtitle")}</AppText>
      </View>
      {selectedMessage ? (
        <MessageDetail
          message={selectedMessage}
          onBack={() => setSelectedMessage(null)}
        />
      ) : state.status === "loading" ? (
        <MessagesLoadingState />
      ) : state.status === "error" ? (
        <MessagesErrorState {...(onRetry ? { onRetry } : {})} />
      ) : state.status === "ready" && state.messages.length > 0 ? (
        <MessageList messages={state.messages} onSelect={setSelectedMessage} />
      ) : (
        <MessagesEmptyState />
      )}
    </ScreenContainer>
  );
}

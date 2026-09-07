import { StyleSheet, View } from "react-native";
import { spacing } from "@stability/design-tokens";

import type { ParentMessageViewModel } from "../types";
import { MessageListItem } from "./message-list-item";

export interface MessageListProps {
  readonly messages: readonly ParentMessageViewModel[];
  readonly onSelect: (message: ParentMessageViewModel) => void;
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});

export function MessageList({ messages, onSelect }: MessageListProps) {
  return (
    <View accessibilityRole="list" style={styles.list}>
      {messages.map((message) => (
        <MessageListItem
          key={message.id}
          message={message}
          onPress={onSelect}
        />
      ))}
    </View>
  );
}

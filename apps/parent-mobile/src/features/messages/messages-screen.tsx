import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { ScreenContainer } from "@/components/ui";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { space } from "@/theme/case-file";

import { MessageDetail } from "./components/message-detail";
import {
  MessagesEmptyState,
  MessagesErrorState,
  MessagesLoadingState,
} from "./components/message-feedback-states";
import { MessageList } from "./components/message-list";
import type {
  MessageListState,
  MessageReply,
  ParentMessageViewModel,
} from "./types";

export interface MessagesScreenProps {
  readonly onRetry?: () => void;
  readonly state?: MessageListState;
  /** The therapist's short name for the header ("2 new notes from Lena"). */
  readonly senderName?: string;
  /** Today's date (YYYY-MM-DD); today's notes show a time instead of a day. */
  readonly today?: string;
  /** Override for "See in routine"; defaults to the Routine tab. */
  readonly onOpenRoutine?: () => void;
  readonly acknowledgedIds?: readonly string[];
  readonly replies?: Readonly<Record<string, readonly MessageReply[]>>;
  readonly onRead?: (id: string) => void;
  readonly onAcknowledge?: (id: string) => void;
  readonly onReply?: (id: string, body: string) => void;
}

const emptyState: MessageListState = { status: "empty" };

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

/** Notes from the therapist, held on the door. */
export function MessagesScreen({
  onRetry,
  state = emptyState,
  senderName,
  today,
  onOpenRoutine,
  acknowledgedIds = [],
  replies = {},
  onRead,
  onAcknowledge,
  onReply,
}: MessagesScreenProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set());

  const messages = useMemo<readonly ParentMessageViewModel[]>(
    () =>
      state.status === "ready"
        ? state.messages.map((message) =>
            readIds.has(message.id) && !message.isRead
              ? { ...message, isRead: true }
              : message,
          )
        : [],
    [readIds, state],
  );
  const selectedMessage =
    messages.find((message) => message.id === selectedId) ?? null;
  const unreadCount = messages.filter((message) => !message.isRead).length;
  const name = isolate(senderName ?? messages[0]?.senderDisplayName ?? "");

  const open = (message: ParentMessageViewModel) => {
    setReadIds((current) => new Set(current).add(message.id));
    onRead?.(message.id);
    setSelectedId(message.id);
  };

  const summary =
    unreadCount === 0
      ? fill(t("inbox.summary.none"), { name })
      : unreadCount === 1
        ? fill(t("inbox.summary.one"), { name })
        : fill(t("inbox.summary.many"), { count: unreadCount, name });

  if (selectedMessage) {
    const id = selectedMessage.id;
    return (
      <ScreenContainer
        key={`note-${id}`}
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
        <MessageDetail
          message={selectedMessage}
          acknowledged={acknowledgedIds.includes(id)}
          replies={replies[id] ?? []}
          {...(senderName ? { senderName } : {})}
          onBack={() => setSelectedId(null)}
          onAcknowledge={() => onAcknowledge?.(id)}
          onReply={(body) => onReply?.(id, body)}
          onOpenRoutine={onOpenRoutine ?? (() => router.push("/routine"))}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      key="notes"
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      <Animated.View entering={enter(0)} style={styles.header}>
        <Type variant="hero" accessibilityRole="header">
          {t("inbox.title")}
        </Type>
        {state.status === "ready" && messages.length > 0 ? (
          <Type
            variant="lede"
            color="secondary"
            accessibilityLiveRegion="polite"
          >
            {summary}
          </Type>
        ) : null}
      </Animated.View>
      {state.status === "loading" ? (
        <MessagesLoadingState />
      ) : state.status === "error" ? (
        <MessagesErrorState {...(onRetry ? { onRetry } : {})} />
      ) : messages.length > 0 ? (
        <MessageList
          messages={messages}
          onSelect={open}
          {...(today ? { today } : {})}
        />
      ) : (
        <Animated.View entering={enter(1)}>
          <MessagesEmptyState />
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.md },
});

import { StyleSheet, View } from "react-native";

import {
  Magnet,
  Paper,
  PressCard,
  Row,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { elevation, ink, space } from "@/theme/case-file";

import { formatNoteWhen, messageCategoryLabelKeys } from "../message-options";
import type { ParentMessageViewModel } from "../types";
import { MessageCategoryBadge } from "./message-category-badge";

export interface MessageListItemProps {
  readonly message: ParentMessageViewModel;
  readonly onPress: (message: ParentMessageViewModel) => void;
  /** Slight hand-placed tilt for slips held on the door, in degrees. */
  readonly tilt?: number;
  readonly today?: string;
}

/**
 * A therapist note as a paper slip. Unread slips are held by the pressboard
 * magnet with a gold dot; read slips lie flat.
 */
export function MessageListItem({
  message,
  onPress,
  tilt = 0,
  today,
}: MessageListItemProps) {
  const { language, t } = useLanguage();
  const unread = !message.isRead;
  const when = formatNoteWhen(
    message.sentAt,
    today,
    language,
    t("common.yesterday"),
  );
  const accessibilityLabel = [
    message.title,
    t(messageCategoryLabelKeys[message.category]),
    t(unread ? "messages.status.unread" : "messages.status.read"),
    when,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <PressCard
      accessibilityHint={t("inbox.open.hint")}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={() => onPress(message)}
      style={unread ? styles.held : null}
    >
      <View style={tilt ? { transform: [{ rotate: `${tilt}deg` }] } : null}>
        {unread ? (
          <View style={styles.magnetPin}>
            <Magnet unread />
          </View>
        ) : null}
        <Paper
          style={[styles.slip, unread ? styles.slipUnread : styles.slipRead]}
        >
          <Type
            variant={unread ? "title" : "headline"}
            {...(message.contentLanguage
              ? { language: message.contentLanguage }
              : {})}
          >
            {isolate(message.title)}
          </Type>
          <Row gap={space.sm}>
            <MessageCategoryBadge category={message.category} />
            {when ? (
              <Type variant="caption" color="muted" style={styles.when}>
                {when}
              </Type>
            ) : null}
          </Row>
          {message.preview ? (
            <Type
              variant="body"
              color="secondary"
              numberOfLines={unread ? 3 : 2}
              {...(message.contentLanguage
                ? { language: message.contentLanguage }
                : {})}
            >
              {isolate(message.preview)}
            </Type>
          ) : null}
          {unread && message.senderDisplayName ? (
            <Row style={styles.between}>
              <Type
                variant="small"
                color="muted"
                style={styles.flex}
                numberOfLines={1}
              >
                {isolate(message.senderDisplayName)}
              </Type>
              <Glyph name="chevron" color={ink.primary} size={18} />
            </Row>
          ) : null}
        </Paper>
      </View>
    </PressCard>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  between: { justifyContent: "space-between" },
  held: { paddingTop: 12 },
  magnetPin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 2,
  },
  slip: { borderRadius: 6, gap: 10, padding: 20 },
  slipUnread: { paddingTop: 24, ...elevation.lift },
  slipRead: { gap: space.sm, paddingVertical: 16 },
  when: { fontVariant: ["tabular-nums"] },
});

import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import {
  Action,
  Magnet,
  Paper,
  PenMark,
  Row,
  Stamp,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { fill, isolate } from "@/lib/format";
import { formatStampDate, formatTime } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { cf, elevation, ink, space, surface } from "@/theme/case-file";

import { toParagraphs } from "../message-options";
import type { MessageReply, ParentMessageViewModel } from "../types";
import { MessageCategoryBadge } from "./message-category-badge";
import { ReplyComposer } from "./reply-composer";

export interface MessageDetailProps {
  readonly acknowledged?: boolean;
  readonly message: ParentMessageViewModel;
  readonly onAcknowledge?: () => void;
  readonly onBack: () => void;
  readonly onOpenRoutine?: () => void;
  readonly onReply?: (body: string) => void;
  readonly replies?: readonly MessageReply[];
  /** The sender's short name, for "Reply to Lena". */
  readonly senderName?: string;
}

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(40 + index * 70)
    .easing(paperEase);

/** The full note as one large paper sheet, with a quick thanks and a reply. */
export function MessageDetail({
  acknowledged = false,
  message,
  onAcknowledge,
  onBack,
  onOpenRoutine,
  onReply,
  replies = [],
  senderName,
}: MessageDetailProps) {
  const { language, t } = useLanguage();
  const [composing, setComposing] = useState(false);
  const contentLanguage = message.contentLanguage
    ? { language: message.contentLanguage }
    : {};
  const sender = message.senderDisplayName ?? senderName ?? "";
  const shortName = isolate(senderName ?? message.senderDisplayName ?? "");
  const initial = (senderName ?? message.senderDisplayName ?? "")
    .replace(/^Dr\.?\s+/u, "")
    .slice(0, 1);

  return (
    <View style={styles.root}>
      <Animated.View entering={enter(0)}>
        <Pressable
          accessibilityLabel={t("inbox.back")}
          accessibilityRole="button"
          hitSlop={6}
          onPress={onBack}
          style={styles.backWrap}
        >
          <Row gap={space.md}>
            <View style={styles.backButton}>
              <Glyph name="arrowBack" color={ink.primary} size={20} />
            </View>
            <Type variant="label" color="secondary">
              {t("inbox.back")}
            </Type>
          </Row>
        </Pressable>
      </Animated.View>

      <Animated.View entering={enter(1)} style={styles.held}>
        <View style={styles.magnetPin}>
          <Magnet />
        </View>
        <Paper style={styles.sheet}>
          <Type
            variant="display"
            accessibilityRole="header"
            {...contentLanguage}
          >
            {isolate(message.title)}
          </Type>

          <Row style={styles.between}>
            <MessageCategoryBadge category={message.category} />
            {message.sentAt ? (
              <Stamp
                label={formatStampDate(message.sentAt, language)}
                tilt={-3}
              />
            ) : null}
          </Row>

          {sender ? (
            <Row gap={space.md}>
              <View style={styles.monogram}>
                <Type variant="label" style={styles.monogramInk}>
                  {initial}
                </Type>
              </View>
              <View style={styles.flex}>
                <Type variant="label">
                  {fill(t("inbox.from"), { name: isolate(sender) })}
                </Type>
                {message.sentAt ? (
                  <Type variant="figure" color="muted" style={styles.small}>
                    {formatTime(message.sentAt, language)}
                  </Type>
                ) : null}
              </View>
            </Row>
          ) : null}

          <View style={styles.rule} />

          <View style={styles.body}>
            {toParagraphs(message.body).map((paragraph, index) => (
              <Type
                key={index}
                variant="lede"
                style={styles.paragraph}
                {...contentLanguage}
              >
                {isolate(paragraph)}
              </Type>
            ))}
          </View>

          {acknowledged ? (
            <Animated.View entering={FadeIn.duration(260)}>
              <Row gap={space.md} style={styles.ackRow}>
                <Stamp label={t("inbox.ack.sent")} tone="moss" tilt={-4} />
                <Type variant="small" color="muted" style={styles.flex}>
                  {fill(t("inbox.ack.detail"), { name: shortName })}
                </Type>
              </Row>
            </Animated.View>
          ) : null}
        </Paper>
      </Animated.View>

      <Animated.View entering={enter(2)} style={styles.actions}>
        <Row gap={space.sm}>
          {!acknowledged && onAcknowledge ? (
            <View style={styles.flex}>
              <Action
                label={t("inbox.ack.action")}
                glyph="tick"
                variant="ink"
                size="large"
                onPress={onAcknowledge}
              />
            </View>
          ) : null}
          {onReply ? (
            <View style={acknowledged || !onAcknowledge ? styles.flex : null}>
              <Action
                label={t("inbox.reply.action")}
                glyph="send"
                variant="outline"
                size="large"
                onPress={() => setComposing(true)}
              />
            </View>
          ) : null}
        </Row>
        {message.category === "routineAdjustment" && onOpenRoutine ? (
          <Action
            label={t("inbox.routine.action")}
            glyph="routine"
            trailingGlyph="chevron"
            variant="outline"
            size="large"
            onPress={onOpenRoutine}
          />
        ) : null}
      </Animated.View>

      {replies.length > 0 ? (
        <Animated.View
          layout={LinearTransition.duration(380).easing(paperEase)}
          style={styles.replies}
        >
          {replies.map((reply) => (
            <Animated.View
              key={reply.id}
              entering={FadeInDown.duration(480).easing(paperEase)}
              layout={LinearTransition.duration(380).easing(paperEase)}
            >
              <Paper tone="sunk" style={styles.reply}>
                <Row style={styles.between}>
                  <Row gap={space.sm}>
                    <View style={styles.familyDot} />
                    <Type variant="label" color="secondary">
                      {t("inbox.reply.you")}
                    </Type>
                    <Type variant="caption" color="muted">
                      {t("inbox.reply.justNow")}
                    </Type>
                  </Row>
                  <Row gap={4}>
                    <PenMark visible size={20} />
                    <Type variant="caption" color="pen">
                      {t("inbox.reply.sent")}
                    </Type>
                  </Row>
                </Row>
                <Type variant="body" color="secondary">
                  {isolate(reply.body)}
                </Type>
              </Paper>
            </Animated.View>
          ))}
        </Animated.View>
      ) : null}

      {onReply ? (
        <ReplyComposer
          visible={composing}
          recipientName={shortName}
          onClose={() => setComposing(false)}
          onSend={(body) => {
            onReply(body);
            setComposing(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 28 },
  flex: { flex: 1 },
  between: { justifyContent: "space-between" },
  small: { fontSize: 13 },
  backWrap: { alignSelf: "flex-start" },
  backButton: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  held: { paddingTop: 12 },
  magnetPin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 2,
  },
  sheet: {
    borderRadius: 8,
    gap: 18,
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 30,
    ...elevation.lift,
  },
  monogram: {
    alignItems: "center",
    backgroundColor: cf.pressboard.base,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  monogramInk: { color: cf.pressboard.ink },
  rule: { backgroundColor: surface.rule, height: 1 },
  body: { gap: space.lg },
  paragraph: { fontSize: 18, lineHeight: 28 },
  ackRow: { paddingTop: space.xs },
  actions: { gap: space.sm },
  replies: { gap: space.md, paddingStart: 28 },
  reply: {
    borderRadius: 6,
    gap: space.sm,
    padding: 16,
    borderColor: surface.rule,
    borderWidth: 1,
  },
  familyDot: { backgroundColor: cf.pen, borderRadius: 4, height: 8, width: 8 },
});

import { colors, radius, spacing } from "@stability/design-tokens";
import { Circle, MessageSquareText, TriangleAlert } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  Badge,
  Card,
  getIconSize,
  iconStrokeWidth,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import { messageCategoryLabelKeys } from "../message-options";
import type { ParentMessageViewModel } from "../types";
import { MessageCategoryBadge } from "./message-category-badge";

export interface MessageListItemProps {
  readonly message: ParentMessageViewModel;
  readonly onPress: (message: ParentMessageViewModel) => void;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.72,
  },
  card: {
    gap: spacing.md,
  },
  header: {
    alignItems: "flex-start",
    gap: spacing.md,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.brand.subtle,
    borderRadius: radius.small,
    height: spacing.xxxl,
    justifyContent: "center",
    width: spacing.xxxl,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  metadata: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});

export function MessageListItem({ message, onPress }: MessageListItemProps) {
  const { language, t } = useLanguage();
  const categoryLabel = t(messageCategoryLabelKeys[message.category]);
  const readLabel = t(
    message.isRead ? "messages.status.read" : "messages.status.unread",
  );
  const accessibilityLabel = [message.title, categoryLabel, readLabel]
    .filter(Boolean)
    .join(". ");

  return (
    <Pressable
      accessibilityHint={t("messages.actions.open")}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={() => onPress(message)}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <Card style={styles.card} variant="interactive">
        <View style={[styles.header, getDirectionalRowStyle(language)]}>
          <View style={styles.icon}>
            <MessageSquareText
              color={colors.brand.primary}
              size={getIconSize("medium")}
              strokeWidth={iconStrokeWidth}
            />
          </View>
          <View style={styles.content}>
            <AppText
              {...(message.contentLanguage
                ? { language: message.contentLanguage }
                : {})}
              variant={message.isRead ? "bodyStrong" : "cardTitle"}
            >
              {message.title}
            </AppText>
            {message.preview ? (
              <AppText
                color="secondary"
                {...(message.contentLanguage
                  ? { language: message.contentLanguage }
                  : {})}
                numberOfLines={2}
              >
                {message.preview}
              </AppText>
            ) : null}
          </View>
        </View>
        <View style={[styles.metadata, getDirectionalRowStyle(language)]}>
          <MessageCategoryBadge category={message.category} />
          <Badge icon={Circle} tone={message.isRead ? "neutral" : "brand"}>
            {readLabel}
          </Badge>
          {message.isImportant ? (
            <Badge icon={TriangleAlert} tone="warning">
              {t("messages.status.important")}
            </Badge>
          ) : null}
          {message.sentAt ? (
            <AppText color="muted" variant="caption">
              {message.sentAt}
            </AppText>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}

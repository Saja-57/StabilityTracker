import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { AppText, Button, Card, Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { ParentMessageViewModel } from "../types";
import { MessageCategoryBadge } from "./message-category-badge";

export interface MessageDetailProps {
  readonly message: ParentMessageViewModel;
  readonly onBack: () => void;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  metadata: {
    gap: spacing.md,
  },
  metadataItem: {
    gap: spacing.xs,
  },
});

export function MessageDetail({ message, onBack }: MessageDetailProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText accessibilityRole="header" variant="sectionTitle">
          {t("messages.detail.title")}
        </AppText>
        <MessageCategoryBadge category={message.category} />
      </View>
      <Card style={styles.container}>
        <AppText
          accessibilityRole="header"
          {...(message.contentLanguage
            ? { language: message.contentLanguage }
            : {})}
          variant="cardTitle"
        >
          {message.title}
        </AppText>
        <Divider />
        <AppText
          {...(message.contentLanguage
            ? { language: message.contentLanguage }
            : {})}
        >
          {message.body}
        </AppText>
        {message.senderDisplayName || message.sentAt ? (
          <>
            <Divider />
            <View style={styles.metadata}>
              {message.senderDisplayName ? (
                <View style={styles.metadataItem}>
                  <AppText color="muted" variant="caption">
                    {t("messages.detail.from")}
                  </AppText>
                  <AppText
                    {...(message.contentLanguage
                      ? { language: message.contentLanguage }
                      : {})}
                  >
                    {message.senderDisplayName}
                  </AppText>
                </View>
              ) : null}
              {message.sentAt ? (
                <View style={styles.metadataItem}>
                  <AppText color="muted" variant="caption">
                    {t("messages.detail.sentAt")}
                  </AppText>
                  <AppText>{message.sentAt}</AppText>
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </Card>
      <Button
        accessibilityLabel={t("messages.actions.back")}
        fullWidth
        onPress={onBack}
        variant="secondary"
      >
        {t("messages.actions.back")}
      </Button>
    </View>
  );
}

import { spacing } from "@stability/design-tokens";
import { Inbox } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card, EmptyState, ErrorState, Skeleton } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

const styles = StyleSheet.create({
  loading: {
    gap: spacing.md,
  },
  skeletonCard: {
    gap: spacing.md,
  },
});

function MessageSkeleton() {
  return (
    <Card style={styles.skeletonCard}>
      <Skeleton height={spacing.lg} width="58%" />
      <Skeleton height={spacing.md} />
      <Skeleton height={spacing.md} width="42%" />
    </Card>
  );
}

export function MessagesEmptyState() {
  const { t } = useLanguage();

  return (
    <EmptyState
      description={t("messages.empty.description")}
      icon={Inbox}
      title={t("messages.empty.title")}
    />
  );
}

export function MessagesLoadingState() {
  const { t } = useLanguage();

  return (
    <View
      accessibilityLabel={t("messages.loading")}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.loading}
    >
      <MessageSkeleton />
      <MessageSkeleton />
    </View>
  );
}

export function MessagesErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLanguage();

  return (
    <ErrorState
      description={t("messages.error.description")}
      {...(onRetry ? { onRetry, retryLabel: t("messages.retry") } : {})}
      title={t("messages.error.title")}
    />
  );
}

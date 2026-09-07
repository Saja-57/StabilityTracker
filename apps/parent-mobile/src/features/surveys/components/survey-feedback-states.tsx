import { spacing } from "@stability/design-tokens";
import { ClipboardList } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card, EmptyState, ErrorState, Skeleton } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

const styles = StyleSheet.create({
  loading: {
    gap: spacing.md,
  },
  skeletonCard: {
    gap: spacing.lg,
  },
});

export function SurveyEmptyState() {
  const { t } = useLanguage();

  return (
    <EmptyState
      description={t("surveys.empty.description")}
      icon={ClipboardList}
      title={t("surveys.empty.title")}
    />
  );
}

export function SurveyLoadingState() {
  const { t } = useLanguage();

  return (
    <View
      accessibilityLabel={t("surveys.loading")}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.loading}
    >
      <Skeleton height={spacing.lg} width="46%" />
      <Card style={styles.skeletonCard}>
        <Skeleton height={spacing.lg} width="72%" />
        <Skeleton height={spacing.huge} />
        <Skeleton height={spacing.huge} />
      </Card>
    </View>
  );
}

export function SurveyErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLanguage();

  return (
    <ErrorState
      description={t("surveys.error.description")}
      {...(onRetry ? { onRetry, retryLabel: t("surveys.retry") } : {})}
      title={t("surveys.error.title")}
    />
  );
}

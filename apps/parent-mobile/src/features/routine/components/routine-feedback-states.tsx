import { radius, spacing } from "@stability/design-tokens";
import { ListChecks } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card, EmptyState, ErrorState, Skeleton } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export function RoutineEmptyState() {
  const { t } = useLanguage();

  return (
    <EmptyState
      description={t("routine.empty.description")}
      icon={ListChecks}
      title={t("routine.empty.title")}
    />
  );
}

export interface RoutineErrorStateProps {
  readonly onRetry: () => void;
}

export function RoutineErrorState({ onRetry }: RoutineErrorStateProps) {
  const { t } = useLanguage();

  return (
    <ErrorState
      description={t("routine.error.description")}
      onRetry={onRetry}
      retryLabel={t("routine.retry")}
      title={t("routine.error.title")}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  card: {
    borderRadius: radius.medium,
    gap: spacing.md,
    padding: spacing.lg,
  },
  row: {
    gap: spacing.sm,
  },
});

export function RoutineLoadingState() {
  const { t } = useLanguage();

  return (
    <View
      accessibilityLabel={t("routine.loading")}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={styles.container}
    >
      <Card style={styles.card}>
        <Skeleton height={spacing.lg} width="44%" />
        <Skeleton height={spacing.xl} />
        <Skeleton height={spacing.md} width="72%" />
      </Card>
      <Card style={styles.card}>
        <Skeleton height={spacing.lg} width="52%" />
        <Skeleton height={spacing.sm} />
        <Skeleton height={spacing.md} width="64%" />
      </Card>
      <View style={styles.row}>
        <Skeleton height={spacing.huge} />
        <Skeleton height={spacing.huge} />
      </View>
    </View>
  );
}

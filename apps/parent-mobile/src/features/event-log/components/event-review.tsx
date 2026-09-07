import { spacing } from "@stability/design-tokens";
import type { TranslationKey } from "@stability/i18n";
import { ClipboardCheck } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, Button, Card, Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import {
  eventIntensityLabelKeys,
  eventTimingLabelKeys,
  eventTypeLabelKeys,
} from "../options";
import type { EventLogDraft } from "../types";
import { FormSection } from "./form-section";

export interface EventReviewProps {
  readonly draft: EventLogDraft;
  readonly onBack: () => void;
}

interface ReviewItem {
  readonly labelKey: TranslationKey;
  readonly value: string;
}

const styles = StyleSheet.create({
  rows: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
  },
  centered: {
    textAlign: "center",
  },
});

export function EventReview({ draft, onBack }: EventReviewProps) {
  const { t } = useLanguage();
  const items: ReviewItem[] = [];

  if (draft.eventType) {
    items.push({
      labelKey: "eventLog.type.title",
      value: t(eventTypeLabelKeys[draft.eventType]),
    });
  }
  if (draft.timingMode) {
    items.push({
      labelKey: "eventLog.timing.title",
      value: t(eventTimingLabelKeys[draft.timingMode]),
    });
  }
  if (draft.date.trim()) {
    items.push({ labelKey: "eventLog.fields.date", value: draft.date.trim() });
  }
  if (draft.time.trim()) {
    items.push({ labelKey: "eventLog.fields.time", value: draft.time.trim() });
  }
  if (draft.intensity) {
    items.push({
      labelKey: "eventLog.intensity.title",
      value: t(eventIntensityLabelKeys[draft.intensity]),
    });
  }

  const textItems = [
    ["eventLog.fields.trigger", draft.trigger],
    ["eventLog.fields.environment", draft.environment],
    ["eventLog.fields.before", draft.before],
    ["eventLog.fields.behavior", draft.behavior],
    ["eventLog.fields.duration", draft.duration],
    ["eventLog.fields.helped", draft.helped],
    ["eventLog.fields.recovery", draft.recovery],
    ["eventLog.fields.notes", draft.notes],
  ] as const satisfies readonly (readonly [TranslationKey, string])[];

  for (const [labelKey, value] of textItems) {
    if (value.trim()) {
      items.push({ labelKey, value: value.trim() });
    }
  }

  return (
    <View style={styles.actions}>
      <FormSection
        description={t("eventLog.review.description")}
        icon={ClipboardCheck}
        title={t("eventLog.review.title")}
      >
        <View style={styles.rows}>
          {items.map((item, index) => (
            <View key={item.labelKey} style={styles.row}>
              <AppText color="muted" variant="caption">
                {t(item.labelKey)}
              </AppText>
              <AppText>{item.value}</AppText>
              {index < items.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </View>
      </FormSection>
      <Card style={styles.actions} variant="subtle">
        <Button
          accessibilityLabel={t("eventLog.actions.saveUnavailable")}
          disabled
          fullWidth
        >
          {t("eventLog.actions.saveUnavailable")}
        </Button>
        <AppText color="muted" style={styles.centered} variant="helper">
          {t("eventLog.actions.saveUnavailableDescription")}
        </AppText>
      </Card>
      <Button
        accessibilityLabel={t("eventLog.actions.back")}
        fullWidth
        onPress={onBack}
        variant="ghost"
      >
        {t("eventLog.actions.back")}
      </Button>
    </View>
  );
}

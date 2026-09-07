import { spacing } from "@stability/design-tokens";
import {
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
} from "@stability/i18n";
import { Check, Inbox, Info } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  Badge,
  BrandLogo,
  Button,
  Card,
  Divider,
  EmptyState,
  ErrorState,
  IconButton,
  LoadingIndicator,
  Progress,
  ScreenContainer,
  SectionHeader,
  Skeleton,
  StatusBadge,
  TextArea,
  TextInput,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

const styles = StyleSheet.create({
  brandRow: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  buttonRow: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  cardContent: {
    gap: spacing.md,
  },
  languageRow: {
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  previewHeader: {
    gap: spacing.sm,
  },
  section: {
    gap: spacing.lg,
  },
  skeletonGroup: {
    flex: 1,
    gap: spacing.sm,
  },
  statusRow: {
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});

export function DesignSystemPreviewScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const directionalRow = getDirectionalRowStyle(language);

  return (
    <ScreenContainer>
      <View style={styles.previewHeader}>
        <AppText variant="pageTitle">{t("preview.title")}</AppText>
        <AppText color="secondary">{t("preview.description")}</AppText>
      </View>

      <View
        accessibilityLabel={t("common.language")}
        accessibilityRole="toolbar"
        style={[styles.languageRow, directionalRow]}
      >
        {SUPPORTED_LANGUAGES.map((option) => (
          <Button
            key={option}
            language={option}
            onPress={() => setLanguage(option)}
            size="small"
            variant={language === option ? "primary" : "secondary"}
          >
            {translate(option, getLanguageLabelKey(option))}
          </Button>
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title={t("brand.title")} />
        <Card style={styles.cardContent}>
          <AppText variant="cardTitle">{t("brand.title")}</AppText>
          <AppText color="secondary">{t("brand.description")}</AppText>
          <View style={[styles.brandRow, directionalRow]}>
            <BrandLogo size="medium" variant="horizontal" />
          </View>
          <View style={[styles.brandRow, directionalRow]}>
            <BrandLogo size="medium" variant="mark" />
            <BrandLogo size="medium" variant="appIcon" />
            <BrandLogo size="small" variant="stacked" />
          </View>
        </Card>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title={t("preview.typography")} />
        <Card style={styles.cardContent}>
          <AppText variant="cardTitle">{t("preview.mixedLanguage")}</AppText>
          {SUPPORTED_LANGUAGES.map((option) => (
            <AppText key={option} language={option} variant="sectionTitle">
              {translate(option, getLanguageLabelKey(option))}
            </AppText>
          ))}
          <AppText color="secondary">{t("preview.description")}</AppText>
          <AppText color="muted" variant="caption">
            {t("bootstrap.ready")}
          </AppText>
        </Card>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title={t("preview.actions")} />
        <Card style={styles.cardContent}>
          <View style={[styles.buttonRow, directionalRow]}>
            <Button icon={Check}>{t("common.save")}</Button>
            <Button variant="secondary">{t("common.cancel")}</Button>
            <Button variant="ghost">{t("common.continue")}</Button>
            <Button variant="danger">{t("common.retry")}</Button>
            <Button loading>{t("common.loading")}</Button>
            <Button disabled>{t("common.continue")}</Button>
            <IconButton accessibilityLabel={t("preview.tooltip")} icon={Info} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t("preview.formControls")} />
        <Card style={styles.cardContent}>
          <TextInput
            helperText={t("preview.input.helper")}
            label={t("preview.input.label")}
            onChangeText={setInputValue}
            placeholder={t("preview.input.placeholder")}
            required
            requiredLabel={t("common.required")}
            value={inputValue}
          />
          <TextArea
            errorText={t("states.error.description")}
            label={t("preview.textarea.label")}
            onChangeText={setTextAreaValue}
            placeholder={t("preview.textarea.placeholder")}
            value={textAreaValue}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t("preview.status")} />
        <Card style={styles.cardContent}>
          <View style={[styles.statusRow, directionalRow]}>
            <Badge>{t("preview.badge.neutral")}</Badge>
            <StatusBadge tone="success">{t("status.success")}</StatusBadge>
            <StatusBadge tone="warning">{t("status.warning")}</StatusBadge>
            <StatusBadge tone="danger">{t("status.danger")}</StatusBadge>
            <StatusBadge tone="info">{t("status.info")}</StatusBadge>
          </View>
          <AppText variant="label">{t("preview.progress.label")}</AppText>
          <Progress
            accessibilityLabel={t("preview.progress.label")}
            value={64}
          />
          <View style={[styles.buttonRow, directionalRow]}>
            <LoadingIndicator accessibilityLabel={t("common.loading")} />
            <View style={styles.skeletonGroup}>
              <Skeleton width="72%" />
              <Skeleton width="48%" />
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t("preview.feedback")} />
        <EmptyState
          action={<Button variant="secondary">{t("common.continue")}</Button>}
          description={t("states.empty.description")}
          icon={Inbox}
          title={t("states.empty.title")}
        />
        <ErrorState
          description={t("states.error.description")}
          onRetry={() => undefined}
          retryLabel={t("common.retry")}
          title={t("states.error.title")}
        />
      </View>
    </ScreenContainer>
  );
}

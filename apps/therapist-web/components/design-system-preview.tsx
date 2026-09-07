"use client";

import {
  getDirection,
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
} from "@stability/i18n";
import {
  Check,
  Info,
  Inbox,
  Layers,
  MoreHorizontal,
  SquareMousePointer,
} from "lucide-react";
import { useState } from "react";

import {
  Badge,
  BrandLogo,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  EmptyState,
  ErrorState,
  IconButton,
  PageHeader,
  Progress,
  SectionHeader,
  Select,
  Skeleton,
  Spinner,
  StatusBadge,
  Switch,
  Tabs,
  Text,
  TextArea,
  TextInput,
  Tooltip,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export function DesignSystemPreview() {
  const { direction, language, setLanguage, t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);

  const languageOptions = SUPPORTED_LANGUAGES.map((option) => ({
    value: option,
    label: translate(option, getLanguageLabelKey(option)),
    language: option,
  }));

  return (
    <main
      lang={language}
      dir={direction}
      className="min-h-dvh bg-[var(--color-background-canvas)] px-4 py-8 text-start text-[var(--color-text-primary)] sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="mx-auto grid w-full max-w-[var(--content-wide)] gap-10">
        <PageHeader
          title={t("preview.title")}
          description={t("preview.description")}
          actions={
            <div
              role="group"
              aria-label={t("common.language")}
              className="flex flex-wrap gap-2"
            >
              {SUPPORTED_LANGUAGES.map((option) => {
                const label = translate(option, getLanguageLabelKey(option));

                return (
                  <Button
                    key={option}
                    variant={language === option ? "primary" : "secondary"}
                    size="small"
                    lang={option}
                    dir={getDirection(option)}
                    aria-pressed={language === option}
                    onClick={() => setLanguage(option)}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          }
        />

        <section className="grid gap-5">
          <SectionHeader title={t("brand.title")} />
          <Card className="grid gap-6">
            <div className="grid gap-1">
              <Text as="h3" variant="cardTitle">
                {t("brand.title")}
              </Text>
              <Text color="secondary">{t("brand.description")}</Text>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <BrandLogo size="medium" variant="horizontal" />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <BrandLogo size="medium" variant="mark" />
              <BrandLogo size="medium" variant="appIcon" />
              <BrandLogo size="small" variant="stacked" />
            </div>
          </Card>
        </section>

        <Divider />

        <section className="grid gap-5">
          <SectionHeader title={t("preview.typography")} />
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="grid gap-3">
              <Text as="h3" variant="cardTitle">
                {t("preview.mixedLanguage")}
              </Text>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {SUPPORTED_LANGUAGES.map((option) => (
                  <Text key={option} language={option} variant="sectionTitle">
                    {translate(option, getLanguageLabelKey(option))}
                  </Text>
                ))}
              </div>
              <Text color="secondary">{t("preview.description")}</Text>
              <Text variant="caption" color="muted">
                {t("bootstrap.ready")}
              </Text>
            </Card>
            <Card variant="highlighted" className="grid content-start gap-3">
              <Text variant="sectionTitle">{t("preview.title")}</Text>
              <Text variant="bodyStrong">{t("preview.typography")}</Text>
              <Text color="secondary">{t("preview.description")}</Text>
            </Card>
          </div>
        </section>

        <Divider />

        <section className="grid gap-5">
          <SectionHeader title={t("preview.actions")} />
          <Card className="flex flex-wrap items-center gap-3">
            <Button icon={Check}>{t("common.save")}</Button>
            <Button variant="secondary">{t("common.cancel")}</Button>
            <Button variant="ghost">{t("common.continue")}</Button>
            <Button variant="danger">{t("common.retry")}</Button>
            <Button loading>{t("common.loading")}</Button>
            <Button disabled>{t("common.continue")}</Button>
            <Tooltip content={t("preview.tooltip")}>
              <IconButton
                icon={Info}
                variant="secondary"
                aria-label={t("preview.tooltip")}
              />
            </Tooltip>
          </Card>
        </section>

        <section className="grid gap-5">
          <SectionHeader title={t("preview.formControls")} />
          <Card className="grid gap-5 md:grid-cols-2">
            <TextInput
              label={t("preview.input.label")}
              placeholder={t("preview.input.placeholder")}
              helperText={t("preview.input.helper")}
              required
              requiredLabel={t("common.required")}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <Select
              label={t("preview.select.label")}
              placeholder={t("preview.select.placeholder")}
              options={languageOptions}
              defaultValue=""
            />
            <TextArea
              label={t("preview.textarea.label")}
              placeholder={t("preview.textarea.placeholder")}
              errorText={t("states.error.description")}
              value={textAreaValue}
              onChange={(event) => setTextAreaValue(event.target.value)}
            />
            <div className="grid content-start gap-3">
              <Checkbox
                label={t("preview.checkbox.label")}
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
              <Switch
                label={t("preview.switch.label")}
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />
            </div>
          </Card>
        </section>

        <section className="grid gap-5">
          <SectionHeader title={t("preview.status")} />
          <Card className="grid gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge>{t("preview.badge.neutral")}</Badge>
              <StatusBadge status="success">{t("status.success")}</StatusBadge>
              <StatusBadge status="warning">{t("status.warning")}</StatusBadge>
              <StatusBadge status="danger">{t("status.danger")}</StatusBadge>
              <StatusBadge status="info">{t("status.info")}</StatusBadge>
            </div>
            <div className="grid gap-2">
              <Text variant="label">{t("preview.progress.label")}</Text>
              <Progress value={64} label={t("preview.progress.label")} />
            </div>
            <div className="flex items-center gap-3">
              <Spinner label={t("common.loading")} />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-5">
          <SectionHeader title={t("preview.feedback")} />
          <div className="grid gap-4 lg:grid-cols-2">
            <EmptyState
              icon={Inbox}
              title={t("states.empty.title")}
              description={t("states.empty.description")}
              action={
                <Button variant="secondary">{t("common.continue")}</Button>
              }
            />
            <ErrorState
              title={t("states.error.title")}
              description={t("states.error.description")}
              action={<Button variant="danger">{t("common.retry")}</Button>}
            />
          </div>
        </section>

        <section className="grid gap-5">
          <SectionHeader title={t("preview.overlays")} />
          <Card className="grid gap-5">
            <Tabs
              defaultValue="components"
              items={[
                {
                  value: "components",
                  label: t("preview.tabs.components"),
                  content: (
                    <Text color="secondary">{t("preview.description")}</Text>
                  ),
                },
                {
                  value: "states",
                  label: t("preview.tabs.states"),
                  content: (
                    <Text color="secondary">{t("bootstrap.ready")}</Text>
                  ),
                },
              ]}
            />
            <Divider />
            <div className="flex flex-wrap gap-3">
              <Dialog
                trigger={
                  <Button variant="secondary">{t("preview.openDialog")}</Button>
                }
                title={t("preview.dialog.title")}
                description={t("preview.dialog.description")}
                closeLabel={t("common.close")}
                footer={<Button>{t("common.continue")}</Button>}
              >
                <Text color="secondary">{t("preview.description")}</Text>
              </Dialog>
              <DropdownMenu
                trigger={
                  <Button variant="secondary" icon={MoreHorizontal}>
                    {t("preview.openMenu")}
                  </Button>
                }
              >
                <DropdownMenuItem icon={SquareMousePointer}>
                  {t("preview.menu.primary")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={Layers}>
                  {t("preview.menu.secondary")}
                </DropdownMenuItem>
              </DropdownMenu>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

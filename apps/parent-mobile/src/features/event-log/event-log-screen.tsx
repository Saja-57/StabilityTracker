import { spacing } from "@stability/design-tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, ScreenContainer } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { CalmingSupportCard } from "./components/calming-support-card";
import { DetailedProgress } from "./components/detailed-progress";
import { EventBasicsSection } from "./components/event-basics-section";
import { EventContextSection } from "./components/event-context-section";
import { EventDuringSection } from "./components/event-during-section";
import { EventLogHeader } from "./components/event-log-header";
import { EventResponseSection } from "./components/event-response-section";
import { EventReview } from "./components/event-review";
import { FlowActions } from "./components/flow-actions";
import { LogModeSelector } from "./components/log-mode-selector";
import { QuickCaptureForm } from "./components/quick-capture-form";
import {
  createEmptyEventLogDraft,
  type DetailedLogStep,
  type EventLogDraft,
  type EventLogDraftChange,
  type EventLogMode,
} from "./types";

const detailedSteps = [
  "basics",
  "before",
  "during",
  "response",
] as const satisfies readonly DetailedLogStep[];
const detailedTotalSteps = detailedSteps.length + 1;

const styles = StyleSheet.create({
  intro: {
    gap: spacing.xs,
  },
});

export function EventLogScreen() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<EventLogMode | null>(null);
  const [draft, setDraft] = useState<EventLogDraft>(createEmptyEventLogDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showEventTypeError, setShowEventTypeError] = useState(false);

  const updateDraft: EventLogDraftChange = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === "eventType") {
      setShowEventTypeError(false);
    }
  };

  const startMode = (nextMode: EventLogMode) => {
    setDraft(createEmptyEventLogDraft());
    setStepIndex(0);
    setIsReviewing(false);
    setShowEventTypeError(false);
    setMode(nextMode);
  };

  const exitFlow = () => {
    setDraft(createEmptyEventLogDraft());
    setStepIndex(0);
    setIsReviewing(false);
    setShowEventTypeError(false);
    setMode(null);
  };

  const validateBasics = () => {
    if (draft.eventType) {
      return true;
    }

    setShowEventTypeError(true);
    return false;
  };

  const openReview = () => {
    if (validateBasics()) {
      setIsReviewing(true);
    }
  };

  if (!mode) {
    return (
      <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
        <EventLogHeader />
        <LogModeSelector onSelect={startMode} />
        <CalmingSupportCard />
      </ScreenContainer>
    );
  }

  const eventTypeError = showEventTypeError
    ? t("eventLog.validation.eventType")
    : undefined;

  if (isReviewing) {
    return (
      <ScreenContainer
        key={`${mode}-review`}
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
        <EventLogHeader onExit={exitFlow} />
        {mode === "detailed" ? (
          <DetailedProgress
            current={detailedTotalSteps}
            total={detailedTotalSteps}
          />
        ) : null}
        <EventReview draft={draft} onBack={() => setIsReviewing(false)} />
      </ScreenContainer>
    );
  }

  if (mode === "quick") {
    return (
      <ScreenContainer
        key="quick"
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
        <EventLogHeader onExit={exitFlow} />
        <QuickCaptureForm
          draft={draft}
          onChange={updateDraft}
          {...(eventTypeError ? { eventTypeError } : {})}
        />
        <FlowActions
          onPrimary={openReview}
          primaryLabel={t("eventLog.actions.review")}
        />
      </ScreenContainer>
    );
  }

  const activeStep = detailedSteps[stepIndex] ?? "basics";
  const isLastDetailStep = stepIndex === detailedSteps.length - 1;
  const goForward = () => {
    if (activeStep === "basics" && !validateBasics()) {
      return;
    }

    if (isLastDetailStep) {
      openReview();
      return;
    }

    setStepIndex((current) => current + 1);
  };

  return (
    <ScreenContainer
      key={`detailed-${activeStep}`}
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      <EventLogHeader onExit={exitFlow} />
      <View style={styles.intro}>
        <AppText accessibilityRole="header" variant="sectionTitle">
          {t("eventLog.detailed.title")}
        </AppText>
        <AppText color="secondary">
          {t("eventLog.detailed.description")}
        </AppText>
      </View>
      <DetailedProgress current={stepIndex + 1} total={detailedTotalSteps} />
      {activeStep === "basics" ? (
        <EventBasicsSection
          draft={draft}
          onChange={updateDraft}
          {...(eventTypeError ? { eventTypeError } : {})}
        />
      ) : activeStep === "before" ? (
        <EventContextSection draft={draft} onChange={updateDraft} />
      ) : activeStep === "during" ? (
        <EventDuringSection draft={draft} onChange={updateDraft} />
      ) : (
        <EventResponseSection draft={draft} onChange={updateDraft} />
      )}
      <FlowActions
        onPrimary={goForward}
        primaryLabel={
          isLastDetailStep
            ? t("eventLog.actions.review")
            : t("eventLog.actions.next")
        }
        {...(stepIndex > 0
          ? { onBack: () => setStepIndex((current) => current - 1) }
          : {})}
      />
    </ScreenContainer>
  );
}

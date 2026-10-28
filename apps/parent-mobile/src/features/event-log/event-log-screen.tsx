import { useCallback, useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";

import { Action, Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { ScreenContainer } from "@/components/ui";
import { fill, isolate } from "@/lib/format";
import { addMinutes } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { corner, space } from "@/theme/case-file";

import { BackButton, EventLogHeader } from "./components/event-log-header";
import { DetailedProgress } from "./components/detailed-progress";
import { EventBasicsSection } from "./components/event-basics-section";
import { EventContextSection } from "./components/event-context-section";
import { EventDuringSection } from "./components/event-during-section";
import { EventResponseSection } from "./components/event-response-section";
import { EventReview } from "./components/event-review";
import { FlowActions } from "./components/flow-actions";
import { LogModeSelector } from "./components/log-mode-selector";
import { QuickCaptureForm } from "./components/quick-capture-form";
import { RecentLogs } from "./components/recent-logs";
import { SupportView } from "./components/support-view";
import { detailedSteps, eventTimingOffsetMinutes } from "./options";
import {
  createEmptyEventLogDraft,
  type DetailedLogStep,
  type EventLogDraft,
  type EventLogDraftChange,
  type EventLogEntryViewModel,
  type EventLogMode,
  type EventLogScreenProps,
  type EventLogStage,
} from "./types";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

/**
 * The Log tab: calm support first, capture second. A parent may open this
 * mid-meltdown, so the first choice is breathing, not a form.
 */
export function EventLogScreen({
  childName,
  therapistName,
  caregiverName,
  now,
  strategies,
  recentLogs,
  onSave,
  onGoHome,
  initialStage = "entry",
}: EventLogScreenProps) {
  const { language, t } = useLanguage();
  const [stage, setStage] = useState<EventLogStage>(initialStage);
  const [mode, setMode] = useState<EventLogMode>("quick");
  const [cameFromSupport, setCameFromSupport] = useState(false);
  const [step, setStep] = useState<DetailedLogStep>("basics");
  const [turn, setTurn] = useState<"forward" | "back">("forward");
  const [draft, setDraft] = useState<EventLogDraft>(() =>
    createEmptyEventLogDraft(),
  );
  const change: EventLogDraftChange = useCallback((key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const at = addMinutes(
    now,
    eventTimingOffsetMinutes[draft.timingMode ?? "now"],
  );
  const stepIndex = detailedSteps.findIndex((item) => item.value === step);

  const startQuick = (fromSupport: boolean) => {
    setDraft(createEmptyEventLogDraft(fromSupport ? "now" : null));
    setCameFromSupport(fromSupport);
    setMode("quick");
    setStage("quick");
  };
  const startDetailed = () => {
    setDraft(createEmptyEventLogDraft("today"));
    setMode("detailed");
    setStep("basics");
    setTurn("forward");
    setStage("detailed");
  };
  const goStep = (next: DetailedLogStep) => {
    const nextIndex = detailedSteps.findIndex((item) => item.value === next);
    setTurn(nextIndex >= stepIndex ? "forward" : "back");
    setStep(next);
  };
  const save = () => {
    const entry: EventLogEntryViewModel = {
      id: `local-${Date.now()}`,
      at,
      type: draft.eventType ?? "other",
      intensity: draft.intensity,
      helped: draft.supports[0] ?? null,
      by: caregiverName,
      details: draft,
    };
    onSave(entry);
    setStage("saved");
  };
  const reset = () => {
    setDraft(createEmptyEventLogDraft());
    setStage("entry");
  };

  // A page turn: the next sheet slides in from the reading end.
  const forwardFromEnd = (turn === "forward") === (language === "en");
  const pageEnter = (forwardFromEnd ? FadeInRight : FadeInLeft)
    .duration(380)
    .easing(paperEase);

  let body: ReactNode = null;

  if (stage === "entry") {
    body = (
      <>
        <Animated.View entering={enter(0)}>
          <EventLogHeader
            title={t("eventLog.entry.title")}
            lede={t("eventLog.entry.description")}
            hero
          />
        </Animated.View>
        <Animated.View entering={enter(1)}>
          <LogModeSelector
            therapistName={therapistName}
            onNow={() => setStage("support")}
            onEarlier={startDetailed}
          />
        </Animated.View>
        <Animated.View entering={enter(2)}>
          <RecentLogs logs={recentLogs} now={now} />
        </Animated.View>
      </>
    );
  } else if (stage === "support") {
    body = (
      <SupportView
        childName={childName}
        therapistName={therapistName}
        strategies={strategies}
        onBack={() => setStage("entry")}
        onLog={() => startQuick(true)}
      />
    );
  } else if (stage === "quick") {
    body = (
      <>
        <Animated.View entering={enter(0)}>
          <EventLogHeader
            title={t("eventLog.quick.title")}
            lede={t("eventLog.quick.description")}
            onBack={() => setStage(cameFromSupport ? "support" : "entry")}
          />
        </Animated.View>
        <Animated.View entering={enter(1)}>
          <QuickCaptureForm
            draft={draft}
            onChange={change}
            onReview={() => setStage("review")}
          />
        </Animated.View>
      </>
    );
  } else if (stage === "detailed") {
    const last = stepIndex === detailedSteps.length - 1;
    const previous = detailedSteps[stepIndex - 1]?.value;
    const next = detailedSteps[stepIndex + 1]?.value;
    body = (
      <>
        <Animated.View
          {...(step === "basics" && turn === "forward"
            ? { entering: enter(0) }
            : {})}
          style={styles.detailedHead}
        >
          <Row style={styles.between}>
            <BackButton
              onPress={() => setStage("entry")}
              label={t("eventLog.actions.exit")}
            />
          </Row>
          <Type variant="display" accessibilityRole="header">
            {t("eventLog.detailed.title")}
          </Type>
          <DetailedProgress step={step} onJump={goStep} />
        </Animated.View>
        <Animated.View key={step} entering={pageEnter} style={styles.page}>
          {step === "basics" ? (
            <EventBasicsSection draft={draft} onChange={change} />
          ) : null}
          {step === "before" ? (
            <EventContextSection draft={draft} onChange={change} />
          ) : null}
          {step === "during" ? (
            <EventDuringSection draft={draft} onChange={change} />
          ) : null}
          {step === "response" ? (
            <EventResponseSection draft={draft} onChange={change} />
          ) : null}
          <FlowActions
            {...(previous
              ? {
                  backLabel: t("eventLog.actions.back"),
                  onBack: () => goStep(previous),
                }
              : {})}
            nextLabel={
              last ? t("eventLog.actions.review") : t("eventLog.actions.next")
            }
            onNext={() => (next ? goStep(next) : setStage("review"))}
            canContinue={step !== "basics" || draft.eventType !== null}
            hint={t("eventLog.validation.eventType")}
          />
        </Animated.View>
      </>
    );
  } else if (stage === "review") {
    body = (
      <>
        <Animated.View entering={enter(0)}>
          <EventLogHeader
            title={t("eventLog.review.title")}
            lede={fill(t("logFlow.review.lede"), {
              name: isolate(therapistName),
            })}
            onBack={() => setStage(mode)}
          />
        </Animated.View>
        <Animated.View entering={enter(1)}>
          <EventReview draft={draft} at={at} caregiverName={caregiverName} />
        </Animated.View>
        <Animated.View entering={enter(2)} style={styles.actions}>
          <Action
            label={fill(t("logFlow.review.save"), {
              child: isolate(childName),
            })}
            glyph="tick"
            variant="ink"
            size="large"
            onPress={save}
            style={styles.wide}
          />
          <Action
            label={t("logFlow.review.edit")}
            glyph="edit"
            variant="quiet"
            size="large"
            onPress={() => setStage(mode)}
          />
        </Animated.View>
      </>
    );
  } else {
    body = (
      <>
        <Animated.View entering={enter(0)}>
          <EventReview
            draft={draft}
            at={at}
            caregiverName={caregiverName}
            stamped
          />
        </Animated.View>
        <Animated.View entering={enter(1)} style={styles.savedText}>
          <Type
            variant="display"
            accessibilityRole="header"
            accessibilityLiveRegion="polite"
          >
            {fill(t("logFlow.saved.title"), { name: isolate(therapistName) })}
          </Type>
          <Type variant="lede" color="secondary">
            {t("logFlow.saved.lede")}
          </Type>
        </Animated.View>
        <Animated.View entering={enter(2)} style={styles.actions}>
          <Action
            label={t("logFlow.saved.home")}
            glyph="home"
            variant="ink"
            size="large"
            onPress={onGoHome}
            style={styles.wide}
          />
          <Action
            label={t("logFlow.saved.another")}
            glyph="plus"
            variant="outline"
            size="large"
            onPress={reset}
            style={styles.wide}
          />
        </Animated.View>
      </>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenContainer
        key={stage === "detailed" ? `detailed-${step}` : stage}
        contentContainerStyle={styles.content}
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
        {body}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 120 },
  between: { justifyContent: "space-between" },
  detailedHead: { gap: space.lg },
  page: { gap: 28 },
  actions: { gap: space.sm },
  wide: { borderRadius: corner.lg },
  savedText: { gap: space.md },
});

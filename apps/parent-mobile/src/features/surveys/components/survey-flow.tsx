import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { Action, Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { ScreenContainer } from "@/components/ui";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, space, surface } from "@/theme/case-file";

import { hasResponse } from "../survey-answers";
import type {
  CaregiverSurveyViewModel,
  SurveyResponseMap,
  SurveyResponseValue,
} from "../types";
import { SurveyEmptyState } from "./survey-feedback-states";
import { SurveyHeader } from "./survey-header";
import { SurveyIntro } from "./survey-intro";
import { SurveyProgress } from "./survey-progress";
import { SurveyQuestion } from "./survey-question";
import { SurveyReview } from "./survey-review";
import { SurveySent } from "./survey-sent";

export interface SurveyFlowProps {
  readonly survey: CaregiverSurveyViewModel;
  /** The therapist's short name: "Send to Lena", "Sent to Lena". */
  readonly therapistName?: string;
  /** Where "Back to Home" goes after sending. Defaults to the Home tab. */
  readonly onHome?: () => void;
  /** Called with the answers when the family sends the check-in. */
  readonly onSubmit?: (responses: SurveyResponseMap) => void;
  /** Answers already sent for this survey; reopening shows the thank-you sheet. */
  readonly submitted?: SurveyResponseMap;
}

type Phase =
  | { readonly kind: "intro" }
  | {
      readonly kind: "question";
      readonly index: number;
      readonly fromReview: boolean;
    }
  | { readonly kind: "review" }
  | { readonly kind: "sent" };

function goHome() {
  router.replace("/");
}

/** Intro, one question per screen, review, then the thank-you sheet. */
export function SurveyFlow({
  onHome = goHome,
  onSubmit,
  survey,
  therapistName,
  submitted,
}: SurveyFlowProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>(
    submitted ? { kind: "sent" } : { kind: "intro" },
  );
  const [responses, setResponses] = useState<SurveyResponseMap>(
    submitted ?? {},
  );
  const [showValidation, setShowValidation] = useState(false);
  const total = survey.questions.length;
  const name = therapistName ? isolate(therapistName) : "";

  if (total === 0) {
    return (
      <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
        <SurveyHeader />
        <SurveyEmptyState />
      </ScreenContainer>
    );
  }

  const answered = survey.questions.map((question) =>
    hasResponse(responses[question.id]),
  );
  const question =
    phase.kind === "question" ? survey.questions[phase.index] : undefined;
  const response = question ? responses[question.id] : undefined;
  const isLast = phase.kind === "question" && phase.index === total - 1;

  const show = (next: Phase) => {
    setShowValidation(false);
    setPhase(next);
  };

  const update = (value: SurveyResponseValue) => {
    if (!question) {
      return;
    }
    setResponses((current) => ({ ...current, [question.id]: value }));
    setShowValidation(false);
  };

  const advance = () => {
    if (phase.kind !== "question" || !question) {
      return;
    }
    if (!question.isOptional && !hasResponse(response)) {
      setShowValidation(true);
      return;
    }
    show(
      phase.fromReview || isLast
        ? { kind: "review" }
        : { kind: "question", index: phase.index + 1, fromReview: false },
    );
  };

  const skip = () => {
    if (phase.kind !== "question" || !question?.isOptional) {
      return;
    }
    setResponses((current) => ({ ...current, [question.id]: undefined }));
    show(
      phase.fromReview || isLast
        ? { kind: "review" }
        : { kind: "question", index: phase.index + 1, fromReview: false },
    );
  };

  const retreat = () => {
    if (phase.kind === "question") {
      show(
        phase.fromReview
          ? { kind: "review" }
          : phase.index === 0
            ? { kind: "intro" }
            : { kind: "question", index: phase.index - 1, fromReview: false },
      );
    } else if (phase.kind === "review") {
      show({ kind: "question", index: total - 1, fromReview: false });
    }
  };

  const submit = () => {
    onSubmit?.(responses);
    show({ kind: "sent" });
  };

  const headerBack =
    phase.kind === "intro" || phase.kind === "sent" ? undefined : retreat;
  const screenKey = phase.kind === "question" ? `q-${phase.index}` : phase.kind;

  return (
    <View style={styles.root}>
      <ScreenContainer
        key={screenKey}
        contentContainerStyle={phase.kind === "sent" ? null : styles.content}
        scrollProps={{ showsVerticalScrollIndicator: false }}
      >
        <SurveyHeader
          {...(headerBack
            ? { onBack: headerBack }
            : phase.kind === "sent"
              ? { onBack: onHome }
              : {})}
          aside={
            phase.kind === "question" ? (
              <View style={styles.progress}>
                <SurveyProgress
                  current={phase.index + 1}
                  total={total}
                  answered={answered}
                />
                <Type variant="caption" color="muted" style={styles.count}>
                  {fill(t("checkin.progress"), {
                    current: phase.index + 1,
                    total,
                  })}
                </Type>
              </View>
            ) : null
          }
        />

        {phase.kind === "intro" ? (
          <SurveyIntro
            survey={survey}
            {...(therapistName ? { therapistName } : {})}
          />
        ) : null}

        {phase.kind === "question" && question ? (
          <Animated.View
            entering={FadeInDown.duration(480).delay(40).easing(paperEase)}
            style={styles.question}
          >
            <SurveyQuestion
              onChange={update}
              question={question}
              {...(response !== undefined ? { value: response } : {})}
            />
            {showValidation ? (
              <Animated.View entering={FadeIn.duration(200)}>
                <Type
                  variant="small"
                  color="cobalt"
                  accessibilityLiveRegion="polite"
                >
                  {t("surveys.validation.required")}
                </Type>
              </Animated.View>
            ) : null}
          </Animated.View>
        ) : null}

        {phase.kind === "review" ? (
          <SurveyReview
            onBack={retreat}
            onEdit={(index) =>
              show({ kind: "question", index, fromReview: true })
            }
            responses={responses}
            survey={survey}
          />
        ) : null}

        {phase.kind === "sent" ? (
          <SurveySent
            onHome={onHome}
            {...(therapistName ? { therapistName } : {})}
          />
        ) : null}
      </ScreenContainer>

      {phase.kind === "sent" ? null : (
        <View pointerEvents="box-none" style={styles.dock}>
          {phase.kind === "intro" ? (
            <Action
              label={t("checkin.intro.begin")}
              trailingGlyph="arrow"
              variant="ink"
              size="large"
              onPress={() =>
                show({ kind: "question", index: 0, fromReview: false })
              }
              style={styles.dockAction}
            />
          ) : null}

          {phase.kind === "question" && question ? (
            <Row gap={space.sm}>
              <Action
                label={
                  phase.fromReview
                    ? t("checkin.backToReview")
                    : t("checkin.previous")
                }
                glyph="arrowBack"
                variant="outline"
                size="large"
                onPress={retreat}
                style={styles.dockAction}
              />
              {question.isOptional && !hasResponse(response) ? (
                <View style={styles.flex}>
                  <Action
                    label={t("checkin.skip")}
                    variant="outline"
                    size="large"
                    onPress={skip}
                    style={styles.dockAction}
                  />
                </View>
              ) : (
                <View style={styles.flex}>
                  <Action
                    label={
                      phase.fromReview || isLast
                        ? t("checkin.toReview")
                        : t("checkin.next")
                    }
                    trailingGlyph="arrow"
                    variant="ink"
                    size="large"
                    onPress={advance}
                    style={styles.dockAction}
                  />
                </View>
              )}
            </Row>
          ) : null}

          {phase.kind === "review" ? (
            <Action
              label={
                name
                  ? fill(t("checkin.submit"), { name })
                  : t("checkin.submitPlain")
              }
              glyph="send"
              variant="ink"
              size="large"
              onPress={submit}
              style={styles.dockAction}
            />
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: surface.ground, flex: 1 },
  content: { paddingBottom: 120 },
  flex: { flex: 1 },
  progress: { alignItems: "flex-end", gap: 6 },
  count: { fontVariant: ["tabular-nums"] },
  question: { gap: space.lg },
  dock: {
    backgroundColor: surface.ground,
    bottom: 0,
    end: 0,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    position: "absolute",
    start: 0,
    boxShadow: `0 -12px 24px -12px ${cf.sheet.base}`,
  },
  dockAction: { borderRadius: 16 },
});

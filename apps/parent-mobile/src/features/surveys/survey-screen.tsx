import { ScreenContainer } from "@/components/ui";

import {
  SurveyEmptyState,
  SurveyErrorState,
  SurveyLoadingState,
} from "./components/survey-feedback-states";
import { SurveyFlow } from "./components/survey-flow";
import { SurveyHeader } from "./components/survey-header";
import type { SurveyScreenState } from "./types";

export interface SurveyScreenProps {
  readonly onRetry?: () => void;
  readonly state?: SurveyScreenState;
}

const emptyState: SurveyScreenState = { status: "empty" };

export function SurveyScreen({
  onRetry,
  state = emptyState,
}: SurveyScreenProps) {
  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <SurveyHeader />
      {state.status === "loading" ? (
        <SurveyLoadingState />
      ) : state.status === "error" ? (
        <SurveyErrorState {...(onRetry ? { onRetry } : {})} />
      ) : state.status === "available" ? (
        <SurveyFlow survey={state.survey} />
      ) : (
        <SurveyEmptyState />
      )}
    </ScreenContainer>
  );
}

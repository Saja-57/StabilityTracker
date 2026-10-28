import { ScreenContainer } from "@/components/ui";

import {
  SurveyEmptyState,
  SurveyErrorState,
  SurveyLoadingState,
} from "./components/survey-feedback-states";
import { SurveyFlow } from "./components/survey-flow";
import { SurveyHeader } from "./components/survey-header";
import type { SurveyResponseMap, SurveyScreenState } from "./types";

export interface SurveyScreenProps {
  readonly onRetry?: () => void;
  readonly state?: SurveyScreenState;
  /** The therapist's short name, used in "Send to Lena" and the thank-you sheet. */
  readonly therapistName?: string;
  /** Where "Back to Home" goes after sending. Defaults to the Home tab. */
  readonly onHome?: () => void;
  /** Called with the answers when the family sends the check-in. */
  readonly onSubmit?: (responses: SurveyResponseMap) => void;
  /** Answers already sent for this survey, if any. */
  readonly submitted?: SurveyResponseMap;
}

const emptyState: SurveyScreenState = { status: "empty" };

export function SurveyScreen({
  onHome,
  onRetry,
  onSubmit,
  state = emptyState,
  therapistName,
  submitted,
}: SurveyScreenProps) {
  if (state.status === "available") {
    return (
      <SurveyFlow
        survey={state.survey}
        {...(therapistName ? { therapistName } : {})}
        {...(onHome ? { onHome } : {})}
        {...(onSubmit ? { onSubmit } : {})}
        {...(submitted ? { submitted } : {})}
      />
    );
  }

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <SurveyHeader />
      {state.status === "loading" ? (
        <SurveyLoadingState />
      ) : state.status === "error" ? (
        <SurveyErrorState {...(onRetry ? { onRetry } : {})} />
      ) : (
        <SurveyEmptyState />
      )}
    </ScreenContainer>
  );
}

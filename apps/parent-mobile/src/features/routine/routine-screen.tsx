import { ScreenContainer, SectionHeader } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { RoutineContextCard } from "./components/routine-context-card";
import {
  RoutineEmptyState,
  RoutineErrorState,
  RoutineLoadingState,
} from "./components/routine-feedback-states";
import { RoutineHeader } from "./components/routine-header";
import { RoutineProgressCard } from "./components/routine-progress-card";
import { RoutineTimeline } from "./components/routine-timeline";
import type { RoutineViewState } from "./types";

export interface RoutineScreenProps {
  readonly completionDisabled?: boolean;
  readonly onCompleteStep?: (stepId: string) => void;
  readonly onUndoStep?: (stepId: string) => void;
  readonly state?: RoutineViewState;
}

export function RoutineScreen({
  completionDisabled = false,
  onCompleteStep,
  onUndoStep,
  state,
}: RoutineScreenProps) {
  const { t } = useLanguage();

  if (state?.status === "loading") {
    return (
      <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
        <RoutineHeader />
        <RoutineLoadingState />
      </ScreenContainer>
    );
  }

  if (state?.status === "error") {
    return (
      <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
        <RoutineHeader />
        <RoutineErrorState onRetry={state.onRetry} />
      </ScreenContainer>
    );
  }

  const routine = state?.status === "ready" ? state.routine : undefined;

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <RoutineHeader />
      <RoutineContextCard
        {...(routine?.context ? { context: routine.context } : {})}
      />
      <RoutineProgressCard
        {...(routine?.summary ? { summary: routine.summary } : {})}
      />
      <SectionHeader title={t("routine.steps")} />
      {routine && routine.steps.length > 0 ? (
        <RoutineTimeline
          completionDisabled={completionDisabled}
          steps={routine.steps}
          {...(onCompleteStep ? { onComplete: onCompleteStep } : {})}
          {...(onUndoStep ? { onUndo: onUndoStep } : {})}
        />
      ) : (
        <RoutineEmptyState />
      )}
    </ScreenContainer>
  );
}

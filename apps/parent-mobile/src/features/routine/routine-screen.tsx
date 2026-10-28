import Animated, { FadeInDown } from "react-native-reanimated";

import { paperEase } from "@/components/case-file/primitives";
import { ScreenContainer } from "@/components/ui";

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

const scrollProps = { showsVerticalScrollIndicator: false } as const;
const enterHeader = FadeInDown.duration(520).delay(60).easing(paperEase);

/**
 * The full visual schedule on the fridge: every picture card of the day in
 * order, the current one large, each ticked in pen by whoever did it.
 */
export function RoutineScreen({
  completionDisabled = false,
  onCompleteStep,
  onUndoStep,
  state,
}: RoutineScreenProps) {
  if (state?.status === "loading") {
    return (
      <ScreenContainer scrollProps={scrollProps}>
        <Animated.View entering={enterHeader}>
          <RoutineHeader />
        </Animated.View>
        <RoutineLoadingState />
      </ScreenContainer>
    );
  }

  if (state?.status === "error") {
    return (
      <ScreenContainer scrollProps={scrollProps}>
        <Animated.View entering={enterHeader}>
          <RoutineHeader />
        </Animated.View>
        <RoutineErrorState onRetry={state.onRetry} />
      </ScreenContainer>
    );
  }

  const routine = state?.status === "ready" ? state.routine : undefined;
  const context = routine?.context;

  return (
    <ScreenContainer scrollProps={scrollProps}>
      <Animated.View entering={enterHeader}>
        <RoutineHeader
          {...(context?.date ? { date: context.date } : {})}
          aside={<RoutineContextCard {...(context ? { context } : {})} />}
        >
          <RoutineProgressCard
            {...(routine?.summary ? { summary: routine.summary } : {})}
          />
        </RoutineHeader>
      </Animated.View>
      {routine && routine.steps.length > 0 ? (
        <RoutineTimeline
          completionDisabled={completionDisabled}
          enterDelay={130}
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

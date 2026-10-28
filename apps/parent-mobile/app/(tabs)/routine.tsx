import { useMemo } from "react";

import {
  RoutineScreen,
  type RoutineStepViewModel,
  type RoutineSupportKey,
  type RoutineViewModel,
} from "@/features/routine";
import type { ScheduleStep } from "@/lib/sample-family";
import { useFamilyContent } from "@/lib/use-family-content";
import { useRoutineDay } from "@/lib/use-routine-day";
import type { RoutineCompletion } from "@/providers/family-store-provider";
import type { SupportedLanguage } from "@stability/i18n";

const supportKeys = new Set<string>([
  "deepPressure",
  "quietSpace",
  "visualTimer",
  "choices",
  "movementBreak",
  "music",
  "countdown",
  "headphones",
]);

function isSupportKey(value: string | undefined): value is RoutineSupportKey {
  return value !== undefined && supportKeys.has(value);
}


function toStep(
  step: ScheduleStep,
  order: number,
  completion: RoutineCompletion | undefined,
  textLanguage: SupportedLanguage,
): RoutineStepViewModel {
  return {
    id: step.id,
    order,
    title: step.title,
    description: step.detail,
    pictogram: step.pictogram,
    scheduledAt: step.time,
    status: completion ? "completed" : "upcoming",
    textLanguage,
    ...(step.endTime ? { endsAt: step.endTime } : {}),
    ...(completion
      ? {
          completion: {
            caregiverDisplayName: completion.by,
            completedAt: completion.at,
          },
        }
      : {}),
    ...(step.adjusted
      ? {
          adjusted: {
            byDisplayName: step.adjusted.by,
            note: step.adjusted.note,
          },
        }
      : {}),
    ...(isSupportKey(step.support) ? { support: step.support } : {}),
  };
}

/** The day's schedule, ticked as the caregiver taps and kept on the device. */
export default function RoutineRoute() {
  const { SAMPLE_TODAY, family, language, schedule } = useFamilyContent();
  const { completions, complete, undo } = useRoutineDay();

  const routine = useMemo<RoutineViewModel>(() => {
    const views = schedule.map((step, index) =>
      toStep(step, index + 1, completions[step.id], language),
    );
    // The first card not yet ticked is what is happening now.
    const currentIndex = views.findIndex((view) => view.status !== "completed");
    const steps = views.map((view, index) =>
      index === currentIndex ? { ...view, status: "current" as const } : view,
    );
    const done = steps.filter((step) => step.status === "completed").length;
    return {
      context: {
        childDisplayName: family.child.givenName,
        contentLanguage: language,
        date: SAMPLE_TODAY,
      },
      steps,
      summary: {
        completedSteps: done,
        totalSteps: steps.length,
        progressPercent: steps.length
          ? Math.round((done / steps.length) * 100)
          : 0,
      },
    };
  }, [SAMPLE_TODAY, completions, family.child.givenName, language, schedule]);

  return (
    <RoutineScreen
      onCompleteStep={complete}
      onUndoStep={undo}
      state={{ status: "ready", routine }}
    />
  );
}

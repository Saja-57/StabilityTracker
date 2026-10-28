import { useCallback, useMemo } from "react";

import {
  useFamilyStore,
  type RoutineCompletion,
} from "@/providers/family-store-provider";

import { SAMPLE_NOW, type ScheduleStep } from "./sample-family";
import { useFamilyContent } from "./use-family-content";

const nowTime = SAMPLE_NOW.slice(11, 16);

function initialCompletions(
  schedule: readonly ScheduleStep[],
): Record<string, RoutineCompletion> {
  return Object.fromEntries(
    schedule
      .filter((step) => step.status === "completed")
      .map((step) => [
        step.id,
        { by: step.completedBy ?? "", at: step.completedAt ?? "" },
      ]),
  );
}

/** Today's ticks, shared by Home and Routine and kept on the device. */
export function useRoutineDay() {
  const { SAMPLE_TODAY, family, schedule } = useFamilyContent();
  const { record, setRoutineDay } = useFamilyStore();
  const caregiver =
    family.caregivers.find((person) => person.you)?.givenName ?? "";
  const completions = useMemo(
    () => record.routine[SAMPLE_TODAY] ?? initialCompletions(schedule),
    [SAMPLE_TODAY, record.routine, schedule],
  );

  const complete = useCallback(
    (id: string) =>
      setRoutineDay(SAMPLE_TODAY, {
        ...completions,
        [id]: { by: caregiver, at: nowTime },
      }),
    [SAMPLE_TODAY, caregiver, completions, setRoutineDay],
  );

  const undo = useCallback(
    (id: string) => {
      const next = { ...completions };
      delete next[id];
      setRoutineDay(SAMPLE_TODAY, next);
    },
    [SAMPLE_TODAY, completions, setRoutineDay],
  );

  return { completions, complete, undo };
}

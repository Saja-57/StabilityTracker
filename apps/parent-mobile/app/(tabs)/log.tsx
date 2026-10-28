import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";

import {
  EventLogScreen,
  isEventSupport,
  isEventType,
  type EventLogEntryViewModel,
  type EventLogStrategyViewModel,
} from "@/features/event-log";
import type { FamilyContent } from "@/lib/sample-family";
import { useFamilyContent } from "@/lib/use-family-content";
import { useFamilyStore } from "@/providers/family-store-provider";

/** Sample history; the family's own logs are kept on the device. */
function toApprovedStrategies(
  strategies: FamilyContent["strategies"],
): readonly EventLogStrategyViewModel[] {
  return strategies.flatMap((strategy) =>
    strategy.approved && isEventSupport(strategy.id)
      ? [
          {
            id: strategy.id,
            support: strategy.id,
            when: strategy.when,
            steps: strategy.steps,
            worked: strategy.worked,
            tried: strategy.tried,
          },
        ]
      : [],
  );
}

function toSampleLogs(
  recentLogs: FamilyContent["recentLogs"],
): readonly EventLogEntryViewModel[] {
  return recentLogs.flatMap((log) =>
    isEventType(log.type)
      ? [
          {
            id: log.id,
            at: log.at,
            type: log.type,
            intensity: log.intensity,
            helped: isEventSupport(log.helped) ? log.helped : null,
            by: log.by,
          },
        ]
      : [],
  );
}

export default function LogRoute() {
  const router = useRouter();
  const { start } = useLocalSearchParams<{ start?: string }>();
  const { SAMPLE_NOW, family, recentLogs, strategies } = useFamilyContent();
  const approvedStrategies = useMemo(
    () => toApprovedStrategies(strategies),
    [strategies],
  );
  const { record, addEvent } = useFamilyStore();
  const logs = useMemo(
    () =>
      [...record.events, ...toSampleLogs(recentLogs)].sort((a, b) =>
        b.at.localeCompare(a.at),
      ),
    [record.events, recentLogs],
  );
  const you = family.caregivers.find((caregiver) => caregiver.you);

  return (
    <EventLogScreen
      key={start ?? "entry"}
      initialStage={start === "support" ? "support" : "entry"}
      childName={family.child.givenName}
      therapistName={family.therapist.givenName}
      caregiverName={you?.givenName ?? ""}
      now={SAMPLE_NOW}
      strategies={approvedStrategies}
      recentLogs={logs}
      onSave={addEvent}
      onGoHome={() => router.navigate("/")}
    />
  );
}

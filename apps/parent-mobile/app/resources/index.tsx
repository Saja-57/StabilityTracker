import { ResourcesScreen, type StrategyId } from "@/features/resources";
import { useMemo } from "react";

import { useFamilyContent } from "@/lib/use-family-content";

export default function ResourcesRoute() {
  const { family, strategies } = useFamilyContent();
  const viewModels = useMemo(
    () =>
      strategies.map((strategy) => ({
        ...strategy,
        id: strategy.id as StrategyId,
        pictogram: strategy.id,
      })),
    [strategies],
  );
  return (
    <ResourcesScreen
      strategies={viewModels}
      therapistGivenName={family.therapist.givenName}
      childGivenName={family.child.givenName}
    />
  );
}

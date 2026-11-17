import { useRouter, type Href } from "expo-router";
import { useMemo } from "react";

import { AskScreen } from "@/features/ask";
import { buildAskContext, destinationHref } from "@/features/ask/ask-client";
import { useFamilyContent } from "@/lib/use-family-content";
import { useRoutineDay } from "@/lib/use-routine-day";
import { useFamilyStore } from "@/providers/family-store-provider";

export default function AiRoute() {
  const router = useRouter();
  const content = useFamilyContent();
  const { completions } = useRoutineDay();
  const { record } = useFamilyStore();
  const checkinSent = content.weeklySurvey.id in record.surveys;
  const context = useMemo(
    () =>
      buildAskContext(content, new Set(Object.keys(completions)), checkinSent),
    [content, completions, checkinSent],
  );
  return (
    <AskScreen
      therapistGivenName={content.family.therapist.givenName}
      childGivenName={content.family.child.givenName}
      context={context}
      onNavigate={(destination) =>
        router.push(destinationHref[destination] as Href)
      }
      onMessageTherapist={() => router.push("/messages" as Href)}
    />
  );
}

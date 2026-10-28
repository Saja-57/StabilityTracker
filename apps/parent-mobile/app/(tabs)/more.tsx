import { MoreScreen } from "@/components/layout/more-screen";
import { useFamilyContent } from "@/lib/use-family-content";

export default function MoreRoute() {
  const { SAMPLE_NOW, family, visits } = useFamilyContent();
  const nextVisit = visits.find((visit) => visit.at >= SAMPLE_NOW.slice(0, 10));
  return (
    <MoreScreen
      child={family.child}
      caregivers={family.caregivers}
      therapistGivenName={family.therapist.givenName}
      checkInWaiting
      {...(nextVisit
        ? {
            nextVisit: {
              at: nextVisit.at,
              isToday: nextVisit.at.startsWith(SAMPLE_NOW.slice(0, 10)),
              focus: nextVisit.focus,
            },
          }
        : {})}
    />
  );
}

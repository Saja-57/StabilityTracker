import { AppointmentsScreen } from "@/features/appointments";
import { useFamilyContent } from "@/lib/use-family-content";

export default function AppointmentsRoute() {
  const { SAMPLE_NOW, family, pastVisits, visits } = useFamilyContent();
  return (
    <AppointmentsScreen
      now={SAMPLE_NOW}
      therapistGivenName={family.therapist.givenName}
      visits={visits}
      pastVisits={pastVisits}
    />
  );
}

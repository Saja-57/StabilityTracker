import { FamilyScreen } from "@/features/family";
import { useFamilyContent } from "@/lib/use-family-content";

export default function FamilyRoute() {
  const { careTeam, family } = useFamilyContent();
  return (
    <FamilyScreen
      child={family.child}
      caregivers={family.caregivers}
      careTeam={careTeam}
      therapistGivenName={family.therapist.givenName}
    />
  );
}

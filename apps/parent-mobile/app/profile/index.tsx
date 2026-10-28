import { ProfileScreen } from "@/features/profile";
import { sampleProfile } from "@/lib/sample-more";
import { useFamilyContent } from "@/lib/use-family-content";
import { useFamilyStore } from "@/providers/family-store-provider";

export default function ProfileRoute() {
  const { family } = useFamilyContent();
  const { record, setNotifications } = useFamilyStore();
  return (
    <ProfileScreen
      caregiver={sampleProfile}
      childGivenName={family.child.givenName}
      therapistGivenName={family.therapist.givenName}
      notificationDefaults={record.notifications}
      onNotificationsChange={setNotifications}
    />
  );
}

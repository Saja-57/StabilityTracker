import { useRouter, type Href } from "expo-router";

import { AskScreen } from "@/features/ask";
import { useFamilyContent } from "@/lib/use-family-content";

export default function AiRoute() {
  const router = useRouter();
  const { askLibrary, family } = useFamilyContent();
  return (
    <AskScreen
      library={askLibrary}
      therapistGivenName={family.therapist.givenName}
      childGivenName={family.child.givenName}
      onMessageTherapist={() => router.push("/messages" as Href)}
    />
  );
}

import { UserRound } from "lucide-react-native";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";

export default function ProfileRoute() {
  return (
    <RoutePlaceholder icon={UserRound} showBack titleKey="navigation.profile" />
  );
}

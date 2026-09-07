import { Users } from "lucide-react-native";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";

export default function FamilyRoute() {
  return (
    <RoutePlaceholder icon={Users} showBack titleKey="navigation.family" />
  );
}

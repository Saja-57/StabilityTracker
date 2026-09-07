import { BookOpen } from "lucide-react-native";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";

export default function ResourcesRoute() {
  return (
    <RoutePlaceholder
      icon={BookOpen}
      showBack
      titleKey="navigation.resources"
    />
  );
}

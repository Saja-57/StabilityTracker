import { ClipboardList } from "lucide-react-native";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";

export default function SurveysRoute() {
  return (
    <RoutePlaceholder
      icon={ClipboardList}
      showBack
      titleKey="navigation.surveys"
    />
  );
}

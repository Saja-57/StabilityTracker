import { CalendarDays } from "lucide-react-native";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";

export default function AppointmentsRoute() {
  return (
    <RoutePlaceholder
      icon={CalendarDays}
      showBack
      titleKey="navigation.appointments"
    />
  );
}

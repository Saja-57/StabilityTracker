import { MessageSquare } from "lucide-react-native";

import { RoutePlaceholder } from "@/components/layout/route-placeholder";

export default function MessagesRoute() {
  return (
    <RoutePlaceholder icon={MessageSquare} titleKey="navigation.messages" />
  );
}

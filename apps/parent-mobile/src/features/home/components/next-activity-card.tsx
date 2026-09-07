import { CalendarClock } from "lucide-react-native";

import { Card, Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { HomeCardHeader } from "./home-card-header";
import { HomeUnavailableState } from "./home-unavailable-state";

export function NextActivityCard() {
  const { t } = useLanguage();

  return (
    <Card>
      <HomeCardHeader
        icon={CalendarClock}
        title={t("home.nextActivity.title")}
      />
      <Divider spacingSize="medium" />
      <HomeUnavailableState
        description={t("home.nextActivity.emptyDescription")}
        title={t("home.nextActivity.emptyTitle")}
      />
    </Card>
  );
}

import type { Href } from "expo-router";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/ui";

import { CaregiverSurveyCard } from "./components/caregiver-survey-card";
import { DailyContext } from "./components/daily-context";
import { HomeHeader } from "./components/home-header";
import { NeedHelpCard } from "./components/need-help-card";
import { NextActivityCard } from "./components/next-activity-card";
import { QuickActions, type HomeActionHref } from "./components/quick-actions";
import { TodayProgressCard } from "./components/today-progress-card";

type HomeRouteHref = HomeActionHref | "/surveys";

export function HomeScreen() {
  const router = useRouter();

  const navigate = (href: HomeRouteHref) => {
    router.push(href as Href);
  };

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <HomeHeader />
      <DailyContext />
      <TodayProgressCard />
      <NeedHelpCard onPress={() => navigate("/log")} />
      <NextActivityCard />
      <CaregiverSurveyCard onPress={() => navigate("/surveys")} />
      <QuickActions onNavigate={navigate} />
    </ScreenContainer>
  );
}

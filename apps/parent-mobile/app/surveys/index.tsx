import { SurveyScreen } from "@/features/surveys";
import { useFamilyContent } from "@/lib/use-family-content";
import { useFamilyStore } from "@/providers/family-store-provider";

export default function SurveysRoute() {
  const { family, weeklySurvey } = useFamilyContent();
  const { record, submitSurvey } = useFamilyStore();
  const sent = record.surveys[weeklySurvey.id];
  return (
    <SurveyScreen
      state={{ status: "available", survey: weeklySurvey }}
      therapistName={family.therapist.givenName}
      onSubmit={(responses) => submitSurvey(weeklySurvey.id, responses)}
      {...(sent ? { submitted: sent.responses } : {})}
    />
  );
}

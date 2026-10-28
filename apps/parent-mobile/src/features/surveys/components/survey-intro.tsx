import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  Magnet,
  Paper,
  Row,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, space } from "@/theme/case-file";

import type { CaregiverSurveyViewModel } from "../types";
import { SurveyProgress } from "./survey-progress";

export interface SurveyIntroProps {
  readonly survey: CaregiverSurveyViewModel;
  readonly therapistName?: string;
}

/** The check-in as a single sheet on the door: what it is and how long. */
export function SurveyIntro({ survey, therapistName }: SurveyIntroProps) {
  const { t } = useLanguage();
  const contentLanguage = survey.contentLanguage
    ? { language: survey.contentLanguage }
    : {};
  const hasOptional = survey.questions.some((question) => question.isOptional);

  return (
    <Animated.View
      entering={FadeInDown.duration(520).delay(60).easing(paperEase)}
      style={styles.held}
    >
      <View style={styles.magnetPin}>
        <Magnet unread />
      </View>
      <Paper style={styles.sheet}>
        <Row style={styles.between}>
          <View style={styles.iconTile}>
            <Glyph name="survey" color={cf.tab.goldInk} size={28} tint={0.25} />
          </View>
          {therapistName ? (
            <TabLabel
              tone="gold"
              label={fill(t("checkin.for"), { name: isolate(therapistName) })}
            />
          ) : null}
        </Row>
        <Type variant="hero" accessibilityRole="header" {...contentLanguage}>
          {isolate(survey.title)}
        </Type>
        {survey.description ? (
          <Type variant="lede" color="secondary" {...contentLanguage}>
            {isolate(survey.description)}
          </Type>
        ) : null}
        <View style={styles.rule} />
        <View style={styles.meta}>
          <Type variant="label" color="secondary" style={styles.figures}>
            {fill(t("checkin.intro.count"), { count: survey.questions.length })}
          </Type>
          <SurveyProgress
            current={0}
            total={survey.questions.length}
            size={18}
          />
          {hasOptional ? (
            <Type variant="small" color="muted">
              {t("checkin.intro.optional")}
            </Type>
          ) : null}
        </View>
      </Paper>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  between: { justifyContent: "space-between" },
  held: { paddingTop: 12, transform: [{ rotate: "-0.8deg" }] },
  magnetPin: {
    alignItems: "center",
    end: 0,
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 2,
  },
  sheet: {
    borderRadius: 8,
    gap: 18,
    padding: 24,
    paddingTop: 30,
    ...elevation.lift,
  },
  iconTile: {
    alignItems: "center",
    backgroundColor: cf.tab.goldWash,
    borderRadius: corner.md,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  rule: { backgroundColor: cf.sheet.rule, height: 1 },
  meta: { gap: space.md },
  figures: { fontVariant: ["tabular-nums"] },
});

import { StyleSheet, TextInput } from "react-native";

import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink } from "@/theme/case-file";
import { getDirectionalTextStyle } from "@/theme/direction";

import type { LongTextSurveyQuestion, ShortTextSurveyQuestion } from "../types";
import { SurveyQuestionFrame } from "./survey-question-frame";

export interface TextQuestionProps {
  readonly onChange: (value: string) => void;
  readonly question: LongTextSurveyQuestion | ShortTextSurveyQuestion;
  readonly value: string;
}

/** A roomy sheet to write on; short answers get a single comfortable line. */
export function TextQuestion({ onChange, question, value }: TextQuestionProps) {
  const { language, t } = useLanguage();
  const long = question.type === "longText";

  return (
    <SurveyQuestionFrame
      hint={t("checkin.hint.text")}
      isOptional={question.isOptional}
      {...(question.language ? { language: question.language } : {})}
      prompt={question.prompt}
    >
      <TextInput
        accessibilityHint={t(`surveys.types.${question.type}`)}
        accessibilityLabel={question.prompt}
        multiline={long}
        onChangeText={onChange}
        placeholder={t("checkin.placeholder")}
        placeholderTextColor={ink.muted}
        selectionColor={cf.pen}
        style={[
          getDirectionalTextStyle(language),
          styles.input,
          long ? styles.long : styles.short,
        ]}
        textAlignVertical={long ? "top" : "center"}
        value={value}
      />
    </SurveyQuestionFrame>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: cf.sheet.raised,
    borderColor: cf.sheet.rule,
    borderRadius: corner.md,
    borderWidth: 1,
    color: ink.primary,
    fontSize: 18,
    lineHeight: 27,
    boxShadow: cf.shadow.folder,
    paddingHorizontal: 18,
  },
  long: { minHeight: 220, paddingVertical: 16 },
  short: { minHeight: 60, paddingVertical: 12 },
});

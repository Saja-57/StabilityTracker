import { TextArea, TextInput } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { LongTextSurveyQuestion, ShortTextSurveyQuestion } from "../types";
import { SurveyQuestionFrame } from "./survey-question-frame";

export interface TextQuestionProps {
  readonly onChange: (value: string) => void;
  readonly question: LongTextSurveyQuestion | ShortTextSurveyQuestion;
  readonly value: string;
}

export function TextQuestion({ onChange, question, value }: TextQuestionProps) {
  const { t } = useLanguage();
  const label = t(`surveys.types.${question.type}`);
  const inputProps = {
    accessibilityLabel: question.prompt,
    label,
    onChangeText: onChange,
    placeholder: t(
      question.type === "longText"
        ? "surveys.text.longPlaceholder"
        : "surveys.text.shortPlaceholder",
    ),
    value,
    ...(question.language ? { language: question.language } : {}),
  };

  return (
    <SurveyQuestionFrame
      isOptional={question.isOptional}
      {...(question.language ? { language: question.language } : {})}
      prompt={question.prompt}
    >
      {question.type === "longText" ? (
        <TextArea {...inputProps} />
      ) : (
        <TextInput {...inputProps} />
      )}
    </SurveyQuestionFrame>
  );
}

import type {
  SurveyQuestion as SurveyQuestionModel,
  SurveyResponseValue,
} from "../types";
import { MultiChoiceQuestion } from "./multi-choice-question";
import { ScaleQuestion } from "./scale-question";
import { SingleChoiceQuestion } from "./single-choice-question";
import { TextQuestion } from "./text-question";

export interface SurveyQuestionProps {
  readonly onChange: (value: SurveyResponseValue) => void;
  readonly question: SurveyQuestionModel;
  readonly value?: SurveyResponseValue;
}

export function SurveyQuestion({
  onChange,
  question,
  value,
}: SurveyQuestionProps) {
  switch (question.type) {
    case "singleChoice":
      return (
        <SingleChoiceQuestion
          onChange={onChange}
          question={question}
          {...(typeof value === "string" ? { value } : {})}
        />
      );
    case "multiChoice":
      return (
        <MultiChoiceQuestion
          onChange={onChange}
          question={question}
          value={Array.isArray(value) ? value : []}
        />
      );
    case "scale":
      return (
        <ScaleQuestion
          onChange={onChange}
          question={question}
          {...(typeof value === "number" ? { value } : {})}
        />
      );
    case "shortText":
    case "longText":
      return (
        <TextQuestion
          onChange={onChange}
          question={question}
          value={typeof value === "string" ? value : ""}
        />
      );
  }
}

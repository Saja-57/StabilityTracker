import type { SupportedLanguage } from "@stability/i18n";

import type { SurveyQuestion, SurveyResponseValue } from "./types";

export interface AnswerSegment {
  readonly language?: SupportedLanguage;
  readonly text: string;
}

export function hasResponse(value: SurveyResponseValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return typeof value === "string" ? value.trim().length > 0 : true;
}

/** The chosen option labels or written text for one answer, in display order. */
export function answerSegments(
  question: SurveyQuestion,
  response: SurveyResponseValue | undefined,
): readonly AnswerSegment[] {
  if (!hasResponse(response)) {
    return [];
  }
  const own = question.language ? { language: question.language } : {};

  switch (question.type) {
    case "singleChoice": {
      const option = question.options.find((item) => item.id === response);
      return option
        ? [
            {
              text: option.label,
              ...(option.language ? { language: option.language } : {}),
            },
          ]
        : [];
    }
    case "multiChoice":
      return Array.isArray(response)
        ? question.options
            .filter((option) => response.includes(option.id))
            .map((option) => ({
              text: option.label,
              ...(option.language ? { language: option.language } : {}),
            }))
        : [];
    case "scale":
      return typeof response === "number"
        ? [{ text: String(response), ...own }]
        : [];
    case "shortText":
    case "longText":
      return typeof response === "string"
        ? [{ text: response.trim(), ...own }]
        : [];
  }
}

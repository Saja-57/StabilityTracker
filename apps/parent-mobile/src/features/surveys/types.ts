import type { SupportedLanguage } from "@stability/i18n";

export type SurveyQuestionType =
  "singleChoice" | "multiChoice" | "scale" | "shortText" | "longText";

export interface SurveyChoiceOption {
  readonly id: string;
  readonly label: string;
  readonly language?: SupportedLanguage;
}

interface SurveyQuestionBase {
  readonly id: string;
  readonly isOptional: boolean;
  readonly language?: SupportedLanguage;
  readonly prompt: string;
}

export interface SingleChoiceSurveyQuestion extends SurveyQuestionBase {
  readonly options: readonly SurveyChoiceOption[];
  readonly type: "singleChoice";
}

export interface MultiChoiceSurveyQuestion extends SurveyQuestionBase {
  readonly options: readonly SurveyChoiceOption[];
  readonly type: "multiChoice";
}

export interface ScaleSurveyQuestion extends SurveyQuestionBase {
  readonly maximum: number;
  /** Words under the highest step; a calm default is used when absent. */
  readonly maximumLabel?: string;
  readonly minimum: number;
  /** Words under the lowest step; a calm default is used when absent. */
  readonly minimumLabel?: string;
  readonly type: "scale";
}

export interface ShortTextSurveyQuestion extends SurveyQuestionBase {
  readonly type: "shortText";
}

export interface LongTextSurveyQuestion extends SurveyQuestionBase {
  readonly type: "longText";
}

export type SurveyQuestion =
  | SingleChoiceSurveyQuestion
  | MultiChoiceSurveyQuestion
  | ScaleSurveyQuestion
  | ShortTextSurveyQuestion
  | LongTextSurveyQuestion;

export interface CaregiverSurveyViewModel {
  readonly contentLanguage?: SupportedLanguage;
  readonly description?: string;
  readonly id: string;
  readonly questions: readonly SurveyQuestion[];
  readonly title: string;
}

export type SurveyResponseValue = string | number | readonly string[];
export type SurveyResponseMap = Readonly<
  Record<string, SurveyResponseValue | undefined>
>;

export type SurveyScreenState =
  | { readonly status: "empty" }
  | { readonly status: "loading" }
  | { readonly status: "error" }
  | {
      readonly status: "available";
      readonly survey: CaregiverSurveyViewModel;
    };

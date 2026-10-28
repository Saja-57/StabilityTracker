import type { SupportedLanguage } from "@stability/i18n";

import type { PictogramName } from "@/components/icons/pictograms";

export type RoutineStepStatus =
  "upcoming" | "current" | "completed" | "skipped" | "delayed";

export interface RoutineContextViewModel {
  readonly childDisplayName?: string;
  readonly contentLanguage?: SupportedLanguage;
  readonly periodLabel?: string;
  readonly routineName?: string;
  /** The routine's day, "YYYY-MM-DD"; shown on the slate date stamp. */
  readonly date?: string;
}

export interface RoutineSummaryViewModel {
  readonly completedSteps: number;
  readonly progressPercent: number;
  readonly totalSteps: number;
}

export interface RoutineCompletionViewModel {
  readonly caregiverDisplayName?: string;
  readonly caregiverLanguage?: SupportedLanguage;
  readonly completedAt?: string;
}

/** A change the therapist made to this step. */
export interface RoutineAdjustmentViewModel {
  readonly byDisplayName: string;
  readonly note?: string;
}

/** Support keys shared with vocab.support.* and the support pictograms. */
export type RoutineSupportKey =
  | "deepPressure"
  | "quietSpace"
  | "visualTimer"
  | "choices"
  | "movementBreak"
  | "music"
  | "countdown"
  | "headphones";

export interface RoutineStepViewModel {
  readonly adjusted?: RoutineAdjustmentViewModel;
  readonly completion?: RoutineCompletionViewModel;
  readonly description?: string;
  /** "HH:mm" end of a step that spans time, such as the school day. */
  readonly endsAt?: string;
  readonly id: string;
  readonly order: number;
  readonly pictogram?: PictogramName;
  /** "HH:mm" start time. */
  readonly scheduledAt?: string;
  readonly status: RoutineStepStatus;
  readonly support?: RoutineSupportKey;
  readonly textLanguage?: SupportedLanguage;
  readonly title: string;
}

export interface RoutineViewModel {
  readonly context?: RoutineContextViewModel;
  readonly steps: readonly RoutineStepViewModel[];
  readonly summary?: RoutineSummaryViewModel;
}

export type RoutineViewState =
  | { readonly status: "loading" }
  | { readonly onRetry: () => void; readonly status: "error" }
  | { readonly routine: RoutineViewModel; readonly status: "ready" };

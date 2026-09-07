import type { SupportedLanguage } from "@stability/i18n";

export type RoutineStepStatus =
  "upcoming" | "current" | "completed" | "skipped" | "delayed";

export interface RoutineContextViewModel {
  readonly childDisplayName?: string;
  readonly contentLanguage?: SupportedLanguage;
  readonly periodLabel?: string;
  readonly routineName?: string;
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

export interface RoutineStepViewModel {
  readonly completion?: RoutineCompletionViewModel;
  readonly description?: string;
  readonly id: string;
  readonly order: number;
  readonly scheduledAt?: string;
  readonly status: RoutineStepStatus;
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

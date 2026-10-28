import type { PictogramName } from "@/components/icons/pictograms";

export type StrategyId =
  | "deepPressure"
  | "headphones"
  | "quietSpace"
  | "countdown"
  | "visualTimer"
  | "breathe";

export interface StrategyViewModel {
  readonly id: StrategyId;
  readonly pictogram: PictogramName;
  /** Approved by the therapist for the child; otherwise a strategy for the caregiver. */
  readonly approved: boolean;
  readonly when: string;
  readonly steps: readonly string[];
  readonly worked: number;
  readonly tried: number;
}

export interface ResourcesScreenProps {
  readonly strategies: readonly StrategyViewModel[];
  readonly therapistGivenName: string;
  readonly childGivenName: string;
}

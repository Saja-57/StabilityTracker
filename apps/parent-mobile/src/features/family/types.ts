import type { CaregiverViewModel, Relation } from "@/features/more/types";

export type FocusArea =
  | "sensory"
  | "transitions"
  | "emotionalRegulation"
  | "communication"
  | "sleep"
  | "feeding"
  | "social";

export type CareRole = "therapist" | "school" | "pediatrician";

export interface FamilyScreenProps {
  readonly child: {
    readonly name: string;
    readonly givenName: string;
    readonly age: number;
    readonly focus: readonly FocusArea[];
    readonly goal: string;
  };
  readonly caregivers: readonly CaregiverViewModel[];
  readonly careTeam: readonly {
    readonly name: string;
    readonly role: CareRole;
    readonly detail: string;
  }[];
  readonly therapistGivenName: string;
}

export type { CaregiverViewModel, Relation };

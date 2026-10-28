export type Relation =
  "mother" | "father" | "grandmother" | "grandfather" | "guardian";

export interface CaregiverViewModel {
  readonly name: string;
  readonly givenName: string;
  readonly relation: Relation;
  readonly you: boolean;
}

export interface MoreHubViewModel {
  readonly child: {
    readonly name: string;
    readonly givenName: string;
    readonly age: number;
  };
  readonly caregivers: readonly CaregiverViewModel[];
  readonly therapistGivenName: string;
  /** A weekly check-in is waiting on the parent. */
  readonly checkInWaiting: boolean;
  /** The next visit, if one is booked. */
  readonly nextVisit?: {
    readonly at: string;
    readonly isToday: boolean;
    /** What the visit is about, in the therapist's words. */
    readonly focus?: string;
  };
}

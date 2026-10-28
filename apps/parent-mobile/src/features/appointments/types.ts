export type VisitMode = "clinic" | "video" | "home";

export interface VisitViewModel {
  readonly id: string;
  /** Local wall-clock time, "YYYY-MM-DDTHH:mm". */
  readonly at: string;
  readonly durationMin: number;
  readonly mode: VisitMode;
  readonly focus: string;
  readonly place: string;
  readonly bring: readonly string[];
}

export interface PastVisitViewModel {
  readonly id: string;
  readonly at: string;
  readonly focus: string;
  readonly summary: string;
}

export interface AppointmentsScreenProps {
  readonly now: string;
  readonly therapistGivenName: string;
  readonly visits: readonly VisitViewModel[];
  readonly pastVisits: readonly PastVisitViewModel[];
}

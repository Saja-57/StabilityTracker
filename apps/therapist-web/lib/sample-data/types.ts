export type EventType = "behavioralEvent" | "meltdown" | "sensoryOverload" | "other";
export type Intensity = "low" | "moderate" | "high";
export type FileStatus = "needsReview" | "sessionToday" | "steady";
export type Trend = "calmer" | "steady" | "busier";

export type FocusArea =
  | "sensory"
  | "transitions"
  | "emotionalRegulation"
  | "communication"
  | "sleep"
  | "feeding"
  | "social";

export type Trigger =
  | "transition"
  | "noise"
  | "demand"
  | "denied"
  | "tired"
  | "crowd"
  | "screenOff"
  | "unknown";

export type Setting = "home" | "school" | "car" | "store" | "outdoors" | "bedtime";

export type Support =
  | "deepPressure"
  | "quietSpace"
  | "visualTimer"
  | "choices"
  | "movementBreak"
  | "music"
  | "countdown"
  | "headphones";

export type CaregiverRelation = "mother" | "father" | "grandmother" | "grandfather" | "guardian";

export interface Caregiver {
  readonly name: string;
  readonly relation: CaregiverRelation;
  readonly primary: boolean;
}

export interface CareEvent {
  readonly id: string;
  readonly childId: string;
  readonly at: string;
  readonly type: EventType;
  readonly intensity: Intensity;
  readonly trigger: Trigger;
  readonly setting: Setting;
  readonly durationMin: number;
  readonly recoveryMin: number;
  readonly helped: readonly Support[];
  readonly helpedWorked: boolean;
  readonly before: string;
  readonly behavior: string;
  readonly reporter: string;
  readonly reviewed: boolean;
  readonly flagged: boolean;
  readonly quick: boolean;
}

export type StepStatus = "completed" | "skipped" | "delayed" | "upcoming" | "current";

export interface RoutineStep {
  readonly id: string;
  readonly time: string;
  readonly label: string;
  /** Oldest first, last 14 days; the final entry is today. */
  readonly history: readonly StepStatus[];
  readonly adjusted?: boolean;
}

export interface SurveyResult {
  readonly id: string;
  readonly title: string;
  readonly sentAt: string;
  readonly answeredAt: string | null;
  readonly score: number | null;
  readonly previousScore: number | null;
  readonly highlight: string;
}

export interface SessionNote {
  readonly id: string;
  readonly at: string;
  readonly kind: "session" | "observation" | "plan";
  readonly title: string;
  readonly body: string;
}

export type MessageKind = "recommendation" | "observation" | "reminder" | "routineAdjustment" | "reply";

export interface ThreadMessage {
  readonly id: string;
  readonly at: string;
  readonly from: "therapist" | "family";
  readonly author: string;
  readonly kind: MessageKind;
  readonly body: string;
  readonly read: boolean;
}

export type SessionMode = "clinic" | "video" | "home";

export interface Appointment {
  readonly id: string;
  readonly childId: string;
  readonly start: string;
  readonly durationMin: number;
  readonly mode: SessionMode;
  readonly focus: string;
}

export interface ChildFile {
  readonly id: string;
  readonly name: string;
  readonly givenName: string;
  readonly age: number;
  readonly since: string;
  readonly focus: readonly FocusArea[];
  readonly caregivers: readonly Caregiver[];
  readonly status: FileStatus;
  readonly statusReason: string;
  readonly pattern: string;
  readonly lastSession: string;
  readonly nextSession: string | null;
  readonly goal: string;
  readonly tabHue: "moss" | "cobalt" | "clay" | "ruby" | "gold";
}

export interface ReportDocument {
  readonly id: string;
  readonly childId: string;
  readonly title: string;
  readonly period: string;
  readonly status: "draft" | "ready" | "shared";
  readonly updatedAt: string;
  readonly audience: "family" | "school" | "clinicalTeam";
}

export interface TherapistProfile {
  readonly name: string;
  readonly givenName: string;
  readonly credential: string;
  readonly practice: string;
}

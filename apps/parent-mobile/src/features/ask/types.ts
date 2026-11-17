import type { AskDestination } from "./ask-client";

export interface AskScreenProps {
  readonly therapistGivenName: string;
  readonly childGivenName: string;
  /** Plain-text summary of the family's plan, routine and logs for grounding. */
  readonly context: string;
  readonly onNavigate: (destination: AskDestination) => void;
  readonly onMessageTherapist: () => void;
}

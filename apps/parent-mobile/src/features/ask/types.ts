export interface AskExchangeViewModel {
  readonly question: string;
  readonly answer: string;
  readonly source: string;
}

export interface AskScreenProps {
  /** Scripted, plan-grounded answers. Ask is a preview, not a live model. */
  readonly library: readonly AskExchangeViewModel[];
  readonly therapistGivenName: string;
  readonly childGivenName: string;
  readonly onMessageTherapist: () => void;
}

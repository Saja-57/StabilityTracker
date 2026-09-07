export interface ShadowToken {
  readonly color: string;
  readonly opacity: number;
  readonly radius: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly elevation: number;
  readonly web: string;
}

export const shadows = {
  none: {
    color: "#17231F",
    opacity: 0,
    radius: 0,
    offsetX: 0,
    offsetY: 0,
    elevation: 0,
    web: "none",
  },
  subtle: {
    color: "#17231F",
    opacity: 0.08,
    radius: 8,
    offsetX: 0,
    offsetY: 2,
    elevation: 2,
    web: "0 2px 8px rgba(23, 35, 31, 0.08)",
  },
  raised: {
    color: "#17231F",
    opacity: 0.1,
    radius: 16,
    offsetX: 0,
    offsetY: 4,
    elevation: 4,
    web: "0 4px 16px rgba(23, 35, 31, 0.10)",
  },
} as const satisfies Record<string, ShadowToken>;

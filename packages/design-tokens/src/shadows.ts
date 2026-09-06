export interface ShadowToken {
  readonly color: string;
  readonly opacity: number;
  readonly radius: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly elevation: number;
}

export const shadows = {
  none: {
    color: "#000000",
    opacity: 0,
    radius: 0,
    offsetX: 0,
    offsetY: 0,
    elevation: 0,
  },
  subtle: {
    color: "#1C211F",
    opacity: 0.08,
    radius: 8,
    offsetX: 0,
    offsetY: 2,
    elevation: 2,
  },
} as const satisfies Record<string, ShadowToken>;

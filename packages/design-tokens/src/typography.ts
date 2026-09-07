export type TypographyWeight = "400" | "500" | "700";

export interface TypographyStyle {
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: TypographyWeight;
  readonly letterSpacing: number;
}

export const typography = {
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  pageTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.35,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: 0,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    letterSpacing: 0.15,
  },
  helper: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    letterSpacing: 0.1,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
} as const satisfies Record<string, TypographyStyle>;

export type TypographyVariant = keyof typeof typography;

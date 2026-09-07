/** Approved matte foundation palette. All application colors derive from here. */
export const colors = {
  background: {
    canvas: "#F4F2EC",
    subtle: "#EBEEE9",
    elevated: "#FAF9F5",
  },
  surface: {
    primary: "#FFFEFB",
    secondary: "#F1F3EF",
    interactive: "#E6ECE8",
  },
  text: {
    primary: "#1D2925",
    secondary: "#4A5B55",
    muted: "#6F7D76",
    inverse: "#F8FAF8",
  },
  border: {
    subtle: "#DEE3DF",
    default: "#C7D0CB",
    strong: "#8F9E97",
  },
  brand: {
    primary: "#315F52",
    primaryHover: "#294F45",
    primaryPressed: "#213F37",
    secondary: "#738C82",
    subtle: "#DDE9E4",
  },
  status: {
    success: "#2F684C",
    warning: "#7A5A28",
    danger: "#824342",
    info: "#3F6765",
  },
  statusSurface: {
    success: "#E2ECE6",
    warning: "#F2E9D8",
    danger: "#F2E2E0",
    info: "#E1EBEA",
  },
  focus: {
    ring: "#4E806F",
  },
  overlay: {
    backdrop: "rgba(19, 29, 25, 0.56)",
  },
} as const;

export type TextColor = keyof typeof colors.text;
export type StatusColor = keyof typeof colors.status;

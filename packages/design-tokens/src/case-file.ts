/**
 * Case File material palette for the therapist web workspace.
 * Pressboard frames the workspace, sheet stock carries all reading, and
 * index-tab inks carry status. Gold is reserved for therapist action.
 */
export const caseFile = {
  pressboard: {
    deep: "#132A23",
    base: "#1C362E",
    raised: "#26443A",
    line: "#335549",
    ink: "#E9F0EA",
    inkMuted: "#A7BDB2",
    inkFaint: "#7F988C",
  },
  sheet: {
    base: "#F2F4F0",
    raised: "#FBFCFA",
    sunk: "#E7ECE6",
    rule: "#D3DCD5",
    ruleStrong: "#B4C2B9",
    ink: "#13201B",
    inkSecondary: "#3B4D45",
    inkMuted: "#5F7069",
  },
  tab: {
    gold: "#E2B04F",
    goldInk: "#6E4A0E",
    goldWash: "#F7E8C6",
    ruby: "#A3403A",
    rubyInk: "#8A2F2A",
    rubyWash: "#F4DEDA",
    cobalt: "#2F5C8A",
    cobaltInk: "#244C74",
    cobaltWash: "#DDE7F1",
    moss: "#3D7A5C",
    mossInk: "#2B5F46",
    mossWash: "#DCEBE2",
    clay: "#B97A3A",
    clayWash: "#F2E4D3",
  },
  intensity: {
    low: "#5F8F79",
    moderate: "#B88019",
    high: "#A3403A",
  },
  pen: "#2E4DA3",
  stamp: "#34506B",
  shadow: {
    sheet:
      "0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 24px 48px -24px rgba(5, 18, 13, 0.55), 0 2px 6px rgba(5, 18, 13, 0.18)",
    folder:
      "0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 10px 24px -12px rgba(19, 32, 27, 0.32), 0 1px 2px rgba(19, 32, 27, 0.12)",
    lift: "0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 22px 40px -18px rgba(19, 32, 27, 0.42), 0 2px 6px rgba(19, 32, 27, 0.14)",
    press: "0 1px 2px rgba(19, 32, 27, 0.18)",
  },
  overlay: "rgba(8, 20, 15, 0.52)",
  selection: "rgba(226, 176, 79, 0.38)",
} as const;

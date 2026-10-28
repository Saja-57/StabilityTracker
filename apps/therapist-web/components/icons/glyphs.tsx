import type { SVGProps } from "react";

/**
 * Case File glyphs. Drawn on a 24px grid: 1.6 stroke, round caps and joins,
 * and one tinted plane per glyph for the duotone layer.
 */
interface GlyphDefinition {
  readonly stroke: readonly string[];
  readonly tint?: readonly string[];
  /** Mirror horizontally in right-to-left layouts. */
  readonly directional?: boolean;
}

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const glyphs = {
  desk: {
    stroke: [
      "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z",
      "M8 8.75h8",
      "M8 12h5",
      circle(15.5, 16, 1.6),
    ],
    tint: [
      "M4 13.5h16v4a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z",
    ],
  },
  files: {
    stroke: [
      "M6.5 5.5V5A1.5 1.5 0 0 1 8 3.5h2.6l1.6 1.6h4.3A1.5 1.5 0 0 1 18 6.6v.4",
      "M3 9.5a2 2 0 0 1 2-2h4.2l1.8 1.8h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      "M7 15.5h5",
    ],
    tint: ["M3 12h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
  },
  calendar: {
    stroke: [
      "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
      "M4 10h16",
      "M8.5 3.25V6.5",
      "M15.5 3.25V6.5",
      "M13 13.5h3v3h-3z",
    ],
    tint: ["M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4z"],
  },
  messages: {
    stroke: [
      "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11.5L7 19.75V16h-.5A2.5 2.5 0 0 1 4 13.5z",
      "M8 8.5h8",
      "M8 11.75h5",
    ],
    tint: [
      "M4 10.5h16v3a2.5 2.5 0 0 1-2.5 2.5H11.5L7 19.75V16h-.5A2.5 2.5 0 0 1 4 13.5z",
    ],
  },
  reports: {
    stroke: [
      "M14 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-10z",
      "M14 3.5v5h5",
      "M9 17v-2.5",
      "M12 17v-5",
      "M15 17v-3.5",
    ],
    tint: ["M14 3.5v5h5z"],
  },
  insights: {
    stroke: [
      circle(10.5, 10.5, 6.25),
      "M15.25 15.25L20 20",
      "M7 11.5l2-2 2 2.25 2.75-3.25",
    ],
    tint: [circle(10.5, 10.5, 6.25)],
  },
  notes: {
    stroke: [
      "M14.5 20.5H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3.25",
      "M8.5 8h5",
      "M8.5 11.5h3",
      "M19.6 11.4a1.5 1.5 0 0 1 2.1 2.1l-5.5 5.6-2.8.7.7-2.8z",
    ],
    tint: ["M19.6 11.4a1.5 1.5 0 0 1 2.1 2.1l-5.5 5.6-2.8.7.7-2.8z"],
  },
  settings: {
    stroke: [
      "M4 7.5h8.5",
      "M17.5 7.5H20",
      "M4 16.5h2.5",
      "M11.5 16.5H20",
      circle(15, 7.5, 2.25),
      circle(9, 16.5, 2.25),
    ],
    tint: [circle(15, 7.5, 2.25), circle(9, 16.5, 2.25)],
  },
  search: {
    stroke: [circle(10.75, 10.75, 6), "M15.25 15.25L19.5 19.5"],
    tint: [circle(10.75, 10.75, 6)],
  },
  chevron: { stroke: ["M9.5 6l6 6-6 6"], directional: true },
  chevronDown: { stroke: ["M6 9.5l6 6 6-6"] },
  arrow: { stroke: ["M5 12h14", "M13.5 6.5L19 12l-5.5 5.5"], directional: true },
  arrowBack: {
    stroke: ["M19 12H5", "M10.5 6.5L5 12l5.5 5.5"],
    directional: true,
  },
  plus: { stroke: ["M12 5v14", "M5 12h14"] },
  close: { stroke: ["M6.5 6.5l11 11", "M17.5 6.5l-11 11"] },
  menu: { stroke: ["M4 7h16", "M4 12h10", "M4 17h16"] },
  tick: { stroke: ["M5 12.75l4.25 4.25L19 7.25"] },
  flag: {
    stroke: ["M5.5 21V4.5", "M5.5 5h11.25l-2.25 4 2.25 4H5.5"],
    tint: ["M5.5 5h11.25l-2.25 4 2.25 4H5.5z"],
  },
  clock: {
    stroke: [circle(12, 12, 8.25), "M12 7.5V12l3 2"],
    tint: [circle(12, 12, 8.25)],
  },
  video: {
    stroke: [
      "M3.5 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z",
      "M15.5 10.25l5-2.75v9l-5-2.75",
    ],
    tint: ["M3.5 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"],
  },
  clinic: {
    stroke: [
      "M3.5 20.5h17",
      "M6 20.5V8.5l6-4.25 6 4.25v12",
      "M10 20.5V16h4v4.5",
      "M12 9v3.5",
      "M10.25 10.75h3.5",
    ],
    tint: ["M6 8.5l6-4.25 6 4.25V12H6z"],
  },
  home: {
    stroke: [
      "M4 10.5L12 4l8 6.5",
      "M6 9v9.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V9",
      "M10 20v-5h4v5",
    ],
    tint: ["M6 9l6-4.9L18 9v2H6z"],
  },
  routine: {
    stroke: ["M4 18.5h4v-4h4v-4h4v-4h4"],
    tint: ["M4 18.5h4v-4h4v-4h4v-4h4v12.5H4z"],
  },
  pulse: { stroke: ["M3 12.5h3.5l2.5-6 4.5 12 2.5-6H21"] },
  leaf: {
    stroke: [
      "M5 19.5c0-8.5 5-14.5 15-14.5 0 9.5-6 14.5-13.5 14.5",
      "M5 19.5c3.25-4.25 6.5-7.25 10.5-9.5",
    ],
    tint: ["M5 19.5c0-8.5 5-14.5 15-14.5 0 9.5-6 14.5-13.5 14.5z"],
  },
  spark: {
    stroke: [
      "M12 3.5v3",
      "M12 17.5v3",
      "M3.5 12h3",
      "M17.5 12h3",
      "M6 6l2 2",
      "M16 16l2 2",
      "M6 18l2-2",
      "M16 8l2-2",
      circle(12, 12, 2.5),
    ],
    tint: [circle(12, 12, 2.5)],
  },
  family: {
    stroke: [
      circle(9, 7.5, 3),
      "M3.5 20a5.5 5.5 0 0 1 11 0",
      circle(17, 11, 2.1),
      "M14.25 20h6.25a3.5 3.5 0 0 0-5.9-2.55",
    ],
    tint: ["M3.5 20a5.5 5.5 0 0 1 11 0z"],
  },
  person: {
    stroke: [circle(12, 8, 3.5), "M5 20a7 7 0 0 1 14 0"],
    tint: ["M5 20a7 7 0 0 1 14 0z"],
  },
  survey: {
    stroke: [
      "M8 5H6.5A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 5H16",
      "M9 3.5h6v3H9z",
      "M8.75 13l2.25 2.25 4.25-4.75",
    ],
    tint: ["M9 3.5h6v3H9z"],
  },
  send: {
    stroke: ["M20.5 3.5L10.25 13.75", "M20.5 3.5l-6.25 17-4-6.75-6.75-4z"],
    tint: ["M20.5 3.5l-6.25 17-4-6.75-6.75-4z"],
    directional: true,
  },
  bell: {
    stroke: [
      "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z",
      "M10 20.75a2 2 0 0 0 4 0",
    ],
    tint: ["M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"],
  },
  globe: {
    stroke: [
      circle(12, 12, 8.5),
      "M3.5 12h17",
      "M12 3.5c2.4 2.5 3.5 5.4 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.4-3.5-8.5s1.1-6 3.5-8.5z",
    ],
  },
  more: {
    stroke: [circle(6, 12, 0.6), circle(12, 12, 0.6), circle(18, 12, 0.6)],
  },
  trendUp: { stroke: ["M4 16.5l5-5 3.5 3.5L20 7.5", "M15 7.5h5v5"] },
  trendDown: { stroke: ["M4 7.5l5 5 3.5-3.5L20 16.5", "M15 16.5h5v-5"] },
  steady: { stroke: ["M4 12h15", "M15.5 8l4 4-4 4"], directional: true },
  edit: {
    stroke: ["M15.5 4.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z", "M13.75 6.25l3 3"],
    tint: ["M15.5 4.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"],
  },
  download: { stroke: ["M12 4v11", "M7 10.5l5 5 5-5", "M5 19.5h14"] },
  drawer: {
    stroke: [
      "M4 5.5h16v4H4z",
      "M5.5 9.5v9A1.5 1.5 0 0 0 7 20h10a1.5 1.5 0 0 0 1.5-1.5v-9",
      "M10 13h4",
    ],
    tint: ["M4 5.5h16v4H4z"],
  },
  filter: { stroke: ["M4 6.5h16", "M7 12h10", "M10 17.5h4"] },
  shield: {
    stroke: [
      "M12 3.5l7 2.5v5.5c0 4.5-3 7.75-7 9-4-1.25-7-4.5-7-9V6z",
      "M9 12l2 2 4-4.25",
    ],
    tint: ["M12 3.5l7 2.5v5.5c0 4.5-3 7.75-7 9-4-1.25-7-4.5-7-9V6z"],
  },
  logout: {
    stroke: [
      "M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14",
      "M10 8l-4 4 4 4",
      "M6 12h9",
    ],
    directional: true,
  },
  sun: {
    stroke: [
      circle(12, 12, 3.5),
      "M12 3.5v1.75",
      "M12 18.75v1.75",
      "M3.5 12h1.75",
      "M18.75 12h1.75",
      "M6 6l1.25 1.25",
      "M16.75 16.75L18 18",
      "M6 18l1.25-1.25",
      "M16.75 7.25L18 6",
    ],
    tint: [circle(12, 12, 3.5)],
  },
  sort: { stroke: ["M8 4v16", "M4.5 7.5L8 4l3.5 3.5", "M16 20V4", "M12.5 16.5L16 20l3.5-3.5"] },
  layers: {
    stroke: ["M12 4l8.5 4.5L12 13 3.5 8.5z", "M3.5 12.5L12 17l8.5-4.5", "M3.5 16.5L12 21l8.5-4.5"],
    tint: ["M12 4l8.5 4.5L12 13 3.5 8.5z"],
  },
  eye: {
    stroke: [
      "M2.75 12S6 5.5 12 5.5 21.25 12 21.25 12 18 18.5 12 18.5 2.75 12 2.75 12z",
      circle(12, 12, 2.75),
    ],
    tint: [circle(12, 12, 2.75)],
  },
} as const satisfies Record<string, GlyphDefinition>;

export type GlyphName = keyof typeof glyphs;

export interface GlyphProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  readonly name: GlyphName;
  readonly size?: number;
  readonly strokeWidth?: number;
  /** Opacity of the duotone plane; set to 0 for a single-weight glyph. */
  readonly tint?: number;
  readonly title?: string;
}

export function Glyph({
  name,
  size = 20,
  strokeWidth = 1.6,
  tint = 0.16,
  title,
  className,
  ...props
}: GlyphProps) {
  const glyph: GlyphDefinition = glyphs[name];

  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={[
        "shrink-0",
        glyph.directional ? "rtl:-scale-x-100" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {glyph.tint && tint > 0
        ? glyph.tint.map((d) => (
            <path key={`t-${d}`} d={d} fill="currentColor" opacity={tint} />
          ))
        : null}
      {glyph.stroke.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      ))}
    </svg>
  );
}

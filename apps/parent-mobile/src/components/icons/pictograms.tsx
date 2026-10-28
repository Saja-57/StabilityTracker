import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

/**
 * Picture-card pictograms for the visual schedule, event types, and calming
 * supports. 48px grid, 2.2 stroke, round caps, one tinted plane per drawing:
 * the same duotone grammar as the glyphs, drawn at fridge-card scale.
 */
interface PictogramDefinition {
  readonly stroke: readonly string[];
  readonly tint?: readonly string[];
}

const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const pictograms = {
  wake: {
    stroke: [
      "M6 36h36",
      "M13 36a11 11 0 0 1 22 0",
      "M24 13v4.5",
      "M12.2 18.2l3.1 3.1",
      "M35.8 18.2l-3.1 3.1",
      "M10 42h28",
    ],
    tint: ["M13 36a11 11 0 0 1 22 0z"],
  },
  dress: {
    stroke: [
      "M17.5 8.5L8 13.5l4.5 8.5 4-2V40h15V20l4 2 4.5-8.5-9.5-5c-1 3.2-3.6 5.2-6.5 5.2s-5.5-2-6.5-5.2z",
    ],
    tint: [
      "M17.5 8.5L8 13.5l4.5 8.5 4-2V40h15V20l4 2 4.5-8.5-9.5-5c-1 3.2-3.6 5.2-6.5 5.2s-5.5-2-6.5-5.2z",
    ],
  },
  breakfast: {
    stroke: [
      "M7 24h34c0 9.4-7.6 16-17 16S7 33.4 7 24z",
      "M31 7l-6 15",
      "M17 18c-2-2.4 2-4.2 0-7",
      "M23 17c-2-2.4 2-4.2 0-7",
    ],
    tint: ["M7 24h34c0 9.4-7.6 16-17 16S7 33.4 7 24z"],
  },
  school: {
    stroke: [
      "M7 40V20.5L24 10l17 10.5V40z",
      "M4 40h40",
      "M20 40v-9h8v9",
      ring(24, 21.5, 3.2),
    ],
    tint: ["M7 20.5L24 10l17 10.5V24H7z"],
  },
  pickup: {
    stroke: [
      ring(15, 11, 4.2),
      "M8 41V25.5a7 7 0 0 1 14 0V41",
      ring(33, 18.5, 3.2),
      "M28 41V30a5 5 0 0 1 10 0v11",
      "M22 29c2.2 2 4 2 6 0",
    ],
    tint: ["M8 41V25.5a7 7 0 0 1 14 0V41z", "M28 41V30a5 5 0 0 1 10 0v11z"],
  },
  decompress: {
    stroke: [
      "M11 29v-5a13 13 0 0 1 26 0v5",
      "M8 27.5h6v11H8z",
      "M34 27.5h6v11h-6z",
    ],
    tint: ["M8 27.5h6v11H8z", "M34 27.5h6v11h-6z"],
  },
  homework: {
    stroke: [
      "M24 14c-5-3-11.5-3.4-17-1.2V38c5.5-2.2 12-1.8 17 1.2 5-3 11.5-3.4 17-1.2V12.8C35.5 10.6 29 11 24 14z",
      "M24 14v25.2",
    ],
    tint: ["M24 14c-5-3-11.5-3.4-17-1.2V38c5.5-2.2 12-1.8 17 1.2z"],
  },
  dinner: {
    stroke: [
      ring(24, 26, 11),
      ring(24, 26, 6),
      "M7 11v9.5",
      "M5 11v5.5a2 2 0 0 0 4 0V11",
      "M41 11c-3.2 2-3.4 8.4-1.2 11.5H41V40",
    ],
    tint: [ring(24, 26, 11)],
  },
  bath: {
    stroke: [
      "M5 24h38v3.5A10.5 10.5 0 0 1 32.5 38h-17A10.5 10.5 0 0 1 5 27.5z",
      "M12 24V12.5a4 4 0 0 1 8 0",
      ring(29, 16, 2.4),
      ring(36, 11, 1.8),
      "M14 38l-2 4",
      "M34 38l2 4",
    ],
    tint: ["M5 24h38v3.5A10.5 10.5 0 0 1 32.5 38h-17A10.5 10.5 0 0 1 5 27.5z"],
  },
  bedtime: {
    stroke: [
      "M30 8a15 15 0 1 0 12 21.5A12 12 0 0 1 30 8z",
      "M12 8v5",
      "M9.5 10.5h5",
      "M18 4v3",
      "M16.5 5.5h3",
    ],
    tint: ["M30 8a15 15 0 1 0 12 21.5A12 12 0 0 1 30 8z"],
  },
  behavioralEvent: {
    stroke: ["M4 26h7l4.5-11 8 22 5-14 3.5 3H44"],
  },
  meltdown: {
    stroke: [
      "M14 31a8 8 0 0 1 .8-16 11.5 11.5 0 0 1 22 3.2A6.5 6.5 0 0 1 36 31z",
      "M23 34l-3.5 6.5h6.5l-3 5",
    ],
    tint: [
      "M14 31a8 8 0 0 1 .8-16 11.5 11.5 0 0 1 22 3.2A6.5 6.5 0 0 1 36 31z",
    ],
  },
  sensoryOverload: {
    stroke: [
      "M15 33c0 4.4 3 7.5 6.5 7.5 3.2 0 5.3-2.2 5.3-5.3 0-4.4 7.2-6.2 7.2-15A12.5 12.5 0 0 0 9 20",
      "M15.5 21a6 6 0 0 1 11.5-2",
      "M38.5 13c2.2 2.4 3.4 5.6 3.4 9s-1.2 6.6-3.4 9",
      "M43 9c3 3.6 4.5 8.2 4.5 13S46 31.4 43 35",
    ],
    tint: [
      "M15 33c0 4.4 3 7.5 6.5 7.5 3.2 0 5.3-2.2 5.3-5.3 0-4.4 7.2-6.2 7.2-15A12.5 12.5 0 0 0 9 20z",
    ],
  },
  other: {
    stroke: [
      ring(24, 24, 17),
      ring(16, 24, 1.2),
      ring(24, 24, 1.2),
      ring(32, 24, 1.2),
    ],
    tint: [ring(24, 24, 17)],
  },
  deepPressure: {
    stroke: [
      ring(24, 19, 8),
      "M7 27c4.5 8.6 11.5 13 17 13s12.5-4.4 17-13",
      "M13 33.5c3 1.6 6.5 1.8 11 1.8s8-.2 11-1.8",
    ],
    tint: [ring(24, 19, 8)],
  },
  quietSpace: {
    stroke: ["M5 41L24 7l19 34z", "M24 41l-5.5-11h11z", "M24 7v-3"],
    tint: ["M5 41L24 7l19 34z"],
  },
  visualTimer: {
    stroke: [ring(24, 27, 15), "M24 27V12", "M21 5h6", "M24 5v7"],
    tint: ["M24 27V12a15 15 0 0 1 13 22.5z"],
  },
  choices: {
    stroke: ["M5 13h16v23H5z", "M27 13h16v23H27z", "M30.5 25l3.2 3.2 6-6.4"],
    tint: ["M27 13h16v23H27z"],
  },
  movementBreak: {
    stroke: [
      ring(30.5, 8.5, 3.5),
      "M27.5 14l-6 8.5 6.5 5-3.2 11.5",
      "M21.5 22.5l-6.5-1.5",
      "M28 27.5l8.5 3",
      "M28.5 16l7 3.5",
    ],
  },
  music: {
    stroke: ["M18.5 36V12.5L37 8v24", ring(14, 36, 4.5), ring(32.5, 32, 4.5)],
    tint: [ring(14, 36, 4.5), ring(32.5, 32, 4.5)],
  },
  countdown: {
    stroke: [
      "M13 6h22",
      "M13 42h22",
      "M16 6c0 10 8 12 8 18s-8 8-8 18",
      "M32 6c0 10-8 12-8 18s8 8 8 18",
    ],
    tint: ["M17.5 42c1.5-6 6.5-8.5 6.5-11s5 5 6.5 11z"],
  },
  headphones: {
    stroke: [
      "M11 29v-5a13 13 0 0 1 26 0v5",
      "M8 27.5h6v11H8z",
      "M34 27.5h6v11h-6z",
    ],
    tint: ["M8 27.5h6v11H8z", "M34 27.5h6v11h-6z"],
  },
  heart: {
    stroke: [
      "M24 40S7 30.5 7 18.5A9 9 0 0 1 24 14a9 9 0 0 1 17 4.5C41 30.5 24 40 24 40z",
    ],
    tint: [
      "M24 40S7 30.5 7 18.5A9 9 0 0 1 24 14a9 9 0 0 1 17 4.5C41 30.5 24 40 24 40z",
    ],
  },
  breathe: {
    stroke: [ring(24, 24, 16), ring(24, 24, 9), ring(24, 24, 2.5)],
    tint: [ring(24, 24, 9)],
  },
} as const satisfies Record<string, PictogramDefinition>;

export type PictogramName = keyof typeof pictograms;

export interface PictogramProps {
  readonly name: PictogramName;
  readonly size?: number;
  readonly color: string;
  readonly tintColor?: string;
  readonly tint?: number;
}

export function Pictogram({
  name,
  size = 44,
  color,
  tintColor,
  tint = 0.2,
}: PictogramProps) {
  const drawing: PictogramDefinition = pictograms[name];
  return (
    <View aria-hidden style={{ width: size, height: size }}>
      <Svg fill="none" height={size} viewBox="0 0 48 48" width={size}>
        {drawing.tint?.map((d) => (
          <Path
            key={`t-${d}`}
            d={d}
            fill={tintColor ?? color}
            opacity={tintColor ? 1 : tint}
          />
        ))}
        {drawing.stroke.map((d) => (
          <Path
            key={d}
            d={d}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
          />
        ))}
      </Svg>
    </View>
  );
}

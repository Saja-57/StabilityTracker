import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Pictogram, type PictogramName } from "@/components/icons/pictograms";

import type { LocalPictureName, LogPictureName } from "../types";

/**
 * Pictures the Log needs that the shared set does not have. Same grammar as
 * the shared pictograms: 48 grid, 2.2 stroke, round caps, one tinted plane.
 */
const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const local: Record<
  LocalPictureName,
  { stroke: readonly string[]; tint: readonly string[] }
> = {
  home: {
    stroke: ["M7 22.5L24 9l17 13.5", "M12 19v21h24V19", "M20.5 40v-10h7v10"],
    tint: ["M12 19L24 9.5 36 19v21H12z"],
  },
  car: {
    stroke: [
      "M5 33v-6.2c0-1 .7-1.9 1.7-2.2l5.3-1.6 4.6-7.5c.5-.9 1.5-1.5 2.6-1.5h10.6c1 0 1.9.5 2.5 1.3l5.2 7.7 3.9 1.3c.9.3 1.6 1.2 1.6 2.2V33z",
      "M12 23h25",
      ring(14, 34, 4),
      ring(34, 34, 4),
    ],
    tint: [
      "M5 33v-6.2c0-1 .7-1.9 1.7-2.2l5.3-1.6 4.6-7.5c.5-.9 1.5-1.5 2.6-1.5h10.6c1 0 1.9.5 2.5 1.3l5.2 7.7 3.9 1.3c.9.3 1.6 1.2 1.6 2.2V33z",
    ],
  },
  store: {
    stroke: ["M10 17h28l-2.4 23.5H12.4z", "M18 21v-5.5a6 6 0 0 1 12 0V21"],
    tint: ["M10 17h28l-2.4 23.5H12.4z"],
  },
  outdoors: {
    stroke: [
      "M24 7.5c-6.2 0-10.5 4.6-10.5 10.2 0 5.4 4.4 9.3 10.5 9.3s10.5-3.9 10.5-9.3C34.5 12.1 30.2 7.5 24 7.5z",
      "M24 41V22",
      "M24 30l-4.5-4",
      "M7 41h34",
    ],
    tint: [
      "M24 7.5c-6.2 0-10.5 4.6-10.5 10.2 0 5.4 4.4 9.3 10.5 9.3s10.5-3.9 10.5-9.3C34.5 12.1 30.2 7.5 24 7.5z",
    ],
  },
  transition: {
    stroke: [
      "M9 41V7h18v34",
      "M5 41h38",
      "M31.5 24H43",
      "M38.5 19.5L43 24l-4.5 4.5",
      ring(22, 25, 1.3),
    ],
    tint: ["M9 41V7h18v34z"],
  },
  denied: {
    stroke: [
      "M10 10h28a4 4 0 0 1 4 4v15a4 4 0 0 1-4 4H23l-8.5 7v-7H10a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z",
      "M17 21.5h14",
    ],
    tint: [
      "M10 10h28a4 4 0 0 1 4 4v15a4 4 0 0 1-4 4H23l-8.5 7v-7H10a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z",
    ],
  },
  tired: {
    stroke: [
      "M8 15h28a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V18a3 3 0 0 1 3-3z",
      "M43 21v6",
      "M11 20.5v7",
    ],
    tint: ["M9 19h5v10H9z"],
  },
  crowd: {
    stroke: [
      ring(12.5, 19, 3.6),
      ring(35.5, 19, 3.6),
      ring(24, 14.5, 4.4),
      "M4.5 40v-6.5a8 8 0 0 1 10.5-7.6",
      "M43.5 40v-6.5a8 8 0 0 0-10.5-7.6",
      "M14 40v-8a10 10 0 0 1 20 0v8",
    ],
    tint: ["M14 40v-8a10 10 0 0 1 20 0v8z"],
  },
  screenOff: {
    stroke: [
      "M11 7h26a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z",
      "M24 16.5v7",
      "M19.2 19.2a7.5 7.5 0 1 0 9.6 0",
    ],
    tint: [
      "M11 7h26a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z",
    ],
  },
  slip: {
    stroke: [
      "M11 6h20l7 7v29H11z",
      "M31 6v7h7",
      "M17 21h14",
      "M17 27h14",
      "M17 33h8",
    ],
    tint: ["M11 6h20l7 7v29H11z"],
  },
};

function isLocal(name: LogPictureName): name is LocalPictureName {
  return name in local;
}

export function LogPicture({
  name,
  size = 44,
  color,
  tintColor,
  tint = 0.2,
}: {
  name: LogPictureName;
  size?: number;
  color: string;
  tintColor?: string;
  tint?: number;
}) {
  if (!isLocal(name)) {
    return (
      <Pictogram
        name={name as PictogramName}
        size={size}
        color={color}
        tint={tint}
        {...(tintColor ? { tintColor } : {})}
      />
    );
  }
  const drawing = local[name];
  return (
    <View aria-hidden style={{ width: size, height: size }}>
      <Svg fill="none" height={size} viewBox="0 0 48 48" width={size}>
        {drawing.tint.map((d) => (
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

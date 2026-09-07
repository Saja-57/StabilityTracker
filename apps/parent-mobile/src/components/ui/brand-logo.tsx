import type {
  DimensionValue,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";
import { Image, StyleSheet } from "react-native";

import appIconSource from "../../../assets/brand/app-icon.png";
import horizontalSource from "../../../assets/brand/logo-horizontal.png";
import markSource from "../../../assets/brand/logo-mark.png";
import stackedSource from "../../../assets/brand/logo-stacked.png";
import { useLanguage } from "@/providers/language-provider";

export type BrandLogoVariant = "appIcon" | "horizontal" | "mark" | "stacked";
export type BrandLogoSize = "large" | "medium" | "small";

export interface BrandLogoProps {
  readonly accessibilityLabel?: string;
  readonly resizeMode?: "center" | "contain";
  readonly size?: BrandLogoSize;
  readonly style?: StyleProp<ImageStyle>;
  readonly variant?: BrandLogoVariant;
}

const BRAND_SOURCES: Record<BrandLogoVariant, ImageSourcePropType> = {
  appIcon: appIconSource,
  horizontal: horizontalSource,
  mark: markSource,
  stacked: stackedSource,
};

// Exact aspect ratios:
// logo-horizontal: 2066 x 761 (~2.715)
// logo-mark: 1254 x 1254 (1:1)
// logo-stacked: 1254 x 1254 (1:1)
// app-icon: 1254 x 1254 (1:1)
const HORIZONTAL_ASPECT_RATIO = 2066 / 761;
const SQUARE_ASPECT_RATIO = 1;

interface Dimensions {
  readonly height: DimensionValue;
  readonly width: DimensionValue;
}

const SIZE_MAP: Record<BrandLogoVariant, Record<BrandLogoSize, Dimensions>> = {
  horizontal: {
    small: { width: 120, height: Math.round(120 / HORIZONTAL_ASPECT_RATIO) },
    medium: { width: 176, height: Math.round(176 / HORIZONTAL_ASPECT_RATIO) },
    large: { width: 232, height: Math.round(232 / HORIZONTAL_ASPECT_RATIO) },
  },
  mark: {
    small: { width: 28, height: 28 },
    medium: { width: 40, height: 40 },
    large: { width: 64, height: 64 },
  },
  stacked: {
    small: { width: 96, height: 96 },
    medium: { width: 144, height: 144 },
    large: { width: 200, height: 200 },
  },
  appIcon: {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 72, height: 72 },
  },
};

const styles = StyleSheet.create({
  horizontal: {
    aspectRatio: HORIZONTAL_ASPECT_RATIO,
  },
  square: {
    aspectRatio: SQUARE_ASPECT_RATIO,
  },
});

export function BrandLogo({
  accessibilityLabel,
  resizeMode = "contain",
  size = "medium",
  style,
  variant = "horizontal",
}: BrandLogoProps) {
  const { t } = useLanguage();
  const label = accessibilityLabel ?? t("brand.logo");
  const dimensions = SIZE_MAP[variant][size];
  const aspectStyle =
    variant === "horizontal" ? styles.horizontal : styles.square;

  return (
    <Image
      accessibilityLabel={label}
      accessibilityRole="image"
      resizeMode={resizeMode}
      source={BRAND_SOURCES[variant]}
      style={[dimensions, aspectStyle, style]}
    />
  );
}

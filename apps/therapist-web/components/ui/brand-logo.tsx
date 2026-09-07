"use client";

import Image from "next/image";

import { cx } from "./styles";
import { useLanguage } from "@/providers/language-provider";

export type BrandLogoVariant = "appIcon" | "horizontal" | "mark" | "stacked";
export type BrandLogoSize = "large" | "medium" | "small";

export interface BrandLogoProps {
  readonly alt?: string;
  readonly className?: string;
  readonly priority?: boolean;
  readonly size?: BrandLogoSize;
  readonly variant?: BrandLogoVariant;
}

const BRAND_SOURCES = {
  appIcon: "/brand/app-icon.png",
  horizontal: "/brand/logo-horizontal.png",
  mark: "/brand/logo-mark.png",
  stacked: "/brand/logo-stacked.png",
} as const;

// Exact aspect ratios:
// logo-horizontal: 2066 x 761 (~2.715)
// logo-mark: 1254 x 1254 (1:1)
// logo-stacked: 1254 x 1254 (1:1)
// app-icon: 1254 x 1254 (1:1)
const HORIZONTAL_ASPECT_RATIO = 2066 / 761;

interface Dimensions {
  readonly height: number;
  readonly width: number;
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

export function BrandLogo({
  alt,
  className,
  priority = false,
  size = "medium",
  variant = "horizontal",
}: BrandLogoProps) {
  const { t } = useLanguage();
  const label = alt ?? t("brand.logo");
  const dimensions = SIZE_MAP[variant][size];

  return (
    <Image
      alt={label}
      className={cx("h-auto object-contain", className)}
      height={dimensions.height}
      priority={priority}
      src={BRAND_SOURCES[variant]}
      width={dimensions.width}
    />
  );
}

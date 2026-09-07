import { sizing } from "@stability/design-tokens";
import type { LucideIcon } from "lucide-react";

export type IconSize = "small" | "medium" | "large";
export type UiIcon = LucideIcon;

export const iconStrokeWidth = 1.75;

export function getIconSize(size: IconSize): number {
  return sizing.icon[size];
}

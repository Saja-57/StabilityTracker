import { sizing } from "@stability/design-tokens";
import type { LucideIcon } from "lucide-react-native";

export type IconComponent = LucideIcon;
export type IconSize = keyof typeof sizing.icon;

export const iconStrokeWidth = 1.75;

export function getIconSize(size: IconSize): number {
  return sizing.icon[size];
}

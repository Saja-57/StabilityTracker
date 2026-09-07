import Link from "next/link";

import type { NavigationItemDefinition } from "./navigation";
import { getIconSize, iconStrokeWidth } from "@/components/ui/icon";
import { cx, focusRing } from "@/components/ui/styles";

export interface SidebarItemProps {
  readonly active: boolean;
  readonly item: NavigationItemDefinition;
  readonly label: string;
  readonly onNavigate?: (() => void) | undefined;
}

export function SidebarItem({
  active,
  item,
  label,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      {...(onNavigate ? { onClick: onNavigate } : {})}
      className={cx(
        "type-bodyStrong flex min-h-11 items-center gap-3 rounded-[var(--radius-small)] border px-3 py-2 text-start transition-[background-color,border-color,color] duration-[var(--motion-fast)]",
        active
          ? "border-[var(--color-brand-secondary)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
          : "border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-interactive)] hover:text-[var(--color-text-primary)]",
        focusRing,
      )}
    >
      <Icon
        aria-hidden="true"
        className="shrink-0"
        size={getIconSize("medium")}
        strokeWidth={iconStrokeWidth}
      />
      <span className="min-w-0 truncate">{label}</span>
    </Link>
  );
}

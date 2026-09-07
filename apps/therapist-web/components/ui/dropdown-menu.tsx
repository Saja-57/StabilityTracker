"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import { getIconSize, iconStrokeWidth, type UiIcon } from "./icon";
import { cx, focusRing } from "./styles";

export interface DropdownMenuProps {
  readonly trigger: ReactElement;
  readonly children: ReactNode;
  readonly align?: "start" | "center" | "end";
  readonly direction?: "ltr" | "rtl";
}

export function DropdownMenu({
  trigger,
  children,
  align = "start",
  direction,
}: DropdownMenuProps) {
  return (
    <DropdownPrimitive.Root {...(direction ? { dir: direction } : {})}>
      <DropdownPrimitive.Trigger asChild>{trigger}</DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-48 rounded-[var(--radius-medium)] border border-[var(--color-border-default)] bg-[var(--color-surface-primary)] p-1.5 shadow-[var(--shadow-raised)]"
        >
          {children}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<
  typeof DropdownPrimitive.Item
> {
  readonly icon?: UiIcon;
}

export function DropdownMenuItem({
  icon: Icon,
  children,
  className,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownPrimitive.Item
      {...props}
      className={cx(
        "type-body flex min-h-10 cursor-default select-none items-center gap-2 rounded-[var(--radius-small)] px-3 text-[var(--color-text-primary)] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-[var(--color-surface-interactive)]",
        focusRing,
        className,
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          size={getIconSize("small")}
          strokeWidth={iconStrokeWidth}
        />
      ) : null}
      {children}
    </DropdownPrimitive.Item>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      {...props}
      className={cx("my-1 h-px bg-[var(--color-border-subtle)]", className)}
    />
  );
}
